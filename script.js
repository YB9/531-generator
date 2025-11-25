let currentStep = 1;
const lifts = ["squat", "deadlift", "bench", "ohp", "row"];
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
    // Generate 1RM Table with initial values and 6 empty monthly rows
    const tbody = document.querySelector('#tm-table tbody');
    tbody.innerHTML = '';
    const today = new Date();

    // First row: Initial date with actual 1RM values
    const initialRow = document.createElement('tr');
    const initialDateCell = document.createElement('td');
    // Format date as 'day month' e.g., '11 Nov'
    const options = { day: 'numeric', month: 'short' };
    initialDateCell.textContent = today.toLocaleDateString('en-GB', options);
    initialRow.appendChild(initialDateCell);

    lifts.forEach(lift => {
        const cell = document.createElement('td');
        // Calculate actual 1RM (trainingMaxes is 90% of 1RM, so divide by 0.9)
        const oneRM = trainingMaxes[lift] / 0.9;
        cell.textContent = oneRM.toFixed(1) + " lb";
        initialRow.appendChild(cell);
    });
    tbody.appendChild(initialRow);

    // Add 6 empty rows for monthly tracking
    for (let i = 1; i <= 6; i++) {
        const emptyRow = document.createElement('tr');

        // Date cell with month offset
        const dateCell = document.createElement('td');
        const futureDate = new Date(today);
        futureDate.setMonth(today.getMonth() + i);
        // Format future date as 'day month' e.g., '11 Nov'
        dateCell.textContent = futureDate.toLocaleDateString('en-GB', options);
        emptyRow.appendChild(dateCell);

        // Empty cells for each lift
        lifts.forEach(() => {
            const cell = document.createElement('td');
            cell.textContent = '';
            emptyRow.appendChild(cell);
        });

        tbody.appendChild(emptyRow);
    }

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

    // Log 1RM values and assistance selections to console
    const oneRMs = {};
    lifts.forEach(lift => {
        const oneRM = trainingMaxes[lift] / 0.9; // calculate actual 1RM
        // Store numeric value rounded to one decimal place
        oneRMs[lift] = parseFloat(oneRM.toFixed(1));
    });
    console.log("1RM values:", oneRMs);
    console.log("Assistance selections per split:", assistanceData);

    // Instead of downloading, output the program content to the console

    // Clean up any created object URLs (none needed now)
    // No file download performed
}
