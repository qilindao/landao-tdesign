import { canUseDom } from "./utils";

export default function isDocumentVisible() {
  if (canUseDom()) {
    return document.visibilityState !== "hidden";
  }
  return true;
}
