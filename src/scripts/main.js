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
    resultDisplay.innerHTML = '';
    generate();
    generate();
  }

  function clearStyles() {
    for (let i = 0; i < squares.length; i++) {
      squares[i].style.backgroundColor = '';
    }
  }

  function handleNewGameClick() {
    location.reload();
    resetGame();
    clearStyles();
    addColours();
    document.addEventListener('keyup', control);
  }

  newGameButton.addEventListener('click', handleNewGameClick);

  function createBoard() {
    for (let i = 0; i < width * width; i++) {
      const square = document.createElement('div');

      square.innerHTML = 0;
      gridDisplay.appendChild(square);
      squares.push(square);
    }
    generate();
    generate();
  }
  createBoard();

  function generate() {
    let randomNumber = Math.floor(Math.random() * squares.length);

    while (squares[randomNumber].innerHTML !== '0') {
      randomNumber = Math.floor(Math.random() * squares.length);
    }

    squares[randomNumber].innerHTML = '2';
    checkForGameOver();
  }

  function moveRight() {
    for (let i = 0; i < 16; i++) {
      if (i % 4 === 0) {
        const totalOne = squares[i].innerHTML;
        const totalTwo = squares[i + 1].innerHTML;
        const totalThree = squares[i + 2].innerHTML;
        const totalFour = squares[i + 3].innerHTML;
        const row = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)];

        const filteredRow = row.filter(num => num);
        const missing = 4 - filteredRow.length;
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
    for (let i = 0; i < 16; i++) {
      if (i % 4 === 0) {
        const totalOne = squares[i].innerHTML;
        const totalTwo = squares[i + 1].innerHTML;
        const totalThree = squares[i + 2].innerHTML;
        const totalFour = squares[i + 3].innerHTML;
        const row = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)];

        const filteredRow = row.filter(num => num);
        const missing = 4 - filteredRow.length;
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
    for (let i = 0; i < 4; i++) {
      const totalOne = squares[i].innerHTML;
      const totalTwo = squares[i + width].innerHTML;
      const totalThree = squares[i + (width * 2)].innerHTML;
      const totalFour = squares[i + (width * 3)].innerHTML;
      const column = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)];

      const filteredColumn = column.filter(num => num);
      const missing = 4 - filteredColumn.length;
      const zeros = Array(missing).fill(0);
      const newColumn = filteredColumn.concat(zeros);

      squares[i].innerHTML = newColumn[0];
      squares[i + width].innerHTML = newColumn[1];
      squares[i + (width * 2)].innerHTML = newColumn[2];
      squares[i + (width * 3)].innerHTML = newColumn[3];
    }
  }

  function moveDown() {
    for (let i = 0; i < 4; i++) {
      const totalOne = squares[i].innerHTML;
      const totalTwo = squares[i + width].innerHTML;
      const totalThree = squares[i + (width * 2)].innerHTML;
      const totalFour = squares[i + (width * 3)].innerHTML;
      const column = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)];

      const filteredColumn = column.filter(num => num);
      const missing = 4 - filteredColumn.length;
      const zeros = Array(missing).fill(0);
      const newColumn = zeros.concat(filteredColumn);

      squares[i].innerHTML = newColumn[0];
      squares[i + width].innerHTML = newColumn[1];
      squares[i + (width * 2)].innerHTML = newColumn[2];
      squares[i + (width * 3)].innerHTML = newColumn[3];
    }
  }

  function combineRow() {
    for (let i = 0; i < 15; i++) {
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
    for (let i = 0; i < 12; i++) {
      if (squares[i].innerHTML === squares[i + width].innerHTML) {
        const combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i + width].innerHTML);

        squares[i].innerHTML = combinedTotal;
        squares[i + width].innerHTML = '0';
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
    moveRight();
    combineRow();
    moveRight();
    generate();
  }

  function keyLeft() {
    moveLeft();
    combineRow();
    moveLeft();
    generate();
  }

  function keyUp() {
    moveUp();
    combineColumn();
    moveUp();
    generate();
  }

  function keyDown() {
    moveDown();
    combineColumn();
    moveDown();
    generate();
  }

  function checkForWin() {
    for (let i = 0; i < squares.length; i++) {
      if (squares[i].innerHTML == '2048') {
        resultDisplay.innerHTML = 'You WIN';
        document.removeEventListener('keyup', control);
        setTimeout(() => clear(), 3000);
      }
    }
  }

  function checkForGameOver() {
    let zeros = 0;

    for (let i = 0; i < squares.length; i++) {
      if (squares[i].innerHTML == '0') {
        zeros++;
      }
    }

    if (zeros === 0) {
      resultDisplay.innerHTML = 'You LOSE, try again!';
      document.removeEventListener('keyup', control);
      setTimeout(() => clear(), 30);
    }
  }

  function clear() {
    clearInterval(myTimer);
  }

  function addColours() {
    const colorMap = {
      '0': '#afa192',
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

    for (let i = 0; i < squares.length; i++) {
      const value = squares[i].innerHTML;

      squares[i].style.backgroundColor = colorMap[value] || '#afa192';
    }
  }

  addColours();

  const myTimer = setInterval(addColours, 50);
});
