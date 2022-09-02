const $ = (selector) => document.querySelector(selector)
const $$ = (selector) => document.getElementById(selector)

const playerOne = $('#select-player-1')
const playerTwo = $('#select-player-2')
const gameSelection = $('.game-selection')
const gameBoard = $('.game-board')
const winner = $('.game-winner')
const playAgain = $('.play-again')
const resetGame = $('.game-reset')
const cells = document.querySelectorAll('.game-cell')
const players = [playerOne, playerTwo]
const winCombos = [
  [0, 3, 6],
  [0, 4, 8],
  [3, 4, 5],
  [0, 1, 2],
  [6, 7, 8],
  [2, 5, 8],
  [1, 4, 7],
  [2, 4, 6],
]

let user
let computer
let boardGame
let isUndefined = false

players.forEach((player) => player.addEventListener('click', () => selectPlayer(player)))
resetGame.addEventListener('click', () => {
  for (const cell of cells) {
    cell.innerHTML = ''
  }
  selectPlayer(computer)
})
playAgain.addEventListener('click', () => {
  addClasslistAndSetTime('fadeOut', winner, 'none', 0)
  addClasslistAndSetTime('fadeIn', gameSelection, 'block', 300)

  for (const cell of cells) {
    cell.innerHTML = ''
  }
})

const addClasslistAndSetTime = (effect, element, display, time) => {
  element.classList.add(effect)
  return setTimeout(() => { element.style.display = display }, time)
}

// const ramdomNumberMinMax = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

const selectPlayer = (player) => {
  const span = `<span class='dot big-dot'></span>`
  const { textContent } = player
  user = (textContent === '✖') ? '✖' : span
  computer = (user === '✖') ? span : '✖'
  boardGame = Array.from(Array(9).keys())

  for (const cell of cells) {
    cell.classList.add('center')
    cell.addEventListener('click', handleClick, false)
  }

  if (computer === '✖') turn(minMax(boardGame, computer)?.index, computer)
  startGame()
  addClasslistAndSetTime('fadeOut', gameSelection, 'none', 0)
  addClasslistAndSetTime('fadeIn', gameBoard, 'block', 300)
}

const startGame = () => {
  addClasslistAndSetTime('fadeOut', winner, 'none', 0)
  addClasslistAndSetTime('fadeOut', gameBoard, 'block', 300)
  addClasslistAndSetTime('fadeIn', gameSelection, 'none', 0)

  for (const cell of cells) {
    cell.style.color = '#000'
    cell.style.background = 'linear-gradient(130deg, #005f9eb3 0%, #00111cb3 30%, #00111cb3 70%, #005f9eb3 100%)'
  }
}

const turn = (spaceId, player) => {
  boardGame[spaceId] = player
  // console.log(spaceId)
  // console.log(emptySquares())
  $$(spaceId).innerHTML = player
  const gameWon = hasWinner(boardGame, player)
  if (gameWon) gameOver(gameWon)
  else {
    isTie()
  }
}

const handleClick = (event) => {
  const { id } = event.target
  if (typeof boardGame[id] === 'number') {
    turn(id, user)
    if (!hasWinner(boardGame, user) && !isTie()) {
      setTimeout(() => {
        turn(minMax(boardGame, computer)?.index, computer)
      }, 500)
    }
  }
}

const gameOver = gameWon => {
  for (let idx of winCombos[gameWon.index]) {
    $$(idx).style.color = '#fff'
    $$(idx).style.backgroundColor = '#B33951'
  }

  for (let cell of cells) {
    cell.removeEventListener('click', handleClick, false)
  }
  const gameWinner = gameWon.player === user
    ? "You Won The Game!"
    : "Computer Won The Game!"
  declareWinner(gameWinner)
}

const declareWinner = message => {
  winner.querySelector('h4').innerHTML = message

  setTimeout(() => {
    addClasslistAndSetTime('fadeOut', gameBoard, 'none', 0)
    addClasslistAndSetTime('fadeIn', winner, 'block', 300)
  }, 1500)
}

const isTie = (exception = false) => {
  if (emptySquares().length === 0 || exception) {
    gameSelection.classList.remove('fadeOut')
    for (let cell of cells) {
      cell.style.background = 'linear-gradient(130deg, #005e9c 0%, #00111c 30%, #00111c 70%, #005e9c 100%)'
      cell.removeEventListener('click', handleClick, false)
    }
    declareWinner("The Game Is Tie!")
    return true
  }
  return false
}

const hasWinner = (board, player) => {
  const spaces = board.reduce((acc, ele, idx) => (ele === player) ? acc.concat(idx) : acc, [])
  let gameWon = null

  for (let [index, winComboSpaces] of winCombos.entries()) {
    if (winComboSpaces.every(elem => spaces.indexOf(elem) > -1)) {
      gameWon = { index, player }
      break
    }
  }
  return gameWon
}
const emptySquares = () => boardGame.filter((elm, i) => i === elm)

const minMax = (testBoard, player) => {
  // console.log(testBoard);
  const openSpaces = emptySquares()
  const moves = []
  let bestMove
  let bestScore

  if (hasWinner(testBoard, user)) return { score: -10 }
  else if (hasWinner(testBoard, computer)) return { score: 10 }
  else if (openSpaces.length === 0) return { score: 0 }

  for (let i = 0; i < openSpaces.length; i++) {
    const move = {}
    move.index = testBoard[openSpaces[i]]
    testBoard[openSpaces[i]] = player

    if (player === computer) move.score = minMax(testBoard, user)?.score // check this
    else move.score = minMax(testBoard, computer)?.score // check this 

    testBoard[openSpaces[i]] = move.index

    if ((player === computer && move.score === 10) || (player === user && move.score === -10))
      return move
    moves.push(move)
  }

  // console.log(moves)

  const checkScore = (array, bestScoreValue) => {
    console.log(array);
    console.log(array[0].score > bestScore);
    bestScore = bestScoreValue
    for (let i = 0; i < array.length; i++) {
      if (array[i].score > bestScore) {
        bestScore = array[i].score
        bestMove = i
      }
    }
  }
  console.log(bestMove)

  if (player === computer) checkScore(moves, -1000)
  else checkScore(moves, 1000)
  // console.log(moves)
  return moves[bestMove]
}
