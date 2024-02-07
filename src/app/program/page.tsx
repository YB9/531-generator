'use client'
import { Assistance, Lift } from "@/exercices"
import { useSearchParams } from "next/navigation";
import Day from "@/app/program/day";

const plan = {
  0: ["Squat", "Bench", "push"],
  1: ["Barbell Row", "Overhead Press", "pull"],
  2: ["Deadlift", "Squat", "legs"],
  3: ["Bench", "Barbell Row", "push"],
  4: ["Overhead Press", "Deadlift", "pull"],
}

const totalWeeks = 26

export default function Program() {
  const searchParams = useSearchParams();
  const lifts: Lift[] = JSON.parse(searchParams.get("orms"));
  const assistance: Assistance[] = JSON.parse(searchParams.get("selectedAssistance"));
  const getLift = (day) => {
    return [ lifts.find(lift => lift.name === plan[day][0]), lifts.find(lift => lift.name === plan[day][1]) ]
  }
  const getAssistance = (day) => {
    const splitExos = assistance.filter((item) => item.split === plan[day][2])
    const exos = []
    while (exos.length < 4) {
      const exo = splitExos[Math.floor(Math.random() * splitExos.length)]
      if (!exos.includes(exo)) {
        exos.push(exo)
      }
    }
    return exos
  }

  const getSplit = (week, day) => {
    const totalDays = week * 5 + day
    const totalCycles = Math.floor(totalDays / 7.5)
    const dayType = Math.floor(totalDays / 2.5) % 3
    return { cycle: totalCycles, plan: plan[day], type: dayType }
  }

  return (
    <div className="flex flex-wrap p-10" style={{ justifyContent: 'space-evenly' }}>
        {[...Array(totalWeeks)].map((x, week) =>
          <div key={"week " + week} style={{ width: '40%', borderRight: week % 2 === 0 && '2px solid black', padding: '20px 0px 0px 50px' }}>
            <h1 style={{ fontWeight: 'bolder' }}>Week {week + 1}</h1>
            {[...Array(5)].map((x, day) => (
              <Day 
                key={"week-"+ week + "-day-" + day}
                lifts={getLift(day)}
                assistance={getAssistance(day)}
                split={getSplit(week, day)}
              />
            ))}
            <br />
          </div>
        )}
    </div>
  )
}

