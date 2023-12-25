'use strict';

document.addEventListener('DOMContentLoaded', () => {
  const gridDisplay = document.querySelector('.grid');
  const scoreDisplay = document.getElementById('score');
  const resultDisplay = document.getElementById('result');
  const newGameButton = document.getElementById('new-game');
  const squares = [];
  const width = 4;
  let score = 0;

  function resetGame() {
    for (let i = 0; i < squares.length; i++) {
      squares[i].innerHTML = 0;
    }
    score = 0;
    scoreDisplay.innerHTML = score;
    resultDisplay.innterHTML = `Join the numbers and get to the <b>2048</b> tile!`;
    generate();
    generate();
  }

  function clearStyles() {
    for (let i = 0; i < squares.length; i++) {
      squares[i].style.backgroundColor = '#afa192'; // Set to the default color
    }
  }

  function handleNewGameClick() {
    resetGame();
    clearStyles();
    addColours();
    document.addEventListener('keyup', control);
  }

  newGameButton.addEventListener('click', handleNewGameClick);

  function createBoard() {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement('div');

      square.innerHTML = '0';
      gridDisplay.appendChild(square);
      squares.push(square);
    }
    generate();
    generate();
  }
  createBoard();

  function generate() {
    const emptySquares = squares.filter(square => square.innerHTML === '0');

    if (emptySquares.length === 0) {
      checkForGameOver();
      checkForWin();

      return;
    }

    const randomIndex = Math.floor(Math.random() * emptySquares.length);

    emptySquares[randomIndex].innerHTML = '2';
    checkForGameOver();
  }

  const BOARD_SIZE = 4;
  const ROW_SIZE = 4;

  function moveRight() {
    for (let i = 0; i < BOARD_SIZE * ROW_SIZE; i++) {
      if (i % 4 === 0) {
        const totalOne = squares[i].innerHTML;
        const totalTwo = squares[i + 1].innerHTML;
        const totalThree = squares[i + 2].innerHTML;
        const totalFour = squares[i + 3].innerHTML;
        const row = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)];

        const filteredRow = row.filter(num => num);
        const missing = ROW_SIZE - filteredRow.length;
        const zeros = Array(missing).fill(0);
        const newRow = zeros.concat(filteredRow);

        squares[i].innerHTML = newRow[0];
        squares[i + 1].innerHTML = newRow[1];
        squares[i + 2].innerHTML = newRow[2];
        squares[i + 3].innerHTML = newRow[3];
      }
    }
  }

  function moveLeft() {
    for (let i = 0; i < BOARD_SIZE * ROW_SIZE; i++) {
      if (i % ROW_SIZE === 0) {
        const totalOne = squares[i].innerHTML;
        const totalTwo = squares[i + 1].innerHTML;
        const totalThree = squares[i + 2].innerHTML;
        const totalFour = squares[i + 3].innerHTML;
        const row = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)];

        const filteredRow = row.filter(num => num);
        const missing = ROW_SIZE - filteredRow.length;

        const zeros = Array(missing).fill(0);

        const newRow = filteredRow.concat(zeros);

        squares[i].innerHTML = newRow[0];
        squares[i + 1].innerHTML = newRow[1];
        squares[i + 2].innerHTML = newRow[2];
        squares[i + 3].innerHTML = newRow[3];
      }
    }
  }

  function moveUp() {
    for (let i = 0; i < ROW_SIZE; i++) {
      const totalOne = squares[i].innerHTML;
      const totalTwo = squares[i + BOARD_SIZE].innerHTML;
      const totalThree = squares[i + (BOARD_SIZE * 2)].innerHTML;
      const totalFour = squares[i + (BOARD_SIZE * 3)].innerHTML;
      const column = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)];

      const filteredColumn = column.filter(num => num);
      const missing = ROW_SIZE - filteredColumn.length;
      const zeros = Array(missing).fill(0);
      const newColumn = filteredColumn.concat(zeros);

      squares[i].innerHTML = newColumn[0];
      squares[i + BOARD_SIZE].innerHTML = newColumn[1];
      squares[i + (BOARD_SIZE * 2)].innerHTML = newColumn[2];
      squares[i + (BOARD_SIZE * 3)].innerHTML = newColumn[3];
    }
  }

  function moveDown() {
    for (let i = 0; i < ROW_SIZE; i++) {
      const totalOne = squares[i].innerHTML;
      const totalTwo = squares[i + BOARD_SIZE].innerHTML;
      const totalThree = squares[i + (BOARD_SIZE * 2)].innerHTML;
      const totalFour = squares[i + (BOARD_SIZE * 3)].innerHTML;
      const column = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)];

      const filteredColumn = column.filter(num => num);
      const missing = 4 - filteredColumn.length;
      const zeros = Array(missing).fill(0);
      const newColumn = zeros.concat(filteredColumn);

      squares[i].innerHTML = newColumn[0];
      squares[i + BOARD_SIZE].innerHTML = newColumn[1];
      squares[i + (BOARD_SIZE * 2)].innerHTML = newColumn[2];
      squares[i + (BOARD_SIZE * 3)].innerHTML = newColumn[3];
    }
  }

  function combineRow() {
    for (let i = 0; i < (BOARD_SIZE * ROW_SIZE) - 1; i++) {
      if (squares[i].innerHTML === squares[i + 1].innerHTML) {
        const combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + 1].innerHTML);

        squares[i].innerHTML = combinedTotal;
        squares[i + 1].innerHTML = '0';
        score += combinedTotal;
        scoreDisplay.innerHTML = score;
      }
    }
    checkForWin();
  }

  function combineColumn() {
    for (let i = 0; i < BOARD_SIZE * (ROW_SIZE - 1); i++) {
      if (squares[i].innerHTML === squares[i + BOARD_SIZE].innerHTML) {
        const combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + BOARD_SIZE].innerHTML);

        squares[i].innerHTML = combinedTotal;
        squares[i + BOARD_SIZE].innerHTML = '0';
        score += combinedTotal;
        scoreDisplay.innerHTML = score;
      }
    }
    checkForWin();
  }

  function control(e) {
    if (e.keyCode === 37) {
      keyLeft();
    } else if (e.keyCode === 38) {
      keyUp();
    } else if (e.keyCode === 39) {
      keyRight();
    } else if (e.keyCode === 40) {
      keyDown();
    }
  }

  document.addEventListener('keyup', control);

  function keyRight() {
    const previousState = getGameState();

    moveRight();
    combineRow();
    moveRight();

    const currentState = getGameState();

    if (!compareStates(previousState, currentState)) {
      generate();
    }
  }

  function keyLeft() {
    const previousState = getGameState();

    moveLeft();
    combineRow();
    moveLeft();

    const currentState = getGameState();

    if (!compareStates(previousState, currentState)) {
      generate();
    }
  }

  function keyUp() {
    const previousState = getGameState();

    moveUp();
    combineColumn();
    moveUp();

    const currentState = getGameState();

    if (!compareStates(previousState, currentState)) {
      generate();
    }
  }

  function keyDown() {
    const previousState = getGameState();

    moveDown();
    combineColumn();
    moveDown();

    const currentState = getGameState();

    if (!compareStates(previousState, currentState)) {
      generate();
    }
  }

  function checkForWin() {
    for (let i = 0; i < squares.length; i++) {
      const value = parseInt(squares[i].innerHTML);

      if (value >= 2048) {
        resultDisplay.innerHTML = 'You WIN';
        document.removeEventListener('keyup', control);
        setTimeout(() => clear(), 3000);
        break; // Stop checking if any cell has a value greater than or equal to 2048
      }
    }
  }

  function checkForGameOver() {
    let zeros = 0;

    for (let i = 0; i < squares.length; i++) {
      if (squares[i].innerHTML === '0') {
        zeros++;
      }
    }

    if (zeros === 0 && !canMove()) {
      resultDisplay.innerHTML = 'You LOSE, try again!';
      document.removeEventListener('keyup', control);
    }
  }

  function canMove() {
    for (let i = 0; i < squares.length; i++) {
      const currentSquare = squares[i].innerHTML;
      const rightSquare = i % width < width - 1 ? squares[i + 1].innerHTML : null;
      const leftSquare = i % width > 0 ? squares[i - 1].innerHTML : null;
      const upSquare = i >= width ? squares[i - width].innerHTML : null;
      const downSquare = i < width * (width - 1) ? squares[i + width].innerHTML : null;

      if (
        currentSquare === rightSquare
        || currentSquare === leftSquare
        || currentSquare === upSquare
        || currentSquare === downSquare
      ) {
        return true;
      }
    }

    return false;
  }

  function clear() {
    clearInterval(myTimer);
  }

  function addColours() {
    for (let i = 0; i < squares.length; i++) {
      const value = squares[i].innerHTML;

      squares[i].style.backgroundColor = value === '0' ? getColor(value) : getColor(value);
      squares[i].style.color = value === '0' ? 'transparent' : 'black'; // Set text color to black for non-zero values
    }
  }

  function getColor(value) {
    const colorMap = {
      '2': '#eee4da',
      '4': '#ede0c8',
      '8': '#f2b179',
      '16': '#ffcea4',
      '32': '#e8c064',
      '64': '#ffab6e',
      '128': '#fd9982',
      '256': '#ead79c',
      '512': '#76daff',
      '1024': '#beeaa5',
      '2048': '#d7d4f0',
    };

    return colorMap[value] || '#afa192';
  }

  function getGameState() {
    return squares.map(square => square.innerHTML);
  }

  function compareStates(state1, state2) {
    return state1.join() === state2.join();
  }

  addColours();

  function updateColors() {
    addColours();

    const currentState = getGameState();
    const previousState = getGameState();

    if (!compareStates(previousState, currentState)) {
      setTimeout(() => {
        generate();
        addColours();
      }, 200); // Adjust the delay as needed
    }
  }

  document.addEventListener('keyup', () => {
    updateColors();
  });

  newGameButton.addEventListener('click', () => {
    updateColors();
  });

  // Add this line to initially update colors
  updateColors();
});
