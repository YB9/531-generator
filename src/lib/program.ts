import { AssistanceExercise, Lift, Maxes } from '../types';

export const projectOrms = (
  lifts: Lift[],
  maxes: Maxes,
  cycles: number,
  adjustments: Record<string, number>
): Record<string, number[]> => {
  const result: Record<string, number[]> = {};
  lifts.forEach((lift) => {
    const initial = maxes[lift.name] || 0;
    const arr = [initial * (adjustments[lift.name] || 1)];
    for (let i = 1; i <= cycles; i++) {
      const prev = arr[arr.length - 1];
      if (i % 5 === 0) {
        arr.push(prev - lift.deload);
      } else {
        arr.push(prev + lift.overload);
      }
    }
    result[lift.name] = arr;
  });
  return result;
};

export const weightedRandomSchedule = (
  assistance: AssistanceExercise[],
  cycles: number
): AssistanceExercise[] => {
  const push = assistance.filter((e) => e.split === 'push');
  const pull = assistance.filter((e) => e.split === 'pull');
  const legs = assistance.filter((e) => e.split === 'legs');
  const totalWeeks = Math.ceil(cycles * 1.5);
  const schedule: AssistanceExercise[] = [];
  const random = (array: AssistanceExercise[]) =>
    [...array].sort(() => Math.random() - 0.5).slice(0, 3);
  for (let i = 0; i < totalWeeks; i++) {
    schedule.push(
      ...random(push),
      ...random(pull),
      ...random(legs),
      ...random(push),
      ...random(pull)
    );
  }
  return schedule;
};

export const balancedSchedule = (
  assistance: AssistanceExercise[],
  cycles: number
): AssistanceExercise[] => {
  const push = assistance.filter((e) => e.split === 'push');
  const pull = assistance.filter((e) => e.split === 'pull');
  const legs = assistance.filter((e) => e.split === 'legs');
  const totalWeeks = Math.ceil(cycles * 1.5);
  const schedule: AssistanceExercise[] = [];

  const select = (array: AssistanceExercise[]) => {
    const shuffled = [...array].sort(() => Math.random() - 0.5);
    const selected: AssistanceExercise[] = [];
    const groups = new Set<string>();
    for (const exo of shuffled) {
      const mainGroup = exo.group[0];
      if (!groups.has(mainGroup)) {
        selected.push(exo);
        groups.add(mainGroup);
      }
      if (selected.length === 3) break;
    }
    return selected;
  };

  for (let i = 0; i < totalWeeks; i++) {
    schedule.push(
      ...select(push),
      ...select(pull),
      ...select(legs),
      ...select(push),
      ...select(pull)
    );
  }
  return schedule;
};

export const getWeightedCount = (
  exos: AssistanceExercise[],
  muscle: string
): number => {
  const SECONDARY_INC = 0.25;
  const count = exos.reduce((acc, exo) => {
    exo.group.forEach((group, index) => {
      if (group === muscle) {
        acc += index === 0 ? 1 : SECONDARY_INC;
      }
    });
    return acc;
  }, 0);
  return Math.ceil(count);
};
