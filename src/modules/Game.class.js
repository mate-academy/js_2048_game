export default class Game {
  static STATUS = {
    IDLE: 'idle',
    PLAYING: 'playing',
    WIN: 'win',
    LOSE: 'lose',
  };

  static SIZE = 4;

  static GRID = Array.from({ length: Game.SIZE }, () => {
    return new Array(Game.SIZE).fill(0);
  });

  constructor() {
    this.initialState = Game.GRID;
    this.currentState = this.initialState.map((row) => [...row]);
    this.status = Game.STATUS.IDLE;
    this.score = 0;
  }

  moveLeft() {
    if (this.status !== Game.STATUS.PLAYING) {
      return;
    }

    let canMove = false;

    for (let row = 0; row < Game.SIZE; row++) {
      const values = [];

      for (let col = 0; col < Game.SIZE; col++) {
        if (this.currentState[row][col] !== 0) {
          values.push(this.currentState[row][col]);
        }
      }

      for (let i = 0; i < values.length; i++) {
        if (values[i] === values[i + 1]) {
          values[i] *= 2;
          values[i + 1] = 0;
          this.score += values[i];
          canMove = true;
        }
      }

      const newRow = values.filter((val) => val !== 0);

      while (newRow.length < Game.SIZE) {
        newRow.push(0);
      }

      for (let col = 0; col < Game.SIZE; col++) {
        if (this.currentState[row][col] !== newRow[col]) {
          this.currentState[row][col] = newRow[col];
          canMove = true;
        }
      }
    }

    if (canMove) {
      this.addRandomTile();
      this.checkStatus();
    }
  }

  moveRight() {
    if (this.status !== Game.STATUS.PLAYING) {
      return;
    }

    let canMove = false;

    for (let row = 0; row < Game.SIZE; row++) {
      const values = [];

      for (let col = 3; col >= 0; col--) {
        if (this.currentState[row][col] !== 0) {
          values.push(this.currentState[row][col]);
        }
      }

      for (let i = 0; i < values.length; i++) {
        if (values[i] === values[i + 1]) {
          values[i] *= 2;
          values[i + 1] = 0;
          this.currentScore += values[i];
          canMove = true;
        }
      }

      const newRow = values.filter((val) => val !== 0);

      while (newRow.length < Game.SIZE) {
        newRow.push(0);
      }

      for (let col = 0; col < Game.SIZE; col++) {
        if (this.currentState[row][col] !== newRow[3 - col]) {
          this.currentState[row][col] = newRow[3 - col];
          canMove = true;
        }
      }
    }

    if (canMove) {
      this.addRandomTile();
      this.checkStatus();
    }
  }

  moveUp() {
    if (this.status !== Game.STATUS.PLAYING) {
      return;
    }

    let canMove = false;

    for (let col = 0; col < Game.SIZE; col++) {
      const values = [];

      for (let row = 0; row < Game.SIZE; row++) {
        if (this.currentState[row][col] !== 0) {
          values.push(this.currentState[row][col]);
        }
      }

      for (let i = 0; i < values.length; i++) {
        if (values[i] === values[i + 1]) {
          values[i] *= 2;
          values[i + 1] = 0;
          this.score += values[i];
          canMove = true;
        }
      }

      const newColumn = values.filter((val) => val !== 0);

      while (newColumn.length < Game.SIZE) {
        newColumn.push(0);
      }

      for (let row = 0; row < Game.SIZE; row++) {
        if (this.currentState[row][col] !== newColumn[row]) {
          this.currentState[row][col] = newColumn[row];
          canMove = true;
        }
      }
    }

    if (canMove) {
      this.addRandomTile();
      this.checkStatus();
    }
  }

  moveDown() {
    if (this.status !== Game.STATUS.PLAYING) {
      return;
    }

    let canMove = false;

    for (let col = 0; col < Game.SIZE; col++) {
      const values = [];

      for (let row = 3; row >= 0; row--) {
        if (this.currentState[row][col] !== 0) {
          values.push(this.currentState[row][col]);
        }
      }

      for (let i = 0; i < values.length; i++) {
        if (values[i] === values[i + 1]) {
          values[i] *= 2;
          values[i + 1] = 0;
          this.score += values[i];
          canMove = true;
        }
      }

      const newColumn = values.filter((val) => val !== 0);

      while (newColumn.length < Game.SIZE) {
        newColumn.push(0);
      }

      for (let row = 0; row < Game.SIZE; row++) {
        if (this.currentState[row][col] !== newColumn[3 - row]) {
          this.currentState[row][col] = newColumn[3 - row];
          canMove = true;
        }
      }
    }

    if (canMove) {
      this.addRandomTile();
      this.checkStatus();
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.currentState;
  }

  getStatus() {
    return this.status;
  }

  start() {
    this.status = Game.STATUS.PLAYING;

    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {
    this.currentState = this.initialState.map((row) => [...row]);
    this.status = Game.STATUS.IDLE;
    this.score = 0;
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < Game.SIZE; row++) {
      for (let col = 0; col < Game.SIZE; col++) {
        if (this.currentState[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const [row, col] = emptyCells[randomIndex];

      this.currentState[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  checkStatus() {
    let hasEmptyCells = false;
    let canMove = false;

    for (let row = 0; row < Game.SIZE; row++) {
      for (let col = 0; col < Game.SIZE; col++) {
        const current = this.currentState[row][col];

        if (current === 2048) {
          this.status = Game.STATUS.WIN;

          return;
        }

        if (current === 0) {
          hasEmptyCells = true;
        }

        if (
          (col < 3 && current === this.currentState[row][col + 1]) ||
          (row < 3 && current === this.currentState[row + 1][col])
        ) {
          canMove = true;
        }
      }
    }

    if (!hasEmptyCells && !canMove) {
      this.status = Game.STATUS.LOSE;
    }
  }
}
