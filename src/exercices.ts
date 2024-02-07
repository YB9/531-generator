import assistance_data from "./data/assistance.json";
import lifts_data from "./data/lifts.json";

export class Assistance {
  name: string;
  split: "push" | "pull" | "legs";
  muscle: "Chest" | "Triceps" | "Shoulders" | // Push
          "Biceps" | "Back" | "Forearms" |   // Pull
          "Quads" | "Hamstrings" | "Calves" // Legs;

  constructor(name, type, muscle) {
    this.name = name;
    this.split = type;
    this.muscle = muscle;
  }
}

export const assistanceColors = {
  "Chest": "rgba(255, 0, 0, 0.1)",
  "Triceps": "rgba(255, 0, 255, 0.1)",
  "Shoulders": "rgba(0, 128, 0, 0.1)",
  "Biceps": "rgba(128, 0, 0, 0.1)",
  "Back": "rgba(0, 255, 255, 0.1)",
  "Forearms": "rgba(0, 0, 255, 0.1)",
  "Quads": "rgba(0, 255, 0, 0.1)",
  "Hamstrings": "rgba(255, 255, 0, 0.1)",
  "Calves": "rgba(0, 0, 128, 0.1)"
}

export class Lift {
  name: "Bench" | "Squat" | "Deadlift" | "Overhead Press" | "Barbell Row";
  increment: number;
  deload: number;
  orm: number;

  constructor(name, increment, deload, orm) {
    this.name = name;
    this.increment = increment;
    this.deload = deload;
    this.orm = orm;
  }
}

// Lifts
export const lifts: Lift[] = Object.keys(lifts_data).map(key => {
  const liftData = lifts_data[key];
  return new Lift(liftData.name, liftData.increment, liftData.deload, 0);
})

// Assistance exercises
export const assistance: Assistance[] = [
  ...assistance_data.push.map(exo => new Assistance(exo.name, "push", exo.muscle)),
  ...assistance_data.pull.map(exo => new Assistance(exo.name, "pull", exo.muscle)),
  ...assistance_data.legs.map(exo => new Assistance(exo.name, "legs", exo.muscle))
]

