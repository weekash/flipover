const board = document.getElementsByClassName('board')[0];
const initBtn = document.getElementsByClassName('init-btn')[0];
const counter = document.getElementsByClassName('counter')[0];
const restart = document.getElementsByClassName('restart');
const scoreBoard = document.getElementById('score');
const gameover = document.getElementById('gameover');
const gridFragment = document.createDocumentFragment();
const COUNTER_TIME = 3000;
const gridSize = 36;
const uniqueCharCount = gridSize/2;
const chars1 = [...Array(uniqueCharCount).keys()]
const chars2 = [...Array(uniqueCharCount).keys()]
const chars = [...chars1, ...chars2]
const elements = [];
shuffle(chars)
const alpha = chars.map((char)=> String.fromCharCode(char + 65))
let selection = [];
let firstElement = elements[selection[0]];
let secondElement = elements[selection[1]];
let selLen = selection.length;
let score = 0;

initBtn.addEventListener('click', (e)=>{
    init();
    e.target.style.display = 'none'
})

for(let i=0;i<restart.length;i++){
    restart[i].addEventListener('click', (e)=>{
    location.reload();
    })
}

function startCounter() {
    let time = 1;
    const endTime = COUNTER_TIME/1000;
    counter.style.display = 'flex';
    counter.textContent = time;
    let interval = setInterval(()=>{
        if(time==endTime) {
            clearInterval(interval)
            counter.style.display = 'none'
        }
        time++;
        counter.textContent = time;
    }, 1000)
}

function setScore(number) {
    scoreBoard.textContent =  number;
    checkGameOver();
}

function checkGameOver() {
    if(score === gridSize) {
        gameover.style.display='block';
    }
}

function init(){
    for(let i=0;i<gridSize;i++) {
        const box = document.createElement('div')
        box.className = 'box';
        box.textContent = alpha[i]
        box.dataset.id = i;
        elements.push(box)
        gridFragment.appendChild(box)
    }
    board.appendChild(gridFragment)
    scoreBoard.style.display = 'block'
    startCounter();
    setTimeout(()=>flipAll(elements), COUNTER_TIME);
}
function shuffle(chars){
    for(let i=0;i<chars.length;i++) {
        let newIndex = Math.floor(Math.random()*(chars.length));
        [chars[i], chars[newIndex]] = [chars[newIndex], chars[i]];
    }
}
function flipOne(item) {
    item.classList.add('hidden')
}
function flipAll(items) {
    items.forEach((item)=>{
        item.classList.add('hidden')
    })
}
function setElements(){
    firstElement = elements[selection[0]]
    secondElement = elements[selection[1]]
}

function emptySelection(){
    selection=[];
    setElements();
    selLen = 0;
}
function checkSame(firstElement, secondElement){
    let first = firstElement.textContent;
    let second = secondElement.textContent
    if(first && second && first === second){
        setTimeout(()=>{
            firstElement.style.visibility = 'hidden'
            secondElement.style.visibility = 'hidden'
            score +=2
            setScore(score)

        },300)
    emptySelection();
    }
}
board.addEventListener('click',(e)=>{
    let currentElement = e.target;
    let dataId = currentElement.dataset.id;
    if(!currentElement.classList.contains('box'))
    return;
    if(selLen==2){
        flipAll([firstElement, secondElement]);
       emptySelection();
    }
    if(selection.includes(dataId)){
        flipOne(firstElement);
       emptySelection();
        return;
    }
    currentElement.classList.remove('hidden')
    selection.push(dataId);
    selLen = selection.length;
    setElements();
    if(selLen == 2){
        checkSame(firstElement, secondElement)
    }
})


