// Variables -------------------------------------------------------------

let words = ['the', 'be', 'to', 'of', 'and', 'a', 'that', 'have', 'this', 'but', 'would', 'there', 'their', 'people', 'could', 'about', 'what', 'which', 'where', 'according', 'specialist', 'canadian', 'hardest', 'obstinance', 'suburban', 'assuming', 'someone', 'thousand', 'millennium', 'did', 'mischievous', 'brother', 'his', 'her', 'memento', 'possession', 'disappointed', 'if', 'it', 'hello', 'she', 'never', 'think', 'lost', 'win', 'fire', 'ice', 'anime', 'manga', 'education', 'piece', 'double', 'hyperactive', 'busted', 'desire', 'especially', 'however', 'wait', 'no', 'yes', 'extremeties', 'fiery', 'wild', 'devil', 'crusader', 'okay', 'yeah', 'so', 'like', 'love', 'appointed', 'shoot', 'trickling', 'stream', 'sing', 'dance', 'facts', 'life', 'great', 'save', 'death', 'drastic', 'lengthy', 'lava', 'beautiful', 'anxious', 'zip', 'enclosure', 'dog', 'cat', 'animal', 'whatever', 'fight', 'go', 'let', 'approximation', 'english', 'math', 'science', 'word'];

let wordCreatedList = [];

let wordCreatedNode = [];

let wordListIndex = -1;
let wordIndex = 0;

let isGameOver = false;

let colorScheme = 'dark';

let spawnInterval = 2.0;
let spawnTimeRemaining = 0;

let wordFallTime = 10;

let letterBulletTransitionTime = 500;

let mainInterval;

let score = 0;

let totalLettersTyped;
let totalCorrectLetters;

const root = document.querySelector(":root");
const startButton = document.querySelector("#start");
const wordFallSpeedInput = document.querySelector("#wordFallSpeed");
const wordSpawnSpeedInput = document.querySelector("#wordSpawnSpeed");
const playground = document.querySelector(".playground");
const scoreboard = document.querySelector(".scoreboard");
const lostBoard = document.querySelector(".lostBoard");
const restartButton = document.querySelector("#restart");
const homeButton = document.querySelector("#home");

// Event Listeners -------------------------------------------------------

document.querySelector("body").addEventListener('click', changeTheme);
startButton.addEventListener('click', start);
restartButton.addEventListener('click', start);
homeButton.addEventListener('click', showGameIntro);

// Event Handlers --------------------------------------------------------

function changeTheme(e){
   if(e.target != startButton && e.target != wordFallSpeedInput && e.target != wordSpawnSpeedInput && e.target != restartButton && e.target != homeButton){
      if(colorScheme == 'dark'){
         colorScheme = 'light';
         root.style.colorScheme = 'light';
         startButton.style.backgroundColor = 'white';
         startButton.style.color = 'rgb(46, 175, 132)';
      }
      else {
         colorScheme = 'dark';
         root.style.colorScheme = 'dark';
         startButton.style.backgroundColor = 'black';
         startButton.style.color = 'rgb(68, 223, 171)';
      }
   }
}

function start(e){
   for(let i=0; i<wordCreatedNode.length; i++){
      wordCreatedNode[i].remove();
   }

   scoreboard.textContent = '0';

   wordCreatedList = [];

   wordCreatedNode = [];

   playground.innerHTML = '';

   wordListIndex = -1;
   wordIndex = 0;

   isGameOver = false;
   spawnTimeRemaining = 0;
   score = 0;
   totalCorrectLetters = 0;
   totalLettersTyped = 0;

   document.querySelector("body").removeEventListener("click", changeTheme);

   document.querySelector(".gameIntro").style.display = 'none';
   document.querySelector(".containerForBlur").style.display = 'none';
   lostBoard.style.display = "none";
   if(e.target == startButton && wordFallSpeedInput.value != null && wordFallSpeedInput.value != 10) {
      wordFallTime = wordFallSpeedInput.value;
   }
   if(e.target == startButton && wordSpawnSpeedInput.value != null && wordSpawnSpeedInput.value != 2.0) {
      spawnInterval = wordSpawnSpeedInput.value;
   }

   document.addEventListener("keydown", typing);

   clearInterval(mainInterval);

   setTimeout(() => {
      mainInterval = setInterval(controller, 20);
   }, 1000); 
}


function typing(e){
   let temp, tempWord, wordEnd;
   if(e.key != "Shift"){
      totalLettersTyped++;
   }
   if(wordListIndex != -1){
      if(e.key == wordCreatedList[wordListIndex][wordIndex]){
         totalCorrectLetters++;
         shootLetter(e.key, wordCreatedNode[wordListIndex]);
         wordIndex++;
         temp = wordCreatedNode[wordListIndex];
         tempWord = wordCreatedList[wordListIndex].slice(wordIndex);
         wordEnd = false;
         if(wordIndex == wordCreatedList[wordListIndex].length){

            wordEnd = true;

            updateScore(wordCreatedList[wordListIndex].length);
   
            wordCreatedList.splice(wordListIndex, 1);
            wordCreatedNode.splice(wordListIndex, 1);
            wordListIndex = -1;
            wordIndex=0;
         }
         setTimeout(() => {
            temp.textContent = tempWord;
            if(wordEnd){
               temp.remove();
            }
         }, letterBulletTransitionTime + 50)
      }
   }
   else {
      for(let i=0; i<wordCreatedList.length; i++){
         if(e.key == wordCreatedList[i][0]){
            totalCorrectLetters++;
            shootLetter(e.key, wordCreatedNode[i]);
            wordListIndex = i;
            wordIndex++;
            temp = wordCreatedNode[wordListIndex];
            tempWord = wordCreatedList[wordListIndex].slice(wordIndex);
            wordEnd = false
            if(wordIndex == wordCreatedList[wordListIndex].length){
               updateScore(1);
               wordCreatedList.splice(wordListIndex, 1);
               wordCreatedNode.splice(wordListIndex, 1);
               wordListIndex = -1;
               wordIndex=0;
               wordEnd = true;
            }

            setTimeout(() => {
               temp.textContent = tempWord;
               if(wordEnd){
                  temp.remove();
               }
            }, letterBulletTransitionTime + 50)
            break;
         }
      }
   }
}

function showGameIntro(){
   document.querySelector(".gameIntro").style.display = 'inline-block';
   document.querySelector(".containerForBlur").style.display = 'inline-block';
   lostBoard.style.display = "none";
}


// Functions -----------------------------------------------------------

function controller(){
   if(spawnTimeRemaining <=0){
      spawnTimeRemaining = spawnInterval;
      createWord();
   }
   spawnTimeRemaining = spawnTimeRemaining - 0.03;

   checkIfWordReachBottom();
}


function createWord(){
   let word = words[Math.floor(Math.random() * (words.length))];
   wordCreatedList.push(word);
   const wordElem = document.createElement('div');
   wordElem.classList.add("wordContainer");
   wordElem.textContent = word;
   wordElem.style.transition = `all ${wordFallTime}s linear`;
   wordElem.style.left = `${Math.random() * (90)}%`;
   playground.append(wordElem);
   setTimeout(() => {
      wordElem.style.top = `${playground.offsetHeight}px`;
      wordCreatedNode.push(wordElem);
   }, 50)
}

function checkIfWordReachBottom(){
   if(wordCreatedNode[0] != null && wordCreatedNode[0].offsetTop >= playground.offsetHeight-wordCreatedNode[0].offsetHeight){
      wordCreatedNode[0].remove();
      wordCreatedNode.shift();
      wordCreatedList.shift();
      gameOver();
   }
}

function gameOver(){
   if(!isGameOver){
      isGameOver = true;
      document.removeEventListener("keydown", typing);
      document.querySelector("body").addEventListener('click', changeTheme);
      lostBoard.style.display = "inline-block";
      document.querySelector(".containerForBlur").style.display = 'inline-block';
      updateLostBoard();
   }
}

function updateLostBoard(){
   document.querySelector("#currentPoints").textContent = `${score}`;
   document.querySelector("#currentAccuracy").textContent = `${(totalCorrectLetters*100/totalLettersTyped).toFixed(1)}%`;
}

function updateScore(points){
   score += points;
   scoreboard.textContent = score;
}

function shootLetter(letter, wordNode){
   const letterBullet = document.createElement("div");
   letterBullet.classList.add("letterBullet");
   letterBullet.textContent = letter;
   playground.append(letterBullet);
   let fallSpeed = playground.offsetHeight/(wordFallTime*1000);
   let top = wordNode.offsetTop + fallSpeed*(letterBulletTransitionTime+50);
   setTimeout(() => {
      letterBullet.style.top = `${top}px`;
      letterBullet.style.left = `${wordNode.offsetLeft}px`;
      setTimeout(() => {
         letterBullet.remove();
      }, letterBulletTransitionTime)
   }, 50);
}