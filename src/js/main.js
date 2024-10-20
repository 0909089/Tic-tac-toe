
let isPlayerOne = NaN;
let playerOneScore = localStorage.getItem('player_one');
let playerTwoScore = localStorage.getItem('player_two');
let player_one = document.querySelector('.player-1-score span.score');
let player_two = document.querySelector('.player-2-score span.score');

let noOfTimesSamePlaceSelected = 0;

let board;

let selectedBoardBox = 0;

function setSymbol(element){

  let option = "";
  let elementColor = "";
  
  if (!element.getAttribute("set")) {

    if (isPlayerOne) {
      option = "x";
      elementColor = "red";
    }
    else{
      option = "0";
      elementColor = "lightgreen";
    }
    
    element.innerText = option;
    element.style.backgroundColor = elementColor;
    element.setAttribute("set", true);
    isPlayerOne = !isPlayerOne;
    setTurnMessage();

    let id = element.getAttribute('data-id');

    board[id] = (option == "x") ? 1: 0;

  }else {
    showGifs();
    noOfTimesSamePlaceSelected++;
  }

  let counterHypen = 0;
  for (let i = 0; i < board.length; i++) {
    if (board[i] == "-") counterHypen++;
  }

  selectedBoardBox = board.length - counterHypen;

  console.log(selectedBoardBox);

  if (selectedBoardBox > 4) {
    if (checkWin("x")) {
      localStorage.setItem('player_one', 1 + Number(localStorage.getItem('player_one'))); // x -> 1
      makeBoard();
      showGifs(true);
    }
    else if (checkWin("o")) { // o -> 0
      localStorage.setItem('player_two', 1 + Number(localStorage.getItem('player_two')));
      makeBoard();
      showGifs(true);
    }
  }
  setDetails();
}

function setDetails() {
  player_one.innerText = localStorage.getItem('player_one');
  player_two.innerText = localStorage.getItem('player_two');
}

function setTurnMessage() {
  let whomTurnMessage = document.querySelector("span.whom-turn");
  if (isPlayerOne)
    whomTurnMessage.innerText = "X";
  else
    whomTurnMessage.innerText = "O";
  
} 

function drawSymbol(button) {
  setSymbol(button);
}

function makePlayerTurn() {
  const choice = Math.round(Math.random());

  if (choice == 0) isPlayerOne = true;
  else isPlayerOne = false;

  setTurnMessage();

}

function newGame() {
  localStorage.clear();
  window.location.reload();
  makePlayerTurn();
}

window.onload = ()=> {

  makePlayerTurn();
  makeBoard();

  localStorage.setItem('player_one', 
    (localStorage.getItem('player_one') == null) ? 0: localStorage.getItem('player_one')
  );
  localStorage.setItem('player_two', 
    (localStorage.getItem('player_two') == null) ? 0: localStorage.getItem('player_two')
  );

  player_one.innerText = playerOneScore;
  player_two.innerText = playerTwoScore;

}

function makeBoard() {
  board = [
    '-', '-', '-',
    '-', '-', '-',
    '-', '-', '-',
  ]
  let gameBoard = document.querySelector('.game-board');
  const reset = ()=> {
    gameBoard.innerHTML = "";
    noOfTimesSamePlaceSelected = 0;
    selectedBoardBox = 0;
  }
  reset();
  let counter = 0;

  for (let i = 0; i < board.length; i++) {
      let button = `<button data-id=${i} class="btn" onclick="drawSymbol(this)">${board[i]}</button>`;
      gameBoard.innerHTML += button;
      counter+=1;
  }

}

function showGifs(winning) {
  let gifContainer = document.querySelector(".gif-container");
  let body = document.querySelector('body');
  let gameBoard = document.querySelector('.game-container');

  const gifs = [
    "src/assets/gifs/tenor-1265180858.gif",
    "src/assets/gifs/mr-bean-frustrated.gif",
    "src/assets/gifs/giphy-3780841550.gif",
  ];

  if (noOfTimesSamePlaceSelected == 3) noOfTimesSamePlaceSelected = 0;

  let img = `<img src="${gifs[noOfTimesSamePlaceSelected]}" width="100%" height="100%">`;
  
  gifContainer.innerHTML = img;;

  gifContainer.style.display = "block";
  body.style.backgroundColor = "red";
  gameBoard.style.display = "none";

  if (winning) {
    window.location.href = "winning.html";
  }

  setTimeout(()=> {
    body.style.backgroundColor = "#2d3e50";
    gifContainer.setAttribute("src", "");
    gifContainer.style.display = "none";
    gameBoard.style.display = "flex";
  }, 3000);

}

function checkWin(elem_id) {
  const player = (elem_id == "x") ? 1: 0;
  let wonStatus = false;


  // Horizontal - ROW wise

  if (board[0] == player && board[1] == player && board[2] == player) {
    wonStatus = true;
  } else if (board[3] == player && board[4] == player && board[5] == player) {
    wonStatus = true;
  } else if (board[6] == player && board[7] == player && board[8] == player) {
    wonStatus = true;
  } 

  // Vertical - COLUMN wise

  if (board[0] == player && board[3] == player && board[6] == player) {
    wonStatus = true;
  } else if (board[1] == player && board[4] == player && board[7] == player) {
    wonStatus = true;
  } else if (board[2] == player && board[5] == player && board[8] == player) {
    wonStatus = true;
  } 

  // Diagonal wise
  if (board[0] == player && board[4] == player && board[8] == player) {
    wonStatus = true;
  }else if (board[2] == player && board[4] == player && board[6] == player) {
    wonStatus = true;
  }

  if(selectedBoardBox == 9 && wonStatus == false) {
    document.querySelector('.game-board').style.display = "none";
    document.querySelector('.draw-game').style.display = "flex";
  }

  if (wonStatus) localStorage.setItem("winner", player);

  return wonStatus;
}