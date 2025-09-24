import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import z from "zod";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({
    path: path.resolve(__dirname, '../../.env'),
});

// Schema for the extended note response
const extendedNoteSchema = z.object({
    sourceNote: z.string().describe("The original note exactly as provided"),
    content: z.string().describe("The comprehensive extended information with additional facts and context"),
});

export type ExtendedNote = z.infer<typeof extendedNoteSchema>;

export const extendNoteByGemini = async (note: string): Promise<ExtendedNote | null> => {
    // Input validation
    if (!note || typeof note !== 'string' || note.trim().length === 0) {
        throw new Error('Note parameter must be a non-empty string');
    }

    // Check for required environment variables
    if (!process.env.GOOGLE_API_KEY) {
        throw new Error('GOOGLE_API_KEY environment variable is required');
    }

    try {
        // Initialize the Gemini model with structured output
        const model = new ChatGoogleGenerativeAI({
            model: "gemini-2.5-pro",
            temperature: 0,
            maxRetries: 3,
            apiKey: process.env.GOOGLE_API_KEY,
        }).withStructuredOutput(extendedNoteSchema, {
            includeRaw: true,
            method: "json_mode"
        });

        // Create the prompt template
        const prompt = ChatPromptTemplate.fromTemplate(`
        You are an expert fact researcher and knowledge expander. Your task is to analyze the given base note and extend it with comprehensive, factual, and relevant information.

        **Base Note:** {note}

        **Instructions:**
        1. **Identify Key Entities and Topics**: Extract all important people, organizations, concepts, events, or subjects mentioned in the base note.

        2. **Fact Verification and Expansion**: For each identified entity:
           - Verify the accuracy of statements in the base note
           - Add missing factual information that provides broader context
           - Include current and historical facts
           - Mention related entities, connections, and relationships

        3. **Provide Comprehensive Context**: 
           - Add background information that enhances understanding
           - Include relevant dates, numbers, achievements, controversies
           - Mention related industries, fields, or domains
           - Add interconnections between different entities mentioned

        4. **Maintain Factual Accuracy**:
           - Only include information you are confident is accurate
           - Avoid speculation or opinions
           - Focus on verifiable facts
           - Include recent developments when relevant

        5. **Structure and Organization**:
           - Keep the original note content intact in "sourceNote"
           - In "content", provide the extended information in a well-organized manner
           - Use clear sections or bullet points for different aspects
           - Ensure the extended content flows logically

        **Example**: If the base note says "Elon Musk is the owner of Tesla", you should extend it with information about:
        - His other major companies (X/Twitter, SpaceX, Neuralink, The Boring Company)
        - His role and titles in these companies
        - Key achievements and milestones
        - Timeline of his involvement with these companies
        - Related industry context

        **Output Format**:
        - sourceNote: The original note exactly as provided
        - content: The comprehensive extended information with additional facts and context
            - ** important format for content is only text no markdown or html or any other format **

        Please extend the following note with factual information:
        `);

        // Generate the extended note
        const response = await model.invoke([
            await prompt.format({ note: note.trim() })
        ]);

        // Validate and return the parsed response
        if (!response.parsed) {
            console.error('Failed to parse response from Gemini API:', response.raw);
            return null;
        }

        // Additional validation to ensure the response contains the original note
        const result = response.parsed as ExtendedNote;
        if (!result.sourceNote || !result.content) {
            console.error('Invalid response structure from Gemini API:', result);
            return null;
        }

        return result;

    } catch (error) {
        console.error('Error extending note with Gemini:', error);
        
        // Handle specific error types
        if (error instanceof Error) {
            if (error.message.includes('API key')) {
                throw new Error('Invalid or missing Google API key');
            }
            if (error.message.includes('quota')) {
                throw new Error('Google API quota exceeded. Please try again later.');
            }
            if (error.message.includes('rate limit')) {
                throw new Error('Rate limit exceeded. Please try again later.');
            }
        }
        
        // For other errors, return null to allow graceful handling
        return null;
    }
}

// console.log(await extendNoteByGemini("Elon Musk เป็นเจ้าของ Tesla"));
// console.log("");
// console.log("");
// console.log("");

// console.log(await extendNoteByGemini("เชฟป้อม หม่อมหลวงขวัญทิพย์ เทวกุล ถนัดทำอาหารไทยโบราณ"));
