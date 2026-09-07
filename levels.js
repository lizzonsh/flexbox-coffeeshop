// levels.js — shared data file for the "Coffee Shop" game.
// Don't edit fields in this file without coordinating with your partner — both the logic and the design read from it.

// All possible values for each flex property, per the spec document.
const OPTIONS = {
  "display":         ["block", "flex"],
  "flex-direction":  ["row", "row-reverse", "column", "column-reverse"],
  "justify-content": ["flex-start", "flex-end", "center", "space-between", "space-around"],
  "align-items":     ["flex-start", "flex-end", "center", "stretch"],
  "flex-wrap":       ["nowrap", "wrap"]
};

const LEVELS = [
  // Level 1 — intro to display: flex. Items are stacked one under another (the default
  // block behavior), and the player needs to turn the counter into a flex container so they line up in a row.
  {
    id: 1,
    instruction: "The items on the counter are stacked one under another. Turn the counter into a flex container so they line up in a single row.",
    items: ["cup", "cup", "cup"],
    controls: ["display"],
    solution: { display: "flex" }
  },

  // Level 2 — basic justify-content on the main axis (row). Tests horizontal centering only.
  {
    id: 2,
    instruction: "Center the items in the middle of the counter, horizontally.",
    items: ["cup", "cup", "cup", "pastry"],
    controls: ["justify-content"],
    solution: { "justify-content": "center" }
  },

  // Level 3 — basic flex-direction. Switches from a row layout to a column layout.
  {
    id: 3,
    instruction: "Arrange the items in a single column, one above another, instead of a row.",
    items: ["cookie", "cookie", "cookie", "cookie"],
    controls: ["flex-direction"],
    solution: { "flex-direction": "column" }
  },

  // Level 4 — first combo: justify-content + align-items on a row axis.
  // Items of varying heights so the bottom alignment is visible to the eye.
  {
    id: 4,
    instruction: "Spread the items across the full width of the counter with equal gaps between them, all aligned to the bottom of the counter.",
    items: ["cup", "pastry", "cookie", "cake"],
    controls: ["justify-content", "align-items"],
    solution: { "justify-content": "space-between", "align-items": "flex-end" }
  },

  // Level 5 — combo on a column axis: flex-direction + align-items.
  // Items of varying heights so the horizontal centering (across the column) is clear.
  {
    id: 5,
    instruction: "Arrange the items in a single column, all centered across the width of the counter.",
    items: ["pastry", "cup", "cake"],
    controls: ["flex-direction", "align-items"],
    solution: { "flex-direction": "column", "align-items": "center" }
  },

  // Level 6 — flex-wrap. 8 items so that on a 600px board the row actually fills up
  // and wrap causes a real overflow to a second row, not just a theoretical one.
  {
    id: 6,
    instruction: "Too many items for one row — spread them across a few rows, centered under each other.",
    items: ["cup", "pastry", "cookie", "cake", "cup", "pastry", "cookie", "cake"],
    controls: ["flex-wrap", "justify-content"],
    solution: { "flex-wrap": "wrap", "justify-content": "center" }
  },

  // Level 7 — reverses the row reading direction (row-reverse). On a reversed main axis,
  // flex-start points to the right side of the counter (unlike the intuitive direction in a
  // normal row) — that's exactly what this level tests, per the RTL note in the spec document.
  {
    id: 7,
    instruction: "Reverse the order of the items in the row, so they sit against the right side of the counter and are centered vertically.",
    items: ["cup", "pastry", "cookie", "cake"],
    controls: ["flex-direction", "justify-content", "align-items"],
    solution: { "flex-direction": "row-reverse", "justify-content": "flex-start", "align-items": "center" }
  },

  // Level 8 — full combo: column-reverse + justify-content + align-items.
  // The most complex — reversed order on a column axis, centered along the column, aligned to the right.
  {
    id: 8,
    instruction: "Reverse the order of the items in the column, center them along the counter, and align them to the right side.",
    items: ["cake", "cup", "pastry", "cookie"],
    controls: ["flex-direction", "justify-content", "align-items"],
    solution: { "flex-direction": "column-reverse", "justify-content": "center", "align-items": "flex-end" }
  }
];