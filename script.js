const container = document.querySelector('.container');
const squareCtr = document.querySelector('.square-container');

const startButton = document.getElementById('start');
const strictButton = document.getElementById('strict');
const powerButton = document.getElementById('power');
const screen = document.querySelector('.screen');

const errorSound = document.querySelector('[data-sound="error"]');

const squares = Array.from(container.querySelectorAll('.square'));
const levelBars = Array.from(container.querySelectorAll('.bar'));

let userInput = [];
let computerInput = [];
let userTurn = false;
let id, color, level = 0;
const numOfLevels = 20;



//start button event
startButton.addEventListener('click', function() {
  if(powerButton.classList.contains('power--active') && level < 2) {
    this.classList.toggle('start--active');
    startLevel();
  }
});


//power switch
powerButton.addEventListener('click', function() {
  this.classList.toggle('power--active');
  squareCtr.classList.toggle('square-container--active');
  if(!this.classList.contains('power--active')) {
    start.classList.remove('start--active');
    strict.classList.remove('strict--active');
    strict.previousSibling.parentNode.previousSibling.classList.remove('p--active');
    level = 0;
    levelBars.forEach(bar=> {
      bar.classList.remove('bar--active');
    });
    screen.textContent = "--";
    userInput = [];
    computerInput = [];
  }
});


//strict button event
strictButton.addEventListener('click', function() {
  if(powerButton.classList.contains('power--active')) {
    this.classList.toggle('strict--active');
    this.previousSibling.parentNode.previousSibling.classList.toggle('p--active');
  }
})


//User input addEventListener
squares.forEach((square) => {
  square.addEventListener('click', userClick);
});


// start game sequence
function startLevel() {
  level++;
  screen.textContent = level;
  let currentBar = document.querySelector(`.b${level}`);
  currentBar.classList.add('bar--active');
  randomNumber();
  let i = 0;
  //start interval. every one second change the ID to the corresponding 'i' element in computerInput Array, then call animate on that id. and every interval add 1 to i so you get next item in array. When i reaches length of the computerInput array clear the interval.
  var interval = setInterval(function() {
    //disable userClick while animating computerInput.
    disableSquares();
    id = computerInput[i];
    animate(id);
    i++;
    if(i === computerInput.length) {
      clearInterval(interval);
      //when computer sequence complete re-enable userClick;
      enableSquares();
    }
  }, 1000);
}



//user input
function userClick() {
  if(powerButton.classList.contains('power--active') ) {
    id = this.dataset.key;
    userInput.push(parseFloat(id));
    //checking end of sequence
    compareMatch();
    //animate(id);
    if(userInput.length === computerInput.length && userInput.length < numOfLevels) {
      userInput = [];
      setTimeout(function(){
        startLevel();
      },1000);
      //startLevel();
    }
    //winner?
    if(userInput.length === numOfLevels) {
      screen.textContent = 'WINNER!';
      startLevel();
      //continuePlay();
    }
  }
}



//compare
function compareMatch() {
  let clickError;
  for(let i = 0; i < userInput.length; i++) {
    if(userInput[i] !== computerInput[i]) {
       clickError = true;
    }
  }
  if(clickError === true) {
    disableSquares();
    matchError();
  } else {
    animate(id);
  }
}

//disableSquares
function disableSquares() {
  squares.forEach(square=>{
    square.disabled = true;
  })
}

//enableSquares
function enableSquares() {
  squares.forEach(square=>{
    square.removeAttribute('disabled');
  })
}


//match errror;
function matchError() {
  animateError();
  screen.textContent = level;
  screen.style.color = 'red';
  setTimeout(()=> {
    screen.textContent = level;
    screen.style.color = '#fff';
  },1000);
  //if strict is on reset
  if (strictButton.classList.contains('strict--active')) {
    userInput = [];
    computerInput = [];
    level = 0;
    levelBars.forEach(bar=> {
      bar.classList.remove('bar--active');
    });
      startLevel();
  } else {
    //replay computerInput
    let i = 0;
    var interval = setInterval(function() {
      id = computerInput[i];
      animate(id);
      i++;
      if(i === computerInput.length) {
        clearInterval(interval);
        enableSquares();
      }
    }, 1000);
    userInput = [];
    //end replay
  }
}


//animate the color and sound when square is active
function animate(id) {
  let currentSquare = document.querySelector(`[data-key="${id}"]`);
  currentSquare.style.opacity = '1.0';

  playSound(id);

  setTimeout(function() {
    currentSquare.style.opacity = '0.5';
  }, 500);
}


// playSound function
function playSound(id) {
  const sounds = document.querySelectorAll('audio');
  sounds.forEach(sound => sound.currentTime = 0);
  let currentSound = document.querySelector(`[data-sound="${id}"]`);
  currentSound.play();
}


//error sound fart
function animateError() {
  errorSound.playbackRate = 2;
  errorSound.play();
  errorSound.currentTime = 0;
}

//generate random number
function randomNumber() {
  let randomNum = (Math.floor(Math.random() * 4) + 1);
  computerInput.push(randomNum);
}
