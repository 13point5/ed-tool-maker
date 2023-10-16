import * as R from "ramda";
import { createStore } from "zustand";
import { arrayMove } from "@dnd-kit/sortable";
import { nanoid } from "nanoid";
import { createContext } from "react";

export enum BlockType {
  shortText = "shortText",
  longText = "longText",
}

export type BlockData = {
  id: string;
  type: BlockType;
  label: string;
};

type BlocksData = {
  ids: BlockData["id"][];
  entities: Record<BlockData["id"], BlockData>;
  contents: Record<BlockData["id"], string>;
};

export type BlocksState = {
  data: BlocksData;

  activeBlockId: BlockData["id"] | null;
  setActiveBlockId: (id: BlockData["id"] | null) => void;

  getBlockData: (id: BlockData["id"]) => BlockData;
  getBlockContent: (id: BlockData["id"]) => string;

  addFirstBlock: (type: BlockType) => void;
  insertBlockBelow: (params: {
    currentBlockId: BlockData["id"];
    type: BlockType;
  }) => void;
  updateBlockLabel: (params: { id: BlockData["id"]; label: string }) => void;
  updateBlockContent: (params: {
    id: BlockData["id"];
    content: string;
  }) => void;
  moveBlock: (params: {
    activeId: BlockData["id"];
    overId: BlockData["id"];
  }) => void;
  deleteBlock: (id: BlockData["id"]) => void;
};

const getBlockIndexById = (blocks: BlockData["id"][], id: string) => {
  return blocks.findIndex((blockId) => blockId === id);
};

export const createBlocksStore = (initialBlocks: BlockData[] = []) => {
  const initialState: BlocksData = {
    ids: [],
    entities: {},
    contents: {},
  };

  initialBlocks.forEach((block) => {
    initialState.ids.push(block.id);
    initialState.entities[block.id] = block;
    initialState.contents[block.id] = "";
  });

  return createStore<BlocksState>()((set, get) => ({
    data: initialState,

    activeBlockId: null,
    setActiveBlockId: (id) => {
      set({ activeBlockId: id });
    },

    getBlockData: (id) => {
      return get().data.entities[id];
    },

    getBlockContent: (id) => get().data.contents[id],

    addFirstBlock: (blockType) => {
      set((state) => {
        const newBlockData: BlockData = {
          id: nanoid(),
          type: blockType,
          label: "Untitled",
        };

        return R.mergeDeepRight(state, {
          data: {
            ids: [newBlockData.id],
            entities: {
              [newBlockData.id]: newBlockData,
            },
          },
        });
      });
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

    updateBlockContent: ({ id, content }) => {
      set((state) =>
        R.mergeDeepRight(state, {
          data: {
            contents: {
              [id]: content,
            },
          },
        })
      );
    },

    deleteBlock: (id) => {
      set((state) => {
        const newIds = state.data.ids.filter((blockId) => blockId !== id);
        const newEntities = R.omit([id], state.data.entities);
        const newContents = R.omit([id], state.data.contents);

        return {
          ...state,
          data: {
            ids: newIds,
            entities: newEntities,
            contents: newContents,
          },
        };
      });
    },
  }));
};

type BlocksStoreType = ReturnType<typeof createBlocksStore>;

export const BlocksStoreContext = createContext<BlocksStoreType | null>(null);
