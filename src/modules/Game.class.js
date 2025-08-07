'use strict';
class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.initialState = initialState;
    this.board = initialState.map((row) => [...row]);

    this.score = 0;
    this.isGame = false;
  }

  // Função utilitária para transpor a matriz
  transpose(board) {
    return board[0].map((_, colIndex) => board.map((row) => row[colIndex]));
  }

  // Função utilitária para inverter as linhas
  reverseRows(board) {
    return board.map((row) => [...row].reverse());
  }

  // Lógica centralizada de movimento para a esquerda
  shiftAndMergeLeft(board) {
    let moved = false;
    let scoreGained = 0;
    const newBoard = board.map((row) => {
      let arr = row.filter((val) => val !== 0);

      for (let j = 0; j < arr.length - 1; j++) {
        if (arr[j] === arr[j + 1]) {
          arr[j] *= 2;
          scoreGained += arr[j];
          arr[j + 1] = 0;
          j++;
        }
      }
      arr = arr.filter((val) => val !== 0);

      while (arr.length < 4) {
        arr.push(0);
      }

      if (!moved && arr.some((val, idx) => val !== row[idx])) {
        moved = true;
      }

      return arr;
    });

    return { newBoard, moved, scoreGained };
  }

  moveLeft() {
    const { newBoard, moved, scoreGained } = this.shiftAndMergeLeft(this.board);

    this.board = newBoard;
    this.score += scoreGained;

    if (moved) {
      this.createNewBlock();
    }

    if (this.isGameLose() || this.isGameWin()) {
      this.isGame = false;
    }
  }

  moveRight() {
    const reversed = this.reverseRows(this.board);
    const { newBoard, moved, scoreGained } = this.shiftAndMergeLeft(reversed);

    this.board = this.reverseRows(newBoard);
    this.score += scoreGained;

    if (moved) {
      this.createNewBlock();
    }

    if (this.isGameLose() || this.isGameWin()) {
      this.isGame = false;
    }
  }

  moveUp() {
    const transposed = this.transpose(this.board);
    const { newBoard, moved, scoreGained } = this.shiftAndMergeLeft(transposed);

    this.board = this.transpose(newBoard);
    this.score += scoreGained;

    if (moved) {
      this.createNewBlock();
    }

    if (this.isGameLose() || this.isGameWin()) {
      this.isGame = false;
    }
  }

  moveDown() {
    const transposed = this.transpose(this.board);
    const reversed = this.reverseRows(transposed);
    const { newBoard, moved, scoreGained } = this.shiftAndMergeLeft(reversed);

    this.board = this.transpose(this.reverseRows(newBoard));
    this.score += scoreGained;

    if (moved) {
      this.createNewBlock();
    }

    if (this.isGameLose() || this.isGameWin()) {
      this.isGame = false;
    }
  }

  hasChanged(beforeArray) {
    let hasChanged = false;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] !== beforeArray[i][j]) {
          hasChanged = true;
          break;
        }
      }

      if (hasChanged) {
        break;
      }
    }

    if (!hasChanged) {
      return;
    }

    this.createNewBlock();
  }

  createNewBlock() {
    const empty = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          empty.push([i, j]);
        }
      }
    }

    if (empty.length > 0) {
      const [x, y] = empty[Math.floor(Math.random() * empty.length)];

      if (Math.random() < 0.1) {
        this.board[x][y] = 4;
      } else {
        this.board[x][y] = 2;
      }
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board.map((row) => [...row]);
  }

  getStatus() {
    if (this.isGame) {
      return 'playing';
    } else if (this.isGameLose()) {
      return 'lose';
    } else if (this.isGameWin()) {
      return 'win';
    } else {
      return 'idle';
    }
  }

  isGameLose() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          return false;
        }

        if (j < 3 && this.board[i][j] === this.board[i][j + 1]) {
          return false;
        }

        if (i < 3 && this.board[i][j] === this.board[i + 1][j]) {
          return false;
        }
      }
    }

    return true;
  }

  isGameWin() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  start() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.createNewBlock();
    this.createNewBlock();
    this.score = 0;
    this.isGame = true;
  }

  restart() {
    this.board = this.initialState.map((row) => [...row]);
    this.isGame = false;
    this.score = 0;
  }

  // Add your own methods here
}

export default Game;
