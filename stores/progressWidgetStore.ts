import { create } from 'zustand';

interface ProgressWidgetState {
  message: string;
  isVisible: boolean;
  isDismissible: boolean;
  error: string | null;
  progress: number;
  showWidget: (
    message: string,
    options: { isDismissible?: boolean; progress?: number }
  ) => void;
  hideWidget: () => void;
  setError: (error: string) => void;
  clearError: () => void;
}

export const useProgressWidgetStore = create<ProgressWidgetState>((set) => ({
  message: '',
  isVisible: false,
  isDismissible: true,
  error: null,
  progress: 0,
  showWidget: (
    message: string,
    options: { isDismissible?: boolean; progress?: number }
  ) => {
    const { isDismissible = true, progress = 0 } = options;
    set({ message, isVisible: true, isDismissible, progress });
  },
  hideWidget: () => set({ isVisible: false }),
  setError: (error: string) => set({ error }),
  clearError: () => set({ error: null }),
}));
