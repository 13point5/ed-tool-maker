// @ts-nocheck

import "@/app/globals.css";
// import "./MentionList.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";

const MentionList = forwardRef((props, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const selectItem = (index) => {
    const item = props.items[index];

    if (item) {
      props.command(item);
    }
  };

  const upHandler = () => {
    setSelectedIndex(
      (selectedIndex + props.items.length - 1) % props.items.length
    );
  };

  const downHandler = () => {
    setSelectedIndex((selectedIndex + 1) % props.items.length);
  };

  const enterHandler = () => {
    selectItem(selectedIndex);
  };

  useEffect(() => setSelectedIndex(0), [props.items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }) => {
      if (event.key === "ArrowUp") {
        upHandler();
        return true;
      }

      if (event.key === "ArrowDown") {
        downHandler();
        return true;
      }

      if (event.key === "Enter") {
        enterHandler();
        return true;
      }

      return false;
    },
  }));

  return (
    <div
      className={`${inter.className} shadow-sm rounded-lg bg-transparent text-sm`}
    >
      {props.items.length ? (
        props.items.map((item, index) => (
          <button
            className={`p-1.5 w-full text-start ${
              index === selectedIndex ? "bg-blue-300" : "bg-slate-100"
            } ${index === 0 && "rounded-t-md"} ${
              index === props.items.length - 1 && "rounded-b-md"
            }`}
            // style={{
            //   border: "2px solid",
            //   backgroundColor:
            //     index === selectedIndex
            //       ? colors[item.type].border || "#eee"
            //       : colors[item.type].bg || "#eee",
            // }}
            key={index}
            onClick={() => selectItem(index)}
          >
            {item.label}
          </button>
        ))
      ) : (
        <div className="item">No result</div>
      )}
    </div>
  );
});

MentionList.displayName = "MentionList";
export default MentionList;
