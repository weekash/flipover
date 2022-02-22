const board = document.getElementsByClassName('board')[0];
const initBtn = document.getElementsByClassName('init-btn')[0];
const counter = document.getElementsByClassName('counter')[0];
const restart = document.getElementsByClassName('restart');
const timerDiv = document.getElementsByClassName('timer')[0];
const endLine = document.getElementsByClassName('endline')[0];
const scoreBoard = document.getElementById('score');
const gameover = document.getElementById('gameover');
const gridFragment = document.createDocumentFragment();
const COUNTER_TIME = 8000;
const gridSize = 36;
const uniqueCharCount = gridSize / 2;
const chars1 = [...Array(uniqueCharCount).keys()]
const chars2 = [...Array(uniqueCharCount).keys()]
const chars = [...chars1, ...chars2]
const elements = [];
shuffle(chars)
const alpha = chars.map((char) => String.fromCharCode(char + 65))
let selection = [];
let firstElement = elements[selection[0]];
let secondElement = elements[selection[1]];
let selLen = selection.length;
let score = 0;
let time = 0;
let timerInterval = null;


initBtn.addEventListener('click', (e) => {
    init();
    e.target.style.display = 'none'
})

for (let i = 0; i < restart.length; i++) {
    restart[i].addEventListener('click', (e) => {
        location.reload();
    })
}

function startCounter() {
    let time = COUNTER_TIME / 1000;
    let endTime = 1;
    counter.style.display = 'block';
    text = `your game starts in ${time} seconds`
    counter.textContent = text;

    let interval = setInterval(() => {
        if (time == endTime) {
            clearInterval(interval)
            counter.style.display = 'none'
        }
        time--;
        text = `your game starts in ${time} seconds`
        counter.textContent = text;
    }, 1000)
}

function setScore(number) {
    scoreBoard.textContent = number;
    checkGameOver();
}

function checkGameOver() {
    if (score === gridSize) {
        endLine.textContent = `Congrats. Well played, you won this round in ${time} seconds`;
        gameover.style.display = 'block';
        clearInterval(timerInterval);
        board.innerHTML = '';

    }
}

function boxContent(value) {
    return `
    <div class="content">
            <div class="front">
            </div>
            <div class="back">
                ${value}
            </div>
        </div>
    `
}
function init() {
    for (let i = 0; i < gridSize; i++) {
        const box = document.createElement('div')
        box.className = 'box';
        box.dataset.value = alpha[i];
        box.dataset.id = i;
        box.innerHTML = boxContent(alpha[i]);
        elements.push(box)
        gridFragment.appendChild(box)
    }
    board.appendChild(gridFragment)
    scoreBoard.style.display = 'block'
    startCounter();
    setTimeout(() => { flipAll(elements); addListener() }, COUNTER_TIME);
}
function shuffle(chars) {
    for (let i = 0; i < chars.length; i++) {
        let newIndex = Math.floor(Math.random() * (chars.length));
        [chars[i], chars[newIndex]] = [chars[newIndex], chars[i]];
    }
}
function flipOne(item) {
    item.classList.add('hidden')
}
function flipAll(items) {
    items.forEach((item) => {
        item.classList.add('hidden')
    })
}
function setElements() {
    firstElement = elements[selection[0]]
    secondElement = elements[selection[1]]
}

function emptySelection() {
    selection = [];
    setElements();
    selLen = 0;
}
function checkSame(firstElement, secondElement) {
    let first = firstElement.dataset.value;
    let second = secondElement.dataset.value
    if (first && second && first === second) {
        setTimeout(() => {
            // firstElement.style.visibility = 'hidden'
            // secondElement.style.visibility = 'hidden'
            firstElement.classList.add('removed')
            secondElement.classList.add('removed')
            score += 2
            setScore(score)

        }, 300)
        emptySelection();
    }
}
function startTimer() {
    timerDiv.style.display = 'block'
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        time += 1
        timerDiv.textContent = time;
        if (time > 500) {
            clearInterval(timerInterval);
            location.reload();
        }
    }, 1000)
}
function addListener() {
    board.addEventListener('click', (e) => {
        let currentElement = e.target.offsetParent.offsetParent;
        let dataId = currentElement.dataset.id;
        if (!currentElement.classList.contains('box'))
            return;
        if (selection.includes(dataId)) {
            flipOne(elements[dataId]);
            selection.splice(selection.indexOf(dataId), 1)
            selLen = selection.length;
            return;
        }
        if (selLen == 2) {
            flipAll([firstElement, secondElement]);
            emptySelection();
        }
        currentElement.classList.remove('hidden')
        selection.push(dataId);
        selLen = selection.length;
        setElements();
        console.log(selection)
        if (selLen == 2) {
            checkSame(firstElement, secondElement)
        }
    })
    startTimer();
}
