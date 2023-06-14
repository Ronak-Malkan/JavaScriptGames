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

let mainInterval;

const root = document.querySelector(":root");
const startButton = document.querySelector("#start");
const wordFallSpeedInput = document.querySelector("#wordFallSpeed");
const wordSpawnSpeedInput = document.querySelector("#wordSpawnSpeed");
const playground = document.querySelector(".playground");

// Event Listeners -------------------------------------------------------

document.querySelector("body").addEventListener('click', changeTheme);
startButton.addEventListener('click', start);


// Event Handlers --------------------------------------------------------

function changeTheme(e){
   if(e.target != startButton && e.target != wordFallSpeedInput && e.target != wordSpawnSpeedInput){
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

function start(){
   document.querySelector(".gameIntro").style.display = 'none';
   document.querySelector(".containerForBlur").style.display = 'none';
   if(wordFallSpeedInput.value != null && wordFallSpeedInput.value != 10) {
      wordFallTime = wordFallSpeedInput.value;
   }
   if(wordSpawnSpeedInput.value != null && wordSpawnSpeedInput.value != 2.0) {
      spawnInterval = wordSpawnSpeedInput.value;
   }

   document.addEventListener("keydown", typing);

   setTimeout(() => {
      mainInterval = setInterval(controller, 20);
   }, 1000)
}


function typing(e){
   if(wordListIndex != -1){
      if(e.key == wordCreatedList[wordListIndex][wordIndex]){
         wordIndex++;
         wordCreatedNode[wordListIndex].textContent = wordCreatedList[wordListIndex].slice(wordIndex);
      }
      console.log(wordCreatedList[wordListIndex] ,wordCreatedList[wordListIndex].length);
      if(wordIndex == wordCreatedList[wordListIndex].length){
         wordCreatedNode[wordListIndex].remove();
         wordCreatedList.splice(wordListIndex, 1);
         wordCreatedNode.splice(wordListIndex, 1);
         wordListIndex = -1;
         wordIndex=0;
      }
   }
   else {
      for(let i=0; i<wordCreatedList.length; i++){
         if(e.key == wordCreatedList[i][0]){
            wordListIndex = i;
            wordIndex++;
            wordCreatedNode[wordListIndex].textContent = wordCreatedList[wordListIndex].slice(wordIndex);
            if(wordIndex == wordCreatedList[wordListIndex].length){
               wordCreatedNode[wordListIndex].remove();
               wordCreatedList.splice(wordListIndex, 1);
               wordCreatedNode.splice(wordListIndex, 1);
               wordListIndex = -1;
               wordIndex=0;
            }
            break;
         }
      }
   }
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
   if( !isGameOver && wordCreatedNode[0] != null && wordCreatedNode[0].offsetTop >= playground.offsetHeight-wordCreatedNode[0].offsetHeight){
      gameOver();
   }
}

function gameOver(){
   isGameOver = true;
}

