let currentStep = 1;
const lifts = ["squat", "deadlift", "bench", "ohp", "row"];
let trainingMaxes = {};
let assistanceData = {};

// Assistance exercises for each split (moved from HTML)
const assistanceExercises = {
    push: [
        "Dumbbell flat bench press (Chest)",
        "Incline dumbbell bench press (Chest)",
        "Push-ups (Chest)",
        "Seated dumbbell shoulder press (Shoulders)",
        "Arnold press (Shoulders)",
        "Dumbbell lateral raise (Shoulders)",
        "Dumbbell front raise (Shoulders)",
        "Lying triceps extension (Triceps)",
        "Overhead dumbbell triceps extension (Triceps)",
        "Close-grip push-ups (Triceps)"
    ],
    pull: [
        "Pull-ups (Lats)",
        "Chin-ups (Lats)",
        "One-arm dumbbell row (Back)",
        "Pendlay row (Back)",
        "Dumbbell pullover (Lats)",
        "Face Pulls (Rear Delts)",
        "Barbell curl (Biceps)",
        "Hammer curl (Biceps)",
        "Wrist Curls (Forearms)",
        "Reverse Barbell Curl (Forearms)"
    ],
    legs: [
        "Bulgarian Split Squat (Quads/Glutes)",
        "Romanian Deadlift (Hamstrings)",
        "Barbell Hip Thrust (Glutes)",
        "Walking Lunges (Legs)",
        "Standing Calf Raise (Calves)"
    ]
};

// Progression settings (in lbs per 4-week cycle)
const progressionConfig = {
    bench: 23,
    ohp: 15,
    squat: 12,
    row: 17,
    deadlift: 20
};


// Default 1RM values for beginners
const defaultWeights = {
    squat: 45,
    deadlift: 95,
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
            { lift: "deadlift", sets: 4, reps: 8, percentage: 0.70, type: "hypertrophy" }
        ]
    },
    {
        day: 5,
        name: "Pull",
        split: "pull",
        lifts: [
            { lift: "row", sets: 5, reps: 5, percentage: 0.80, type: "strength" },
            { lift: "squat", sets: 4, reps: 5, percentage: 0.70, type: "hypertrophy" }
        ]
    }
];

// Helper to determine if a week is a deload week
// Deloads happen every 4th week (Week 4, 8, 12, etc.)
// Weeks 1-3: Accumulate load
// Week 4: Deload
// Cycle repeats
function isDeloadWeek(week) {
    if (week < 1) return false;
    return week % 4 === 0;
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


function generateProgramData() {
    // Get initial 1RM values
    const initialOneRMs = {};
    lifts.forEach(lift => {
        initialOneRMs[lift] = trainingMaxes[lift] / 0.9;
    });

    const weeks = [];
    const numWeeks = 26;

    for (let week = 1; week <= numWeeks; week++) {
        const isDeload = isDeloadWeek(week);

        // Calculate cycle number (0-indexed)
        const cycleIndex = Math.floor((week - 1) / 4);
        // Week within cycle (1-4)
        const weekInCycle = ((week - 1) % 4) + 1;

        const weekData = {
            number: week,
            isDeload: isDeload,
            lifts1RM: {},
            days: []
        };

        // Calculate 1RMs for this week (Update every 4 weeks)
        // We use the start of the current cycle to determine the 1RM
        // So Weeks 1-4 use the same 1RM, Weeks 5-8 use 1RM + increment, etc.
        lifts.forEach(lift => {
            // Pass cycleIndex * 4 to simulate that increments happen every 4 weeks
            weekData.lifts1RM[lift] = calculate1RMForWeek(lift, initialOneRMs[lift], cycleIndex * 4);
        });

        // Generate Days
        programStructure.forEach(dayInfo => {
            const dayData = {
                day: dayInfo.day,
                name: dayInfo.name,
                split: dayInfo.split,
                mainLifts: [],
                assistance: []
            };

            // Main Lifts
            dayInfo.lifts.forEach(liftInfo => {
                let sets, reps, weight;
                const oneRM = weekData.lifts1RM[liftInfo.lift];

                if (liftInfo.type === "strength") {
                    // 5/3/1 Logic based on Training Max (90% of current 1RM)
                    const trainingMax = oneRM * 0.9;

                    if (weekInCycle === 1) {
                        // Week 1 (5s): 
                        // 1. Warmup (40% x 15)
                        // 2. 65% x 5
                        // 3. 75% x 5
                        // 4. 85% x 5
                        // 5. 65% x 1+ (AMRAP @ first main set weight)
                        dayData.mainLifts.push(
                            { name: liftInfo.lift.charAt(0).toUpperCase() + liftInfo.lift.slice(1), sets: 1, reps: 15, weight: roundDownToFive(trainingMax * 0.40) },
                            { name: liftInfo.lift.charAt(0).toUpperCase() + liftInfo.lift.slice(1), sets: 1, reps: 5, weight: roundDownToFive(trainingMax * 0.65) },
                            { name: liftInfo.lift.charAt(0).toUpperCase() + liftInfo.lift.slice(1), sets: 1, reps: 5, weight: roundDownToFive(trainingMax * 0.75) },
                            { name: liftInfo.lift.charAt(0).toUpperCase() + liftInfo.lift.slice(1), sets: 1, reps: 5, weight: roundDownToFive(trainingMax * 0.85) },
                            { name: liftInfo.lift.charAt(0).toUpperCase() + liftInfo.lift.slice(1), sets: 1, reps: "1+", weight: roundDownToFive(trainingMax * 0.65) }
                        );
                    } else if (weekInCycle === 2) {
                        // Week 2 (3s):
                        // 1. Warmup (40% x 15)
                        // 2. 70% x 3
                        // 3. 80% x 3
                        // 4. 90% x 3
                        // 5. 70% x 1+ (AMRAP @ first main set weight)
                        dayData.mainLifts.push(
                            { name: liftInfo.lift.charAt(0).toUpperCase() + liftInfo.lift.slice(1), sets: 1, reps: 15, weight: roundDownToFive(trainingMax * 0.40) },
                            { name: liftInfo.lift.charAt(0).toUpperCase() + liftInfo.lift.slice(1), sets: 1, reps: 3, weight: roundDownToFive(trainingMax * 0.70) },
                            { name: liftInfo.lift.charAt(0).toUpperCase() + liftInfo.lift.slice(1), sets: 1, reps: 3, weight: roundDownToFive(trainingMax * 0.80) },
                            { name: liftInfo.lift.charAt(0).toUpperCase() + liftInfo.lift.slice(1), sets: 1, reps: 3, weight: roundDownToFive(trainingMax * 0.90) },
                            { name: liftInfo.lift.charAt(0).toUpperCase() + liftInfo.lift.slice(1), sets: 1, reps: "1+", weight: roundDownToFive(trainingMax * 0.70) }
                        );
                    } else if (weekInCycle === 3) {
                        // Week 3 (5/3/1):
                        // 1. Warmup (40% x 15)
                        // 2. 75% x 5
                        // 3. 85% x 3
                        // 4. 95% x 1
                        // 5. 75% x 1+ (AMRAP @ first main set weight)
                        dayData.mainLifts.push(
                            { name: liftInfo.lift.charAt(0).toUpperCase() + liftInfo.lift.slice(1), sets: 1, reps: 15, weight: roundDownToFive(trainingMax * 0.40) },
                            { name: liftInfo.lift.charAt(0).toUpperCase() + liftInfo.lift.slice(1), sets: 1, reps: 5, weight: roundDownToFive(trainingMax * 0.75) },
                            { name: liftInfo.lift.charAt(0).toUpperCase() + liftInfo.lift.slice(1), sets: 1, reps: 3, weight: roundDownToFive(trainingMax * 0.85) },
                            { name: liftInfo.lift.charAt(0).toUpperCase() + liftInfo.lift.slice(1), sets: 1, reps: 1, weight: roundDownToFive(trainingMax * 0.95) },
                            { name: liftInfo.lift.charAt(0).toUpperCase() + liftInfo.lift.slice(1), sets: 1, reps: "1+", weight: roundDownToFive(trainingMax * 0.75) }
                        );
                    } else {
                        // Week 4 (Deload): 5 sets for visual consistency
                        // 1. Warmup (40% x 15)
                        dayData.mainLifts.push(
                            { name: liftInfo.lift.charAt(0).toUpperCase() + liftInfo.lift.slice(1), sets: 1, reps: 15, weight: roundDownToFive(trainingMax * 0.40) },
                            { name: liftInfo.lift.charAt(0).toUpperCase() + liftInfo.lift.slice(1), sets: 1, reps: 5, weight: roundDownToFive(trainingMax * 0.50) },
                            { name: liftInfo.lift.charAt(0).toUpperCase() + liftInfo.lift.slice(1), sets: 1, reps: 5, weight: roundDownToFive(trainingMax * 0.60) },
                            { name: liftInfo.lift.charAt(0).toUpperCase() + liftInfo.lift.slice(1), sets: 1, reps: 5, weight: roundDownToFive(trainingMax * 0.60) },
                            { name: liftInfo.lift.charAt(0).toUpperCase() + liftInfo.lift.slice(1), sets: 1, reps: 5, weight: roundDownToFive(trainingMax * 0.60) }
                        );
                    }


                } else {
                    // Hypertrophy Logic (Standard sets/reps based on Training Max)
                    const trainingMax = oneRM * 0.9;
                    weight = roundDownToFive(trainingMax * liftInfo.percentage);
                    dayData.mainLifts.push({
                        name: liftInfo.lift.charAt(0).toUpperCase() + liftInfo.lift.slice(1),
                        sets: liftInfo.sets,
                        reps: liftInfo.reps,
                        weight: weight
                    });
                }
            });

            // Assistance
            const selectedAssistance = assistanceData[dayInfo.split] || assistanceExercises[dayInfo.split];
            const randomAssistance = pickRandom(selectedAssistance, 3);
            dayData.assistance = randomAssistance;

            weekData.days.push(dayData);
        });

        weeks.push(weekData);
    }

    return { weeks, initialOneRMs };
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
        list.addEventListener('keydown', function (e) {
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

// Calculate 1RM for a given week, with progressive overload
// Every 4-week cycle adds increment to 1RM
// weekNumber passed here is effectively "weeks completed" or similar accumulator
// In our usage: calculate1RMForWeek(lift, start, (cycleIndex * 4))
function calculate1RMForWeek(lift, startingOneRM, weeksElapsed) {
    const increment = progressionConfig[lift];
    let current1RM = startingOneRM;

    // Use integer division to find how many FULL cycles have passed
    // Each cycle is 4 weeks.
    // If weeksElapsed is 0, 1, 2, 3 -> 0 cycles
    // If weeksElapsed is 4, 5, 6, 7 -> 1 cycle
    const cyclesCompleted = Math.floor(weeksElapsed / 4);

    if (cyclesCompleted > 0) {
        current1RM += (increment * cyclesCompleted);
    }

    return current1RM;
}

function generateOverview() {
    const container = document.getElementById('overview-content');
    container.innerHTML = '';

    // Get initial 1RM values
    const initialOneRMs = {};
    lifts.forEach(lift => {
        initialOneRMs[lift] = trainingMaxes[lift] / 0.9;
    });

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
    // Only show Month 6 with Total Gain merged
    const month = 6;
    const row = document.createElement('tr');
    const monthCell = document.createElement('td');
    monthCell.textContent = `Month ${month}`;
    row.appendChild(monthCell);

    const weeksElapsed = 24; // Month 6 ends at week 24

    lifts.forEach(lift => {
        const cell = document.createElement('td');
        const startVal = roundDownToFive(initialOneRMs[lift]);
        const endVal = roundDownToFive(calculate1RMForWeek(lift, initialOneRMs[lift], weeksElapsed));
        const totalDiff = endVal - startVal;

        cell.textContent = endVal + ' lb';

        if (totalDiff > 0) {
            const spanPlus = document.createElement('span');
            spanPlus.className = 'diff-add';
            spanPlus.style.fontWeight = 'bold';
            spanPlus.textContent = '+' + totalDiff + ' lb';
            cell.appendChild(spanPlus);
        } else if (totalDiff < 0) {
            const spanMinus = document.createElement('span');
            spanMinus.className = 'diff-sub';
            spanMinus.style.fontWeight = 'bold';
            spanMinus.textContent = totalDiff + ' lb';
            cell.appendChild(spanMinus);
        }

        row.appendChild(cell);
    });

    tbody.appendChild(row);

    table.appendChild(tbody);
    container.appendChild(table);
}

function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const data = generateProgramData();

    // Layout configuration
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;
    const colGap = 5;
    const rowGap = 10;

    // 2 columns, 1 row (2 weeks per page)
    const boxWidth = (pageWidth - (margin * 2) - colGap) / 2;
    const boxHeight = pageHeight - (margin * 2); // Full height available

    const positions = [
        { x: margin, y: margin }, // Left
        { x: margin + boxWidth + colGap, y: margin } // Right
    ];

    // --- Helper to render a week at specific coordinates ---
    function renderWeekAt(week, startX, startY) {
        // Week Title
        doc.setFontSize(10);
        doc.setTextColor(44, 62, 80);
        doc.text(`Week ${week.number}`, startX, startY + 4);

        // Table Data
        const tableBody = week.days.map(day => {
            // Group lifts by name
            const groupedLifts = {};
            day.mainLifts.forEach(l => {
                if (!groupedLifts[l.name]) groupedLifts[l.name] = [];
                groupedLifts[l.name].push(l);
            });

            const mainLiftsStr = Object.entries(groupedLifts).map(([name, sets]) => {
                let s = `${name}:\n`;
                sets.forEach(set => {
                    if (set.sets > 1) {
                        for (let i = 0; i < set.sets; i++) {
                            s += `${set.reps}x ${set.weight} lbs\n`;
                        }
                    } else {
                        s += `${set.reps}x ${set.weight} lbs\n`;
                    }
                });
                return s.trim();
            }).join("\n\n");

            const assistance = day.assistance.map(e => `3x 8-12: ${e}`).join("\n\n");

            return [
                `Day ${day.day}\n${day.name}`,
                mainLiftsStr,
                assistance,
                day.split // Hidden field for coloring
            ];
        });

        doc.autoTable({
            startY: startY + 8,
            head: [['Day', 'Lifts', 'Assistance']],
            body: tableBody,
            theme: 'grid',
            headStyles: {
                fillColor: [44, 62, 80],
                fontSize: 7,
                cellPadding: 1,
                minCellHeight: 0
            },
            styles: {
                fontSize: 6.5,
                cellPadding: 1.5,
                overflow: 'linebreak',
                valign: 'top',
                lineColor: [200, 200, 200]
            },
            columnStyles: {
                0: { cellWidth: 10, valign: 'middle' },
                1: { cellWidth: 35 },
                2: { cellWidth: 'auto', valign: 'middle' }
            },
            margin: { left: startX },
            tableWidth: boxWidth,
            showHead: 'firstPage',
            didParseCell: function (data) {
                if (data.section === 'body') {
                    const split = data.row.raw[3];
                    if (split === 'push') data.cell.styles.fillColor = [245, 249, 255]; // Subtle Blue
                    if (split === 'pull') data.cell.styles.fillColor = [245, 255, 245]; // Subtle Green
                    if (split === 'legs') data.cell.styles.fillColor = [255, 252, 245]; // Subtle Orange
                }
            }
        });
    }

    // --- 1. Loop through weeks (2 per page) ---
    for (let i = 0; i < data.weeks.length; i += 2) {
        if (i > 0) doc.addPage();

        for (let j = 0; j < 2; j++) {
            if (i + j < data.weeks.length) {
                const pos = positions[j];
                renderWeekAt(data.weeks[i + j], pos.x, pos.y);
            }
        }
    }

    doc.save("531_Program_Compact_26Weeks.pdf");
}

// Old console log function removed in favor of PDF download
