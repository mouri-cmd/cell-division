import { create } from 'zustand';

type CellType = 'both' | 'plant' | 'animal';
type ViewMode = '3d' | 'textbook';

interface SimStore {
  viewMode: ViewMode;
  cellView: CellType;
  selectedOrganelle: string | null;
  hoveredOrganelle: string | null;

  setViewMode: (mode: ViewMode) => void;
  setCellView: (view: CellType) => void;
  setSelectedOrganelle: (id: string | null) => void;
  setHoveredOrganelle: (id: string | null) => void;
}

export const useSimStore = create<SimStore>((set) => ({
  viewMode: 'textbook',
  cellView: 'both',
  selectedOrganelle: null,
  hoveredOrganelle: null,

  setViewMode: (mode) => set({ viewMode: mode }),
  setCellView: (view) => set({ cellView: view, selectedOrganelle: null }),
  setSelectedOrganelle: (id) => set({ selectedOrganelle: id }),
  setHoveredOrganelle: (id) => set({ hoveredOrganelle: id }),
}));
