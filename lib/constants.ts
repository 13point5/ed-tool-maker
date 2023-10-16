export const openAiApiKeyStorageKey = "ai-tool-maker--openai-api-key";

export const mentionRendererClass = "p-[2px] rounded-sm bg-blue-300";

export const getProjectTypeLabel = (type: string) => {
  switch (type) {
    case "tool":
      return "Tool";

    case "chatbot":
      return "Chatbot";

    default:
      return type;
  }
};
