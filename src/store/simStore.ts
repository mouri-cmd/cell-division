import { create } from 'zustand';

type CellType = 'both' | 'plant' | 'animal';
type ViewMode = '3d' | 'textbook';
type Language = 'bn' | 'en';

interface SimStore {
  viewMode: ViewMode;
  cellView: CellType;
  selectedOrganelle: string | null;
  hoveredOrganelle: string | null;
  language: Language;

  setViewMode: (mode: ViewMode) => void;
  setCellView: (view: CellType) => void;
  setSelectedOrganelle: (id: string | null) => void;
  setHoveredOrganelle: (id: string | null) => void;
  setLanguage: (lang: Language) => void;
}

export const useSimStore = create<SimStore>((set) => ({
  viewMode: 'textbook',
  cellView: 'both',
  selectedOrganelle: null,
  hoveredOrganelle: null,
  language: 'bn',

  setViewMode: (mode) => set({ viewMode: mode }),
  setCellView: (view) => set({ cellView: view, selectedOrganelle: null }),
  setSelectedOrganelle: (id) => set({ selectedOrganelle: id }),
  setHoveredOrganelle: (id) => set({ hoveredOrganelle: id }),
  setLanguage: (lang) => set({ language: lang }),
}));
