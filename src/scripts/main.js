'use strict';

const { Field } = require('./Field');
const { Block } = require('./Block');

const gameField = document.querySelector('.game-field');
let field = new Field(gameField);
const score = document.querySelector('.game-score');
let currentScore = 0;

const startMessage = document.querySelector('.message-start');
const loseMessage = document.querySelector('.message-lose');
const winMessage = document.querySelector('.message-win');
const startButton = document.querySelector('.start');

const allowMove = () => {
  window.addEventListener('keydown', handleMove, { once: true });
};

const resetGame = () => {
  while (gameField.firstChild) {
    gameField.removeChild(gameField.lastChild);
  }

  field = new Field(gameField);
  currentScore = 0;
  score.textContent = currentScore;
};

const onStart = () => {
  if (startButton.textContent === 'Restart') {
    if (!loseMessage.classList.contains('hidden')) {
      loseMessage.classList.add('hidden');
    }

    if (!winMessage.classList.contains('hidden')) {
      winMessage.classList.add('hidden');
    }

    resetGame();
  } else {
    startMessage.classList.add('hidden');
    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.textContent = 'Restart';
  }

  field.randomEmptyCell.block = new Block(gameField);
  field.randomEmptyCell.block = new Block(gameField);
  allowMove();
};

startButton.addEventListener('click', onStart);

startButton.addEventListener('keydown', (e) => {
  if (e.code === 'Enter' || e.code === 'Space') {
    e.preventDefault();
  }
});

const handleMove = (e) => {
  switch (e.key) {
    case 'ArrowRight':
      if (!canMoveRight()) {
        allowMove();

        return;
      }
      moveRight();
      break;

    case 'ArrowLeft':
      if (!canMoveLeft()) {
        allowMove();

        return;
      }
      moveLeft();
      break;

    case 'ArrowUp':
      if (!canMoveUp()) {
        allowMove();

        return;
      }
      moveUp();
      break;

    case 'ArrowDown':
      if (!canMoveDown()) {
        allowMove();

        return;
      }
      moveDown();
      break;

    default:
      allowMove();

      return;
  }

  field.cells.forEach(cell => {
    const newMerge = cell.mergeBlocks();

    if (newMerge) {
      currentScore += newMerge;
    }
  });
  score.textContent = currentScore;

  if (field.cells.some(cell => cell.block && cell.block.value === 2048)) {
    winMessage.classList.remove('hidden');

    return;
  }

  field.randomEmptyCell.block = new Block(gameField);

  if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
    loseMessage.classList.remove('hidden');

    return;
  }

  allowMove();
};

const slideBlocks = (groupsOfCells) => {
  groupsOfCells.forEach(group => {
    for (let i = 1; i < group.length; i++) {
      const currentCell = group[i];

      if (currentCell.block === null) {
        continue;
      }

      let lastEmptyCell = null;

      for (let j = i - 1; j >= 0; j--) {
        const previousCell = group[j];

        if (!previousCell.canAccept(currentCell.block)) {
          break;
        }
        lastEmptyCell = previousCell;
      }

      if (lastEmptyCell !== null) {
        if (lastEmptyCell.block) {
          lastEmptyCell.mergeBlock = currentCell.block;
        } else {
          lastEmptyCell.block = currentCell.block;
        }
        currentCell.block = null;
      }
    }
  });
};

const moveLeft = () => {
  return slideBlocks(field.cellsByRows);
};

const moveRight = () => {
  return slideBlocks(field.cellsByRows
    .map(row => [...row].reverse())
  );
};

const moveUp = () => {
  return slideBlocks(field.cellsByColumns);
};

const moveDown = () => {
  return slideBlocks(field.cellsByColumns
    .map(column => [...column].reverse())
  );
};

const canMove = (groups) => {
  return groups.some(group => {
    return group.some((cell, index) => {
      if (index === 0 || cell.block === null) {
        return false;
      }

      const previousCell = group[index - 1];

      return previousCell.canAccept(cell.block);
    });
  });
};

const canMoveLeft = () => {
  return canMove(field.cellsByRows);
};

const canMoveRight = () => {
  return canMove(field.cellsByRows
    .map(row => [...row].reverse())
  );
};

const canMoveUp = () => {
  return canMove(field.cellsByColumns);
};

const canMoveDown = () => {
  return canMove(field.cellsByColumns
    .map(column => [...column].reverse())
  );
};
