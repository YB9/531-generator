let currentStep = 1;
const lifts = ["squat", "deadlift", "bench", "ohp", "rows"];
let trainingMaxes = {};
let assistanceData = {};

function calculate1RM(weight, reps) {
    if (!weight || !reps || weight <= 0 || reps <= 0) return null;
    return weight * (1 + reps / 30);
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

// Initialize exercise selection listeners
document.addEventListener('DOMContentLoaded', function () {
    const exerciseLists = document.querySelectorAll('.exercise-list');
    exerciseLists.forEach(list => {
        list.addEventListener('click', toggleExercise);
    });
});


function generateOverview() {
    // Generate TM Table
    const tbody = document.querySelector('#tm-table tbody');
    tbody.innerHTML = '';
    const today = new Date().toLocaleDateString();
    const row = document.createElement('tr');

    const dateCell = document.createElement('td');
    dateCell.textContent = today;
    row.appendChild(dateCell);

    lifts.forEach(lift => {
        const cell = document.createElement('td');
        cell.textContent = trainingMaxes[lift].toFixed(1) + " lb";
        row.appendChild(cell);
    });
    tbody.appendChild(row);

    // Generate Assistance Summary
    const summaryDiv = document.getElementById('assistance-summary');
    summaryDiv.innerHTML = '';

    const splits = [
        { name: "Push", key: "push" },
        { name: "Pull", key: "pull" },
        { name: "Legs", key: "legs" }
    ];

    splits.forEach(split => {
        const card = document.createElement('div');
        card.className = 'summary-card';

        const exercises = assistanceData[split.key] || [];
        const exerciseList = exercises.length > 0
            ? exercises.map(ex => `<li>${ex}</li>`).join('')
            : '<li>No exercises selected</li>';

        card.innerHTML = `
            <strong>${split.name}</strong>
            <ul style="margin: 0.5rem 0; padding-left: 1.5rem;">
                ${exerciseList}
            </ul>
        `;
        summaryDiv.appendChild(card);
    });
}

function downloadProgram() {
    let content = "5/3/1 Program Generator\n\n";
    content += `Date: ${new Date().toLocaleDateString()}\n\n`;

    content += "Training Maxes (90% of 1RM):\n";
    lifts.forEach(lift => {
        content += `${lift.charAt(0).toUpperCase() + lift.slice(1)}: ${trainingMaxes[lift].toFixed(1)} lb\n`;
    });

    content += "\nAssistance Work:\n";
    const splits = ["push", "pull", "legs"];

    splits.forEach(split => {
        const exercises = assistanceData[split] || [];
        content += `\n${split.charAt(0).toUpperCase() + split.slice(1)}:\n`;
        if (exercises.length > 0) {
            exercises.forEach(ex => {
                content += `  - ${ex}\n`;
            });
        } else {
            content += `  - No exercises selected\n`;
        }
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '531-program.txt';
    a.click();
    window.URL.revokeObjectURL(url);
}
