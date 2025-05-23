import { create } from "zustand";

interface MainStore {
  page: string;
  loggedIn: boolean;

  setPage: (page: string) => void;
  setLoggedIn: (status: boolean) => void;
}

export const useMainStore = create<MainStore>((set) => ({
  page: "home",
  loggedIn: false,

  setPage: (page) => set({ page }),
  setLoggedIn: (status) => set({ loggedIn: status }),
}));
