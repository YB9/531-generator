var Bench;
var Squat;
var DeadLift;
var OverheadPress;
var BarbellRow;

function showProgram() {

    //get the lifts
    Bench = document.getElementById('bench').value * 0.90;
    Squat = document.getElementById('squat').value * 0.90;
    DeadLift = document.getElementById('deadlift').value * 0.90;
    OverheadPress = document.getElementById('overheadpress').value * 0.90;
    BarbellRow = document.getElementById('barbellrow').value * 0.90;

    localStorage["Bench"] = Bench;
    localStorage["Squat"] = Squat;
    localStorage["Deadlift"] = DeadLift;
    localStorage["OverheadPress"] = OverheadPress;
    localStorage["BarbellRow"] = BarbellRow;
}
