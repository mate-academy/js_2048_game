class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.initialState = initialState.map((stateRow) => [...stateRow]);
    this.state = initialState.map((stateRow) => [...stateRow]);
    this.score = 0;
    this.status = 'idle';
  }

  getState() {
    return this.state.map((stateRow) => [...stateRow]);
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';

    this.addRandomCell();
    this.addRandomCell();
  }

  restart() {
    this.state = this.initialState.map((stateRow) => [...stateRow]);
    this.score = 0;
    this.status = 'idle';
  }

  moveLeft() {
    this.moveHorizontal(false);
  }

  moveRight() {
    this.moveHorizontal(true);
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = this.getState();
    const transposed = this.transpose(this.state);
    const moved = transposed.map((line) => this.mergeLine(line));

    this.state = this.transpose(moved);

    if (this.isSameState(oldState, this.state)) {
      return;
    }

    this.finishMove();
  }

  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = this.getState();
    const transposed = this.transpose(this.state);

    const moved = transposed.map((line) => {
      return this.mergeLine([...line].reverse()).reverse();
    });

    this.state = this.transpose(moved);

    if (this.isSameState(oldState, this.state)) {
      return;
    }

    this.finishMove();
  }

  moveHorizontal(reverse) {
    if (this.status !== 'playing') {
      return;
    }

    const oldState = this.getState();

    this.state = this.state.map((stateRow) => {
      const line = reverse ? [...stateRow].reverse() : [...stateRow];

      const mergedLine = this.mergeLine(line);

      return reverse ? mergedLine.reverse() : mergedLine;
    });

    if (this.isSameState(oldState, this.state)) {
      return;
    }

    this.finishMove();
  }

  finishMove() {
    this.addRandomCell();

    if (this.has2048()) {
      this.status = 'win';

      return;
    }

    if (!this.canMove()) {
      this.status = 'lose';
    }
  }

  mergeLine(line) {
    const numbers = line.filter((value) => value !== 0);
    const result = [];

    for (let index = 0; index < numbers.length; index++) {
      if (numbers[index] === numbers[index + 1]) {
        const mergedValue = numbers[index] * 2;

        result.push(mergedValue);
        this.score += mergedValue;

        index++;
      } else {
        result.push(numbers[index]);
      }
    }

    while (result.length < 4) {
      result.push(0);
    }

    return result;
  }

  addRandomCell() {
    const emptyCells = [];

    for (let cellRow = 0; cellRow < 4; cellRow++) {
      for (let cellColumn = 0; cellColumn < 4; cellColumn++) {
        if (this.state[cellRow][cellColumn] === 0) {
          emptyCells.push([cellRow, cellColumn]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const [randomRow, randomColumn] = emptyCells[randomIndex];

    this.state[randomRow][randomColumn] = Math.random() < 0.9 ? 2 : 4;
  }

  transpose(state) {
    const result = [];

    for (let columnIndex = 0; columnIndex < 4; columnIndex++) {
      result[columnIndex] = [];

      for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
        result[columnIndex].push(state[rowIndex][columnIndex]);
      }
    }

    return result;
  }

  isSameState(firstState, secondState) {
    return JSON.stringify(firstState) === JSON.stringify(secondState);
  }

  has2048() {
    return this.state.some((stateRow) => stateRow.includes(2048));
  }

  canMove() {
    for (const stateRow of this.state) {
      if (stateRow.includes(0)) {
        return true;
      }
    }

    for (let rowIndex = 0; rowIndex < 4; rowIndex++) {
      for (let columnIndex = 0; columnIndex < 3; columnIndex++) {
        if (
          this.state[rowIndex][columnIndex] ===
          this.state[rowIndex][columnIndex + 1]
        ) {
          return true;
        }
      }
    }

    for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
      for (let columnIndex = 0; columnIndex < 4; columnIndex++) {
        if (
          this.state[rowIndex][columnIndex] ===
          this.state[rowIndex + 1][columnIndex]
        ) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
