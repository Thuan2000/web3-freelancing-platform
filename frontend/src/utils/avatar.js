import * as jdenticon from "jdenticon";

export const generateAvatarDataUrl = (username, size = 100) => {
  const svg = jdenticon.toSvg(username, size);
  const dataUrl = `data:image/svg+xml;base64,${btoa(svg)}`;
  return dataUrl;
};