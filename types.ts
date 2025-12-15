export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface GroundingChunk {
  maps?: {
    uri?: string;
    title?: string;
    placeAnswerSources?: {
      reviewSnippets?: {
        content: string;
      }[];
    }[];
  };
}

export interface SearchResult {
  text: string;
  groundingChunks: GroundingChunk[];
}

export type DistanceOption = 3 | 8 | 15;
