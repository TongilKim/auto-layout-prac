import { create } from "zustand";

type State = {
  parentElement: {
    width: number;
    height: number;
  };
  lowestRightMargin: number;
  lowestLeftMargin: number;
};

type Action = {
  setParentElement: (width: number, height: number) => void;
  setLowestRightMargin: (margin: number) => void;
  setLowestLeftMargin: (margin: number) => void;
};

export const useDefaultStore = create<State & Action>((set) => ({
  parentElement: {
    width: 1200,
    height: 800,
  },
  lowestRightMargin: 1200,
  lowestLeftMargin: 800,
  setLowestRightMargin: (margin) => set(() => ({ lowestRightMargin: margin })),
  setLowestLeftMargin: (margin) => set(() => ({ lowestLeftMargin: margin })),
  setParentElement: (width, height) =>
    set(() => ({ parentElement: { width, height } })),
}));
