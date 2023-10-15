import { useState } from "react";
import { MentionsInput, Mention, OnChangeHandlerFunc } from "react-mentions";

const style = {
  control: {
    backgroundColor: "#fff",
    fontSize: 14,
  },
  "&multiLine": {
    control: {
      minHeight: 150,
    },
    highlighter: {
      paddingTop: "8px",
      paddingLeft: "12px",
      // borderRadius: "4px",
      // border: "none",
    },
    input: {
      padding: "0.5rem 0.75rem",
      border: "1px solid hsl(var(--border))",
      borderRadius: "calc(var(--radius) - 2px)",
      minHeight: 150,
    },
  },
  suggestions: {
    list: {
      backgroundColor: "transparent",
      outline: "none",
      border: "1px solid hsl(var(--border))",
      fontSize: 14,
    },
    item: {
      padding: "0.25rem 0.5rem",
      border: "none",
      outline: "none",
      "&focused": {
        backgroundColor: "#bfdbfe",
      },
    },
  },
};

export const Instructions = () => {
  const [value, setValue] = useState("");
  console.log("value", value);

  const handleChange: OnChangeHandlerFunc = (e) => {
    setValue(e.target.value);
  };

  return (
    <MentionsInput value={value} onChange={handleChange} style={style}>
      <Mention
        trigger="@"
        data={[
          {
            id: "1",
            display: "John Doe",
          },
          {
            id: "2",
            display: "Lala",
          },
        ]}
        style={{
          backgroundColor: "#bfdbfe",
          borderRadius: "2px",
        }}
      />
    </MentionsInput>
  );
};
