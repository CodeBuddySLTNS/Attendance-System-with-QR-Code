import { create } from "zustand";

interface MainStore {
  page: string;
  setPage: (page: string) => void;
}

export const useMainStore = create<MainStore>((set) => ({
  page: "home",

  setPage: (page) => set({ page }),
}));
