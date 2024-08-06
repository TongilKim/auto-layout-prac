import { create } from "zustand";

type State = {
  parentElement: {
    width: number;
    height: number;
  };
  lowestRightMargin: number;
  lowestLeftMargin: number;
  childElements:
    | Array<{
        id: number;
        leftMargin: number;
        rightMargin: number;
      }>
    | [];
};

type Action = {
  setParentElement: (width: number, height: number) => void;
  setLowestRightMargin: (margin: number) => void;
  setLowestLeftMargin: (margin: number) => void;
  setChildElements: (
    id: number,
    leftMargin: number,
    rightMargin: number
  ) => void;
};

export const useDefaultStore = create<State & Action>((set, get) => ({
  parentElement: {
    width: 1200,
    height: 800,
  },
  lowestRightMargin: 1200,
  lowestLeftMargin: 800,
  childElements: [],
  setChildElements: (id, leftMargin, rightMargin) => {
    console.log("current uid: ", id);
    const childElements = get().childElements;
    if (childElements.length === 0) {
      set(() => ({ childElements: [{ id, leftMargin, rightMargin }] }));
    } else {
      set((state) => {
        if (childElements.some((child) => child.id === id)) {
          return {
            childElements: state.childElements.map((child) => {
              if (child.id === id) {
                return { id, leftMargin, rightMargin };
              }
              return child;
            }),
          };
        } else {
          return {
            childElements: [
              ...state.childElements,
              { id, leftMargin, rightMargin },
            ],
          };
        }
      });
    }
  },
  setLowestRightMargin: (margin) => set(() => ({ lowestRightMargin: margin })),
  setLowestLeftMargin: (margin) => set(() => ({ lowestLeftMargin: margin })),
  setParentElement: (width, height) =>
    set(() => ({ parentElement: { width, height } })),
}));
