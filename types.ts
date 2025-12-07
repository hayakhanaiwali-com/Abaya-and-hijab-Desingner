export interface HijabStyle {
  id: string;
  styleName: string;
  description: string;
  fabric: string;
  faceShape: string;
  occasion: string;
  steps: string[];
  colorPalette: string[];
  imagePrompt: string;
}

export interface StylingRequest {
  preference: string;
}

export type LoadingState = 'idle' | 'generating-plan' | 'generating-images' | 'complete' | 'error';
