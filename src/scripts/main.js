'use strict';

class Tile {
  constructor() {
    const CHANS_TWO = 0.9;

    this.numeric = Math.random() < CHANS_TWO ? 2 : 4;

    this.coords = this.findPlase();
    this.oldCoords = { ...this.coords };

    this.canMuve = true;
    this.tile = this.addTile();
    this.moved = false;
    this.combined = false;

    Tile.tiles.push(this);
  }

  findPlase() {
    const freeFields = [];

    for (let r = 0; r < Tile.FIELD_ROWS.length; r++) {
      const columns = Tile.FIELD_ROWS[r].children;

      for (let c = 0; c < columns.length; c++) {
        if (!columns[c].firstChild) {
          freeFields.push({
            r,
            c,
          });
        }
      }
    }

    if (freeFields.length === 0) {
      return false;
    }

    const max = freeFields.length - 1;
    const plase = Math.floor(Math.random() * (max + 1));

    return freeFields[plase];
  }

  addTile() {
    const { r, c } = this.coords;
    const fieldForAdd = Tile.FIELD_ROWS[r].children[c];

    fieldForAdd.insertAdjacentHTML('beforeend', `
      <div class="cell cell--${this.numeric}">${this.numeric}</div>
    `);

    return fieldForAdd.children[0];
  }

  checkMoveLeft() {
    const { c } = this.coords;

    if (c === 0) {
      return false;
    }

    const neighbour = this.findNeighbourL();

    return this.checkNeighbour(neighbour);
  }

  checkMoveRight() {
    const { c } = this.coords;

    if (c === 3) {
      return false;
    }

    const neighbour = this.findNeighbourR();

    return this.checkNeighbour(neighbour);
  }

  checkMoveTop() {
    const { r } = this.coords;

    if (r === 0) {
      return false;
    }

    const neighbour = this.findNeighbourU();

    return this.checkNeighbour(neighbour);
  }

  checkMoveBottomn() {
    const { r } = this.coords;

    if (r === 3) {
      return false;
    }

    const neighbour = this.findNeighbourB();

    return this.checkNeighbour(neighbour);
  }

  checkNeighbour(neighbour) {
    if (!neighbour) {
      return true;
    }

    if (
      neighbour.numeric === this.numeric
      && !neighbour.combined
      && !this.combined
    ) {
      return true;
    }

    return false;
  }

  findNeighbourU() {
    const { r, c } = this.coords;

    return Tile.tiles.find(tile => {
      if (tile.coords.c !== c) {
        return false;
      }

      if (tile.coords.r !== r - 1) {
        return false;
      }

      return true;
    });
  }

  findNeighbourB() {
    const { r, c } = this.coords;

    return Tile.tiles.find(tile => {
      if (tile.coords.c !== c) {
        return false;
      }

      if (tile.coords.r !== r + 1) {
        return false;
      }

      return true;
    });
  }

  findNeighbourR() {
    const { r, c } = this.coords;

    return Tile.tiles.find(tile => {
      if (tile.coords.r !== r) {
        return false;
      }

      if (tile.coords.c !== c + 1) {
        return false;
      }

      return true;
    });
  }

  findNeighbourL() {
    const { r, c } = this.coords;

    return Tile.tiles.find(tile => {
      if (tile.coords.r !== r) {
        return false;
      }

      if (tile.coords.c !== c - 1) {
        return false;
      }

      return true;
    });
  }
}
Tile.FIELD_ROWS = document.querySelectorAll('.field-row');
Tile.tiles = [];

const COUNT_FILDS_CELL = 4;
let score = 0;
let moveTimeout;
let newTimeout;
let forMoveInHtml = [];

const buttonStart = document.querySelector('.start');
const buttonRestart = document.querySelector('.restart');
const messageWin = document.querySelector('.message-win');
const messageStart = document.querySelector('.message-start');
const messageLose = document.querySelector('.message-lose');

function addScore(specs) {
  document.querySelector('.game-score').innerHTML = specs;
}

function moveAndCombineTileHTMLTimeout() {
  return setTimeout(() => {
    moveAndCombineTileHTML();
  }, 100);
}

function moveAndCombineTileHTML() {
  forMoveInHtml.forEach(tile => {
    if (tile.moved) {
      const { r, c } = tile.oldCoords;

      tile.tile = tile.addTile();

      if (tile.combined) {
        tile.tile.classList.add('combin');
        tile.combined = false;
      }

      Tile.FIELD_ROWS[r].children[c].innerHTML = '';
      tile.moved = false;
      tile.oldCoords = { ...tile.coords };

      moveTimeout = null;
    }
  });
}

function stap(naighbour, direction, tile) {
// try {

  if (naighbour) {
    const naighbourIndex = Tile.tiles.indexOf(naighbour);

    naighbour.tile.parentNode.innerHTML = '';
    Tile.tiles.splice(naighbourIndex, 1);
    naighbour.moved = false;

    tile.numeric *= 2;
    tile.combined = true;

    score += tile.numeric;

    if (tile.numeric >= 2042) {
      messageWin.classList.remove('hidden');
    }
  }

  // } catch (error) {
  //   debugger;
  // }

  switch (direction) {
    case 'ArrowUp':
      tile.coords.r -= 1;
      break;

    case 'ArrowLeft':
      tile.coords.c -= 1;
      break;

    case 'ArrowDown':
      tile.coords.r += 1;
      break;

    case 'ArrowRight':
      tile.coords.c += 1;
      break;
  }

  return tile;
}

function newTileTimeout() {
  return setTimeout(() => {
    newTile();
  }, 150);
}

function newTile() {
  const tail = new Tile();

  tail.tile.classList.add('born');

  newTimeout = null;
}

function checkOpportunity() {
  return Tile.tiles.some(tile => {
    return tile.checkMoveTop()
      || tile.checkMoveBottomn()
      || tile.checkMoveLeft()
      || tile.checkMoveRight();
  });
}

buttonStart.addEventListener('click', () => {
  buttonRestart.classList.remove('hidden');
  buttonStart.classList.add('hidden');
  messageStart.classList.add('hidden');

  newTileTimeout();
  newTileTimeout();
});

buttonRestart.addEventListener('click', () => {
  messageWin.classList.add('hidden');
  messageLose.classList.add('hidden');

  const cells = document.querySelectorAll('.cell');

  cells.forEach(cell => {
    cell.parentNode.innerHTML = '';
  });

  Tile.tiles = [];
  score = 0;
  addScore('');

  newTileTimeout();
  newTileTimeout();
});

document.addEventListener('keydown', ev => {
  if (moveTimeout) {
    clearTimeout(moveTimeout);
    moveAndCombineTileHTML(forMoveInHtml);
  }

  if (newTimeout) {
    clearTimeout(newTimeout);
    newTile();
  }

  forMoveInHtml = [];

  for (let ii = 1; ii < COUNT_FILDS_CELL; ii++) {
    const intationMoveAll = [];

    if (ev.key === 'ArrowUp') {
      for (let row = 1; row < COUNT_FILDS_CELL; row++) {
        const intationMove = Tile.tiles.filter(tile => tile.coords.r === row);

        intationMove.forEach(tile => {
          if (tile.checkMoveTop()) {
            const naighbour = tile.findNeighbourU();

            intationMoveAll.push(stap(naighbour, ev.key, tile));
          }
        });
      }

      if (intationMoveAll.length === 0) {
        break;
      }

      intationMoveAll.forEach(tile => {
        tile.tile.style.transform = (
          `translateY(calc(-${ii * 100}% - ${ii * 10}px))`
        );
        tile.moved = true;
      });

      forMoveInHtml.push(...intationMoveAll);
    }

    if (ev.key === 'ArrowLeft') {
      for (let colamn = 1; colamn < COUNT_FILDS_CELL; colamn++) {
        const intationMove = (
          Tile.tiles.filter(tile => tile.coords.c === colamn)
        );

        intationMove.forEach(tile => {
          if (tile.checkMoveLeft()) {
            const naighbour = tile.findNeighbourL();

            intationMoveAll.push(stap(naighbour, ev.key, tile));
          }
        });
      }

      if (intationMoveAll.length === 0) {
        break;
      }

      intationMoveAll.forEach(tile => {
        tile.tile.style.transform = (
          `translateX(calc(-${ii * 100}% - ${ii * 10}px))`
        );
        tile.moved = true;
      });

      forMoveInHtml.push(...intationMoveAll);
    }

    if (ev.key === 'ArrowDown') {
      for (let row = 2; row >= 0; row--) {
        const intationMove = Tile.tiles.filter(tile => tile.coords.r === row);

        intationMove.forEach(tile => {
          if (tile.checkMoveBottomn()) {
            const naighbour = tile.findNeighbourB();

            intationMoveAll.push(stap(naighbour, ev.key, tile));
          }
        });
      }

      if (intationMoveAll.length === 0) {
        break;
      }

      intationMoveAll.forEach(tile => {
        tile.tile.style.transform = (
          `translateY(calc(${ii * 100}% + ${ii * 10}px))`
        );
        tile.moved = true;
      });

      forMoveInHtml.push(...intationMoveAll);
    }

    if (ev.key === 'ArrowRight') {
      for (let colamn = 2; colamn >= 0; colamn--) {
        const intationMove = (
          Tile.tiles.filter(tile => tile.coords.c === colamn)
        );

        intationMove.forEach(tile => {
          if (tile.checkMoveRight()) {
            const naighbour = tile.findNeighbourR();

            intationMoveAll.push(stap(naighbour, ev.key, tile));
          }
        });
      }

      if (intationMoveAll.length === 0) {
        break;
      }

      intationMoveAll.forEach(tile => {
        tile.tile.style.transform = (
          `translateX(calc(${ii * 100}% + ${ii * 10}px))`
        );
        tile.moved = true;
      });

      forMoveInHtml.push(...intationMoveAll);
    }
  }

  if (forMoveInHtml.length > 0) {
    moveTimeout = moveAndCombineTileHTMLTimeout(forMoveInHtml);
    // moveAndCombineTileHTML(forMoveInHtml);

    addScore(score);

    newTimeout = newTileTimeout();
    // newTile();
  }

  if (!checkOpportunity()) {
    const gameFilg = document.querySelector('.game-field');

    gameFilg.style.opacity = '0.5';
    messageLose.classList.remove('hidden');
  }
});
