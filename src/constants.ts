export type Split = "push" | "pull" | "legs";
export type Category = "lift" | "assistance";

export const CHEST = "chest";
export const TRICEPS = "triceps";
export const SHOULDERS = "shoulders";
export const QUADRICEPS = "quadriceps";
export const HAMSTRINGS = "hamstrings";
export const BACK = "back";
export const BICEPS = "biceps";
export const FOREARMS = "forearms";
export const CALVES = "calves";

export const VALID_MUSCLE_GROUPS = [
  CHEST,
  TRICEPS,
  SHOULDERS,
  QUADRICEPS,
  HAMSTRINGS,
  BACK,
  BICEPS,
  FOREARMS,
  CALVES,
];

export const groupColors = {
  [CHEST]: "red",
  [TRICEPS]: "yellow",
  [SHOULDERS]: "blue",
  [QUADRICEPS]: "green",
  [HAMSTRINGS]: "purple",
  [BACK]: "pink",
  [BICEPS]: "teal",
  [FOREARMS]: "orange",
  [CALVES]: "cyan",
};
