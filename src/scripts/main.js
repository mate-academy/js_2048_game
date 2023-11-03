'use strict';

// import { Board } from "./classes/board.js";
// import { Card } from './classes/card.js';

// const board = new Board(document.querySelector('.board'));

const BOARD_SIZE = 4;

const board = [];

board.boardElement = document.querySelector('.board');

board.fillBoard = function() {
  const allCells = document.querySelectorAll('.cell');

  for (let i = 0; i < allCells.length; i++) {
    const cell = allCells[i];

    const x = i % BOARD_SIZE;
    const y = Math.floor(i / BOARD_SIZE);

    cell.x = x;
    cell.y = y;

    cell.isEmpty = function() {
      return this.linkCard === null;
    };

    board.push(cell);
  }
};

board.unlinkCards = function() {
  this.forEach(cell => {
    cell.linkCard = null;
  });
};

board.getRandomEmptyCell = function() {
  const emptyCells = this.filter(cell => cell.isEmpty());

  if (emptyCells.length === 0) {
    return;
  }

  const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];

  return randomCell;
};

board.clear = function() {
  this.unlinkCards();

  const cardsToRemove = [...this.boardElement.childNodes]
    .filter(child => child.classList && child.classList.contains('card'));

  cardsToRemove.forEach(card => {
    this.boardElement.removeChild(card);
  });
};

board.spawnCard = function() {
  const randomCell = this.getRandomEmptyCell();

  if (randomCell === undefined) {
    return;
  }

  const card = createCard();

  card.setXY(randomCell.x, randomCell.y);

  randomCell.linkCard = card;

  this.boardElement.appendChild(card);
};

board.isBestCell = function(cell, trgtCoord, direction) {
  switch (direction) {
    case 'Up':
      return cell.x === trgtCoord.x && cell.y < trgtCoord.y && cell.isEmpty();
    case 'Down':
      return cell.x === trgtCoord.x && cell.y > trgtCoord.y && cell.isEmpty();
    case 'Left':
      return cell.y === trgtCoord.y && cell.x < trgtCoord.x && cell.isEmpty();
    case 'Right':
      return cell.y === trgtCoord.y && cell.x > trgtCoord.x && cell.isEmpty();
    default:
      // console.log('Error,'
      //   + 'in shift method you can use'
      //   + 'only this value: Up, Down, Right, Left'
      // );

      return false;
  }
};

board.getLastFreeCell = function(cellWithCard, direction) {
  let targetCoord = {
    x: cellWithCard.x, y: cellWithCard.y,
  };

  let lastFreeCell = null;

  for (const cell of board) {
    if (this.isBestCell(cell, targetCoord, direction)) {
      lastFreeCell = cell;

      targetCoord = {
        x: cell.x, y: cell.y,
      };
    }
  }

  return lastFreeCell;
};

board.getCellsInOrder = function(direction) {
  const boardCopy = [...this];

  switch (direction) {
    case 'Up':
      return boardCopy;
    case 'Down':
      return boardCopy.reverse();
    case 'Left':
      return boardCopy.sort((cell1, cell2) =>
        cell1.y - cell2.y || cell1.x - cell2.x
      );
    case 'Right':
      return boardCopy.sort((cell1, cell2) =>
        cell1.y - cell2.y || cell2.x - cell1.x
      );
    default:
      // console.log('Error,'
      //   + 'in getCellsInOrder method you can use'
      //   + 'only this value: Up, Down, Right, Left'
      // );

      return false;
  }
};

board.swipe = function(direction) {
  const cellInRightOrder = this.getCellsInOrder(direction);

  for (const cell of cellInRightOrder) {
    if (cell.isEmpty()) {
      continue;
    }

    const lastFreeCell = this.getLastFreeCell(cell, direction);

    if (lastFreeCell === null) {
      continue;
    }

    const card = cell.linkCard;

    card.setXY(lastFreeCell.x, lastFreeCell.y);
    lastFreeCell.linkCard = card;
    cell.linkCard = null;
  }
};

function createCard(weight = Math.random() < 0.1 ? 4 : 2) {
  const card = document.createElement('div');

  card.classList.add('card', `card--${weight}`);
  card.textContent = weight;

  card.setXY = function(x, y) {
    this.x = x;
    this.y = y;

    this.style.setProperty('--x', x);
    this.style.setProperty('--y', y);
  };

  return card;
}

function setupControls() {
  switch (event.key) {
    case 'ArrowUp':
      // console.log('Up arrow key was pressed.');
      board.swipe('Up');
      board.spawnCard();
      break;
    case 'ArrowDown':
      // console.log('Down arrow key was pressed.');
      board.swipe('Down');
      board.spawnCard();
      break;
    case 'ArrowLeft':
      // console.log('Left arrow key was pressed.');
      board.swipe('Left');
      board.spawnCard();
      break;
    case 'ArrowRight':
      // console.log('Right arrow key was pressed.');
      board.swipe('Right');
      board.spawnCard();
      break;
    default:
      break;
  }
}

function startGame() {
  board.fillBoard();
  board.unlinkCards();
  board.spawnCard();
  board.spawnCard();

  document.addEventListener('keydown', setupControls);
}

function stopGame() {
  board.clear();
  document.removeEventListener('keydown', setupControls);
}

const startButton = document.querySelector('.tile--button');

startButton.isRestart = false;

startButton.toggle = function() {
  if (this.isRestart) {
    this.classList.remove('tile--button--restart');
    this.classList.add('tile--button--start');
    this.textContent = 'Start';
  } else {
    this.classList.remove('tile--button--start');
    this.classList.add('tile--button--restart');
    this.textContent = 'Restart';
  }

  this.isRestart = !this.isRestart;
};

startButton.addEventListener('click', () => {
  if (startButton.isRestart) {
    stopGame();
    startButton.toggle();
  } else {
    startButton.toggle();
    startGame();
  }
});
