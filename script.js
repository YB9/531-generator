let currentStep = 1;
const lifts = ["squat", "deadlift", "bench", "ohp", "row"];
let trainingMaxes = {};
let assistanceData = {};

// Assistance exercises for each split (moved from HTML)
const assistanceExercises = {
    push: [
        "Dumbbell flat bench press",
        "Incline dumbbell bench press",
        "Push-ups",
        "Dumbbell floor press",
        "Seated dumbbell shoulder press",
        "Arnold press",
        "Pike push-ups / handstand push-ups",
        "Single-arm dumbbell overhead press",
        "Dumbbell lateral raise",
        "Dumbbell front raise",
        "Lying triceps extension",
        "Overhead dumbbell triceps extension",
        "Diamond / close-grip push-ups"
    ],
    pull: [
        "Pull-ups",
        "Chin-ups",
        "Dumbbell pullover",
        "Barbell pullover",
        "Pendlay row",
        "One-arm dumbbell row",
        "Inverted row",
        "Yates row",
        "Bent-over rear delt raise",
        "DB Y-raise",
        "Barbell curl",
        "Alternating dumbbell curl",
        "Hammer curl"
    ],
    legs: [
        "Front squat",
        "Goblet squat",
        "Walking lunges",
        "Romanian deadlift",
        "Stiff-leg deadlift",
        "Barbell good morning",
        "Barbell hip thrust",
        "Nordic hamstring curl",
        "Bulgarian split squat",
        "Step-ups",
        "Single-leg Romanian deadlift",
        "Single-leg glute bridge",
        "Standing calf raise"
    ]
};

// Progression settings (in lbs)
const progressionConfig = {
    bench:     { increment: 7.5,  deload: 10 },   // aggressive
    ohp:       { increment: 5,    deload: 10 },   // slight deload bump for recovery
    squat:     { increment: 7.5,  deload: 15 },   // push monthly gains a bit
    row:       { increment: 7.5,  deload: 10 },   // rows recover fast; add more
    deadlift:  { increment: 10,   deload: 20 }    // most room for aggression
};

// Default 1RM values for beginners
const defaultWeights = {
    squat: 85,
    deadlift: 125,
    bench: 85,
    ohp: 50,
    row: 65
};

// Program structure: 5 days per week
const programStructure = [
    {
        day: 1,
        name: "Push",
        split: "push",
        lifts: [
            { lift: "bench", sets: 5, reps: 3, percentage: 0.87, type: "strength" },
            { lift: "ohp", sets: 4, reps: 10, percentage: 0.70, type: "hypertrophy" }
        ]
    },
    {
        day: 2,
        name: "Pull",
        split: "pull",
        lifts: [
            { lift: "deadlift", sets: 5, reps: 3, percentage: 0.87, type: "strength" },
            { lift: "row", sets: 4, reps: 10, percentage: 0.70, type: "hypertrophy" }
        ]
    },
    {
        day: 3,
        name: "Legs",
        split: "legs",
        lifts: [
            { lift: "squat", sets: 4, reps: 3, percentage: 0.75, type: "strength" },
            { lift: "bench", sets: 4, reps: 10, percentage: 0.70, type: "hypertrophy" }
        ]
    },
    {
        day: 4,
        name: "Push",
        split: "push",
        lifts: [
            { lift: "ohp", sets: 5, reps: 3, percentage: 0.87, type: "strength" },
            { lift: "deadlift", sets: 3, reps: 8, percentage: 0.70, type: "hypertrophy" }
        ]
    },
    {
        day: 5,
        name: "Pull",
        split: "pull",
        lifts: [
            { lift: "row", sets: 5, reps: 5, percentage: 0.80, type: "strength" },
            { lift: "squat", sets: 3, reps: 5, percentage: 0.70, type: "hypertrophy" }
        ]
    }
];

// Helper to determine if a week is a deload week
// Deloads happen every other month (Month 2, 4, 6...)
// On the FIRST week of that month.
// Month 1: Weeks 1-4
// Month 2: Weeks 5-8 (Deload on Week 5)
// Month 3: Weeks 9-12
// Month 4: Weeks 13-16 (Deload on Week 13)
function isDeloadWeek(week) {
    // Week 5, 13, 21...
    // Formula: (week - 5) % 8 === 0
    return (week >= 5) && ((week - 5) % 8 === 0);
}

function calculate1RM(weight, reps) {
    if (!weight || !reps || weight <= 0 || reps <= 0) return null;
    return weight * (1 + reps / 30);
}

// Round DOWN to nearest multiple of 5
function roundDownToFive(value) {
    return Math.floor(value / 5) * 5;
}

function setResult(id, value) {
    document.getElementById(id).textContent =
        value ? value.toFixed(1) + " lb" : "—";
}

function nextStep(step) {
    if (step === 2) {
        // Validate Step 1
        if (!calculateAndValidateLifts()) {
            alert("Please enter valid weights and reps for all lifts.");
            return;
        }
    }

    if (step === 3) {
        // Gather Step 2 data
        gatherAssistanceData();
        generateOverview();
    }

    showStep(step);
}

function prevStep(step) {
    showStep(step);
}

function showStep(step) {
    document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
    document.getElementById(`step-${step}`).classList.add('active');
    currentStep = step;
}

function calculateLift(lift) {
    const weightInput = document.getElementById(`${lift}-weight`).value;
    const repsInput = document.getElementById(`${lift}-reps`).value;

    // Use input value if present, otherwise default
    // If input is empty string, use default. If 0, use 0 (though 0 weight is likely invalid for 1RM calculation it will just return null)
    let weight = weightInput !== "" ? parseFloat(weightInput) : defaultWeights[lift];
    let reps = repsInput !== "" ? parseInt(repsInput) : 1;

    const oneRM = calculate1RM(weight, reps);

    // Display 1RM
    const oneRMElement = document.getElementById(`${lift}-1rm`);
    
    // If we rely on defaults, strictly speaking the input is "empty" but we have a value.
    // However, if the user explicitly types 0, we want to respect that (and show nothing/invalid).
    // calculate1RM returns null for <= 0.
    
    oneRMElement.textContent = oneRM ? `1RM: ${oneRM.toFixed(1)} lb` : "—";

    // Display Training Max (0.9 × 1RM)
    const tmElement = document.getElementById(`${lift}-tm`);
    if (oneRM) {
        trainingMaxes[lift] = oneRM * 0.90;
        tmElement.textContent = `TM: ${trainingMaxes[lift].toFixed(1)} lb`;
    } else {
        tmElement.textContent = "—";
        delete trainingMaxes[lift];
    }

    // Check if all lifts are calculated to enable Next button
    checkAllLiftsCalculated();
}

function checkAllLiftsCalculated() {
    let allCalculated = true;

    lifts.forEach(lift => {
        if (!trainingMaxes[lift]) {
            allCalculated = false;
        }
    });

    document.getElementById('next-to-step2').disabled = !allCalculated;
}

function calculateAndValidateLifts() {
    // Check if calculations have been done
    let allCalculated = true;

    lifts.forEach(lift => {
        if (!trainingMaxes[lift]) {
            allCalculated = false;
        }
    });

    return allCalculated;
}




function gatherAssistanceData() {
    const splits = ['push', 'pull', 'legs'];
    assistanceData = {};

    splits.forEach(split => {
        const exerciseList = document.getElementById(`${split}-exercises`);
        // Select text values from selected items
        const selectedExercises = Array.from(exerciseList.querySelectorAll('.exercise-item.selected .exercise-name'))
            .map(span => span.textContent.trim()) // Get text from span
            .filter(val => val.length > 0); // Ensure not empty

        assistanceData[split] = selectedExercises;
    });
}

// Toggle exercise selection
function toggleExercise(event) {
    // Check if the click originated from the editable span
    // We rely on the fact that the span only wraps the text
    if (event.target.classList.contains('exercise-name')) {
        return; // Do nothing if clicking the text (browser handles focus)
    }

    // Otherwise toggle selection if clicking the container (background/padding)
    const item = event.target.closest('.exercise-item');
    if (item) {
        item.classList.toggle('selected');
    }
}

// Prevent newlines in contenteditable
function handleEnterKey(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        event.target.blur(); // Remove focus
    }
}

// Initialize exercise selection listeners and populate exercise lists from JS
document.addEventListener('DOMContentLoaded', function () {
    // Populate exercise lists from assistanceExercises object
    populateExerciseLists();

    const exerciseLists = document.querySelectorAll('.exercise-list');
    exerciseLists.forEach(list => {
        list.addEventListener('click', toggleExercise);
        
        // Add listener for Enter key on contenteditable elements
        list.addEventListener('keydown', function(e) {
            if (e.target.classList.contains('exercise-name')) {
                handleEnterKey(e);
            }
        });
    });

    // Initialize all lifts with stored values or defaults
    lifts.forEach(lift => calculateLift(lift));
});

// Populate exercise lists dynamically from assistanceExercises
function populateExerciseLists() {
    const splits = ['push', 'pull', 'legs'];

    splits.forEach(split => {
        const container = document.getElementById(`${split}-exercises`);
        if (container) {
            container.innerHTML = ''; // Clear existing content

            assistanceExercises[split].forEach(exercise => {
                const div = document.createElement('div');
                div.className = 'exercise-item selected';
                
                // Create contenteditable span for editable name
                const span = document.createElement('span');
                span.className = 'exercise-name';
                span.contentEditable = true;
                span.textContent = exercise;
                // Disable spellcheck for cleaner look
                span.spellcheck = false;
                
                div.appendChild(span);
                container.appendChild(div);
            });
        }
    });
}



// Pick n random items from an array
function pickRandom(arr, n) {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(n, arr.length));
}

// Calculate 1RM for a given week, with progressive overload and deloads
// Every week adds increment to 1RM, except deload weeks
// Deloads happen every other month, on the 1st week of the yes month
function calculate1RMForWeek(lift, startingOneRM, weekNumber) {
    const config = progressionConfig[lift];
    let max1RM = startingOneRM;
    let current1RM = startingOneRM;

    for (let week = 1; week <= weekNumber; week++) {
        if (isDeloadWeek(week)) {
            // Deload week - subtract deload value AND update max
            // This ensures future increments build from this new lower baseline
            current1RM = max1RM - config.deload;
            max1RM = current1RM;
        } else {
            // Normal week - add increment
            current1RM = max1RM + config.increment;
            max1RM = current1RM; // Update max
        }
    }

    return current1RM;
}

// Get the max 1RM ever reached for a lift up to a given week
function getMax1RMForWeek(lift, startingOneRM, weekNumber) {
    const config = progressionConfig[lift];
    let max1RM = startingOneRM;

    // Count non-deload weeks to calculate max
    for (let week = 1; week <= weekNumber; week++) {
        if (week % 5 !== 0) {
            max1RM += config.increment;
        }
    }

    return max1RM;
}

function generateOverview() {
    const container = document.getElementById('overview-content');
    container.innerHTML = '';

    // Get initial 1RM values
    const initialOneRMs = {};
    lifts.forEach(lift => {
        initialOneRMs[lift] = trainingMaxes[lift] / 0.9;
    });

    // Show 1RM progression table - monthly values only
    const tableTitle = document.createElement('h3');
    tableTitle.textContent = 'One Rep Max Progression (6 Months)';
    container.appendChild(tableTitle);

    const table = document.createElement('table');
    table.id = 'tm-table';

    // Header
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    ['Month', 'Squat', 'Deadlift', 'Bench', 'OHP', 'Row'].forEach(text => {
        const th = document.createElement('th');
        th.textContent = text;
        headerRow.appendChild(th);
    });
    thead.appendChild(headerRow);
    table.appendChild(thead);

    // Body
    const tbody = document.createElement('tbody');

    // Initial row
    const initialRow = document.createElement('tr');
    const initialCell = document.createElement('td');
    initialCell.textContent = 'Start';
    initialRow.appendChild(initialCell);

    lifts.forEach(lift => {
        const cell = document.createElement('td');
        cell.textContent = roundDownToFive(initialOneRMs[lift]) + ' lb';
        initialRow.appendChild(cell);
    });
    tbody.appendChild(initialRow);

    // Monthly rows (4 weeks per month)
    let prevWeeksElapsed = 0;
    for (let month = 1; month <= 6; month++) {
        const row = document.createElement('tr');
        const monthCell = document.createElement('td');
        monthCell.textContent = `Month ${month}`;
        row.appendChild(monthCell);

        const weeksElapsed = month * 4;

        lifts.forEach(lift => {
            const cell = document.createElement('td');
            const oneRM = calculate1RMForWeek(lift, initialOneRMs[lift], weeksElapsed);
            
            // Calculate increments and deloads for this month
            // Range: (prevWeeksElapsed + 1) to weeksElapsed
            let increments = 0;
            let deloads = 0;
            const config = progressionConfig[lift];

            for (let w = prevWeeksElapsed + 1; w <= weeksElapsed; w++) {
                if (isDeloadWeek(w)) {
                    deloads += config.deload;
                } else {
                    increments += config.increment;
                }
            }

            cell.textContent = roundDownToFive(oneRM) + ' lb';

            // Add diffs
            if (increments > 0) {
                const spanPlus = document.createElement('span');
                spanPlus.className = 'diff-add';
                spanPlus.textContent = '+' + increments;
                cell.appendChild(spanPlus);
            }

            if (deloads > 0) {
                const spanMinus = document.createElement('span');
                spanMinus.className = 'diff-sub';
                spanMinus.textContent = '-' + deloads;
                cell.appendChild(spanMinus);
            }

            row.appendChild(cell);
        });

        tbody.appendChild(row);

        prevWeeksElapsed = weeksElapsed;
    }

    table.appendChild(tbody);

    // Add Total Diff Row
    const totalRow = document.createElement('tr');
    const totalLabel = document.createElement('td');
    totalLabel.textContent = 'Total Gain';
    totalLabel.style.fontWeight = 'bold';
    totalRow.appendChild(totalLabel);

    lifts.forEach(lift => {
        const cell = document.createElement('td');
        const startVal = roundDownToFive(initialOneRMs[lift]);
        // Month 6 ends at week 24 (6 * 4)
        const endVal = roundDownToFive(calculate1RMForWeek(lift, initialOneRMs[lift], 24));
        const diff = endVal - startVal;

        if (diff > 0) {
            const spanPlus = document.createElement('span');
            spanPlus.className = 'diff-add';
            // Make the font slightly larger/bolder as requested implicitly by "mirroring Start row" importance
            spanPlus.style.fontWeight = 'bold';
            spanPlus.textContent = '+' + diff + ' lb';
            cell.appendChild(spanPlus);
        } else if (diff < 0) {
            const spanMinus = document.createElement('span');
            spanMinus.className = 'diff-sub';
            spanMinus.style.fontWeight = 'bold';
            spanMinus.textContent = diff + ' lb';
            cell.appendChild(spanMinus);
        } else {
            cell.textContent = '—';
        }
        totalRow.appendChild(cell);
    });
    tbody.appendChild(totalRow);

    container.appendChild(table);
}

function downloadProgram() {
    // Get initial 1RM values
    const initialOneRMs = {};
    lifts.forEach(lift => {
        initialOneRMs[lift] = trainingMaxes[lift] / 0.9;
    });

    let content = "=".repeat(60) + "\n";
    content += "WORKOUT PROGRAM - 6 MONTH PLAN\n";
    content += "=".repeat(60) + "\n";
    content += `Generated: ${new Date().toLocaleDateString()}\n\n`;

    // Generate 24 weeks (6 months * 4 weeks) of programming
    const numWeeks = 24;

    for (let week = 1; week <= numWeeks; week++) {
        const isDeload = isDeloadWeek(week);

        // Calculate current 1RMs for this week (use training max = 90% of 1RM for calculations)
        const weekOneRMs = {};
        lifts.forEach(lift => {
            weekOneRMs[lift] = calculate1RMForWeek(lift, initialOneRMs[lift], week - 1);
        });

        content += "\n" + "=".repeat(60) + "\n";
        content += `WEEK ${week}${isDeload ? ' (DELOAD)' : ''}\n`;
        content += "=".repeat(60) + "\n";

        // Show 1RMs for this week (rounded to 5)
        content += "1RMs: ";
        content += lifts.map(lift => {
            const name = lift.charAt(0).toUpperCase() + lift.slice(1);
            return `${name}: ${roundDownToFive(weekOneRMs[lift])}`;
        }).join(", ") + "\n";

        // Generate each day
        programStructure.forEach(dayInfo => {
            content += "\n" + "-".repeat(40) + "\n";
            content += `Day ${dayInfo.day} – ${dayInfo.name}\n`;
            content += "-".repeat(40) + "\n";

            // Main lifts - use training max (90% of 1RM) for weight calculations
            dayInfo.lifts.forEach(liftInfo => {
                const trainingMax = weekOneRMs[liftInfo.lift] * 0.9;
                const weight = roundDownToFive(trainingMax * liftInfo.percentage);
                const liftName = liftInfo.lift.charAt(0).toUpperCase() + liftInfo.lift.slice(1);
                content += `  ${liftName}: ${liftInfo.sets}×${liftInfo.reps} @ ${weight} lb\n`;
            });

            // Assistance work - pick 3 random from the split
            const selectedAssistance = assistanceData[dayInfo.split] || assistanceExercises[dayInfo.split];
            const randomAssistance = pickRandom(selectedAssistance, 3);

            if (randomAssistance.length > 0) {
                content += "Assistance:\n";
                randomAssistance.forEach(exercise => {
                    content += `  ${exercise}\n`;
                });
            }
        });
    }

    console.log(content);
}
