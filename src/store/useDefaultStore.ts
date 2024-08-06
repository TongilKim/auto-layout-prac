import { create } from "zustand";
import { DEFAULT_PARENT_HEIGHT, DEFAULT_PARENT_WIDTH } from "../constants";

type State = {
  parentElementDimension: {
    width: number;
    height: number;
  };

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

  setChildElements: (
    id: number,
    leftMargin: number,
    rightMargin: number
  ) => void;
};

export const useDefaultStore = create<State & Action>((set, get) => ({
  parentElementDimension: {
    width: DEFAULT_PARENT_WIDTH,
    height: DEFAULT_PARENT_HEIGHT,
  },

  childElements: [],
  setChildElements: (id, leftMargin, rightMargin) => {
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

  setParentElement: (width, height) =>
    set(() => ({ parentElementDimension: { width, height } })),
}));
