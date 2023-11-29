'use strict';

const gameField = Array(4).fill(null).map(() => Array(4).fill(""));

function startGame() {
  draw();
  addNumber();
  addNumber();
}

function draw() {
  let gameBoard = document.querySelector('.game-field');
  gameBoard.innerHTML = '';
  for (let i = 0; i < 4; i++) {
    let row = document.createElement('tr');
    for (let j = 0; j < 4; j++) {
      let cell = document.createElement('td');
      cell.innerHTML = gameField[i][j];
      cell.className = `field-cell field-cell--${gameField[i][j]}`;
      row.appendChild(cell);
    }
    gameBoard.appendChild(row);
  }
}

function addNumber() {
  let emptyCells = [];
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (!gameField[i][j]) {
        emptyCells.push({i: i, j: j});
      }
    }
  }
  if (emptyCells.length) {
    let {i, j} = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    gameField[i][j] = Math.random() < 0.1 ? 4 : 2;
    draw();
  }
}

document.addEventListener('keydown', function(e) {
  switch (e.key) {
    case 'ArrowUp':
      // Move up
      break;
    case 'ArrowDown':
      // Move down
      break;
    case 'ArrowLeft':
      // Move left
      break;
    case 'ArrowRight':
      // Move right
      break;
  }
});

window.onload = startGame;
