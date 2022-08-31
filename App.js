const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.querySelectorAll(selector)

// const playerOne = document.getElementById('select-player-1')
// const playerTwo = document.getElementById('select-player-2')
const playerOne = $('#select-player-1')
const playerTwo = $('#select-player-2')
const gameSelection = $('.game-selection')
const gameBoard = $('.game-board')
const winner = $('.game-winner')
const cells = $$('.game-cell')
const playAgain = $$('.game-reset')

let user;
let computer;
const winCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 4, 8], [6, 4, 2], [2, 5, 8], [1, 4, 7], [0, 3, 6]]
const players = [playerOne, playerTwo]
const boardGame = Array.from(Array(9).keys());

players.forEach((player) => player.addEventListener('click', () => startGame(player)))
playAgain.forEach((player) => player.addEventListener('click', () => startGame(player)))

const selectPlayer = (player) => {
  for (const cell of cells) {
    cell.addEventListener('click', handleClick, false)
  }
  // winner.classList.remove('fadeIn');
  // winner.classList.add('fadeOut');
  // setTimeout(() => { winner.style.display = 'none' }, 290);

  gameSelection.style.display = 'none';
  gameSelection.classList.add('fadeIn');
  setTimeout(() => { gameSelection.style.display = 'none' }, 500);

  gameBoard.style.display = 'block';
  gameBoard.classList.remove('fadeIn');
  gameBoard.classList.add('fadeOut');
  setTimeout(() => { gameBoard.style.display = 'block' }, 290);


  // console.log(player)
  // if (player === '✖') console.log(player)
  // if (player === '✖') turn(spot(), player)
  // cells.forEach((cell) => cell.addEventListener('click', handleClick, false))

}

const turn = (spaceId, player) => {
  console.log(player, 'desde turn')
  boardGame[spaceId] = player;
  // $(`#${spaceId}`).innerHTML = player;
  document.getElementById(spaceId).innerHTML = player;
  const gameWon = hasWinner(boardGame, player)
  if (gameWon) gameOver(gameWon)
  isTie()
}

const startGame = (player) => {
  // boardGame = Array.from(Array(9).keys());
  winner.classList.remove('fadeIn');
  winner.classList.add('fadeOut');
  setTimeout(() => { winner.style.display = 'none' }, 0);

  const { textContent } = player;
  console.log(minMax(boardGame, computer), 'start game')
  if (textContent === '✖') {
    user = '✖'
    computer = 'O'
    selectPlayer(user)
    turn(minMax(boardGame, computer).index, user)
  }
  user = 'O'
  computer = '✖'
  selectPlayer(user)



  // gameSelection.style.display = 'none';
  // gameSelection.classList.add('fadeIn');
  // setTimeout(() => { gameSelection.style.display = 'none' }, 290);

  // gameBoard.style.display = 'block';
  // gameBoard.classList.remove('fadeIn');
  // gameBoard.classList.add('fadeOut');
  // setTimeout(() => { gameBoard.style.display = 'block' }, 290);

  // for (const cell of cells) {
  //   cell.innerHTML = '';
  //   cell.style.color = '#000';
  //   cell.style.background = '#ff9eb150';
  // }
}


const handleClick = (gameSpace) => {
  const { id } = gameSpace.target
  // console.log(minMax(gameBoard, computer).index)
  if (typeof boardGame[id] === 'number') {
    turn(id, user)
    if (!hasWinner(boardGame, user) && !isTie()) {
      setTimeout(() => {
        turn(minMax(boardGame, computer).index, computer)
      }, 500);
    }
  }
}

const gameOver = gameWon => {
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.color = '#FFF';
    document.getElementById(index).style.backgroundColor = '#B33951';
  }

  for (let cell of cells) {
    cell.removeEventListener('click', handleClick, false);
  }

  declareWinner(gameWon.player === user ? "You Won The Game!" : "Computer Won The Game!");
}

const declareWinner = message => {
  winner.querySelector('h4').innerHTML = message;

  setTimeout(() => {

    gameBoard.classList.remove('fadeIn');
    gameBoard.classList.add('fadeOut');
    setTimeout(() => { gameBoard.style.display = 'none' }, 290);

    winner.classList.add('fadeIn');
    setTimeout(() => { winner.style.display = 'block' }, 290);

  }, 1500);
}

const isTie = () => {
  if (emptySquares().length === 0) {
    gameSelection.classList.remove('fadeOut');

    for (let cell of cells) {
      cell.style.backgroundColor = "#B33951";
      cell.removeEventListener('click', handleClick, false);
    }

    declareWinner("The Game Is Tie!");
    return true;
  }

  return false;
}


const hasWinner = (board, player) => {
  const spaces = board.reduce((acc, ele, idx) => (ele === player) ? acc.concat(idx) : acc, []);
  let gameWon = null;

  for (let [index, winComboSpaces] of winCombos.entries()) {
    if (winComboSpaces.every(elem => spaces.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }

  return gameWon;
}
const emptySquares = () => boardGame.filter((elm, i) => i === elm);

const minMax = (testBoard, player) => {
  // console.log('aqui entra')
  const openSpaces = emptySquares();
  const moves = [];
  let bestMove;
  let bestScore;

  if (hasWinner(testBoard, user)) return { score: -10 };
  else if (hasWinner(testBoard, computer)) return { score: 10 };
  else if (openSpaces.length === 0) return { score: 0 };

  for (let i = 0; i < openSpaces.length; i++) {
    const move = {};
    move.index = testBoard[openSpaces[i]];
    testBoard[openSpaces[i]] = player;
    console.log(minMax(testBoard, user))

    if (player === computer) move.score = minMax(testBoard, user)?.score;
    else move.score = minMax(testBoard, computer)?.score;

    testBoard[openSpaces[i]] = move.index;

    if ((player === computer && move.score === 10) || (player === user && move.score === -10))
      return move;
    else moves.push(move)
  }

  const checkScore = (array, bestScoreValue) => {
    bestScore = bestScoreValue
    for (let i = 0; i < array.length; i++) {
      if (array[i].score > bestScore) {
        bestScore = array[i].score;
        bestMove = i;
      }
    }
  }
  if (player === computer) checkScore(moves, -1000);
  else checkScore(moves, 1000);
  return moves[bestMove];

  // if (player === computer) {
  //   // bestScore = -1000;
  //   // for (let i = 0; i < moves.length; i++) {
  //   //   if (moves[i].score > bestScore) {
  //   //     bestScore = moves[i].score;
  //   //     bestMove = i;
  //   //   }
  //   // }
  //   ciclofor(moves, -1000)

  // } else {
  //   ciclofor(moves, 1000)
  //   // bestScore = 1000;
  //   // for (let i = 0; i < moves.length; i++) {
  //   //   if (moves[i].score < bestScore) {
  //   //     bestScore = moves[i].score;
  //   //     bestMove = i;
  //   //   }
  //   // }

  // }
}

