class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.score = 0;
    this.status = 'idle';
    this.initialState = initialState;
    this.state = this.copyState(this.initialState);
  }

  copyState(state) {
    return state.map((row) => [...row]);
  }

  addRandomTile() {
    const emptyTiles = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          emptyTiles.push([row, col]);
        }
      }
    }

    if (emptyTiles.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyTiles.length);

      const [row, col] = emptyTiles[randomIndex];

      this.state[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const moved = this.move('left');

    if (moved) {
      this.addRandomTile();
      this.checkGameState();
    }
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const moved = this.move('right');

    if (moved) {
      this.addRandomTile();
      this.checkGameState();
    }
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const moved = this.move('up');

    if (moved) {
      this.addRandomTile();
      this.checkGameState();
    }
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const moved = this.move('down');

    if (moved) {
      this.addRandomTile();
      this.checkGameState();
    }
  }

  move(direction) {
    const originalState = this.copyState(this.state);

    const combineRow = (row) => {
      const newRow = row.filter((n) => n !== 0);

      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          newRow[i + 1] = 0;
          this.score += newRow[i];
        }
      }

      return newRow.filter((n) => n !== 0);
    };

    const moveRowLeft = (row) => {
      const newRow = combineRow(row);

      while (newRow.length < 4) {
        newRow.push(0);
      }

      return newRow;
    };

    const moveRowRight = (row) => {
      const copyRow = [...row];

      const newRow = combineRow(copyRow.reverse());

      while (newRow.length < 4) {
        newRow.push(0);
      }

      return newRow.reverse();
    };

    const moveStateLeft = (state) => {
      return state.map((row) => moveRowLeft(row));
    };

    const moveStateRight = (state) => {
      return state.map((row) => moveRowRight(row));
    };

    switch (direction) {
      case 'left':
        this.state = moveStateLeft(this.state);
        break;

      case 'right':
        this.state = moveStateRight(this.state);
        break;

      case 'up':
        this.state = this.transposeState(
          moveStateLeft(this.transposeState(this.state)),
        );
        break;

      case 'down':
        this.state = this.transposeState(
          moveStateRight(this.transposeState(this.state)),
        );
        break;
    }

    return !this.areStatesEqual(this.state, originalState);
  }

  checkGameState() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 2048) {
          this.status = 'win';

          return;
        }
      }
    }

    if (this.hasEmptyCells() || this.canCombine()) {
      return;
    }
    this.status = 'lose';
  }

  hasEmptyCells() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          return true;
        }
      }
    }

    return false;
  }

  canCombine() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const current = this.state[row][col];

        if (col < 3 && current === this.state[row][col + 1]) {
          return true;
        }

        if (row < 3 && current === this.state[row + 1][col]) {
          return true;
        }
      }
    }

    return false;
  }

  transposeState(state) {
    const result = [];

    for (let col = 0; col < 4; col++) {
      result[col] = [];

      for (let row = 0; row < 4; row++) {
        result[col].push(state[row][col]);
      }
    }

    return result;
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
    if (this.status === 'idle') {
      this.status = 'playing';
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  restart() {
    this.state = this.copyState(this.initialState);
    this.score = 0;
    this.status = 'idle';
  }

  areStatesEqual(state1, state2) {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (state1[row][col] !== state2[row][col]) {
          return false;
        }
      }
    }

    return true;
  }
}

module.exports = Game;
