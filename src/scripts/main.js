'use strict';

// x = callId % 4
// y = Math.floor(cellId / 4)

const getX = id => id % 4;
const getY = id => Math.floor(id / 4);

let gameState = 'start';
let startMessage = document.querySelector('.message-start');

let allTiles = [...(document.querySelectorAll('.field-cell'))]
  .map((cellNode, index) => {
    cellNode.dataset.cellId = index;

    return cellNode;
  });

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
  console.log(values);

  let nonZero = values.filter(val => val !== '');

  if (nonZero.length !== 0) {
    values = values.filter(val => val !== '');

    if (nonZero.length === 1) {
      values = [nonZero[0], '', '', ''];

      for (let j = 0; j < 4; j++) {
        // chunk[j].innerText = `${values[j]}`;
        changeValue(chunk[j], `${values[j]}`);
      }
    } else if (nonZero.length > 1) {
      for (let j = 1; j < nonZero.length; j++) {
        if (values[j - 1] === values[j]) {
          values[j - 1] *= 2;
          values[j] = '';
        }
      }

      values = values.filter(val => val !== '');

      for (let j = 0; j < 4; j++) {
        changeValue(chunk[j], `${values[j] || ''}`);
      }
    }
  }
}

function createNewTile() {
  let EmptyTiles = allTiles.filter(cell => cell.innerText === '');

  if (EmptyTiles.length > 0) {
    let randomIndex = Math.floor(EmptyTiles.length * Math.random());
    let randomValue = Math.random() < 0.9 ? 2 : 4;

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
      e.target.innerText = 'Restart\n↺';
      startMessage.classList.add('hidden');
    } else if (gameState === 'playing') {
      window.location.reload();
    }
  }
});

window.addEventListener('keydown', (e) => {
  if (gameState === 'playing') {
    switch (e.key) {
      case 'ArrowUp':
        console.log('ArrowUp pressed');
        moveAll('Up');
        break;
      case 'ArrowDown':
        console.log('ArrowDown pressed');
        moveAll('Down');
        break;
      case 'ArrowRight':
        console.log('ArrowRight pressed');
        moveAll('Right');
        break;
      case 'ArrowLeft':
        console.log('ArrowLeft pressed');
        moveAll('Left');
        break;
      default:
        break;
    }

    createNewTile();
  }
});
