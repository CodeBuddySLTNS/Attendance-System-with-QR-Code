import { create } from "zustand";

interface MainStore {
  page: string;
  loggedIn: boolean;
  isTeacher: boolean;

  setPage: (page: string) => void;
  setLoggedIn: (status: boolean) => void;
  setTeacher: (status: boolean) => void;
}

export const useMainStore = create<MainStore>((set) => ({
  page: "home",
  loggedIn: false,
  isTeacher: false,

  setPage: (page) => set({ page }),
  setLoggedIn: (status) => set({ loggedIn: status }),
  setTeacher: (status) => set({ loggedIn: status }),
}));
