// Variables --------------------------------------------------------------------------------------------------------

const scoreboard = document.querySelector(".score");

let speed = 350;

let score = 0;

//change speed every 3s
let speedChangeTime = 100;

let isMobile = false;

if(document.body.offsetWidth <= 768){
   isMobile = true;
}

// Left Road Variables --------------------------------------------------

const leftRoad = document.querySelector(".leftRoad");
const rightRoad = document.querySelector(".rightRoad");
const leftCar = document.querySelector(".leftCar");
const firstLane = document.querySelector(".firstLane");
const secondLane = document.querySelector(".secondLane");

// stores which lane is left car currently in
let leftCarLane = 2;

// time left until creation of another obsctacle in left road
let createLeftObsTime = 0;

// array of X elements and O elements for Lane 1 and 2
let lane1X = [];
let lane2X = [];
let lane1O = [];
let lane2O = [];


// Right Road Variables --------------------------------------------------

const rightCar = document.querySelector(".rightCar");
const thirdLane = document.querySelector(".thirdLane");
const fourthLane = document.querySelector(".fourthLane");

let rightCarLane = 3;

let createRightObsTime = 0;
let lane3X = [];
let lane4X = [];
let lane3O = [];
let lane4O = [];


// Initialisation -----------------------------------------------------------------------------------------------------------

if(!isMobile){
   rightCar.style.bottom = `${9*document.body.offsetWidth/200}px`;
   leftCar.style.bottom = `${9*document.body.offsetWidth/200}px`;
}
else {
   rightCar.style.bottom = `${20*document.body.offsetWidth/200}px`;
   leftCar.style.bottom = `${20*document.body.offsetWidth/200}px`;
}

// set Intervals ------------------------------------------------------------------------------------------------------------

let mainInterval = setInterval(controller, 20);


// Event Listeners -----------------------------------------------------------------------------------------------------------

document.addEventListener("keydown", keyDownHandler);
leftRoad.addEventListener("touchstart", leftCarLaneChange);
rightRoad.addEventListener("touchstart", rightCarLaneChange);
leftCar.addEventListener("touchstart", leftCarLaneChange);
rightCar.addEventListener("touchstart", rightCarLaneChange);

// Event Handlers ---------------------------------------------------------------------------------------------------------------

function keyDownHandler(e){
   if(e.key=="a"){
      if(!isMobile){
         leftCar.style.left = "33%";
      }
      else {
         leftCar.style.left = "7.5%";
      }
      leftCarLane = 0;
      //here setTimeout is used because we don't want immediately change lane, it takes 200ms for transition to end. Hence until that time car will not be in any lane (that is why carLane = 0), hence it will not be affected by obstacles in either lane.
      setTimeout(() => {
         leftCarLane = 1;
      }, 200);
   }
   else if(e.key=="d"){
      if(!isMobile){
         leftCar.style.left = "43%";
      }
      else {
         leftCar.style.left = "32.5%";
      }
      leftCarLane = 0;
      setTimeout(() => {
         leftCarLane = 2;
      }, 200);
   }

   if(e.key=="ArrowLeft"){
      if(!isMobile){
         rightCar.style.left = "53%";
      }
      else {
         rightCar.style.left = "57.5%";
      }
      rightCarLane = 0;
      setTimeout(() => {
         rightCarLane = 3;
      }, 200);
   }
   else if(e.key=="ArrowRight"){
      if(!isMobile){
         rightCar.style.left = "63%";
      }
      else {
         rightCar.style.left = "82.5%";
      }
      rightCarLane = 0;
      setTimeout(() => {
         rightCarLane = 4;
      }, 200);
   }
}

function leftCarLaneChange(){
   if(leftCarLane==2){
      if(!isMobile){
         leftCar.style.left = "33%";
      }
      else {
         leftCar.style.left = "7.5%";
      }
      leftCarLane = 0;
      setTimeout(() => {
         leftCarLane = 1;
      }, 200);
   }
   else if(leftCarLane==1){
      if(!isMobile){
         leftCar.style.left = "43%";
      }
      else {
         leftCar.style.left = "32.5%";
      }
      leftCarLane = 0;
      setTimeout(() => {
         leftCarLane = 2;
      }, 200);
   }
}

function rightCarLaneChange(){
   if(rightCarLane==3){
      if(!isMobile){
         rightCar.style.left = "63%";
      }
      else {
         rightCar.style.left = "82.5%";
      }
      rightCarLane = 0;
      setTimeout(() => {
         rightCarLane = 4;
      }, 200);
   }
   else if(rightCarLane==4){
      if(!isMobile){
         rightCar.style.left = "53%";
      }
      else {
         rightCar.style.left = "57.5%";
      }
      rightCarLane = 0;
      setTimeout(() => {
         rightCarLane = 3;
      }, 200);
   }
}


// Functions -----------------------------------------------------------------------------------------------------------------------



//this function is the controller function, it is used to create obstacles, check whether game is over, etc
async function controller(){
   //removing unnecessary Xs
   removeXs();

   //check whether car is touching Xs
   collisionWithX();

   //check whether any O was missed by the car
   checkMissedO();

   //check whether any O is hit by the car
   checkHitO();

   //speed change code block
   if(speedChangeTime <=0){
      speed += 1;
      speedChangeTime = 100;
   }
   speedChangeTime -= 20;

   let maxTime;
   let minTime;

   if(!isMobile){
      //max time is set such that obstacle is 13vw away from the earlier obstacle, it is in ms
      maxTime = (13/100) * (document.body.offsetWidth/speed) * 1000;
      // min time is set such that obstacle is 10vw away from the earlier obstacle
      minTime = (10 * document.body.offsetWidth)*1000 /(100*speed);
   }
   else {
      //max time is set such that obstacle is 13vw away from the earlier obstacle, it is in ms
      maxTime = (55/100) * (document.body.offsetWidth/speed) * 1000;
      // min time is set such that obstacle is 10vw away from the earlier obstacle
      minTime = (45 * document.body.offsetWidth)*1000 /(100*speed);
   }

   //for creating obstacles,it checks whether the time for creating obstacles is up, then calls createObs and sets next random time
   if(createLeftObsTime <= 0){
      createLeftObsTime = Math.floor(Math.random() * (maxTime - minTime) + minTime);
      createObs("left");
   }
   if(createRightObsTime <= 0){
      createObs("right");
      createRightObsTime = Math.floor(Math.random() * (maxTime - minTime) + minTime);
   }
   createRightObsTime -= 20;
   createLeftObsTime -= 20;
}


//this is used to create obstacles, it further calls createO, createX functions
async function createObs(road){
   // decide whether O or X
   let OorX = Math.floor(Math.random() * 2);

   
   if(road=="left"){
      if(OorX==0){
         createO("left"); 
      }
      else if(OorX==1){
         createX("left");
      }
   }
   else {
      if(OorX==0){
         createO("right"); 
      }
      else if(OorX==1){
         createX("right");
      }
   }
}


// it is used to create Os
async function createO(road){
   const tempObs = document.createElement("div");
   tempObs.classList.add("O");
   tempObs.textContent = "O";

   //set the transition time according to the screen height
   let transitionTime = document.body.offsetHeight/speed;
   tempObs.style.transition = `all ${transitionTime}s linear`;

   // decides which lane to put the O in, for both roads. For left road 0 means Lane1, 1 means Lane2 and for right road 0,1 is lane 3,4 resp.
   let lane = Math.floor(Math.random() * 2);
   if(road=="left"){
      if(lane==0){
         if(!isMobile){
            tempObs.style.left = "33%";
         }
         else {
            tempObs.style.left = "7.5%";
         }
         firstLane.append(tempObs);
         lane1O.push(tempObs);
      }
      else {
         if(!isMobile){
            tempObs.style.left = "43%";
         }
         else {
            tempObs.style.left = "32.5%";
         }
         secondLane.append(tempObs);
         lane2O.push(tempObs);
      }
   }
   else if(road=="right"){
      if(lane==0){
         if(!isMobile){
            tempObs.style.left = "53%";
         }
         else {
            tempObs.style.left = "57.5%";
         }
         thirdLane.append(tempObs);
         lane3O.push(tempObs);
      }
      else {
         if(!isMobile){
            tempObs.style.left = "63%";
         }
         else {
            tempObs.style.left = "82.5%";
         }
         fourthLane.append(tempObs);
         lane4O.push(tempObs);
      }
   }
   //set time out is used because if you give the element some top before it is inserted into DOM the transition doesn't happen.
   setTimeout(()=> {
      tempObs.style.top = "101%";
   }, 20);
}


// creates Xs
async function createX(road){
   const tempObs = document.createElement("div");
   tempObs.classList.add("X");
   tempObs.textContent = "X";

   //set the transition time according to the screen
   let transitionTime = document.body.offsetHeight/speed;
   tempObs.style.transition = `all ${transitionTime}s linear`;

   let lane = Math.floor(Math.random() * 2);
   if(road=="left"){
      if(lane==0){
         if(!isMobile){
            tempObs.style.left = "33%";
         }
         else {
            tempObs.style.left = "7.5%";
         }
         firstLane.append(tempObs);
         lane1X.push(tempObs);
      }
      else {
         if(!isMobile){
            tempObs.style.left = "43%";
         }
         else {
            tempObs.style.left = "32.5%";
         }
         secondLane.append(tempObs);
         lane2X.push(tempObs);
      }
   }
   else if(road=="right"){
      if(lane==0){
         if(!isMobile){
            tempObs.style.left = "53%";
         }
         else {
            tempObs.style.left = "57.5%";
         }
         thirdLane.append(tempObs);
         lane3X.push(tempObs);
      }
      else {
         if(!isMobile){
            tempObs.style.left = "63%";
         }
         else {
            tempObs.style.left = "82.5%";
         }
         fourthLane.append(tempObs);
         lane4X.push(tempObs);
      }
   }
   setTimeout(()=> {
      tempObs.style.top = "101%";
   }, 20);
}


// this function removes Xs that are beyond the viewport
async function removeXs(){
   if(lane1X.length>=1 && lane1X[0].offsetTop >= document.body.offsetHeight){
      lane1X[0].remove();
      lane1X.shift();
   }
   if(lane2X.length>=1 && lane2X[0].offsetTop >= document.body.offsetHeight){
      lane2X[0].remove();
      lane2X.shift();
   }
   if(lane3X.length>=1 && lane3X[0].offsetTop >= document.body.offsetHeight){
      lane3X[0].remove();
      lane3X.shift();
   }
   if(lane4X.length>=1 && lane4X[0].offsetTop >= document.body.offsetHeight){
      lane4X[0].remove();
      lane4X.shift();
   }
}


// checks whether either car is in contact with any X
async function collisionWithX(){
   if(leftCarLane==1){
      for(let i=0; i<lane1X.length; i++){
         //below if statement is used to shorten the for loop, if our car is above one X and below another then no need check remaining X
         if(leftCar.offsetTop > lane1X[i].offsetTop + lane1X[i].offsetHeight){
            return;
         }

         if (
               (leftCar.offsetTop > lane1X[i].offsetTop && leftCar.offsetTop < lane1X[i].offsetTop + lane1X[i].offsetHeight) || 
               (leftCar.offsetTop + leftCar.offsetHeight > lane1X[i].offsetTop && leftCar.offsetTop + leftCar.offsetHeight < lane1X[i].offsetTop + lane1X[i].offsetHeight)
            )
         {
            lane1X[i].classList.add("animateEnlarge");
            gameOver(1);
         }
      }
   }
   else if(leftCarLane==2){
      for(let i=0; i<lane2X.length; i++){

         if(leftCar.offsetTop > lane2X[i].offsetTop + lane2X[i].offsetHeight){
            return;
         }

         if (
               (leftCar.offsetTop > lane2X[i].offsetTop && leftCar.offsetTop < lane2X[i].offsetTop + lane2X[i].offsetHeight) || 
               (leftCar.offsetTop + leftCar.offsetHeight > lane2X[i].offsetTop && leftCar.offsetTop + leftCar.offsetHeight < lane2X[i].offsetTop + lane2X[i].offsetHeight)
            )
         {
            lane2X[i].classList.add("animateEnlarge");
            gameOver(2);
         }
      }
   }
   if(rightCarLane==3){
      for(let i=0; i<lane3X.length; i++){

         if(rightCar.offsetTop > lane3X[i].offsetTop + lane3X[i].offsetHeight){
            return;
         }

         if (
               (rightCar.offsetTop > lane3X[i].offsetTop && rightCar.offsetTop < lane3X[i].offsetTop + lane3X[i].offsetHeight) || 
               (rightCar.offsetTop + rightCar.offsetHeight > lane3X[i].offsetTop && rightCar.offsetTop + rightCar.offsetHeight < lane3X[i].offsetTop + lane3X[i].offsetHeight)
            )
         {
            lane3X[i].classList.add("animateEnlarge");
            gameOver(3);
         }
      }
   }
   else if(rightCarLane==4) {
      for(let i=0; i<lane4X.length; i++){

         if(rightCar.offsetTop > lane4X[i].offsetTop + lane4X[i].offsetHeight){
            return;
         }

         if (
               (rightCar.offsetTop > lane4X[i].offsetTop && rightCar.offsetTop < lane4X[i].offsetTop + lane4X[i].offsetHeight) || 
               (rightCar.offsetTop + rightCar.offsetHeight > lane4X[i].offsetTop && rightCar.offsetTop + rightCar.offsetHeight < lane4X[i].offsetTop + lane4X[i].offsetHeight)
            )
         {
            lane4X[i].classList.add("animateEnlarge");
            gameOver(4);
         }
      }
   }
}


// checked if the car missed any Os, if so then game is over
async function checkMissedO(){
   if(lane1O.length >= 1 && lane1O[0].offsetTop > leftCar.offsetTop + leftCar.offsetHeight){
      lane1O[0].classList.add("animateEnlarge");
      gameOver(5);
   }
   if(lane2O.length >= 1 && lane2O[0].offsetTop > leftCar.offsetTop + leftCar.offsetHeight){
      lane2O[0].classList.add("animateEnlarge");
      gameOver(6);
   }
   if( lane3O.length >= 1 && lane3O[0].offsetTop > rightCar.offsetTop + rightCar.offsetHeight){
      lane3O[0].classList.add("animateEnlarge");
      gameOver(7);
   }
   if( lane4O.length >= 1 && lane4O[0].offsetTop > rightCar.offsetTop + rightCar.offsetHeight){
      lane4O[0].classList.add("animateEnlarge");
      gameOver(8);
   }
}


// checks if the car hit any O, if so removes that O from DOM and lane*O array
async function checkHitO(){

   if(leftCarLane==1){
      if(
         lane1O.length >=1 &&
         (
            (leftCar.offsetTop > lane1O[0].offsetTop && leftCar.offsetTop < lane1O[0].offsetTop + lane1O[0].offsetHeight) || 
            (leftCar.offsetTop + leftCar.offsetHeight > lane1O[0].offsetTop && leftCar.offsetTop + leftCar.offsetHeight < lane1O[0].offsetTop + lane1O[0].offsetHeight)
         )
      )
      {
         lane1O[0].remove();
         lane1O.shift();
         score++;
         scoreboard.textContent = score;
      }
   }
   else if(leftCarLane==2){
      if(
         lane2O.length >= 1 &&
         (
            (leftCar.offsetTop > lane2O[0].offsetTop && leftCar.offsetTop < lane2O[0].offsetTop + lane2O[0].offsetHeight) || 
            (leftCar.offsetTop + leftCar.offsetHeight > lane2O[0].offsetTop && leftCar.offsetTop + leftCar.offsetHeight < lane2O[0].offsetTop + lane2O[0].offsetHeight)
         )
      )
      {
         lane2O[0].remove();
         lane2O.shift();
         score++;
         scoreboard.textContent = score;
      }
   }
   if(rightCarLane==3){
      if(
         lane3O.length >= 1 &&
         (
            (rightCar.offsetTop > lane3O[0].offsetTop && rightCar.offsetTop < lane3O[0].offsetTop + lane3O[0].offsetHeight) || 
            (rightCar.offsetTop + rightCar.offsetHeight > lane3O[0].offsetTop && rightCar.offsetTop + rightCar.offsetHeight < lane3O[0].offsetTop + lane3O[0].offsetHeight)
         )
      )
      {
         lane3O[0].remove();
         lane3O.shift();
         score++;
         scoreboard.textContent = score;
      }
   }
   else if(rightCarLane==4) {
      if(
         lane4O.length >= 1 &&
         (
            (rightCar.offsetTop > lane4O[0].offsetTop && rightCar.offsetTop < lane4O[0].offsetTop + lane4O[0].offsetHeight) || 
            (rightCar.offsetTop + rightCar.offsetHeight > lane4O[0].offsetTop && rightCar.offsetTop + rightCar.offsetHeight < lane4O[0].offsetTop + lane4O[0].offsetHeight)
         )
      )
      {
         lane4O[0].remove();
         lane4O.shift();
         score++;
         scoreboard.textContent = score;
      }
   }
}


async function stopObstacles(){
   for(let i=0; i<lane1X.length; i++){
      lane1X[i].style.top = `${lane1X[i].offsetTop}px`;
   }
   for(let i=0; i<lane1O.length; i++){
      lane1O[i].style.top = `${lane1O[i].offsetTop}px`;
   }
   for(let i=0; i<lane2X.length; i++){
      lane2X[i].style.top = `${lane2X[i].offsetTop}px`;
   }
   for(let i=0; i<lane2O.length; i++){
      lane2O[i].style.top = `${lane2O[i].offsetTop}px`;
   }
   for(let i=0; i<lane3X.length; i++){
      lane3X[i].style.top = `${lane3X[i].offsetTop}px`;
   }
   for(let i=0; i<lane3O.length; i++){
      lane3O[i].style.top = `${lane3O[i].offsetTop}px`;
   }
   for(let i=0; i<lane4X.length; i++){
      lane4X[i].style.top = `${lane4X[i].offsetTop}px`;
   }
   for(let i=0; i<lane4O.length; i++){
      lane4O[i].style.top = `${lane4O[i].offsetTop}px`;
   }
}


//game over
async function gameOver(fromWhere){
      console.log(fromWhere);
      stopObstacles();

      //remove event listeners and intervals
      clearInterval(mainInterval);
      document.removeEventListener("keydown", keyDownHandler);
      leftRoad.removeEventListener("touchstart", leftCarLaneChange);
      rightRoad.removeEventListener("touchstart", rightCarLaneChange);
      leftCar.removeEventListener("touchstart", leftCarLaneChange);
      rightCar.removeEventListener("touchstart", rightCarLaneChange);

      //stop all obstacles
      setTimeout(()=>{   
         stopObstacles();
      }, 20);

      //Lost is an div element which pop ups when player loses, it shows the score
      document.querySelector(".Lost").style.display = "inline-block";
      document.querySelector("#score").textContent = score;
      setTimeout(() => {
        //window.location.reload();
      }, 5000);
}