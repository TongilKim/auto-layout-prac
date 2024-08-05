import { create } from "zustand";

type State = {
  parentElement: {
    width: number;
    height: number;
  };
};

type Action = {
  setParentElement: (width: number, height: number) => void;
};

export const useDefaultStore = create<State & Action>((set) => ({
  parentElement: {
    width: 1200,
    height: 800,
  },

  setParentElement: (width, height) =>
    set(() => ({ parentElement: { width, height } })),
}));
