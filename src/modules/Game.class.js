class Game {
  constructor(initialState) {
    this.state = initialState || this.createInitialState();
    this.score = 0;
    this.status = 'idle';
    this.start();
  }

  createInitialState() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  generateRandomTile() {
    const emptyCells = [];

    this.state.forEach((currentRow, r) => {
      currentRow.forEach((cell, c) => {
        if (cell === 0) {
          emptyCells.push([r, c]);
        }
      });
    });

    if (emptyCells.length === 0) {
      return this.updateStatus();
    }

    const [row, col] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];

    this.state[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  updateStatus() {
    this.status = this.state.flat().includes(2048)
      ? 'win'
      : this.canMove()
        ? 'playing'
        : 'lose';
  }

  canMove() {
    return this.state.some(
      (currentRow, r) =>
        currentRow.some(
          (cell, c) =>
            cell === 0 ||
            (c < 3 && cell === currentRow[c + 1]) ||
            (r < 3 && cell === this.state[r + 1][c]),
        ),
      // eslint-disable-next-line function-paren-newline
    );
  }

  move(direction) {
    const moveRow = (row) => {
      const newRow = row.filter(Boolean);
      const mergedRow = [];

      for (let i = 0; i < newRow.length; i++) {
        if (newRow[i] === newRow[i + 1]) {
          mergedRow.push(newRow[i] * 2);
          this.score += newRow[i] * 2;
          i++;
        } else {
          mergedRow.push(newRow[i]);
        }
      }

      return [...mergedRow, ...Array(4 - mergedRow.length).fill(0)];
    };

    const moveOperations = {
      left: () => {
        this.state = this.state.map(moveRow);
      },
      right: () => {
        this.state = this.state
          .map((row) => moveRow(row.reverse()))
          .map((row) => row.reverse());
      },
      up: () => {
        this.transpose();
        this.state = this.state.map(moveRow);
        this.transpose();
      },
      down: () => {
        this.transpose();

        this.state = this.state
          .map((row) => moveRow(row.reverse()))
          .map((row) => row.reverse());
        this.transpose();
      },
    };

    const previousState = JSON.stringify(this.state);

    moveOperations[direction]();

    if (previousState !== JSON.stringify(this.state)) {
      this.generateRandomTile();
      this.updateStatus();
    }
  }

  transpose() {
    this.state = this.state[0].map(
      (_, colIndex) => this.state.map((row) => row[colIndex]),
      // eslint-disable-next-line function-paren-newline
    );
  }

  start() {
    this.score = 0;
    this.state = this.createInitialState();
    this.status = 'playing';
    this.generateRandomTile();
    this.generateRandomTile();
  }

  restart() {
    this.start();
  }

  getState() {
    return this.state;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }
}

export default Game;
