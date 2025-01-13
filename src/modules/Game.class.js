'use strict';

class Game {
  static STATUSES = {
    idle: 'idle',
    playing: 'playing',
    win: 'win',
    lose: 'lose',
  };

  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    gameBoard,
    scoreField,
  ) {
    this.initialState = initialState;
    this.state = initialState.map((row) => [...row]);
    this.status = Game.STATUSES.idle;
    this.score = 0;
    this.gameBoard = gameBoard;
    this.scoreField = scoreField;
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.state;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = Game.STATUSES.playing;
    this.#addCell();
    this.#addCell();
  }

  restart() {
    this.state = this.initialState.map((row) => [...row]);
    this.status = Game.STATUSES.idle;
    this.score = 0;
  }

  moveLeft() {
    if (this.status !== Game.STATUSES.playing) {
      return;
    }

    let canMoveLeftInGroup = false;

    this.state = this.state.map((row) => {
      if (!this.#canMoveInGroup(row)) {
        return row;
      }

      canMoveLeftInGroup = true;

      return this.#moveCellsInGroup(row);
    });

    if (canMoveLeftInGroup) {
      this.#addCell();
    }

    this.#setStatus();
  }

  moveRight() {
    if (this.status !== Game.STATUSES.playing) {
      return;
    }

    let canMoveRightInGroup = false;

    this.state = this.state.map((row) => {
      const rowReversed = [...row].reverse();

      if (!this.#canMoveInGroup(rowReversed)) {
        return row;
      }

      canMoveRightInGroup = true;

      return this.#moveCellsInGroup(rowReversed).reverse();
    });

    if (canMoveRightInGroup) {
      this.#addCell();
    }

    this.#setStatus();
  }

  moveUp() {
    if (this.status !== Game.STATUSES.playing) {
      return;
    }

    let canMoveUpInGroup = false;

    const cellsGroupByColumns = this.#transpose(this.state);

    const updatedCellsGroupByColumns = cellsGroupByColumns.map((row) => {
      if (!this.#canMoveInGroup(row)) {
        return row;
      }

      canMoveUpInGroup = true;

      return this.#moveCellsInGroup(row);
    });

    this.state = this.#transpose(updatedCellsGroupByColumns);

    if (canMoveUpInGroup) {
      this.#addCell();
    }

    this.#setStatus();
  }

  moveDown() {
    if (this.status !== Game.STATUSES.playing) {
      return;
    }

    let canMoveDownInGroup = false;

    const cellsGroupByColumns = this.#transpose(this.state);

    const updatedCellsGroupByColumns = cellsGroupByColumns.map((row) => {
      const reversedRow = [...row].reverse();

      if (!this.#canMoveInGroup(reversedRow)) {
        return row;
      }

      canMoveDownInGroup = true;

      return this.#moveCellsInGroup(reversedRow).reverse();
    });

    this.state = this.#transpose(updatedCellsGroupByColumns);

    if (canMoveDownInGroup) {
      this.#addCell();
    }

    this.#setStatus();
  }

  updateGameBoard() {
    const regex = /field-cell--\d+/;
    const currState = this.getState();

    this.scoreField.innerText = this.getScore();

    for (let i = 0; i < currState.length; i++) {
      for (let j = 0; j < currState.length; j++) {
        if (currState[i][j] !== 0) {
          this.gameBoard.rows[i].cells[j].className =
            `field-cell field-cell--${currState[i][j]}`;
          this.gameBoard.rows[i].cells[j].innerText = currState[i][j];
        } else if (
          currState[i][j] === 0 &&
          regex.test(this.gameBoard.rows[i].cells[j].className)
        ) {
          this.gameBoard.rows[i].cells[j].className = 'field-cell';
          this.gameBoard.rows[i].cells[j].innerText = '';
        }
      }
    }
  }

  #addCell() {
    const coord = this.#getRandomEmptyCell();

    if (coord !== null) {
      this.state[coord[0]][coord[1]] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  #getRandomEmptyCell() {
    const emptyCells = [];

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[0].length; j++) {
        if (this.state[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length < 1) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    return emptyCells[randomIndex];
  }

  #transpose(arr) {
    return arr[0].map((_, colIndex) => arr.map((row) => row[colIndex]));
  }

  #moveCellsInGroup(group) {
    const mergedValues = [0, 0, 0, 0];

    for (let i = 1; i < group.length; i++) {
      if (group[i] === 0) {
        continue;
      }

      const cellWithNumIndex = i;
      let targetCellIndex = null;
      let j = i - 1;

      while (
        j >= 0 &&
        (group[j] === 0 ||
          (group[j] === group[cellWithNumIndex] && mergedValues[j] !== 1))
      ) {
        targetCellIndex = j;
        j--;
      }

      if (targetCellIndex === null) {
        continue;
      }

      if (group[targetCellIndex] === 0) {
        group[targetCellIndex] = group[cellWithNumIndex];
        group[cellWithNumIndex] = 0;
      } else {
        group[targetCellIndex] += group[cellWithNumIndex];
        group[cellWithNumIndex] = 0;

        mergedValues[targetCellIndex] = 1;

        this.score += group[targetCellIndex];
      }
    }

    return group;
  }

  #setStatus() {
    if (!this.#checkCanMove()) {
      this.status = Game.STATUSES.lose;
    }

    if (this.#checkWin()) {
      this.status = Game.STATUSES.win;
    }
  }

  #checkWin() {
    return this.state.some((row) => {
      return row.some((cell) => cell === 2048);
    });
  }

  #checkCanMove() {
    const canMoveHorisontal = this.state.some((row) => {
      const reversedRow = [...row];

      if (this.#canMoveInGroup(row) || this.#canMoveInGroup(reversedRow)) {
        return true;
      }

      return false;
    });

    const canMoveVertical = this.#transpose(this.state).some((row) => {
      const reversedRow = [...row];

      if (this.#canMoveInGroup(row) || this.#canMoveInGroup(reversedRow)) {
        return true;
      }

      return false;
    });

    return canMoveHorisontal || canMoveVertical;
  }

  #canMoveInGroup(group) {
    return group.some((cell, index) => {
      if (index === 0) {
        return false;
      }

      if (cell === 0) {
        return false;
      }

      if (group[index - 1] === 0) {
        return true;
      }

      if (group[index] === group[index - 1]) {
        return true;
      }

      return false;
    });
  }
}

module.exports = Game;
