export const isDarwin = /Mac|iPod|iPhone|iPad/.test(window.navigator.platform);

export const KEYS = {
  ARROW_DOWN: "ArrowDown",
  ARROW_LEFT: "ArrowLeft",
  ARROW_RIGHT: "ArrowRight",
  ARROW_UP: "ArrowUp",
  BACKSPACE: "Backspace",
  CTRL_OR_CMD: isDarwin ? "metaKey" : "ctrlKey",
  DELETE: "Delete",
  ENTER: "Enter",
  EQUAL: "Equal",
  ESCAPE: "Escape",
  MINUS: "Minus",
  QUESTION_MARK_KEY: "?",
  QUOTE: "Quote",
  SPACE: "Space",
  TAB: "Tab",

  A_CODE: "KeyA",
  C_CODE: "KeyC",
  D_CODE: "KeyD",
  F_CODE: "KeyF",
  G_CODE: "KeyG",
  H_CODE: "KeyH",
  Q_CODE: "KeyQ",
  S_CODE: "KeyS",
  V_CODE: "KeyV",
  Z_CODE: "KeyZ",
} as const;

export type Key = keyof typeof KEYS;

export const isArrowCode = (code: string) =>
  code === KEYS.ARROW_LEFT ||
  code === KEYS.ARROW_RIGHT ||
  code === KEYS.ARROW_DOWN ||
  code === KEYS.ARROW_UP;

export const getResizeCenterPointKey = (event: MouseEvent | KeyboardEvent) =>
  event.altKey;

export const getResizeWithSidesSameLengthKey = (event: MouseEvent) =>
  event.shiftKey;

export const getRotateWithDiscreteAngleKey = (event: MouseEvent) =>
  event.shiftKey;
