import { GoogleGenAI } from "@google/genai";
import { EmbeddingsInterface } from '@langchain/core/embeddings';

export class CustomGeminiEmbeddings implements EmbeddingsInterface {
    private client: GoogleGenAI;
    private model: string;
    private outputDim: number;

    constructor(model: string, outputDim: number = 1536) {
        this.client = new GoogleGenAI({});
        this.model = model;
        this.outputDim = outputDim;
    }

    // For a single string
    async embedQuery(text: string): Promise<number[]> {
        const response = await this.client.models.embedContent({
            model: this.model,
            contents: [text],
            config: { outputDimensionality: this.outputDim },
        });
        return response.embeddings![0].values!;
    }

    // For multiple strings
    async embedDocuments(texts: string[]): Promise<number[][]> {
        const response = await this.client.models.embedContent({
            model: this.model,
            contents: texts,
            config: { outputDimensionality: this.outputDim },
        });
        return response.embeddings!.map((e: any) => e.values)! as number[][];
    }
}