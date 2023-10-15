import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { BlockItem, Props as ItemProps } from "./Item";
import { BlockData } from "@/lib/blocksStore";

type Props = {
  id: BlockData["id"];
  onLabelChange: ItemProps["onLabelChange"];
  onDelete: ItemProps["onDelete"];
};

export const SortableItem = ({ id, onLabelChange, onDelete }: Props) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <BlockItem
      ref={setNodeRef}
      style={style}
      {...attributes}
      setActivatorNodeRef={setActivatorNodeRef}
      listeners={listeners}
      id={id}
      onLabelChange={onLabelChange}
      onDelete={onDelete}
    />
  );
};
