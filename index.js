// document.querySelector("#HelloWorld").onclick = (e) => { alert("Hello World")};

//Legacy:
const audioCtx = new AudioContext();

let oscillators = [];

let oscillatorCount = 7;
for (let i = 0; i < oscillatorCount; i++) {
    let oscillatorNode = audioCtx.createOscillator();
    let gainNode = audioCtx.createGain();
    oscillatorNode.type = "sawtooth";
    oscillatorNode.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillators.push({oscillatorNode, gainNode});
}
//console.log("OSCILLATORS: ");
//console.log(oscillators);

// document.querySelector("#soundBtn").addEventListener('click', (e) => {
//     try{
//         oscillatorNode.start();}
//         catch{

//         }
//     setEnvelope(0.5, 0.7);
// });

// document.querySelector("#stopBtn").addEventListener('click', (e) => {
//     oscillatorNode.stop();
// });

// function setEnvelope(attackTime = 0.01, releaseTime = 0.01) {
//     //ATTACK:
//     for (let i = 0; i <= attackTime; i += 0.01) {
//         gainNode.gain.setValueAtTime(i / attackTime, audioCtx.currentTime + i); //make volume rise over time
//     }

//     //RELEASE:
//     for (let i = releaseTime; i>0; i -= 0.01) {
//         gainNode.gain.setValueAtTime( (i/releaseTime), audioCtx.currentTime + attackTime + (releaseTime-i));
//     }
//     //Set to zero at end:
//     gainNode.gain.setValueAtTime(0, audioCtx.currentTime + attackTime + releaseTime);
// }

// let pot = document.querySelector("#potentiometer");
// let potDisplay = document.querySelector("#value");
// let potentiometerCircle = document.querySelector("#potBody")
// pot.addEventListener("input", () =>{
//     let mappedValue = (pot.value / 100) * 270
//     potDisplay.innerText = `${pot.value} (${mappedValue})`;
//     potentiometerCircle.style.transform = `rotate(${mappedValue}deg)`;
// });

const NOTES_PER_OCTAVE = 12;
const NOTE_C0 = 16.35; //Lowest note on Piano (A0)

const OCTAVE_COUNT = 6;

let noteTable = [];
let noteNames = ["C", "C#/Db", "D", "D#/Eb", "E", "F", "F#/Gb", "G", "G#/Ab", "A", "A#/Bb", "B"];
for (let i = 0; i < OCTAVE_COUNT * NOTES_PER_OCTAVE + 1; i++) {
    //Get the "letter" of the note:"
    let indexOfNote;
    indexOfNote = i - (12 * (Math.floor(i / NOTES_PER_OCTAVE))); //Make it loop up to 12
    let octaveIndex = Math.floor(i / NOTES_PER_OCTAVE);
    let noteLetter = noteNames[indexOfNote] + String(octaveIndex);

    //Get the frequency of the note:
    let noteFrequency = NOTE_C0 * 2 ** (i / 12);

    //create the object:
    let note = { "note": noteLetter, "frequency": noteFrequency };
    noteTable.push(note);
}
//console.log("NOTES: ");
//console.log(noteTable);

//Start doing it for each pot:
// let bars = document.querySelectorAll(".potBar");
let pots = document.querySelectorAll(".potCircle");
let values = document.querySelectorAll(".potValue");

for (let i = 0; i < pots.length; i++) {

    //Style potentiometer
    let potElement = pots[i];
    potElement.style.position = 'absolute';
    offset = (i * 45) + 3;
    offsetH = '50px';
    potElement.style.top = `${offsetH}`;
    potElement.style.left = `${offset}px`

    //Attach handlers:
    potElement.addEventListener("mousedown", (potEvent) => {
        potEvent.preventDefault();
        //local event only works while on the area of the object. so use a temporary "document" eventhandler
        document.addEventListener("mousemove", potentiometerHandler);
        document.addEventListener("mouseup", (docUpEvent) =>{
            document.removeEventListener("mousemove", potentiometerHandler);
            document.removeEventListener("mouseup", this);
        });
    });
    function potentiometerHandler(event){
        let currentRotation = values[i].innerText;
        currentRotation -= event.movementY;
        //constrain to 0 and 270:
        currentRotation = Math.max(0, Math.min(270, currentRotation));
        potElement.style.transform = `rotate(${currentRotation}deg)`;
        values[i].innerText = currentRotation;
    }
}

let keyToNoteIndexes = {
    "KeyA": 0,
    "KeyW": 1,
    "KeyS": 2,
    "KeyE": 3,
    "KeyD": 4,
    "KeyF": 5,
    "KeyT": 6,
    "KeyG": 7,
    "KeyY": 8,
    "KeyH": 9,
    "KeyU": 10,
    "KeyJ": 11,
    "KeyK": 12,
}

let currentOctave = 0;
function keyCodeToNote(keyCode) {
    let keyIndex = keyToNoteIndexes[keyCode];

    return noteTable(keyIndex * (12 * currentOctave));
}
function octaveUp() {
    //console.log("Raising octave");
    currentOctave++
}
function octaveDown() {
    //console.log("Lowering octave");
    currentOctave--
}
let keyCodeToControl = {
    "KeyZ": octaveDown,
    "KeyX": octaveUp
}

let keyDisplay = document.getElementById("keyDisplay");
let presscount = 0;
let alreadyPressed = false;
document.addEventListener("keydown", (e) => {
    if (e.repeat) { return } //ignore if event is triggered by a repeat
    //Get the note if it is a note-key:
    if (e.code in keyToNoteIndexes) {
        //console.log("triggered a note")
        //console.log(`Key ${e.code} got pushed down, giving us note index ${keyToNoteIndexes[e.code]}
            // giving us note ${noteTable[keyToNoteIndexes[e.code]]["note"]}`)
        keyDisplay.innerText = `Pressed key ${e.code}, playing note: ${noteTable[keyToNoteIndexes[e.code]].note}`;
        return;
    }
    if (e.code in keyCodeToControl) {
        //console.log(keyCodeToControl[e.code]()); //Execute the control command
    }
});
document.addEventListener("keyup", (e) => {

});

