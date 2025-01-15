'use strict';

export default class Game {
  constructor(initialState) {
    this.initialState = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.state = structuredClone(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  handleMove(getLine, setLine, reverse = false) {
    if (this.status !== 'playing') {
      return;
    }

    const prevState = structuredClone(this.state);
    const size = 4;

    for (let i = 0; i < size; i++) {
      let line = getLine(i).filter((cell) => cell !== 0);

      if (reverse) {
        line = line.reverse();
      }

      for (let j = 0; j < line.length - 1; j++) {
        if (line[j] === line[j + 1]) {
          line[j] *= 2;
          this.score += line[j];
          line.splice(j + 1, 1);
        }
      }

      while (line.length < size) {
        if (reverse) {
          line.unshift(0);
        } else {
          line.push(0);
        }
      }

      if (reverse) {
        line = line.reverse();
      }

      setLine(i, line);
    }

    if (prevState !== structuredClone(this.state)) {
      this.addRandomTile();
      this.updateGameStatus();
    }
  }

  moveLeft() {
    this.handleMove(
      (i) => this.state[i],
      (i, line) => {
        this.state[i] = line;
      },
    );
  }

  moveRight() {
    this.handleMove(
      (i) => this.state[i],
      (i, line) => {
        this.state[i] = line;
      },
      true,
    );
  }

  moveUp() {
    this.handleMove(
      (j) => this.state.map((row) => row[j]),
      (j, line) => {
        line.forEach((value, i) => {
          this.state[i][j] = value;
        });
      },
    );
  }

  moveDown() {
    this.handleMove(
      (j) => this.state.map((row) => row[j]),
      (j, line) => {
        line.forEach((value, i) => {
          this.state[i][j] = value;
        });
      },
      true,
    );
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
    this.state = structuredClone(this.initialState);
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.state = structuredClone(this.initialState);
    this.score = 0;
    this.status = 'idle';
    this.addRandomTile();
    this.addRandomTile();
  }

  addRandomTile() {
    const arrayForEmptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 0) {
          arrayForEmptyCells.push([i, j]);
        }
      }
    }

    if (arrayForEmptyCells.length > 0) {
      const [row, col] =
        arrayForEmptyCells[
          Math.floor(Math.random() * arrayForEmptyCells.length)
        ];

      this.state[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  hasWon() {
    return this.state.some((row) => row.some((cell) => cell === 2048));
  }

  canMove() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 0) {
          return true;
        }
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        const current = this.state[i][j];

        if (
          (i < 3 && current === this.state[i + 1][j]) ||
          (j < 3 && current === this.state[i][j + 1])
        ) {
          return true;
        }
      }
    }

    return false;
  }

  updateGameStatus() {
    if (this.hasWon()) {
      this.status = 'win';
    } else if (!this.canMove()) {
      this.status = 'lose';
    }
  }
}
