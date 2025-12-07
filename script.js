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
    bench: { increment: 7.5, deload: 10 },
    ohp: { increment: 5, deload: 7.5 },
    squat: { increment: 7.5, deload: 15 },
    row: { increment: 5, deload: 5 },
    deadlift: { increment: 10, deload: 20 }
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
    const weight = parseFloat(document.getElementById(`${lift}-weight`).value);
    const reps = parseInt(document.getElementById(`${lift}-reps`).value);

    const oneRM = calculate1RM(weight, reps);

    // Display 1RM
    const oneRMElement = document.getElementById(`${lift}-1rm`);
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
        const selectedExercises = Array.from(exerciseList.querySelectorAll('.exercise-item.selected'))
            .map(item => item.dataset.exercise);
        assistanceData[split] = selectedExercises;
    });
}

// Toggle exercise selection
function toggleExercise(event) {
    if (event.target.classList.contains('exercise-item')) {
        event.target.classList.toggle('selected');
    }
}

// Initialize exercise selection listeners and populate exercise lists from JS
document.addEventListener('DOMContentLoaded', function () {
    // Populate exercise lists from assistanceExercises object
    populateExerciseLists();

    const exerciseLists = document.querySelectorAll('.exercise-list');
    exerciseLists.forEach(list => {
        list.addEventListener('click', toggleExercise);
    });
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
                div.dataset.exercise = exercise;
                div.textContent = exercise;
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
// Every week adds increment to 1RM, every 5th week is a deload
// 1RM never decreases below max ever reached
function calculate1RMForWeek(lift, startingOneRM, weekNumber) {
    const config = progressionConfig[lift];
    let max1RM = startingOneRM;
    let current1RM = startingOneRM;

    for (let week = 1; week <= weekNumber; week++) {
        if (week % 5 === 0) {
            // Deload week - subtract deload value but don't update max
            current1RM = max1RM - config.deload;
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

    // Monthly rows (approximately 4.33 weeks per month)
    for (let month = 1; month <= 6; month++) {
        const row = document.createElement('tr');
        const monthCell = document.createElement('td');
        monthCell.textContent = `Month ${month}`;
        row.appendChild(monthCell);

        const weeksElapsed = Math.round(month * 4.33);

        lifts.forEach(lift => {
            const cell = document.createElement('td');
            const oneRM = calculate1RMForWeek(lift, initialOneRMs[lift], weeksElapsed);
            cell.textContent = roundDownToFive(oneRM) + ' lb';
            row.appendChild(cell);
        });

        tbody.appendChild(row);
    }

    table.appendChild(tbody);
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

    // Generate 26 weeks (~6 months) of programming
    const numWeeks = 26;

    for (let week = 1; week <= numWeeks; week++) {
        const isDeload = (week % 5 === 0);

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
