// Variables --------------------------------------------------------------------------------------------------------

const scoreboard = document.querySelector(".score");

let speed = 350;

let gameOverVar = false;
let score = 0;

// Left Road Variables --------------------------------------------------

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

rightCar.style.bottom = `${6*document.body.offsetWidth/200}px`;
leftCar.style.bottom = `${6*document.body.offsetWidth/200}px`;

// set Intervals ------------------------------------------------------------------------------------------------------------

let mainInterval = setInterval(controller, 20);


// Event Listeners -----------------------------------------------------------------------------------------------------------

document.addEventListener("keydown", keyDownHandler);


// Event Handlers ---------------------------------------------------------------------------------------------------------------

function keyDownHandler(e){
   if(e.key=="a"){
      leftCar.style.left = "33%";
      leftCarLane = 0;
      //here setTimeout is used because we don't want immediately change lane, it takes 200ms for transition to end. Hence until that time car will not be in any lane (that is why carLane = 0), hence it will not be affected by obstacles in either lane.
      setTimeout(() => {
         leftCarLane = 1;
      }, 200);
   }
   else if(e.key=="d"){
      leftCar.style.left = "43%";
      leftCarLane = 0;
      setTimeout(() => {
         leftCarLane = 2;
      }, 200);
   }

   if(e.key=="ArrowLeft"){
      rightCar.style.left = "53%";
      rightCarLane = 0;
      setTimeout(() => {
         rightCarLane = 3;
      }, 150);
   }
   else if(e.key=="ArrowRight"){
      rightCar.style.left = "63%";
      rightCarLane = 0;
      setTimeout(() => {
         rightCarLane = 4;
      }, 150);
   }
}


// Functions -----------------------------------------------------------------------------------------------------------------------


//this function is the controller function, it is used to create obstacles, check whether game is over, etc
async function controller(){

   //max time is set such that obstacle is 13vw away from the earlier obstacle, it is in ms
   let maxTime = (13/100) * (document.body.offsetWidth/speed) * 1000;
   // min time is set such that obstacle is 10vw + 60px away from the earlier obstacle
   let minTime = (10 * document.body.offsetWidth)*1000 /(100*speed);

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

   //removing unnecessary Xs
   removeXs();

   //check whether car is touching Xs
   collisionWithX();

   //check whether any O was missed by the car
   checkMissedO();

   //check whether any O is hit by the car
   checkHitO();
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
         tempObs.style.left = "33%";
         firstLane.append(tempObs);
         lane1O.push(tempObs);
      }
      else {
         tempObs.style.left = "43%";
         secondLane.append(tempObs);
         lane2O.push(tempObs);
      }
   }
   else if(road=="right"){
      if(lane==0){
         tempObs.style.left = "53%";
         thirdLane.append(tempObs);
         lane3O.push(tempObs);
      }
      else {
         tempObs.style.left = "63%";
         fourthLane.append(tempObs);
         lane4O.push(tempObs);
      }
   }
   //set time out is used because if you give the element some top before it is inserted into DOM the transition doesn't happen.
   setTimeout(()=> {
      tempObs.style.top = "101%";
   }, 5);
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
         tempObs.style.left = "33%";
         firstLane.append(tempObs);
         lane1X.push(tempObs);

      }
      else {
         tempObs.style.left = "43%";
         secondLane.append(tempObs);
         lane2X.push(tempObs);
      }
   }
   else if(road=="right"){
      if(lane==0){
         tempObs.style.left = "53%";
         thirdLane.append(tempObs);
         lane3X.push(tempObs);
      }
      else {
         tempObs.style.left = "63%";
         fourthLane.append(tempObs);
         lane4X.push(tempObs);
      }
   }
   setTimeout(()=> {
      tempObs.style.top = "101%";
   }, 5);
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
            //as soon as X is hit, stop it's movement. So that user can see why did the game end
            lane1X[i].style.top = `${lane1X[i].offsetTop}px`;
            gameOver();
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
            lane2X[i].style.top = `${lane2X[i].offsetTop}px`;
            gameOver();
         }
      }
   }
   if(rightCarLane==3){
      for(let i=0; i<lane3X.length; i++){

         if(leftCar.offsetTop > lane3X[i].offsetTop + lane3X[i].offsetHeight){
            return;
         }

         if (
               (leftCar.offsetTop > lane3X[i].offsetTop && leftCar.offsetTop < lane3X[i].offsetTop + lane3X[i].offsetHeight) || 
               (leftCar.offsetTop + leftCar.offsetHeight > lane3X[i].offsetTop && leftCar.offsetTop + leftCar.offsetHeight < lane3X[i].offsetTop + lane3X[i].offsetHeight)
            )
         {
            lane3X[i].style.top = `${lane3X[i].offsetTop}px`;
            gameOver();
         }
      }
   }
   else if(rightCarLane==4) {
      for(let i=0; i<lane4X.length; i++){

         if(leftCar.offsetTop > lane4X[i].offsetTop + lane4X[i].offsetHeight){
            return;
         }

         if (
               (leftCar.offsetTop > lane4X[i].offsetTop && leftCar.offsetTop < lane4X[i].offsetTop + lane4X[i].offsetHeight) || 
               (leftCar.offsetTop + leftCar.offsetHeight > lane4X[i].offsetTop && leftCar.offsetTop + leftCar.offsetHeight < lane4X[i].offsetTop + lane4X[i].offsetHeight)
            )
         {
            lane4X[i].style.top = `${lane4X[i].offsetTop}px`;
            gameOver();
         }
      }
   }
}


// checked if the car missed any Os, if so then game is over
async function checkMissedO(){
   if(lane1O.length >= 1 && lane1O[0].offsetTop > leftCar.offsetTop + leftCar.offsetHeight){
      lane1O[0].style.top = `${lane1O[0].offsetTop}px`;
      gameOver();
   }
   if(lane2O.length >= 1 && lane2O[0].offsetTop > leftCar.offsetTop + leftCar.offsetHeight){
      lane2O[0].style.top = `${lane2O[0].offsetTop}px`;
      gameOver();
   }
   if( lane3O.length >= 1 && lane3O[0].offsetTop > rightCar.offsetTop + rightCar.offsetHeight){
      lane3O[0].style.top = `${lane3O[0].offsetTop}px`;
      gameOver();
   }
   if( lane4O.length >= 1 && lane4O[0].offsetTop > rightCar.offsetTop + rightCar.offsetHeight){
      lane4O[0].style.top = `${lane4O[0].offsetTop}px`;
      gameOver();
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
            (leftCar.offsetTop > lane3O[0].offsetTop && leftCar.offsetTop < lane3O[0].offsetTop + lane3O[0].offsetHeight) || 
            (leftCar.offsetTop + leftCar.offsetHeight > lane3O[0].offsetTop && leftCar.offsetTop + leftCar.offsetHeight < lane3O[0].offsetTop + lane3O[0].offsetHeight)
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
            (leftCar.offsetTop > lane4O[0].offsetTop && leftCar.offsetTop < lane4O[0].offsetTop + lane4O[0].offsetHeight) || 
            (leftCar.offsetTop + leftCar.offsetHeight > lane4O[0].offsetTop && leftCar.offsetTop + leftCar.offsetHeight < lane4O[0].offsetTop + lane4O[0].offsetHeight)
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


//game over
function gameOver(){
   if(!gameOverVar){ 

      //remove event listeners and intervals
      clearInterval(mainInterval);
      document.removeEventListener("keydown", keyDownHandler);

      //Lost is an div element which pop ups when player loses, it shows the score
      document.querySelector(".Lost").style.display = "inline-block";
      document.querySelector("#score").textContent = score;
      gameOverVar = true;
      window.stop();
      setTimeout(() => {
         window.location.reload();
      }, 5000);
   }
}