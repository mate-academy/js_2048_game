'use strict';
// id to coords:
// x = id % 4
// y = Math.floor(id / 4)
//
// coords to id:
// Y*4 + X = id

/*
  Missing movement animation
*/

const getX = id => id % 4;
const getY = id => Math.floor(id / 4);

const score = document.querySelector('#game-score');
const startMessage = document.querySelector('.message-start');
const winMessage = document.querySelector('.message-win');
const loseMessage = document.querySelector('.message-lose');

let moveDone = false;
let gameState = 'start';

const allTiles = [...(document.querySelectorAll('.field-cell'))]
  .map((cellNode, index) => {
    cellNode.dataset.cellId = index;

    return cellNode;
  });

function executeDefeat() {
  // player lost the game
  gameState = 'defeat';
  loseMessage.classList.remove('hidden');
}

function checkMoves() {
  if (allTiles.filter(cell => cell.innerText === '').length > 0) {
    return;
  }

  const coodrTiles = allTiles.map((tile, ind) => {
    const newObj = {
      x: getX(tile.dataset.cellId),
      y: getY(tile.dataset.cellId),
      value: +tile.innerText,
      index: ind,
    };

    return newObj;
  });

  for (const cell of coodrTiles) {
    const cellNeighbours = [
      coodrTiles.find(sub => sub.x === (cell.x - 1)
        && (sub.y === cell.y)),
      coodrTiles.find(sub => sub.x === (cell.x + 1)
        && (sub.y === cell.y)),
      coodrTiles.find(sub => sub.y === (cell.y - 1)
        && (sub.x === cell.x)),
      coodrTiles.find(sub => sub.y === (cell.y + 1)
        && (sub.x === cell.x)),
    ];

    const cellNeighboursValues = cellNeighbours
      .filter(item => item !== undefined)
      .map(tile => tile.value);

    if (cellNeighboursValues.includes(cell.value)) {
      // neighbour cell has same value, move available
      return;
    }
  }

  executeDefeat();
}

function checkFor2048() {
  if (allTiles.map(cell => cell.innerText).some(value => value === '2048')) {
    // player won the game
    gameState = 'win';
    winMessage.classList.remove('hidden');
  }
}

function changeValue(tile, newValue) {
  tile.innerText = newValue;

  if (!newValue) {
    tile.classList = 'field-cell';
  } else {
    tile.classList = `field-cell field-cell--${newValue}`;
  }
}

function Allign(chunk) {
  // [2.0.0.2] => [2.2] => [4] => [4.0.0.0]
  // [0.4.0.8] => [4.8] => [4.8.0.0]
  let values = chunk.map(cell => cell.innerText);
  const initialValuesStr = values.join('+');
  const nonZero = values.filter(val => val !== '');

  if (nonZero.length !== 0) {
    values = values.filter(val => val !== '');

    if (nonZero.length === 1) {
      values = [nonZero[0], '', '', ''];

      for (let j = 0; j < 4; j++) {
        changeValue(chunk[j], `${values[j]}`);
      }

      if (values.join('+') !== initialValuesStr) {
        moveDone = true;
      }
    } else if (nonZero.length > 1) {
      for (let j = 1; j < nonZero.length; j++) {
        if (values[j - 1] === values[j]) {
          values[j - 1] *= 2;
          values[j] = '';
          score.innerText = `${+score.innerText + (values[j - 1])}`;
        }
      }

      values = values.filter(val => val !== '');

      for (let j = 0; j < 4; j++) {
        changeValue(chunk[j], `${values[j] || ''}`);
      }

      if (chunk.map(cell => cell.innerText).join('+') !== initialValuesStr) {
        moveDone = true;
      }
    }
  }
}

function createNewTile() {
  const EmptyTiles = allTiles.filter(cell => cell.innerText === '');

  if (EmptyTiles.length > 0) {
    const randomIndex = Math.floor(EmptyTiles.length * Math.random());
    const randomValue = Math.random() < 0.9 ? 2 : 4;

    EmptyTiles[randomIndex].innerText = randomValue;
    EmptyTiles[randomIndex].classList.add(`field-cell--${randomValue}`);
  };
}

function moveAll(direction) {
  let chunks = [];

  switch (direction) {
    case 'Up':
      chunks = [];

      allTiles.forEach(tile => {
        chunks[getX(tile.dataset.cellId)]
          ? chunks[getX(tile.dataset.cellId)].push(tile)
          : chunks[getX(tile.dataset.cellId)] = [tile];
      });

      chunks.forEach(chunk => {
        Allign(chunk);
      });
      break;
    case 'Down':
      chunks = [];

      allTiles.forEach(tile => {
        chunks[getX(tile.dataset.cellId)]
          ? chunks[getX(tile.dataset.cellId)].push(tile)
          : chunks[getX(tile.dataset.cellId)] = [tile];
      });

      chunks.forEach(chunk => {
        Allign(chunk.reverse());
      });
      break;
    case 'Left':
      chunks = [];

      allTiles.forEach(tile => {
        chunks[getY(tile.dataset.cellId)]
          ? chunks[getY(tile.dataset.cellId)].push(tile)
          : chunks[getY(tile.dataset.cellId)] = [tile];
      });

      chunks.forEach(chunk => {
        Allign(chunk);
      });
      break;
    case 'Right':
      chunks = [];

      allTiles.forEach(tile => {
        chunks[getY(tile.dataset.cellId)]
          ? chunks[getY(tile.dataset.cellId)].push(tile)
          : chunks[getY(tile.dataset.cellId)] = [tile];
      });

      chunks.forEach(chunk => {
        Allign(chunk.reverse());
      });
      break;
    default:
      break;
  }
};

window.addEventListener('click', (e) => {
  if (e.target.id === 'startButton') {
    if (gameState === 'start') {
      createNewTile();
      createNewTile();
      gameState = 'playing';
      e.target.innerText = 'Restart';
      e.target.classList.add('restart');
      startMessage.classList.add('hidden');
    } else {
      score.innerText = '0';
      allTiles.forEach(tile => changeValue(tile, ''));
      moveDone = false;
      gameState = 'playing';
      createNewTile();
      createNewTile();
    }
  }
});

window.addEventListener('keydown', (e) => {
  if (gameState === 'playing') {
    switch (e.key) {
      case 'ArrowUp':
        moveAll('Up');
        break;
      case 'ArrowDown':
        moveAll('Down');
        break;
      case 'ArrowRight':
        moveAll('Right');
        break;
      case 'ArrowLeft':
        moveAll('Left');
        break;
      default:
        break;
    }

    if (moveDone === true) {
      createNewTile();
      moveDone = false;
    }
  };

  checkFor2048();
  checkMoves();
});
