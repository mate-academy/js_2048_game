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
    const cell = createCell(allCells[i], i);

    board.push(cell);
  }
};

board.resetLinkedCards = function() {
  this.forEach(cell => {
    cell.resetLinkedCard();
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
  this.resetLinkedCards();

  const cardsToRemove = [...this.boardElement.childNodes]
    .filter(child => child.classList && child.classList.contains('card'));

  cardsToRemove.forEach(card => {
    this.boardElement.removeChild(card);
  });
};

board.spawnCard = function() {
  const emptyCell = this.getRandomEmptyCell();

  if (emptyCell === undefined) {
    return;
  }

  const card = createCard();

  card.setXY(emptyCell.x, emptyCell.y);

  emptyCell.linkCard = card;

  this.boardElement.appendChild(card);
};

board.firstSpawn = function(amount = 1) {
  for (let i = 0; i < amount; i++) {
    this.spawnCard();
  }
};

board.getGroupForCell = function(cell, direction) {
  if (direction === 'Up' || direction === 'Down') {
    return this
      .filter(cell2 => cell.x === cell2.x)
      .sort((cell1, cell2) => cell1.y - cell2.y);
  }

  if (direction === 'Left' || direction === 'Right') {
    return this
      .filter(cell2 => cell.y === cell2.y)
      .sort((cell1, cell2) => cell1.x - cell2.x);
  }

  throw new Error('Error, in shift method you can use'
    + 'only this value: Up, Down, Right, Left'
  );
};

board.getCellForMerge = function(cellWithCard, direction) {
  const thisGroup = this.getGroupForCell(cellWithCard, direction);

  const cellIndex = thisGroup
    .findIndex(cell => cell.y === cellWithCard.y && cell.x === cellWithCard.x);

  switch (direction) {
    case 'Up':
      for (let y = cellIndex - 1; y >= 0; y--) {
        const cell = thisGroup[y];

        if (cell.isEmpty()) {
          continue;
        }

        if (cellWithCard.canMergeWith(cell)) {
          return cell;
        } else {
          break;
        }
      }
      break;
    case 'Down':
      for (let y = cellIndex + 1; y < thisGroup.length; y++) {
        const cell = thisGroup[y];

        if (cell.isEmpty()) {
          continue;
        }

        if (cellWithCard.canMergeWith(cell)) {
          return cell;
        } else {
          break;
        }
      }
      break;
    case 'Left':
      for (let x = cellIndex - 1; x >= 0; x--) {
        const cell = thisGroup[x];

        if (cell.isEmpty()) {
          continue;
        }

        if (cellWithCard.canMergeWith(cell)) {
          return cell;
        } else {
          break;
        }
      }
      break;
    case 'Right':
      for (let x = cellIndex + 1; x < thisGroup.length; x++) {
        const cell = thisGroup[x];

        if (cell.isEmpty()) {
          continue;
        }

        if (cellWithCard.canMergeWith(cell)) {
          return cell;
        } else {
          break;
        }
      }
      break;
    default:
      throw new Error('Error, in shift method you can use'
        + 'only this value: Up, Down, Right, Left'
      );
  }

  return null;
};

board.isCellOnPath = function(cell, target, direction) {
  if (!cell.isEmpty()) {
    return false;
  }

  switch (direction) {
    case 'Up':
      return cell.x === target.x && cell.y < target.y;
    case 'Down':
      return cell.x === target.x && cell.y > target.y;
    case 'Left':
      return cell.y === target.y && cell.x < target.x;
    case 'Right':
      return cell.y === target.y && cell.x > target.x;
    default:
      throw new Error('Error, in shift method you can use'
        + 'only this value: Up, Down, Right, Left'
      );
  }
};

board.getCellForMove = function(cellWithCard, direction) {
  let targetCoords = {
    x: cellWithCard.x, y: cellWithCard.y,
  };
  let lastFreeCell = null;

  for (const cell of this) {
    if (this.isCellOnPath(cell, targetCoords, direction)) {
      lastFreeCell = cell;

      targetCoords = {
        x: cell.x, y: cell.y,
      };
    }
  }

  return lastFreeCell;
};

board.getCellsInOrder = function(direction) {
  const sortedCells = [...this];

  switch (direction) {
    case 'Up':
      return sortedCells;
    case 'Down':
      return sortedCells.reverse();
    case 'Left':
      return sortedCells.sort((cell1, cell2) =>
        cell1.y - cell2.y || cell1.x - cell2.x
      );
    case 'Right':
      return sortedCells.sort((cell1, cell2) =>
        cell1.y - cell2.y || cell2.x - cell1.x
      );
    default:
      throw new Error('Error,'
        + 'in getCellsInOrder method you can use'
        + 'only this value: Up, Down, Right, Left'
      );
  }
};

board.getTargetCell = function(startCell, direction) {
  return this.getCellForMerge(startCell, direction)
    || this.getCellForMove(startCell, direction);
};

board.swipe = function(direction) {
  const cellsWithCard = this
    .getCellsInOrder(direction)
    .filter(cell => !cell.isEmpty());
  let needSpawn = false;

  for (const cell of cellsWithCard) {
    const targetCell = this.getTargetCell(cell, direction);

    if (targetCell === null) {
      continue;
    }

    needSpawn = true;

    if (targetCell.canMergeWith(cell)) {
      targetCell.mergeWith(cell);
      targetCell.wasMerged = true;
      continue;
    }

    const card = cell.linkCard;

    card.setXY(targetCell.x, targetCell.y);
    targetCell.linkCard = card;
    cell.resetLinkedCard();
  }

  this.forEach(cell => {
    cell.wasMerged = false;
  });

  if (needSpawn) {
    this.spawnCard();
  }
};

function createCell(cell, i) {
  const x = i % BOARD_SIZE;
  const y = Math.floor(i / BOARD_SIZE);

  cell.x = x;
  cell.y = y;
  cell.wasMerged = false;

  cell.isEmpty = function() {
    return this.linkCard === null;
  };

  cell.canMergeWith = function(cell2) {
    return !this.isEmpty() && !cell2.isEmpty()
    && this.linkCard.weight === cell2.linkCard.weight;
  };

  cell.mergeWith = function(cell2) {
    const card = this.linkCard;

    card.setWeight(card.weight * 2);

    cell2.linkCard.setXY(card.x, card.y);

    cell2.linkCard.remove();
    cell2.resetLinkedCard();

    card.playAnimation('cardMerge');
  };

  cell.resetLinkedCard = function() {
    this.linkCard = null;
  };

  cell.resetLinkedCard();

  return cell;
}

const ANIMATION_DURATION = 300;

function createCard(weight = Math.random() < 0.1 ? 4 : 2) {
  const card = document.createElement('div');

  card.setXY = function(x, y) {
    this.x = x;
    this.y = y;

    this.style.setProperty('--x', x);
    this.style.setProperty('--y', y);
  };

  card.setWeight = function(newWeight) {
    this.weight = newWeight;
    card.className = '';
    card.classList.add(`card`, `card--${newWeight}`);
    card.textContent = newWeight;
  };

  card.remove = function() {
    this.parentNode.removeChild(this);
  };

  card.playAnimation = function(AnimationName, duration = ANIMATION_DURATION) {
    this.style.animation = `${AnimationName} ${duration}ms`;

    setTimeout(() => {
      this.style.animation = '';
    }, duration);
  };

  card.setWeight(weight);

  card.playAnimation('cardCreation');

  return card;
}

function handleKeyPress() {
  switch (event.key) {
    case 'ArrowUp':
      board.swipe('Up');
      break;
    case 'ArrowDown':
      board.swipe('Down');
      break;
    case 'ArrowLeft':
      board.swipe('Left');
      break;
    case 'ArrowRight':
      board.swipe('Right');
      break;
    default:
      break;
  }
}

board.fillBoard();

function startGame() {
  startButton.toggle();
  board.resetLinkedCards();
  board.firstSpawn(2);
  // console.log(board);

  document.addEventListener('keydown', handleKeyPress);
}

function stopGame() {
  startButton.toggle();
  board.clear();
  document.removeEventListener('keydown', handleKeyPress);
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
  } else {
    startGame();
  }
});
