import { EmbeddingsInterface } from '@langchain/core/embeddings';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';

export const buildVectorData = async (rawText: string, embeddings: EmbeddingsInterface): Promise<{ vectors: number[][], chunks: string[] }> => {
    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
    });
    const chunks = await splitter.splitText(rawText);
    const vectors = await embeddings.embedDocuments(chunks);

    return {
        vectors,
        chunks
    };
}