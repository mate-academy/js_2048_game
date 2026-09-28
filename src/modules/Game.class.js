'use strict';

/**
 * This class represents the game.
 */
class Game {
  constructor(initialState) {
    if (initialState) {
      this.initialState = JSON.parse(JSON.stringify(initialState));
    } else {
      this.initialState = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    }

    this.board = JSON.parse(JSON.stringify(this.initialState));
    this.score = 0;
    this.status = 'idle';
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.board = JSON.parse(JSON.stringify(this.initialState));
    this.score = 0;
    this.status = 'playing';

    const isEmptyBoard = this.board.every((row) => {
      return row.every((cell) => cell === 0);
    });

    if (isEmptyBoard) {
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  restart() {
    this.board = JSON.parse(JSON.stringify(this.initialState));
    this.score = 0;
    this.status = 'idle';
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < 4; r += 1) {
      for (let c = 0; c < 4; c += 1) {
        if (this.board[r][c] === 0) {
          emptyCells.push({ r, c });
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomCell =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const row = randomCell.r;
    const col = randomCell.c;

    this.board[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  slideLineLeft(row) {
    const filtered = row.filter((val) => val !== 0);
    const newRow = [];
    let scoreGained = 0;

    let i = 0;

    while (i < filtered.length) {
      if (i + 1 < filtered.length && filtered[i] === filtered[i + 1]) {
        const mergedValue = filtered[i] * 2;

        newRow.push(mergedValue);
        scoreGained += mergedValue;
        i += 2;
      } else {
        newRow.push(filtered[i]);
        i += 1;
      }
    }

    while (newRow.length < 4) {
      newRow.push(0);
    }

    return { row: newRow, scoreGained };
  }

  rotateBoard() {
    const newBoard = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    for (let r = 0; r < 4; r += 1) {
      for (let c = 0; c < 4; c += 1) {
        newBoard[c][3 - r] = this.board[r][c];
      }
    }

    this.board = newBoard;
  }

  moveLeftOnly() {
    let moved = false;
    let totalScoreGained = 0;

    for (let r = 0; r < 4; r += 1) {
      const { row, scoreGained } = this.slideLineLeft(this.board[r]);

      if (JSON.stringify(this.board[r]) !== JSON.stringify(row)) {
        moved = true;
      }
      this.board[r] = row;
      totalScoreGained += scoreGained;
    }

    return { moved, totalScoreGained };
  }

  move(direction) {
    // CRÍTICO: Permite movimentação APENAS quando o estado for 'playing'
    if (this.status !== 'playing') {
      return false;
    }

    const rotations = {
      left: 0,
      up: 3,
      right: 2,
      down: 1,
    };

    const count = rotations[direction];

    for (let i = 0; i < count; i += 1) {
      this.rotateBoard();
    }

    const { moved, totalScoreGained } = this.moveLeftOnly();

    for (let i = 0; i < (4 - count) % 4; i += 1) {
      this.rotateBoard();
    }

    if (moved) {
      this.score += totalScoreGained;
      this.addRandomTile();
      this.checkStatus();
    }

    return moved;
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

  checkStatus() {
    let has2048 = false;
    let hasEmptyCell = false;

    for (let r = 0; r < 4; r += 1) {
      for (let c = 0; c < 4; c += 1) {
        const val = this.board[r][c];

        if (val === 2048) {
          has2048 = true;
        }

        if (val === 0) {
          hasEmptyCell = true;
        }
      }
    }

    if (has2048 && this.status !== 'win') {
      this.status = 'win';

      return;
    }

    if (hasEmptyCell) {
      return;
    }

    this.checkNoMovesLeft();
  }

  checkNoMovesLeft() {
    for (let r = 0; r < 4; r += 1) {
      for (let c = 0; c < 4; c += 1) {
        const current = this.board[r][c];

        if (c + 1 < 4 && current === this.board[r][c + 1]) {
          return;
        }

        if (r + 1 < 4 && current === this.board[r + 1][c]) {
          return;
        }
      }
    }

    this.status = 'lose';
  }
}

export default Game;
