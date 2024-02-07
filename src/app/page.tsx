'use client'
import { lifts, assistance, assistanceColors, Lift } from "@/exercices"
import Link from "next/link";
import { useState } from "react";

const AssistanceSection = ({ type, selectedAssistance, setSelectedAssistance }) => {
  const isSelected = (item) => selectedAssistance.includes(item)

  return (
    <div style={{ flex: 1, borderBottom: '1px solid black' }}>
      <h2 style={{ textAlign: 'center', backgroundColor: 'darkgray', border: '1px solid black' }}>{type.toUpperCase()}</h2>
      {assistance.filter((item) => item.split === type).map((item) => (
        <div 
          key={item.name}
          style={{ backgroundColor: isSelected(item) && 'rgba(100, 100, 200, 0.1)', textAlign: 'center', display: 'flex', flexDirection: 'row', 
            justifyContent: 'space-between', padding: 15, borderRight: '1px solid black', borderLeft: '1px solid black', cursor: 'pointer' }}
          onClick={() => setSelectedAssistance(
            isSelected(item) ? selectedAssistance.filter((i) => i.name !== item.name) : [...selectedAssistance, item]
            )}  
          >
          <p>{item.name}</p>
          <p style={{ backgroundColor: assistanceColors[item.muscle], padding: '0px 10px' }}>{item.muscle}</p>
        </div>
      ))}
    </div>
  );
};

export default function Home() {
  const [orms, setORMs] = useState([])
  const [selectedAssistance, setSelectedAssistance] = useState(assistance)

  return (
    <div className="flex p-10 h-lvh w-lvw">
      
      <div style={{ flex: '1 0 20%', display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly', height: '75%'}}>
        <h2 style={{ textAlign: 'center' }}>LIFTS</h2>
        {lifts.map((lift) => (
          <div key={lift.name} className="m-5">
            <p>{lift.name}</p>
            <input style={{ border: '1px solid black' }} onChange={(e) => {
              const updatedLift = new Lift(lift.name, lift.increment, lift.deload, Number(e.target.value)*0.9)
              setORMs(
                [...orms.filter((orm) => orm.name !== lift.name), updatedLift]
              )
            }}/>
          </div>
          ))}
        <Link href={
          '/program'
          + '?orms=' + JSON.stringify(orms)
          + '&selectedAssistance=' + JSON.stringify(selectedAssistance)
        }> Generate Program </Link>
      </div>

      <div className="mt-5" style={{ flex: '1 0 80%' }}>
        <h2 style={{ textAlign: 'center' }}>ASSISTANCE</h2>
        <div className="mt-10" style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <AssistanceSection type="push" selectedAssistance={selectedAssistance} setSelectedAssistance={setSelectedAssistance} />
          <AssistanceSection type="pull" selectedAssistance={selectedAssistance} setSelectedAssistance={setSelectedAssistance} />
          <AssistanceSection type="legs" selectedAssistance={selectedAssistance} setSelectedAssistance={setSelectedAssistance} />
        </div>
      </div>

    </div>
  )
}

