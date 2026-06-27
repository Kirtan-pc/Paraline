import { create } from 'zustand';

interface PreviewState {
  activePreviewThemeId: string | null;
  setActivePreviewThemeId: (id: string | null) => void;
}

export const usePreviewStore = create<PreviewState>((set) => ({
  activePreviewThemeId: null,
  setActivePreviewThemeId: (id) => set({ activePreviewThemeId: id }),
}));
