export interface Exercise {
  name: string;
  group: string[];
  category: string;
  split: string;
}

export interface Lift extends Exercise {
  overload: number;
  deload: number;
}

export interface AssistanceExercise extends Exercise {}

export type Maxes = Record<string, number | undefined>;
