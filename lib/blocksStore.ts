import * as R from "ramda";
import { create } from "zustand";
import { arrayMove } from "@dnd-kit/sortable";
import { nanoid } from "nanoid";

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
  ids: ["1", "2", "3", "4", "5", "6"],
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
    "4": {
      id: "4",
      type: BlockType.shortText,
      label: "Short Input 3",
    },
    "5": {
      id: "5",
      type: BlockType.shortText,
      label: "Short Input 4",
    },
    "6": {
      id: "6",
      type: BlockType.shortText,
      label: "Short Input 4",
    },
  },
};

type BlocksStore = {
  data: BlocksState;

  activeBlockId: BlockData["id"] | null;
  setActiveBlockId: (id: BlockData["id"] | null) => void;

  insertBlockBelow: (params: {
    currentBlockId: BlockData["id"];
    type: BlockType;
  }) => void;
  updateBlockLabel: (params: { id: BlockData["id"]; label: string }) => void;
  moveBlock: (params: {
    activeId: BlockData["id"];
    overId: BlockData["id"];
  }) => void;
  deleteBlock: (id: BlockData["id"]) => void;
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

  insertBlockBelow: ({ currentBlockId, type }) => {
    set((state) => {
      const newBlockData: BlockData = {
        id: nanoid(),
        type,
        label: "Untitled",
      };

      return R.mergeDeepRight(state, {
        data: {
          ids: R.insert(
            getBlockIndexById(state.data.ids, currentBlockId) + 1,
            newBlockData.id,
            state.data.ids
          ),
          entities: {
            [newBlockData.id]: newBlockData,
          },
        },
      });
    });
  },

  moveBlock: ({ activeId, overId }) => {
    set((state) => {
      const items = state.data.ids;

      const oldIndex = getBlockIndexById(items, activeId);
      const newIndex = getBlockIndexById(items, overId);

      const newIds = arrayMove(items, oldIndex, newIndex);

      return R.mergeDeepRight(state, {
        data: {
          ids: newIds,
        },
      });
    });
  },

  updateBlockLabel: ({ id, label }) => {
    set((state) =>
      R.mergeDeepRight(state, {
        data: {
          entities: {
            [id]: {
              label,
            },
          },
        },
      })
    );
  },

  deleteBlock: (id) => {
    set((state) => {
      const newIds = state.data.ids.filter((blockId) => blockId !== id);
      const newEntities = R.omit([id], state.data.entities);

      return R.mergeDeepRight(state, {
        data: {
          ids: newIds,
          entities: newEntities,
        },
      });
    });
  },
}));
