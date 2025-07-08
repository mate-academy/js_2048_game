'use strict';

class Game {
  constructor(buttonEl, tableEl, messagesEl, scoreEl) {
    this.initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.status = 'idle';
    this.score = 0;

    this.buttonEl = buttonEl;
    this.tableEl = tableEl;
    this.messagesEl = messagesEl;
    this.scoreEl = scoreEl;
  }

  start() {
    this.state = this.initialState.map((el) => [...el]);
    this.status = 'playing';
    this.updateGameUIByStatus(this.status);
    this.addCell(2);
    this.addCell(this.getRandomNum(9) > 0 ? 2 : 4);
    this.syncMatrixWithTable();
  }

  move(direction) {
    const beforeMove = this.state.toString();
    let withoutHole = [];

    if (direction === 'ArrowLeft') {
      withoutHole = this.state.map((row) => row.filter((el) => el !== 0));
    }

    if (direction === 'ArrowRight') {
      withoutHole = this.state.map((row) => {
        return [...row].reverse().filter((el) => el !== 0);
      });
    }

    if (direction === 'ArrowUp') {
      withoutHole = this.transposeMatrice(this.state).map((row) => {
        return row.filter((el) => el !== 0);
      });
    }

    if (direction === 'ArrowDown') {
      withoutHole = this.transposeMatrice(this.state).map((row) => {
        return [...row].reverse().filter((el) => el !== 0);
      });
    }

    for (let i = 0; i < withoutHole.length; i++) {
      for (let j = 0; j < withoutHole[i].length; j++) {
        if (withoutHole[i][j] === withoutHole[i][j + 1]) {
          this.score += withoutHole[i][j] + withoutHole[i][j + 1];

          withoutHole[i].splice(
            j,
            2,
            withoutHole[i][j] + withoutHole[i][j + 1],
          );
        }
      }

      while (withoutHole[i].length < 4) {
        withoutHole[i].push(0);
      }
    }

    if (direction === 'ArrowRight') {
      this.state = withoutHole.map((row) => row.reverse());
    }

    if (direction === 'ArrowDown') {
      this.state = this.transposeMatrice(
        withoutHole.map((row) => row.reverse()),
      );
    }

    if (direction === 'ArrowUp') {
      this.state = this.transposeMatrice(withoutHole);
    }

    if (direction === 'ArrowLeft') {
      this.state = withoutHole;
    }

    if (beforeMove !== this.state.toString()) {
      this.addCell(this.getRandomNum(9) > 0 ? 2 : 4);
    }

    this.scoreEl.textContent = this.score;
    this.syncMatrixWithTable();
    this.checkWinLose(this.state);
  }

  moveLeft(key) {
    this.move(key);
  }

  moveRight(key) {
    this.move(key);
  }

  moveUp(key) {
    this.move(key);
  }

  moveDown(key) {
    this.move(key);
  }

  checkWinLose(state) {
    const cantMerge = (board) => {
      for (let i = 0; i < board.length; i++) {
        for (let j = 0; j < board[i].length - 1; j++) {
          if (board[i][j] === board[i][j + 1]) {
            return false;
          }
        }
      }

      return true;
    };

    if (this.state.toString().includes('2048')) {
      this.status = 'win';
      this.updateGameUIByStatus(this.status);
    }

    if (
      cantMerge(state) &&
      cantMerge(this.transposeMatrice(state)) &&
      this.getEmptyCells().length === 0
    ) {
      this.status = 'lose';
      this.updateGameUIByStatus(this.status);
    }
  }

  updateGameUIByStatus(stat) {
    if (stat === 'playing') {
      this.buttonEl.textContent = 'Restart';
      this.buttonEl.classList.replace('start', 'restart');
      this.messagesEl[2].classList.add('hidden');
    }

    if (stat === 'win') {
      this.messagesEl[1].classList.remove('hidden');
    }

    if (stat === 'lose') {
      this.messagesEl[0].classList.remove('hidden');
    }
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

  restart() {
    this.score = 0;
    this.scoreEl.textContent = 0;

    this.messagesEl.forEach((el) => {
      el.classList.add('hidden');
    });

    this.start();
  }

  getRandomNum(max) {
    return Math.floor(Math.random() * (max + 1));
  }

  getEmptyCells() {
    const emptyCells = [];

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    return emptyCells;
  }

  addCell(num) {
    const empCells = this.getEmptyCells();
    const empCell = empCells[this.getRandomNum(empCells.length - 1)];

    this.state[empCell[0]][empCell[1]] = num;
  }

  syncMatrixWithTable() {
    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        const curCell = this.tableEl.rows[i].cells[j];
        const curNum = this.state[i][j];

        curCell.textContent = curNum || '';

        const oldClass = [...curCell.classList].find((el) => {
          return el.includes('field-cell--');
        });

        curCell.classList.remove(oldClass);

        if (curNum > 0) {
          curCell.classList.add(`field-cell--${curNum}`);
        }
      }
    }
  }

  transposeMatrice(matrice) {
    const result = [];

    for (let i = 0; i < matrice[0].length; i++) {
      const row = [];

      for (let j = 0; j < matrice.length; j++) {
        row.push(matrice[j][i]);
      }
      result.push(row);
    }

    return result;
  }
}

module.exports = Game;
