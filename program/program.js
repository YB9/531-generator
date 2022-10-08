// Training Max
var Bench = localStorage["Bench"];
var Squat = localStorage["Squat"];
var Deadlift = localStorage["Deadlift"];
var OverheadPress = localStorage["OverheadPress"];
var BarbellRow = localStorage["BarbellRow"];

//Lifts
var BenchWarmup = Bench * 0.25;
var Bench555 = [Bench * 0.65, Bench * 0.75, Bench * 0.85];
var Bench333 = [Bench * 0.7, Bench * 0.8, Bench * 0.9];
var Bench531 = [Bench * 0.75, Bench * 0.85, Bench * 0.95];

var cycleBench = 1;
var counterBench = 0;

var SquatWarmup = Squat * 0.25;
var Squat555 = [Squat * 0.65, Squat * 0.75, Squat * 0.85];
var Squat333 = [Squat * 0.7, Squat * 0.8, Squat * 0.9];
var Squat531 = [Squat * 0.75, Squat * 0.85, Squat * 0.95];

var cycleSquat = 1;
var counterSquat = 0;

var DeadliftWarmup = Deadlift * 0.25;
var Deadlift555 = [Deadlift * 0.65, Deadlift * 0.75, Deadlift * 0.85];
var Deadlift333 = [Deadlift * 0.7, Deadlift * 0.8, Deadlift * 0.9];
var Deadlift531 = [Deadlift * 0.75, Deadlift * 0.85, Deadlift * 0.95];

var cycleDeadlift = 1;
var counterDeadlift = 0;

var OverheadPressWarmup = OverheadPress * 0.25;
var OverheadPress555 = [OverheadPress * 0.65, OverheadPress * 0.75, OverheadPress * 0.85];
var OverheadPress333 = [OverheadPress * 0.7, OverheadPress * 0.8, OverheadPress * 0.9];
var OverheadPress531 = [OverheadPress * 0.75, OverheadPress * 0.85, OverheadPress * 0.95];

var cycleOHP = 1;
var counterOverheadPress = 0;

var BarbellRowWarmup = BarbellRow * 0.25;
var BarbellRow555 = [BarbellRow * 0.65, BarbellRow * 0.75, BarbellRow * 0.85];
var BarbellRow333 = [BarbellRow * 0.7, BarbellRow * 0.8, BarbellRow * 0.9];
var BarbellRow531 = [BarbellRow * 0.75, BarbellRow * 0.85, BarbellRow * 0.95];

var cycleBBRow = 1;
var counterBarbellRow = 0;

// Assistance options
var push = ["Dips", "Arnold Press", "Pushdown", "Pushups", "Lateral Raises", "Triceps Extension", "Incline DB Press",
	    "Cable Raise", "Close-grip BB Press"];
var pull = ["Pullups", "Chinups", "Hammer curls", "Lat Pulldowns", "BB Curls", "Inverted Row", 
	    "Preacher Curl", "Seated Cable Row", "Cable Curls", "DB Bench Row", "Reverse Curls"];	
var leg = ["Laying Leg Curl", "Lunges", "DB Squats", "Machine Calf Raise", "Leg Push"];

var pushCounter = 0;
var pullCounter = 0;
var legCounter = 0;

function fillData() {

    //fill warmup
    // var warmupArr = document.getElementsByClassName("warmup");
    // for(var i = 0; i < warmupArr.length; i++){
    //     document.getElementsByClassName("warmup")[i].innerHTML = "HI Treadmill <br> Box jumps";
    // }    

    //fill Lifts
    var benchArr = document.getElementsByClassName("bench");
    var squatArr = document.getElementsByClassName("squat");
    var deadliftArr = document.getElementsByClassName("deadlift"); 
    var ohpArr = document.getElementsByClassName("ohp");
    var bbrowArr = document.getElementsByClassName("bbrow"); 

    for(var i = 0; i < benchArr.length; i++){
        document.getElementsByClassName("bench")[i].innerHTML = "Bench : <br>" + fillLifts("bench");
    }
    for(var i = 0; i < squatArr.length; i++){
        document.getElementsByClassName("squat")[i].innerHTML = "Squat : <br>" + fillLifts("squat");
    }
    for(var i = 0; i < deadliftArr.length; i++){
        document.getElementsByClassName("deadlift")[i].innerHTML = "Deadlift : <br>" + fillLifts("deadlift");
    }
    for(var i = 0; i < ohpArr.length; i++){
        document.getElementsByClassName("ohp")[i].innerHTML = "OHP : <br>" + fillLifts("overheadPress");
    }
    for(var i = 0; i < bbrowArr.length; i++){
        document.getElementsByClassName("bbrow")[i].innerHTML = "BB Row : <br>" + fillLifts("barbellRow");
    }


    //fill assistance
    var assistanceArr = document.getElementsByClassName("assistance");
	
    for(var i = 0; i < assistanceArr.length; i+=5){
	    
        //PUSH 1	
		document.getElementsByClassName("assistance")[i].innerHTML = "PUSH<br> 3x8-12 - " + generateRandomAssist("push") + "<br> 3x8-12 - " +
        generateRandomAssist("push") + "<br> 3x8-12 - " + generateRandomAssist("push");
		
		//PULL1
        document.getElementsByClassName("assistance")[i+1].innerHTML = "PULL<br> 3x8-12 - " + generateRandomAssist("pull") + "<br> 3x8-12 - " +
        generateRandomAssist("pull") + "<br> 3x8-12 - " + generateRandomAssist("pull");
		
		//LEGS
        document.getElementsByClassName("assistance")[i+2].innerHTML = "LEGS<br> 3x8-12 - " + generateRandomAssist("leg") + "<br> 3x8-12 - " +
        generateRandomAssist("leg") + "<br> 3x8-12 - " + generateRandomAssist("leg");
	    
		//PUSH2
	    document.getElementsByClassName("assistance")[i+3].innerHTML = "PUSH<br> 3x8-12 - " + generateRandomAssist("push") + "<br> 3x8-12 - " +
        generateRandomAssist("push") + "<br> 3x8-12 - " + generateRandomAssist("push");
		
		//PULL2
        document.getElementsByClassName("assistance")[i+4].innerHTML = "PULL<br> 3x8-12 - " + generateRandomAssist("pull") + "<br> 3x8-12 - " +
        generateRandomAssist("pull") + "<br> 3x8-12 - " + generateRandomAssist("pull");
		
    }

}

function fillLifts(lift){

    var result = "";

    if(lift === "bench"){
        //warmup
        result += "1x15   - ";
        result += round5(BenchWarmup).toString() + " lb";
        result += "<br>";

        //555
        if(counterBench === 0){
            result += "1x5   - ";
            result += round5(Bench555[0]).toString() + " lb";
            result += "<br>";
            result += "1x5  -  ";
            result +=  round5(Bench555[1]).toString() + " lb";
            result += "<br>";
            result += "1x5+ - ";
            result +=  round5(Bench555[2]).toString() + " lb";
            result += "<br>";
            result += "1x5+   - ";
            result +=  round5(Bench555[0]).toString() + " lb";
            counterBench++;
        }        
        //333
        else if(counterBench === 1){
            result += "1x3   - ";
            result +=  round5(Bench333[0]).toString() + " lb";
            result += "<br>";
            result += "1x3   - ";
            result +=  round5(Bench333[1]).toString() + " lb";
            result += "<br>";
            result += "1x3+ - ";
            result +=  round5(Bench333[2]).toString() + " lb";
            result += "<br>";
            result += "1x5+   - ";
            result +=  round5(Bench333[0]).toString() + " lb";
            counterBench++
        }      
        //531  
        else if(counterBench === 2){
            result += "1x5   - ";
            result +=  round5(Bench531[0]).toString() + " lb";
            result += "<br>";
            result += "1x3   - ";
            result +=  round5(Bench531[1]).toString() + " lb";
            result += "<br>";
            result += "1x1+ - ";
            result +=  round5(Bench531[2]).toString() + " lb";
            result += "<br>";
            result += "1x5+   - ";
            result +=  round5(Bench531[0]).toString() + " lb";            
            nextCycle(lift);
        } 
    }
    if(lift === "squat"){
        //warmup
        result += "1x15   - ";
        result += round5(SquatWarmup).toString() + " lb";
        result += "<br>";

        //555
        if(counterSquat === 0){
            result += "1x5   - ";
            result +=  round5(Squat555[0]).toString() + " lb";
            result += "<br>";
            result += "1x5   - ";
            result +=  round5(Squat555[1]).toString() + " lb";
            result += "<br>";
            result += "1x5+ - ";
            result +=  round5(Squat555[2]).toString() + " lb";
            result += "<br>";
            result += "1x5+   - ";
            result +=  round5(Squat555[0]).toString() + " lb";
            counterSquat++;
        }        
        //333
        else if(counterSquat === 1){
            result += "1x3   - ";
            result +=  round5(Squat333[0]).toString() + " lb";
            result += "<br>";
            result += "1x3   - ";
            result +=  round5(Squat333[1]).toString() + " lb";
            result += "<br>";
            result += "1x3+ - ";
            result +=  round5(Squat333[2]).toString() + " lb";
            result += "<br>";
            result += "1x5+   - ";
            result +=  round5(Squat333[0]).toString() + " lb";
            counterSquat++
        }      
        //531  
        else if(counterSquat === 2){
            result += "1x5   - ";
            result +=  round5(Squat531[0]).toString() + " lb";
            result += "<br>";
            result += "1x3   - ";
            result +=  round5(Squat531[1]).toString() + " lb";
            result += "<br>";
            result += "1x1+ - ";
            result += round5(Squat531[2]).toString() + " lb";
            result += "<br>";
            result += "1x5+   - ";
            result += round5(Squat531[0]).toString() + " lb";            
            nextCycle(lift);
        }
    }
    if(lift === "deadlift"){
        //warmup
        result += "1x15   - ";
        result += round5(DeadliftWarmup).toString() + " lb";
        result += "<br>"

        //555
        if(counterDeadlift === 0){
            result += "1x5   - ";
            result += round5(Deadlift555[0]).toString() + " lb";
            result += "<br>";
            result += "1x5   - ";
            result += round5(Deadlift555[1]).toString() + " lb";
            result += "<br>";
            result += "1x5+ - ";
            result += round5(Deadlift555[2]).toString() + " lb";
            result += "<br>";
            result += "1x5+   - ";
            result += round5(Deadlift555[0]).toString() + " lb";
            counterDeadlift++;
        }        
        //333
        else if(counterDeadlift === 1){
            result += "1x3   - ";
            result += round5(Deadlift333[0]).toString() + " lb";
            result += "<br>";
            result += "1x3   - ";
            result += round5(Deadlift333[1]).toString() + " lb";
            result += "<br>";
            result += "1x3+ - ";
            result += round5(Deadlift333[2]).toString() + " lb";
            result += "<br>";
            result += "1x5+   - ";
            result += round5(Deadlift333[0]).toString() + " lb";
            counterDeadlift++
        }      
        //531  
        else if(counterDeadlift === 2){
            result += "1x5   - ";
            result += round5(Deadlift531[0]).toString() + " lb";
            result += "<br>";
            result += "1x3   - ";
            result += round5(Deadlift531[1]).toString() + " lb";
            result += "<br>";
            result += "1x1+ - ";
            result += round5(Deadlift531[2]).toString() + " lb";
            result += "<br>";
            result += "1x5+   - ";
            result += round5(Deadlift531[0]).toString() + " lb";            
            nextCycle(lift);
        }
    }
    if(lift === "overheadPress"){
        //warmup
        result += "1x15   - ";
        result += round5(OverheadPressWarmup).toString() + " lb";
        result += "<br>";

        //555
        if(counterOverheadPress === 0){
            result += "1x5   - ";
            result += round5(OverheadPress555[0]).toString() + " lb";
            result += "<br>";
            result += "1x5   - ";
            result += round5(OverheadPress555[1]).toString() + " lb";
            result += "<br>";
            result += "1x5+ - ";
            result += round5(OverheadPress555[2]).toString() + " lb";
            result += "<br>";
            result += "1x5+   - ";
            result += round5(OverheadPress555[0]).toString() + " lb";
            counterOverheadPress++;
        }        
        //333
        else if(counterOverheadPress === 1){
            result += "1x3   - ";
            result += round5(OverheadPress333[0]).toString() + " lb";
            result += "<br>";
            result += "1x3   - ";
            result += round5(OverheadPress333[1]).toString() + " lb";
            result += "<br>";
            result += "1x3+ - ";
            result += round5(OverheadPress333[2]).toString() + " lb";
            result += "<br>";
            result += "1x5+   - ";
            result += round5(OverheadPress333[0]).toString() + " lb";
            counterOverheadPress++
        }      
        //531  
        else if(counterOverheadPress === 2){
            result += "1x5   - ";
            result += round5(OverheadPress531[0]).toString() + " lb";
            result += "<br>";
            result += "1x3   - ";
            result += round5(OverheadPress531[1]).toString() + " lb";
            result += "<br>";
            result += "1x1+ - ";
            result += round5(OverheadPress531[2]).toString() + " lb";
            result += "<br>";
            result += "1x5+   - ";
            result += round5(OverheadPress531[0]).toString() + " lb";            
            nextCycle(lift);
        }
    }
    if(lift === "barbellRow"){
        //warmup
        result += "1x15   - ";
        result += round5(BarbellRowWarmup).toString() + " lb";
        result += "<br>";

        //555
        if(counterBarbellRow === 0){
            result += "1x5   - ";
            result += round5(BarbellRow555[0]).toString() + " lb";
            result += "<br>";
            result += "1x5   - ";
            result += round5(BarbellRow555[1]).toString() + " lb";
            result += "<br>";
            result += "1x5+ - ";
            result += round5(BarbellRow555[2]).toString() + " lb";
            result += "<br>";
            result += "1x5+   - ";
            result += round5(BarbellRow555[0]).toString() + " lb";
            counterBarbellRow++;
        }        
        //333
        else if(counterBarbellRow === 1){
            result += "1x3   - ";
            result += round5(BarbellRow333[0]).toString() + " lb";
            result += "<br>";
            result += "1x3   - ";
            result += round5(BarbellRow333[1]).toString() + " lb";
            result += "<br>";
            result += "1x3+ - ";
            result += round5(BarbellRow333[2]).toString() + " lb";
            result += "<br>";
            result += "1x5+   - ";
            result += round5(BarbellRow333[0]).toString() + " lb";
            counterBarbellRow++
        }      
        //531  
        else if(counterBarbellRow === 2){
            result += "1x5   - ";
            result += round5(BarbellRow531[0]).toString() + " lb";
            result += "<br>";
            result += "1x3   - ";
            result += round5(BarbellRow531[1]).toString() + " lb";
            result += "<br>";
            result += "1x1+ - ";
            result += round5(BarbellRow531[2]).toString() + " lb";
            result += "<br>";
            result += "1x5+   - ";
            result += round5(BarbellRow531[0]).toString() + " lb";            
            nextCycle(lift);
        }
    }
    return result;


}

function round5(x){
    return Math.round(x/5)*5;
}

//Note: 1 cycle = 1.5 week
function nextCycle(lift){

    if(lift === "bench"){
        if(cycleBench === 5){
            Bench  = parseInt(Bench) - 5;
            cycleBench = 0;
        }
        else{
            Bench = parseInt(Bench) + 10;
        }        
        BenchWarmup = Bench * 0.25;
        Bench555 = [Bench * 0.65, Bench * 0.75, Bench * 0.85];
        Bench333 = [Bench * 0.7, Bench * 0.8, Bench * 0.9];
        Bench531 = [Bench * 0.75, Bench * 0.85, Bench * 0.95];
    
        counterBench = 0;
        cycleBench++;
    }
    else if(lift === "squat"){
        if(cycleSquat === 5){
            Squat  = parseInt(Squat) - 10;
            cycleSquat = 0;
        }
        else{
            Squat = parseInt(Squat) + 15;
        }
    
        SquatWarmup = Squat * 0.25;
        Squat555 = [Squat * 0.65, Squat * 0.75, Squat * 0.85];
        Squat333 = [Squat * 0.7, Squat * 0.8, Squat * 0.9];
        Squat531 = [Squat * 0.75, Squat * 0.85, Squat * 0.95];
    
        counterSquat = 0;
        cycleSquat++;
    }
    else if(lift === "deadlift"){
        if(cycleDeadlift === 5){
            Deadlift  = parseInt(Deadlift) - 7.5;
            cycleDeadlift = 0;
        }
        else{
            Deadlift = parseInt(Deadlift) + 15;
        }
    
        DeadliftWarmup = Deadlift * 0.25;
        Deadlift555 = [Deadlift * 0.65, Deadlift * 0.75, Deadlift * 0.85];
        Deadlift333 = [Deadlift * 0.7, Deadlift * 0.8, Deadlift * 0.9];
        Deadlift531 = [Deadlift * 0.75, Deadlift * 0.85, Deadlift * 0.95];
    
        counterDeadlift = 0;
        cycleDeadlift++;
    }
    else if(lift === "overheadPress"){
        if(cycleOHP === 5){
            OverheadPress  = parseInt(OverheadPress) - 5;
            cycleOHP = 0;
        }
        else{
            OverheadPress = parseInt(OverheadPress) + 7.5;
        }
    
        OverheadPressWarmup = OverheadPress * 0.25;
        OverheadPress555 = [OverheadPress * 0.65, OverheadPress * 0.75, OverheadPress * 0.85];
        OverheadPress333 = [OverheadPress * 0.7, OverheadPress * 0.8, OverheadPress * 0.9];
        OverheadPress531 = [OverheadPress * 0.75, OverheadPress * 0.85, OverheadPress * 0.95];
    
        counterOverheadPress = 0;
        cycleOHP++;

    }
    else if(lift === "barbellRow"){
        if(cycleBBRow === 5){
            BarbellRow  = parseInt(BarbellRow) - 5;
            cycleBBRow = 0;
        }
        else{
            BarbellRow = parseInt(BarbellRow) + 10;
        }
    
        BarbellRowWarmup = BarbellRow * 0.25;
        BarbellRow555 = [BarbellRow * 0.65, BarbellRow * 0.75, BarbellRow * 0.85];
        BarbellRow333 = [BarbellRow * 0.7, BarbellRow * 0.8, BarbellRow * 0.9];
        BarbellRow531 = [BarbellRow * 0.75, BarbellRow * 0.85, BarbellRow * 0.95];
    
        counterBarbellRow = 0;
        cycleBBRow++;
    }
}

function generateRandomAssist(type) {

    var exercice = "";

    if(type === "push"){
	if(pushCounter === push.length){
    		shuffleArray(push);		
		pushCounter = 0;
	}       
        exercice = push[pushCounter];
        pushCounter++;
    }
    else if(type === "pull"){
		
	if(pullCounter === pull.length){
		shuffleArray(pull);
		pullCounter = 0;
	}  
        exercice = pull[pullCounter];
        pullCounter++;
    }
    else if(type ="leg"){
		
	if(legCounter === leg.length){
		shuffleArray(leg);
        	legCounter = 0;
    	}	
        exercice = leg[legCounter];
        legCounter++;
    }
    return exercice;
}

function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}
