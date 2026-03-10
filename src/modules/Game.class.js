'use strict';

class Game {
  static STATUS_IDLE = 'idle';
  static STATUS_PLAYING = 'playing';
  static STATUS_WIN = 'win';
  static STATUS_LOSE = 'lose';

  constructor(initialState = null) {
    if (Array.isArray(initialState)) {
      this.initialState = initialState.map((row) => [...row]);
    } else {
      this.initialState = this.createEmptyBoard();
    }

    this.restart();
  }

  createEmptyBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  getState() {
    return this.board.map((row) => [...row]);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status !== Game.STATUS_IDLE) {
      return;
    }

    this.status = Game.STATUS_PLAYING;
    this.addRandomTile();
    this.addRandomTile();
    this.updateStatus();
  }

  restart() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = Game.STATUS_IDLE;
  }

  moveLeft() {
    return this.move('left');
  }

  moveRight() {
    return this.move('right');
  }

  moveUp() {
    return this.move('up');
  }

  moveDown() {
    return this.move('down');
  }

  move(direction) {
    if (this.status !== Game.STATUS_PLAYING) {
      return false;
    }

    const oldBoard = this.getState();
    let points = 0;

    switch (direction) {
      case 'left':
        this.board = this.board.map((row) => {
          const result = this.processLine(row);

          points += result.score;

          return result.line;
        });
        break;

      case 'right':
        this.board = this.board.map((row) => {
          const reversed = [...row].reverse();
          const result = this.processLine(reversed);

          points += result.score;

          return result.line.reverse();
        });
        break;

      case 'up':
        this.board = this.transpose(this.board).map((row) => {
          const result = this.processLine(row);

          points += result.score;

          return result.line;
        });
        this.board = this.transpose(this.board);
        break;

      case 'down':
        this.board = this.transpose(this.board).map((row) => {
          const reversed = [...row].reverse();
          const result = this.processLine(reversed);

          points += result.score;

          return result.line.reverse();
        });
        this.board = this.transpose(this.board);
        break;

      default:
        return false;
    }

    if (this.areBoardsEqual(oldBoard, this.board)) {
      return false;
    }

    this.score += points;
    this.addRandomTile();
    this.updateStatus();

    const gameStatus = this.getStatus();

    if (gameStatus === Game.STATUS_LOSE && typeof document !== 'undefined') {
      document.querySelector('.game-field')?.classList.add('shake');
    }

    return true;
  }

  processLine(line) {
    const filtered = line.filter((value) => value !== 0);
    const merged = [];
    let score = 0;

    for (let i = 0; i < filtered.length; i++) {
      if (filtered[i] === filtered[i + 1]) {
        const doubled = filtered[i] * 2;

        merged.push(doubled);
        score += doubled;
        i++;
      } else {
        merged.push(filtered[i]);
      }
    }

    while (merged.length < 4) {
      merged.push(0);
    }

    return {
      line: merged,
      score,
    };
  }

  transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
  }

  areBoardsEqual(firstBoard, secondBoard) {
    return firstBoard.every((row, rowIndex) => {
      return row.every(
        (cell, cellIndex) => cell === secondBoard[rowIndex][cellIndex],
      );
    });
  }

  getEmptyCells() {
    const emptyCells = [];

    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    return emptyCells;
  }

  addRandomTile() {
    const emptyCells = this.getEmptyCells();

    if (!emptyCells.length) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const { row, col } = emptyCells[randomIndex];
    const value = Math.random() < 0.1 ? 4 : 2;

    this.board[row][col] = value;
  }

  hasAvailableMoves() {
    if (this.getEmptyCells().length > 0) {
      return true;
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const current = this.board[row][col];
        const right = this.board[row][col + 1];
        const down = this.board[row + 1]?.[col];

        if (current === right || current === down) {
          return true;
        }
      }
    }

    return false;
  }

  updateStatus() {
    const has2048 = this.board.some((row) => row.some((cell) => cell === 2048));

    if (has2048) {
      this.status = Game.STATUS_WIN;

      return;
    }

    if (!this.hasAvailableMoves()) {
      this.status = Game.STATUS_LOSE;

      return;
    }

    this.status = Game.STATUS_PLAYING;
  }
}

window.Game = Game;
