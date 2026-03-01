import {
  Tile,
  createCellsField,
  random,
  sortChip,
  getDirectionVector1,
  arrVector,
  removeTileMarg,
} from './utils.js';

import { board, scoreHtml, collorMap } from './utils-html.js';

export class Game {
  constructor() {
    this.cellArr = createCellsField(); // array all cells field
    this.arrChip = []; // Array Obj Chip
    this.score = 0;
    this.isWin = false;
    this.isLose = false;
  }

  getFilledCells() {
    return this.cellArr.length === this.arrChip.length;
  } // for message Lose ***

  // moveability check function
  canMove() {
    for (const chip of this.arrChip) {
      const curentCell = chip.cell;

      for (const vec of arrVector) {
        const step = getDirectionVector1(vec);

        const nextRow = curentCell.row + step.row;
        const nextCol = curentCell.col + step.col;
        const nextCell = this.#getCell(nextRow, nextCol);

        if (nextCell && nextCell.tile.value === chip.value) {
          return true;
        }
      }
    }

    return false;
  }

  // get random empty cell
  #getRandomEmptyCell() {
    const emptyCells = this.cellArr.filter((cell) => cell.isEmpty);

    if (emptyCells.length === 0) {
      return null;
    }

    return random(emptyCells);
  }

  // Creare Obj - chip
  createChip() {
    const cell = this.#getRandomEmptyCell();

    if (!cell) {
      return null;
    }

    const value = Math.random() < 0.1 ? 4 : 2;
    const chip = new Tile(cell, value);

    this.#createHtmlChipNew(chip); // create div-chip
    this.arrChip.push(chip);
  }

  // get cell to move
  #getCell(row, col) {
    return this.cellArr.find(
      (cell) => (cell.row === row && cell.col === col) || null,
    );
  }

  // move + merging + move
  #move(direction) {
    return this.#moveChips(direction, this.arrChip);
  }

  #moveChips(direction, arrChip) {
    sortChip(direction, arrChip);

    let moved = false;

    for (const chip of arrChip) {
      if (this.#moveOneChip(chip, direction)) {
        moved = true;
      }
    }

    for (const chip of arrChip) {
      if (this.#margeChips(chip, direction)) {
        moved = true;
      }
    }

    for (const chip of arrChip) {
      if (this.#moveOneChip(chip, direction)) {
        moved = true;
      }
    }

    return moved;
  }

  // move of Chip
  #moveOneChip(chip, direction) {
    const vector = getDirectionVector1(direction);

    if (!vector) {
      return false;
    }

    let moved = false;
    let currentCell = chip.cell;

    while (true) {
      const nextRow = currentCell.row + vector.row;
      const nextCol = currentCell.col + vector.col;

      const nextCell = this.#getCell(nextRow, nextCol);

      if (!nextCell) {
        break;
      }

      if (!nextCell.isEmpty) {
        break;
      }

      currentCell.tile = null;

      chip.cell = nextCell;
      nextCell.tile = chip;

      currentCell = nextCell;
      moved = true;
    }

    return moved; // new
  }

  // merging of chips
  #margeChips(chip, direction) {
    const vector = getDirectionVector1(direction);

    // if (!vector) return {false;}

    if (!vector) {
      return false;
    }

    const currentCell = chip.cell;

    const nextRow = currentCell.row + vector.row;
    const nextCol = currentCell.col + vector.col;
    const nextCell = this.#getCell(nextRow, nextCol);

    if (!nextCell) {
      return false;
    }

    if (nextCell.isEmpty) {
      return false;
    }

    if (
      nextCell.tile.value === chip.value &&
      !nextCell.tile.marg &&
      !chip.marg
    ) {
      const tileToRemove = nextCell.tile;
      const htmlToRemove = nextCell.tile.idObj;
      const chipHtml = document.getElementById(chip.idObj);

      chip.value *= 2;
      chipHtml.textContent = chip.value; // ! move to
      chipHtml.classList.add(collorMap[chip.value]); // ! move to

      this.#calculationScore(chip.value);

      currentCell.tile = null;
      chip.cell = nextCell;
      nextCell.tile = chip;
      chip.marg = true;
      removeTileMarg(tileToRemove, this.arrChip); // Chip removed from field
      document.getElementById(htmlToRemove).remove(); // htmlChip removed

      return true;
    }

    return false;
  }

  moveLeft() {
    return this.#move('ArrowLeft');
  }

  moveRight() {
    return this.#move('ArrowRight');
  }

  moveUp() {
    return this.#move('ArrowUp');
  }

  moveDown() {
    return this.#move('ArrowDown');
  }

  moveMap = {
    ArrowUp: () => this.moveUp(),
    ArrowDown: () => this.moveDown(),
    ArrowLeft: () => this.moveLeft(),
    ArrowRight: () => this.moveRight(),
  };

  saveState() {
    const state = {
      count: Tile.count,
      score: this.score,
      tiles: this.arrChip.map((chip) => ({
        id: chip.idObj,
        row: chip.cell.row,
        col: chip.cell.col,
        value: chip.value,
        collor: chip.collor,
      })),
    };

    localStorage.setItem('gameState', JSON.stringify(state));
  }

  getState() {
    const dataGame = JSON.parse(localStorage.getItem('gameState'));

    return dataGame;
  }

  applyState(dataGame) {
    this.score = dataGame.score;
    scoreHtml.textContent = this.score;

    for (const t of dataGame.tiles) {
      const cell = this.#getCell(t.row, t.col);
      const chip = new Tile(cell);

      chip.idObj = t.id;
      chip.value = t.value;
      chip.collor = t.collor;
      this.arrChip.push(chip);
    }
    Tile.count = dataGame.count;
  }

  #calculationScore(value) {
    this.score += value;
    scoreHtml.textContent = this.score;
  }

  getStatus() {
    if (this.isWin) {
      return 'win';
    }

    if (this.isLose) {
      return 'lose';
    }

    return 'playing';
  }

  updateStatus() {
    if (this.arrChip.find((chip) => chip.value >= 2048)) {
      this.isWin = true;

      return;
    }

    if (this.getFilledCells() && !this.canMove()) {
      this.isLose = true;
    }
  }

  start() {
    this.createChip();
    this.createChip(); // созд Chip + html + выводит на доску
  }

  restart() {
    this.arrChip = []; // clear array Chip
    this.cellArr.forEach((cell) => (cell.tile = null)); // Removes tiles
    this.score = 0; // clear score
    this.isWin = false;
    this.isLose = false;
    document.querySelectorAll('.chipHtml').forEach((ch) => ch.remove());
    scoreHtml.textContent = 0; // clear score from HTML
    localStorage.removeItem('gameState'); // removing date from localStorage
  }

  resetMergeFlags() {
    this.arrChip.forEach((ch) => (ch.marg = false));
  }

  #createHtmlChipNew(Chip) {
    if (!Chip) {
      return;
    }

    const div = document.createElement('div');

    div.classList.add(
      'field-cell',
      `field-cell--${Chip.value}`,
      'chipHtml',
      'chipHtmlAnim',
      Chip.collor,
    );
    div.style.position = 'absolute';
    div.innerText = Chip.value;
    div.id = Chip.idObj;

    this.#applyHtmlChip(Chip, div);
    board.append(div);
    setTimeout(() => div.classList.remove('chipHtmlAnim'), 500);
  }

  #applyHtmlChip(Chip, div) {
    const boardRect = board.getBoundingClientRect();
    const targCell = board.rows[Chip.cell.row].cells[Chip.cell.col];
    const cellRect = targCell.getBoundingClientRect();

    div.style.left = cellRect.left - boardRect.left + 'px';
    div.style.top = cellRect.top - boardRect.top + 'px';
  }

  renderMoveHtmlChip() {
    for (const Chip of this.arrChip) {
      const div = document.getElementById(Chip.idObj);

      if (div) {
        this.#applyHtmlChip(Chip, div);
      }
    }
  }

  renderHtmlChip() {
    for (const chip of this.arrChip) {
      this.#createHtmlChipNew(chip);
    }
  }
}
