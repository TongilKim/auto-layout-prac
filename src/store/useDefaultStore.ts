import { create } from "zustand";
import { DEFAULT_PARENT_HEIGHT, DEFAULT_PARENT_WIDTH } from "../constants";

export type ChildElement = {
  id: number;
  width: number;
  leftPadding: number;
  rightPadding: number;
  topPadding: number;
  bottomPadding: number;
};

type State = {
  parentElement: {
    width: number;
    height: number;
    widthPadding: number;
    heightPadding: number;
  };

  childElements: Array<ChildElement> | [];
};

type Action = {
  setParentElementDimension: (width: number, height: number) => void;
  setParentElementWidthPadding: (widthPadding: number) => void;
  setParentElementHeightPadding: (heightPadding: number) => void;
  setChildElements: (
    id: number,
    width: number,
    leftPadding: number,
    rightPadding: number,
    topPadding: number,
    bottomPadding: number
  ) => void;
};

export const useDefaultStore = create<State & Action>((set, get) => ({
  parentElement: {
    width: DEFAULT_PARENT_WIDTH,
    height: DEFAULT_PARENT_HEIGHT,
    widthPadding: 0,
    heightPadding: 0,
  },
  setParentElementDimension: (width, height) =>
    set(() => ({ parentElement: { ...get().parentElement, width, height } })),
  setParentElementWidthPadding: (widthPadding) =>
    set(() => ({ parentElement: { ...get().parentElement, widthPadding } })),
  setParentElementHeightPadding: (heightPadding) =>
    set(() => ({ parentElement: { ...get().parentElement, heightPadding } })),

  childElements: [],
  setChildElements: (
    id,
    width,
    leftPadding,
    rightPadding,
    topPadding,
    bottomPadding
  ) => {
    const childElements = get().childElements;
    if (childElements.length === 0) {
      set(() => ({
        childElements: [
          { id, width, leftPadding, rightPadding, topPadding, bottomPadding },
        ],
      }));
    } else {
      set((state) => {
        if (childElements.some((child) => child.id === id)) {
          return {
            childElements: state.childElements.map((child) => {
              if (child.id === id) {
                return {
                  id,
                  width,
                  leftPadding,
                  rightPadding,
                  topPadding,
                  bottomPadding,
                };
              }
              return child;
            }),
          };
        } else {
          return {
            childElements: [
              ...state.childElements,
              {
                id,
                width,
                leftPadding,
                rightPadding,
                topPadding,
                bottomPadding,
              },
            ],
          };
        }
      });
    }
  },
}));
