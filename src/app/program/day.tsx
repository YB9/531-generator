'use client'
import { Lift, Assistance } from "@/exercices";

const five = ['15', '5', '5', '5+', '5+']
const three = ['15', '3', '3', '3+', '5+']
const one = ['15', '5', '3', '1+', '5+']

const repTypeMap = {
  0: five,
  1: three,
  2: one
}

export default function Day ({ lifts, assistance, split }: { lifts: Lift[], assistance: Assistance[], split })  {
  const splitTypeA = repTypeMap[split.type]
  const splitTypeB = lifts[1].name === 'Squat' ? repTypeMap[(split.type + 1) % 3] : repTypeMap[split.type]

  const calcWeightArr = (splitType, lift) => {
    const isOverlap =  split.plan[0] === "Deadlift" && split.plan[1] === "Squat"
    const offset = (isOverlap && lift.name === "Squat") ? 1 : 0

    const increment = lift.increment * (split.cycle + offset)
    const deload = (lift.increment + lift.deload) * Math.floor((split.cycle + offset ) / 5)

    const updaedOrm = lift.orm + increment - deload
    const weightValues = [
      Math.round(updaedOrm * 0.25 / 5) * 5,
    ]
    switch (splitType) {
      case five:
        weightValues.push(
          Math.round(updaedOrm * 0.65 / 5) * 5,
          Math.round(updaedOrm * 0.75 / 5) * 5,
          Math.round(updaedOrm * 0.85 / 5) * 5,
          Math.round(updaedOrm * 0.65 / 5) * 5
        )
        break;
      case three:
        weightValues.push(
          Math.round(updaedOrm * 0.7 / 5) * 5,
          Math.round(updaedOrm * 0.8 / 5) * 5,
          Math.round(updaedOrm * 0.9 / 5) * 5,
          Math.round(updaedOrm * 0.7 / 5) * 5
        )
        break;
      case one:
        weightValues.push(
          Math.round(updaedOrm * 0.75 / 5) * 5,
          Math.round(updaedOrm * 0.85 / 5) * 5,
          Math.round(updaedOrm * 0.95 / 5) * 5,
          Math.round(updaedOrm * 0.75 / 5) * 5
        )
        break;
    }
    return weightValues
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'row', padding: '10px 0px' }}>
      <div id="lifts" style={{ flex: 1, display: 'flex', flexDirection: 'row' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <p> {lifts[0].name} </p>
          {splitTypeA.map((reps, i) => (
            <p style={{ fontSize: 14 }} key={i}> {reps + ' x ' + calcWeightArr(splitTypeA, lifts[0])[i] + ' lbs'} </p>
          ))
          }
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <p> {lifts[1].name} </p>
          {splitTypeB.map((reps, i) => (
            <p style={{ fontSize: 14 }} key={i}> {reps + ' x ' + calcWeightArr(splitTypeB, lifts[1])[i] + ' lbs'} </p>
          ))
          }
        </div>
      </div>
      <div id="assistance" style={{ flex: 1 }}>
        <p> {split.plan[2]} </p>
        {[...Array(4)].map((x, i) => (
          <p style={{ fontSize: 14 }} key={i} suppressHydrationWarning> {'3x12 ' + assistance[i].name} </p>
        ))
        }
      </div>
    </div>
  );
};


