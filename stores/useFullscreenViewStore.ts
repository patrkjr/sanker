import { create } from 'zustand';

interface FullscreenViewState {
  isVisible: boolean;
  imageUri: string | null;
  show: (imageUri: string) => void;
  hide: () => void;
}

export const useFullscreenViewStore = create<FullscreenViewState>((set) => ({
  isVisible: false,
  imageUri: null,
  show: (imageUri: string) => set({ isVisible: true, imageUri }),
  hide: () => set({ isVisible: false, imageUri: null }),
}));
