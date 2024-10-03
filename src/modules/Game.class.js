class Game {
  constructor(initialState) {
    this.state = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'idle';
  }

  generateRandomTile() {
    const emptyCells = [];

    this.state.forEach((currentRow, rowIndex) => {
      currentRow.forEach((cell, colIndex) => {
        if (cell === 0) {
          emptyCells.push([rowIndex, colIndex]);
        }
      });
    });

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [row, col] = emptyCells[randomIndex];

    this.state[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  updateStatus() {
    if (this.state.flat().includes(2048)) {
      this.status = 'win';
    } else if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  canMove() {
    return this.state.some((row, rowIndex) =>
      row.some((cell, colIndex) => {
        if (cell === 0) {
          return true;
        }

        if (
          colIndex < 3 &&
          this.state[rowIndex][colIndex] === this.state[rowIndex][colIndex + 1]
        ) {
          return true;
        }

        if (
          rowIndex < 3 &&
          this.state[rowIndex][colIndex] === this.state[rowIndex + 1][colIndex]
        ) {
          return true;
        }

        return false;
        // eslint-disable-next-line
      }));
  }

  moveLeft() {
    let moved = false;

    this.state = this.state.map((row) => {
      const newRow = row.filter((val) => val);

      while (newRow.length < 4) {
        newRow.push(0);
      }

      for (let i = 0; i < 3; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          this.score += newRow[i];
          newRow.splice(i + 1, 1);
          newRow.push(0);
          moved = true;
        }
      }

      return newRow;
    });

    if (moved) {
      this.generateRandomTile();
    }
    this.updateStatus();
  }

  moveRight() {
    this.state = this.state.map((row) => row.reverse());
    this.moveLeft();
    this.state = this.state.map((row) => row.reverse());
  }

  moveUp() {
    this.transpose();
    this.moveLeft();
    this.transpose();
  }

  moveDown() {
    this.transpose();
    this.moveRight();
    this.transpose();
  }

  transpose() {
    this.state = this.state[0].map(
      (_, colIndex) => this.state.map((row) => row[colIndex]),
      // eslint-disable-next-line function-paren-newline
    );
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

  start() {
    this.state = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'playing';
    this.generateRandomTile();
    this.generateRandomTile();
  }

  restart() {
    this.start();
  }
}

module.exports = Game;
