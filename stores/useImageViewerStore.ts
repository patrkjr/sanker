import { create } from 'zustand';

interface ImageViewerState {
  isVisible: boolean;
  imageUri: string | null;
  show: (imageUri: string) => void;
  hide: () => void;
}

export const useImageViewerStore = create<ImageViewerState>((set) => ({
  isVisible: false,
  imageUri: null,
  show: (imageUri: string) => set({ isVisible: true, imageUri }),
  hide: () => set({ isVisible: false, imageUri: null }),
}));
