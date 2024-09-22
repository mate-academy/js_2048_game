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
    this.currentState = JSON.parse(JSON.stringify(this.initialState));
    this.status = 'idle';
    this.score = 0;

    this.left = 'ArrowLeft';
    this.right = 'ArrowRight';
    this.up = 'ArrowUp';
    this.down = 'ArrowDown';
  }

  moveLeft() {
    if (this.status === 'playing') {
      this.slideTiles(this.left, this.currentState);
    }
  }
  moveRight() {
    if (this.status === 'playing') {
      this.slideTiles(this.right, this.currentState);
    }
  }
  moveUp() {
    if (this.status === 'playing') {
      this.slideTiles(this.up, this.currentState);
    }
  }
  moveDown() {
    if (this.status === 'playing') {
      this.slideTiles(this.down, this.currentState);
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
    this.status = 'playing';
    this.getRandomMatrixValue();
    this.getRandomMatrixValue();
  }

  restart() {
    this.score = 0;
    this.status = 'idle';
    this.currentState = JSON.parse(JSON.stringify(this.initialState));
  }

  getRandomValue() {
    return Math.random() > 0.9 ? 4 : 2;
  }

  getRandomCell() {
    const emptyCells = [];

    for (let i = 0; i < this.currentState.length; i++) {
      for (let j = 0; j < this.currentState[i].length; j++) {
        if (this.currentState[i][j] === 0) {
          emptyCells.push({ row: i, col: j });
        }
      }
    }

    if (emptyCells.length === 0) {
      return null;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);

    return emptyCells[randomIndex];
  }

  getRandomMatrixValue() {
    const { row, col } = this.getRandomCell();
    const value = this.getRandomValue();

    if (row >= 0 && col >= 0 && value !== 0) {
      this.currentState[row][col] = value;
    }
  }

  groupCellsByColumn(matrix) {
    const newGroup = [];

    if (matrix.length > 0) {
      for (let j = 0; j < matrix.length; j++) {
        newGroup.push(matrix.map((row) => row[j]));
      }
    }

    return newGroup;
  }

  slideTiles(direction, groupedMatrix) {
    let hasChanged = false;

    if (direction === this.left || direction === this.right) {
      for (let i = 0; i < groupedMatrix.length; i++) {
        const row = this.currentState[i];
        const newGroup = this.slideTilesInGroup(row, direction === this.right);

        if (row.join(',') !== newGroup.join(',')) {
          hasChanged = true;
          this.currentState[i] = newGroup;
        }
      }
    } else if (direction === this.up || direction === this.down) {
      for (let j = 0; j < groupedMatrix.length; j++) {
        const column = this.currentState.map((line) => line[j]);
        const newColumn = this.slideTilesInGroup(
          column,
          direction === this.down,
        );

        for (let i = 0; i < groupedMatrix.length; i++) {
          if (this.currentState[i][j] !== newColumn[i]) {
            hasChanged = true;
            this.currentState[i][j] = newColumn[i];
          }
        }
      }
    }

    if (hasChanged) {
      this.getRandomMatrixValue();
      this.checkGameOver();
    }
  }

  slideTilesInGroup(group, isReverse) {
    const newGroup = group.filter((cell) => cell !== 0);

    if (isReverse) {
      newGroup.reverse();
    }

    for (let i = 0; i < newGroup.length; i++) {
      if (newGroup[i] === newGroup[i + 1]) {
        newGroup[i] *= 2;

        this.score += newGroup[i];
        newGroup.splice(i + 1, 1);

        if (newGroup[i] === 2048) {
          this.status = 'win';
        }
      }
    }

    while (newGroup.length < group.length) {
      newGroup.push(0);
    }

    if (isReverse) {
      newGroup.reverse();
    }

    return newGroup;
  }

  checkGameOver() {
    for (let i = 0; i < this.currentState.length; i++) {
      for (let j = 0; j < this.currentState[i].length; j++) {
        if (this.currentState[i][j] === 0) {
          return;
        }

        if (
          j < this.currentState[i].length - 1 &&
          this.currentState[i][j] === this.currentState[i][j + 1]
        ) {
          return;
        }

        if (
          i < this.currentState[i].length - 1 &&
          this.currentState[i][j] === this.currentState[i + 1][j]
        ) {
          return;
        }
      }
    }

    this.status = 'lose';
  }
}

module.exports = Game;
