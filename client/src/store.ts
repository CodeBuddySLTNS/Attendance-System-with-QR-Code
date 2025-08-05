import { create } from "zustand";
import type { User } from "./types/students.types";

interface MainStore {
  page: string;
  loggedIn: boolean;
  user: User | null;

  setPage: (page: string) => void;
  setLoggedIn: (status: boolean) => void;
  setUser: (status: User | null) => void;
}

export const useMainStore = create<MainStore>((set) => ({
  page: "home",
  loggedIn: false,
  user: null,

  setPage: (page) => set({ page }),
  setLoggedIn: (status) => set({ loggedIn: status }),
  setUser: (user) => set({ user }),
}));
