export interface Sticker {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  place_name: string;
  pictures: string[];
  created_at: string;
  updated_at: string;
}

// Request body for creating a sticker
export interface CreateStickerRequest {
  name: string;
  latitude: number;
  longitude: number;
  place_name: string;
  pictures?: string[];
}
