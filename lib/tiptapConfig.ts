import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import Document from "@tiptap/extension-document";

const editorConfig = {
  extensions: [Paragraph, Text, Document],
  editorProps: {
    attributes: {
      class: "h-full w-full prose prose-sm focus:outline-none text-sm bg-white",
    },
  },
};

export default editorConfig;
