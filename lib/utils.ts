import { BlocksState } from "@/lib/blocksStore";
import { mentionRendererClass } from "@/lib/constants";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatHTMLWithContent = (
  html: string,
  blocksContentById: BlocksState["data"]["contents"]
) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const spans = doc.getElementsByTagName("span");

  for (let i = spans.length - 1; i >= 0; i--) {
    const span = spans[i];
    const dataType = span.getAttribute("data-type");
    const dataId = span.getAttribute("data-id");

    if (dataType === "mention" && dataId) {
      const newElement = doc.createTextNode(blocksContentById[dataId]);
      span.parentNode?.replaceChild(newElement, span);
    }
  }

  return doc.body.innerHTML
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replaceAll("<p>", "")
    .replaceAll("</p>", "")
    .trim();
};

export const formatHTMLWithMentions = (html: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const spans = doc.getElementsByTagName("span");

  for (let i = spans.length - 1; i >= 0; i--) {
    const span = spans[i];
    const dataType = span.getAttribute("data-type");
    const dataId = span.getAttribute("data-id");

    if (dataType === "mention" && dataId) {
      const blockId = `<@block:${dataId}>`;
      const newElement = doc.createTextNode(blockId);
      span.parentNode?.replaceChild(newElement, span);
    }
  }

  return doc.body.innerHTML.replace(/&lt;/g, "<").replace(/&gt;/g, ">");
};

export const restoreHTMLFromMentions = (
  html: string,
  blocksById: BlocksState["data"]["entities"]
) => {
  const blockIdRegex = /<@block:(.*?)>/g;
  const restoredHtml = html.replace(blockIdRegex, (_, blockId) => {
    const dataLabel = blocksById[blockId]?.label || "";
    return `<span data-type="mention" class="${mentionRendererClass}" data-id="${blockId}" data-label="${dataLabel}"></span>`;
  });

  return restoredHtml;
};

export const updateMentionLabel = (html: string, id: string, label: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const spans = doc.getElementsByTagName("span");

  for (let i = spans.length - 1; i >= 0; i--) {
    const span = spans[i];
    const dataType = span.getAttribute("data-type");
    const dataId = span.getAttribute("data-id");

    if (dataType === "mention" && dataId === id) {
      span.setAttribute("data-label", label);
    }
  }

  return doc.body.innerHTML;
};

export const deleteMention = (html: string, id: string) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  const spans = doc.getElementsByTagName("span");

  for (let i = spans.length - 1; i >= 0; i--) {
    const span = spans[i];
    const dataType = span.getAttribute("data-type");
    const dataId = span.getAttribute("data-id");

    if (dataType === "mention" && dataId === id) {
      span.remove();
    }
  }

  return doc.body.innerHTML;
};

export async function copyTextToClipboard(text: string) {
  if ("clipboard" in navigator) {
    return await navigator.clipboard.writeText(text);
  } else {
    return document.execCommand("copy", true, text);
  }
}
