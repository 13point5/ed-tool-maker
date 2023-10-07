import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import { BlockItem } from "./Item";
import { BlockData } from "@/app/page";

type Props = {
  id: BlockData["id"];
};

export const SortableItem = ({ id }: Props) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <BlockItem
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      id={id}
    />
  );
};
