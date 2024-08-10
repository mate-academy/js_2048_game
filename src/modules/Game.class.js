class Game {
  static STATUS = {
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
  ) {
    this.status = Game.STATUS.idle;
    this.initialState = initialState;
    this.state = initialState.map((row) => [...row]);
    this.score = 0;
  }

  start() {
    this.status = Game.STATUS.playing;
    this.getRandomCell();
    this.getRandomCell();
  }

  getRandomCell() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 0) {
          emptyCells.push([r, c]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const [randomR, randomC] =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.state[randomR][randomC] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  checkGameStatus() {
    let canMove = false;
    let hasEmptyCells = false;

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 2048) {
          this.status = Game.STATUS.win;

          return;
        }

        if (this.state[r][c] === 0) {
          hasEmptyCells = true;
        }

        if (
          (r < 3 && this.state[r][c] === this.state[r + 1][c]) ||
          (c < 3 && this.state[r][c] === this.state[r][c + 1])
        ) {
          canMove = true;
        }
      }
    }

    if (!canMove && !hasEmptyCells) {
      this.status = Game.STATUS.lose;
    }
  }

  moveLeft() {
    if (this.status === Game.STATUS.playing) {
      let canMove = false;

      for (let r = 0; r < 4; r++) {
        const values = [];

        for (let c = 0; c < 4; c++) {
          if (this.state[r][c] !== 0) {
            values.push(this.state[r][c]);
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

        const updatedRow = values.filter((value) => value !== 0);

        while (updatedRow.length < 4) {
          updatedRow.push(0);
        }

        for (let c = 0; c < 4; c++) {
          if (this.state[r][c] !== updatedRow[c]) {
            this.state[r][c] = updatedRow[c];
            canMove = true;
          }
        }
      }

      if (canMove) {
        this.getRandomCell();
        this.checkGameStatus();
      }
    }
  }

  moveRight() {
    if (this.status === Game.STATUS.playing) {
      let canMove = false;

      for (let r = 0; r < 4; r++) {
        const values = [];

        for (let c = 3; c >= 0; c--) {
          if (this.state[r][c] !== 0) {
            values.push(this.state[r][c]);
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

        const updatedRow = values.filter((value) => value !== 0);

        while (updatedRow.length < 4) {
          updatedRow.push(0);
        }

        for (let c = 0; c < 4; c++) {
          if (this.state[r][c] !== updatedRow[3 - c]) {
            this.state[r][c] = updatedRow[3 - c];
            canMove = true;
          }
        }
      }

      if (canMove) {
        this.getRandomCell();
        this.checkGameStatus();
      }
    }
  }

  moveUp() {
    if (this.status === Game.STATUS.playing) {
      let canMove = false;

      for (let c = 0; c < 4; c++) {
        const values = [];

        for (let r = 0; r < 4; r++) {
          if (this.state[r][c] !== 0) {
            values.push(this.state[r][c]);
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

        const updatedColumn = values.filter((value) => value !== 0);

        while (updatedColumn.length < 4) {
          updatedColumn.push(0);
        }

        for (let r = 0; r < 4; r++) {
          if (this.state[r][c] !== updatedColumn[r]) {
            this.state[r][c] = updatedColumn[r];
            canMove = true;
          }
        }
      }

      if (canMove) {
        this.getRandomCell();
        this.checkGameStatus();
      }
    }
  }

  moveDown() {
    if (this.status === Game.STATUS.playing) {
      let canMove = false;

      for (let c = 0; c < 4; c++) {
        const values = [];

        for (let r = 3; r >= 0; r--) {
          if (this.state[r][c] !== 0) {
            values.push(this.state[r][c]);
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

        const updatedColumn = values.filter((value) => value !== 0);

        while (updatedColumn.length < 4) {
          updatedColumn.push(0);
        }

        for (let r = 0; r < 4; r++) {
          if (this.state[r][c] !== updatedColumn[3 - r]) {
            this.state[r][c] = updatedColumn[3 - r];
            canMove = true;
          }
        }
      }

      if (canMove) {
        this.getRandomCell();
        this.checkGameStatus();
      }
    }
  }

  restart() {
    this.status = Game.STATUS.idle;
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
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
}

module.exports = Game;
