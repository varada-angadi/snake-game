//dom manipulation
const board=document.querySelector('.board');
const startButton=document.querySelector(".btn-start");
const restartButton=document.querySelector(".btn-over");
const startGmModal=document.querySelector(".start-gm");
const reStartGmModal=document.querySelector(".over-gm");
const winGmModal=document.querySelector(".win-gm");
const highScoreElement=document.querySelector('#hscore');
const timeElement=document.querySelector('#time');
const scoreElement=document.querySelector('#score');
const overScore=document.querySelector("#over-score")
const modal=document.querySelector(".modal");

//each block dimention
const blockWidth = 30;
const blockHeight = 30;

//total rows cols calculation
const cols=Math.floor(board.clientWidth/blockWidth);
const rows=Math.floor(board.clientHeight/blockHeight);

//Initial values for scores
let score = 0; 
let time = `00-00`;
let highScore=localStorage.getItem('highScore') || 0;
highScoreElement.innerText=highScore;

//Interval initialized to null at start
let intervalId=null;
let timeInterval=null;

//Initial objects and arrays
const blocks=[] ;
let snake=[{x: 1, y:2}]
let food=foodGeneration();
let direction='down';

function foodGeneration(){
    let food;
while(true){
        food={x:Math.floor(Math.random()*rows), y:Math.floor(Math.random()*cols)};
        let isOnSnake = snake.some(segment => segment.x === food.x && segment.y === food.y);
        if (!isOnSnake) break;
    }
    return food;
}

//grid block generation
for(let i=0;i<rows;i++){
    for(let j=0;j<cols;j++){
        const block = document.createElement('div');
        block.classList.add('block');
        board.appendChild(block);
        blocks[`${i}-${j}`]=block;
    }
}

//render function for entire game logic
function render(){
    let head=null;
    //random food generation. It gives you the exact <div> of that cell
    blocks[`${food.x}-${food.y}`].classList.add('food');

    //snake movement as per direction
    if(direction === "left"){
        head={
            x: snake[0].x,
            y: snake[0].y-1
        }
    }
    else if(direction === "right"){
        head={
            x: snake[0].x,
            y: snake[0].y+1
        }
    }
    else if(direction === "down"){
        head={
            x: snake[0].x+1,
            y: snake[0].y
        }
    }
    else if(direction === "up"){
        head={
            x: snake[0].x-1,
            y: snake[0].y
        }
    }

    //game over logic
    //wall touch
    if(head.x<0 || head.x==rows || head.y<0 || head.y==cols){
        clearInterval(intervalId);
        clearInterval(timeInterval);
        scoreElement.innerText=0;
        modal.style.display="flex";
        startGmModal.style.display="none"
        reStartGmModal.style.display="flex";
        return;
    } 
    //self eat
    let selfCollision = snake.some(segment => segment.x === head.x && segment.y === head.y);
    if (selfCollision) {
        clearInterval(intervalId);
        clearInterval(timeInterval);
        scoreElement.innerText=0;
        modal.style.display = "flex";
        startGmModal.style.display = "none";
        reStartGmModal.style.display = "flex";
        return;
    }

    // remove old snake from UI
    snake.forEach(segment => {
        let coords=`${segment.x}-${segment.y}`;
        blocks[coords].classList.remove('body');
        blocks[coords].classList.remove('head');

    })

    //food eaten logic
    if(head.x==food.x && head.y==food.y){
        blocks[`${food.x}-${food.y}`].classList.remove('food');
        food=foodGeneration();
        snake.unshift(head);
        score+=10;
        scoreElement.textContent=score;
        if(score>highScore){
            highScore=score;
            localStorage.setItem('highScore',highScore.toString())
            highScoreElement.textContent=highScore
        }
    }
    else{
        //after moving forward the tail is removed 
        //Move forward = add head + remove tail
        //the head is moved forward
        snake.unshift(head);
        snake.pop();
    }

    if(snake.length===rows*cols){
        clearInterval(intervalId);
        clearInterval(timeInterval);
        scoreElement.innerText=0;
        modal.style.display = "flex";
        startGmModal.style.display = "none";
        winGmModal.style.display = "flex";
        return;
    }
    
    //adding body color for snake
    snake.forEach((segment,index) => {
        let coords=`${segment.x}-${segment.y}`;
        if(index==0){ blocks[coords].classList.add('head');}
        else{blocks[coords].classList.add('body');}
    })

}

//snake direction event listner for keys
addEventListener('keydown',(event)=>{
    if(event.key==='ArrowUp' && direction!=='down'){
        direction="up";
    }
    if(event.key==='ArrowDown' && direction!=='up'){
        direction="down";
    }
    if(event.key==='ArrowLeft' && direction!=='right'){
        direction="left";
    }
    if(event.key==='ArrowRight' && direction!=='left'){
        direction="right";
    }
});

//start button logic to start game
startButton.addEventListener("click",()=>
{
    modal.style.display="none";
    intervalId = setInterval(()=>{ render();}, 400);
    timeInterval=setInterval(()=>{ let [min,sec]=time.split("-").map(Number);
    if(sec==59){ min+=1; sec=0;}
    else{sec+=1;}
    time=`${min}-${sec}`
    timeElement.textContent=time },1000)
})

//Restart button listener
restartButton.addEventListener("click",restartGame)
clearInterval(intervalId);
clearInterval(timeInterval);
//restart button logic
function restartGame(){
    //remove food
    blocks[`${food.x}-${food.y}`].classList.remove('food');
    //remove snake
    snake.forEach(segment => {
        let coords=`${segment.x}-${segment.y}`;
        blocks[coords].classList.remove('body');
        blocks[coords].classList.remove('head');

    })
    overScore.textContent=score;
    //reinitialize to 0
    score=0;
    time=`00-00`
    timeElement.textContent=time;
    scoreElement.textContent=score;
    highScoreElement.textContent=highScore;
    modal.style.display="none";
    snake=[{x: 1,y:2}]
    food=foodGeneration();
    //start render
    intervalId = setInterval(()=>{render();}, 700)
}



