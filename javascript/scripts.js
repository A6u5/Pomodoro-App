/*__________________________________________________________________________________
 Variables & Constants:
_____________________________________________________________________________________*/

let pomodoroTitle = document.getElementsByClassName("pomodoro")[0];
let shortBreakTitle = document.getElementsByClassName("shortBreak")[0];
let longBreakTitle = document.getElementsByClassName("longBreak")[0];

let configurationButton = document.getElementsByClassName("settings")[0];
let settingsScreen = document.getElementsByClassName("settingsScreen")[0];
let closeButton = document.getElementsByClassName("closeButton")[0];

let pomodoro = Number(document.getElementById("pomodoroNumber").value);
let shortBreak = Number(document.getElementById("shortBreakNumber").value);
let longBreak = Number(document.getElementById("longBreakNumber").value); 

let time = document.getElementsByClassName("time")[0];
let pause = document.getElementsByClassName("pause")[0];

let applyButton = document.getElementsByClassName("applyButton")[0];

let firstColourButton = document.getElementsByClassName("firstColor")[0];
let secondColourButton = document.getElementsByClassName("secondColor")[0];
let thirdColourButton = document.getElementsByClassName("thirdColor")[0];

let firstFont = document.getElementsByClassName("firstFont")[0];
let secondFont = document.getElementsByClassName("secondFont")[0];
let thirdFont = document.getElementsByClassName("thirdFont")[0];

let fontFamily = getComputedStyle(firstFont).fontFamily;
let colour = getComputedStyle(firstColourButton).backgroundColor;

let applyButtonTop = getComputedStyle(applyButton).top;
let timeFontSize = getComputedStyle(time).fontSize;

let overlay = document.getElementsByClassName("overlay")[0];

let currentSeconds = timeStringToSeconds(time.textContent);
let interval = null;
let counter = 1;
let totalTime;
let isRunning = false;

const alarmSound = new Audio("./assets/audio/alarm.wav");

const progressCircle = document.querySelector(".progressRingCircle");
if (window.innerWidth <= 600) {
    progressCircle.setAttribute("r", "80");
    document.getElementsByClassName("timeTitle")[0].textContent = "TIME\n(MINUTES)";
}
const radius = progressCircle.r.baseVal.value;
const circumference = 2 * Math.PI * radius;

progressCircle.style.strokeDasharray = `${circumference}`;
progressCircle.style.strokeDashoffset = `${circumference}`;
setProgress(100);

const inputs = document.querySelectorAll('input[type="number"]');




/*__________________________________________________________________________________
 Functions:
_____________________________________________________________________________________*/

function setProgress(percent) {
    const offset = circumference - (percent / 100) * circumference;
    progressCircle.style.strokeDashoffset = offset;
}

function timeStringToSeconds(str) {
    let [min, sec] = str.split(":").map(Number);
    return min * 60 + sec;
}

function secondsToTimeString(seconds) {
    let min = Math.floor(seconds / 60);
    let sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
}

function changeTitleColor() {
    if (counter <= 7) {
        if (counter % 2 !== 0) { 
            pomodoroTitle.style.color = "#151932";
            pomodoroTitle.style.backgroundColor = colour;
            shortBreakTitle.style.color = "#60647d";
            shortBreakTitle.style.backgroundColor = "#151932";
            longBreakTitle.style.color = "#60647d";
            longBreakTitle.style.backgroundColor = "#151932";
        }
        else {
            pomodoroTitle.style.color = "#60647d";
            pomodoroTitle.style.backgroundColor = "#151932";
            shortBreakTitle.style.color = "#151932";
            shortBreakTitle.style.backgroundColor = colour;
            longBreakTitle.style.color = "#60647d";
            longBreakTitle.style.backgroundColor = "#151932";
            }   
    }
    else {
        pomodoroTitle.style.color = "#60647d";
        pomodoroTitle.style.backgroundColor = "#151932";
        shortBreakTitle.style.color = "#60647d";
        shortBreakTitle.style.backgroundColor = "#151932";
        longBreakTitle.style.color = "#151932";
        longBreakTitle.style.backgroundColor = colour;
    }
}
/*__________________________________________________________________________________
 Event Listeners:
_____________________________________________________________________________________*/

pause.addEventListener("click", () => {
    if (pause.textContent === "PAUSE") {
        clearInterval(interval);
        pause.textContent = "START";
        isRunning = false;
    }
    else {
        pause.textContent = "PAUSE";

        if (!isRunning) {
            totalTime = currentSeconds;
            setProgress(100);
            isRunning = true;
        }
        interval = setInterval(() => {
            if (currentSeconds > 0) {
                currentSeconds--;
                time.textContent = secondsToTimeString(currentSeconds);
                
                const percent = (currentSeconds / totalTime) * 100;
                setProgress(percent);
            } else if (counter <= 7) {
                clearInterval(interval);
                pause.textContent = "START";
                counter++;
                setProgress(100);
                isRunning = false;

                if (counter % 2 === 0) {
                    changeTitleColor();
                    
                    currentSeconds = shortBreak * 60;
                    time.textContent = secondsToTimeString(currentSeconds);
                } else {
                    changeTitleColor();
                    
                    currentSeconds = pomodoro * 60;
                    time.textContent = secondsToTimeString(currentSeconds);
                }
                alarmSound.play();
            } else {
                clearInterval(interval);
                pause.textContent = "START";
                counter = 1;
                setProgress(100);
                isRunning = false;

                changeTitleColor();
                currentSeconds = longBreak * 60;
                time.textContent = secondsToTimeString(currentSeconds);
                alarmSound.play();
            }
        }, 1000);
    }
})

configurationButton.addEventListener("click", () => {
    clearInterval(interval);
    pause.textContent = "START";
    settingsScreen.style.animation = "openSettingsScreenAnimation .2s ease-in"
    settingsScreen.style.display = "block";
    overlay.style.display = "block";
})

closeButton.addEventListener("click", () => {
    settingsScreen.style.animation = "closeSettingsScreenAnimation .2s ease-in"
    
    const handleAnimationEnd = () => {
        settingsScreen.style.display = "none";
        overlay.style.display = "none";
        settingsScreen.removeEventListener("animationend", handleAnimationEnd);
    };

    settingsScreen.addEventListener("animationend", handleAnimationEnd);
})

inputs.forEach(input => {
    input.addEventListener('input', () => {
        let val = parseInt(input.value, 10);
        
        if (val > 99) input.value = 99;
        else if (val < 1 && input.value !== '') input.value = 1;
    });
});

firstColourButton.addEventListener("click", () => {
    colour = getComputedStyle(firstColourButton).backgroundColor;
    firstColourButton.textContent = "✔";
    secondColourButton.textContent = "";
    thirdColourButton.textContent = "";
})

secondColourButton.addEventListener("click", () => {
    colour = getComputedStyle(secondColourButton).backgroundColor;
    firstColourButton.textContent = "";
    secondColourButton.textContent = "✔";
    thirdColourButton.textContent = "";
})

thirdColourButton.addEventListener("click", () => {
    colour = getComputedStyle(thirdColourButton).backgroundColor;
    firstColourButton.textContent = "";
    secondColourButton.textContent = "";
    thirdColourButton.textContent = "✔";
})

firstFont.addEventListener("click", () => {
    fontFamily = getComputedStyle(firstFont).fontFamily;
    firstFont.style.backgroundColor = "#151932";
    firstFont.style.color = "white";

    secondFont.style.backgroundColor = "#eef1fa";
    secondFont.style.color = "#151932";

    thirdFont.style.backgroundColor = "#eef1fa";
    thirdFont.style.color = "#151932";
    applyButtonTop = window.innerWidth < 600 ? "-1rem" : "-2rem";
    timeFontSize = window.innerWidth < 600 ? "3rem" : "6rem";
})

secondFont.addEventListener("click", () => {
    fontFamily = getComputedStyle(secondFont).fontFamily;
    firstFont.style.backgroundColor = "#eef1fa";
    firstFont.style.color = "#151932";

    secondFont.style.backgroundColor = "#151932";
    secondFont.style.color = "white";

    thirdFont.style.backgroundColor = "#eef1fa";
    thirdFont.style.color = "#151932";

    applyButtonTop =  window.innerWidth < 600 ? "-1rem" : "-2rem";
    timeFontSize = window.innerWidth < 600 ? "3rem" : "6rem";
})

thirdFont.addEventListener("click", () => {
    fontFamily = getComputedStyle(thirdFont).fontFamily;
    firstFont.style.backgroundColor = "#eef1fa";
    firstFont.style.color = "#151932";

    secondFont.style.backgroundColor = "#eef1fa";
    secondFont.style.color = "#151932";

    thirdFont.style.backgroundColor = "#151932";
    thirdFont.style.color = "white";

    if (window.innerWidth > 600 && window.innerWidth <= 1527) applyButtonTop = "-2rem";
    else if (window.innerWidth <= 600) applyButtonTop = "-1rem";
    else applyButtonTop = "-2rem";
    timeFontSize = window.innerWidth < 600 ? "2.7rem" : "5rem";
})


applyButton.addEventListener("click", () => {
    let body = document.getElementsByTagName("body")[0];
    
    pomodoro = Number(document.getElementById("pomodoroNumber").value);
    shortBreak = Number(document.getElementById("shortBreakNumber").value);
    longBreak = Number(document.getElementById("longBreakNumber").value); 
    
    body.style.fontFamily = fontFamily;
    time.style.fontSize = timeFontSize;
    
    applyButton.style.backgroundColor = colour;
    applyButton.style.top = applyButtonTop;

    if (counter <= 7) {
        if (counter % 2 !== 0) currentSeconds = pomodoro * 60;
        else currentSeconds = shortBreak * 60;
    } else {
        currentSeconds = longBreak * 60;
    } 

    time.textContent = secondsToTimeString(currentSeconds);
    pause.textContent = "START";
    setProgress(100);
    changeTitleColor();

    document.getElementsByClassName("progressRingCircle")[0].style.stroke = colour;
})
