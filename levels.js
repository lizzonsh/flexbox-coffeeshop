// levels.js — shared data: OPTIONS and LEVELS, read by script.js.

// Every value each Flexbox property can take, offered as dropdown choices.
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
  // Items of different heights so column vs. column-reverse are visibly different.
  {
    id: 3,
    instruction: "Arrange the items in a single column, top to bottom in their current order, instead of a row.",
    items: ["cookie", "cup", "cake", "pastry"],
    controls: ["flex-direction"],
    solution: { "flex-direction": "column" }
  },

  // Level 4 — first combo: justify-content + align-items on a row axis.
  // Items of varying heights so the bottom alignment is visible to the eye.
  {
    id: 4,
    instruction: "Spread the items across the full width of the counter with equal gaps between them and no gap at the outer edges, all aligned to the bottom of the counter.",
    items: ["cup", "pastry", "cookie", "cake"],
    controls: ["justify-content", "align-items"],
    solution: { "justify-content": "space-between", "align-items": "flex-end" }
  },

  // Level 5 — combo on a column axis: flex-direction + align-items.
  // Items of varying heights so the horizontal centering (across the column) is clear.
  {
    id: 5,
    instruction: "Arrange the items in a single column, in their current order, all centered across the width of the counter.",
    items: ["pastry", "cup", "cake"],
    controls: ["flex-direction", "align-items"],
    solution: { "flex-direction": "column", "align-items": "center" }
  },

  // Level 6 — flex-wrap. 8 items so that on the 540px board the row actually fills up
  // and wrap causes a real overflow to a second row, not just a theoretical one.
  {
    id: 6,
    instruction: "Too many items for one row — spread them across several rows, with each row centered.",
    items: ["cup", "pastry", "cookie", "cake", "cup", "pastry", "cookie", "cake"],
    controls: ["flex-wrap", "justify-content"],
    solution: { "flex-wrap": "wrap", "justify-content": "center" }
  },

  // Level 7 — reverses the row reading direction (row-reverse); flex-end (not flex-start,
  // which is the initial value and so gives no visible feedback) points left when reversed.
  {
    id: 7,
    instruction: "Reverse the order of the items in the row, so they sit flush against the left side of the counter and are centered vertically.",
    items: ["cup", "pastry", "cookie", "cake"],
    controls: ["flex-direction", "justify-content", "align-items"],
    solution: { "flex-direction": "row-reverse", "justify-content": "flex-end", "align-items": "center" }
  },

  // Level 8 — full combo: column-reverse + justify-content + align-items.
  // The most complex — reversed order on a column axis, centered along the column, aligned to the right.
  {
    id: 8,
    instruction: "Arrange the items in a column, in reverse order, centered along the counter and aligned to the right side.",
    items: ["cake", "cup", "pastry", "cookie"],
    controls: ["flex-direction", "justify-content", "align-items"],
    solution: { "flex-direction": "column-reverse", "justify-content": "center", "align-items": "flex-end" }
  }
];
