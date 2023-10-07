import { create } from "zustand";
import { arrayMove } from "@dnd-kit/sortable";

export enum BlockType {
  shortText = "shortText",
  longText = "longText",
}

export type BlockData = {
  id: string;
  type: BlockType;
  label: string;
};

type BlocksState = {
  ids: BlockData["id"][];
  entities: Record<BlockData["id"], BlockData>;
};

const initialState: BlocksState = {
  ids: ["1", "2", "3"],
  entities: {
    "1": {
      id: "1",
      type: BlockType.shortText,
      label: "Short Input 1",
    },
    "2": {
      id: "2",
      type: BlockType.longText,
      label: "Long Input 1",
    },
    "3": {
      id: "3",
      type: BlockType.shortText,
      label: "Short Input 2",
    },
  },
};

type BlocksStore = {
  data: BlocksState;

  activeBlockId: BlockData["id"] | null;
  setActiveBlockId: (id: BlockData["id"] | null) => void;

  // addBlock: (blockType: BlockType) => BlockData;
  // removeBlock: (id: BlockData["id"]) => void;
  // updateBlockLabel: (id: BlockData["id"], label: string) => void;
  moveBlock: (params: {
    activeId: BlockData["id"];
    overId: BlockData["id"];
  }) => void;
};

const getBlockIndexById = (blocks: BlockData["id"][], id: string) => {
  return blocks.findIndex((blockId) => blockId === id);
};

export const useBlocksStore = create<BlocksStore>()((set, get) => ({
  data: initialState,

  activeBlockId: null,
  setActiveBlockId: (id) => {
    set({ activeBlockId: id });
  },

  moveBlock: ({ activeId, overId }) => {
    set((state) => {
      const items = state.data.ids;

      const oldIndex = getBlockIndexById(items, activeId);
      const newIndex = getBlockIndexById(items, overId);

      const newIds = arrayMove(items, oldIndex, newIndex);

      return {
        ...state,
        data: {
          ...state.data,
          ids: newIds,
        },
      };
    });
  },
}));
