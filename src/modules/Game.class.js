export class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.initialState = initialState;
    this.state = initialState.map((row) => [...row]);
    this.status = 'idle';
    this.score = 0;
  }

  moveLeft() {
    this.move('left');
  }

  moveRight() {
    this.move('right');
  }

  moveUp() {
    this.move('up');
  }

  moveDown() {
    this.move('down');
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

  start(buttonStart, buttonRestart) {
    const startMessage = document.querySelector('.message-start');

    buttonStart.classList.add('hidden');
    buttonRestart.classList.remove('hidden');
    startMessage.classList.add('hidden');
    this.status = 'playing';
    this.resetTable();

    if (this.isEmptyCells()) {
      const [randomRow, randomColumn, randomNumber] = this.generateNumber();

      this.state[randomRow][randomColumn] = randomNumber;
      this.addNumberToTable(randomRow, randomColumn, randomNumber);
    }
  }

  restart(buttonRestart, buttonStart) {
    const startMessage = document.querySelector('.message-start');
    const loseMessage = document.querySelector('.message-lose');
    const winMessage = document.querySelector('.message-win');

    this.state = this.initialState.map((row) => [...row]);
    this.status = 'idle';
    this.changeScore(0);
    buttonStart.classList.remove('hidden');
    buttonRestart.classList.add('hidden');
    startMessage.classList.remove('hidden');
    loseMessage.classList.add('hidden');
    winMessage.classList.add('hidden');

    this.resetTable();
  }

  gameOver() {
    const loseMessage = document.querySelector('.message-lose');

    loseMessage.classList.remove('hidden');
    this.status = 'lose';
  }

  win() {
    const winMessage = document.querySelector('.message-win');

    winMessage.classList.remove('hidden');
    this.status = 'win';
  }

  generateNumber() {
    let randomRow = 0;
    let randomColumn = 0;
    const randomNumber = Math.random() > 0.9 ? 4 : 2;

    do {
      randomRow = Math.round(Math.random() * 3);
      randomColumn = Math.round(Math.random() * 3);
    } while (this.state[randomRow][randomColumn] !== 0);

    return [randomRow, randomColumn, randomNumber];
  }

  addNumberToTable(row, column, number) {
    const tableRow = document.querySelectorAll('.field-row')[row];
    const tableColumn = tableRow.querySelectorAll('.field-cell')[column];

    tableColumn.classList.forEach((cls) => {
      if (cls.startsWith('field-cell--')) {
        tableColumn.classList.remove(cls);
      }
    });

    tableColumn.textContent = number;
    tableColumn.classList.add(`field-cell--${number}`);
  }

  removeNumberFromTable(row, column) {
    const tableRow = document.querySelectorAll('.field-row')[row];
    const tableColumn = tableRow.querySelectorAll('.field-cell')[column];

    tableColumn.textContent = '';

    tableColumn.classList.forEach((cls) => {
      if (cls.startsWith('field-cell--')) {
        tableColumn.classList.remove(cls);
      }
    });
  }

  resetTable() {
    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        if (this.initialState[row][column] !== 0) {
          this.addNumberToTable(row, column, this.initialState[row][column]);
        } else {
          this.removeNumberFromTable(row, column);
        }
      }
    }
  }

  isEqualStates(state1, state2) {
    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        if (state1[row][column] !== state2[row][column]) {
          return false;
        }
      }
    }

    return true;
  }

  move(direction) {
    const previousState = this.state.map((row) => [...row]);
    const isLeftRightDirection = 'left right'.includes(direction);
    const isUpLeft = 'left up'.includes(direction);

    for (let i = 0; i < 4; i++) {
      let emptyCell = -1;
      const firstNeighbour = {
        index: -1,
        number: -1,
      };

      const [start, step] = isUpLeft ? [0, 1] : [3, -1];

      for (let j = start; j < 4 && j >= 0; j += step) {
        const [firstIndex, secondIndex] = isLeftRightDirection
          ? [i, j]
          : [j, i];
        const currentValue = this.state[firstIndex][secondIndex];

        if (currentValue === 0) {
          if (isLeftRightDirection) {
            emptyCell = emptyCell === -1 ? secondIndex : emptyCell;
          } else {
            emptyCell = emptyCell === -1 ? firstIndex : emptyCell;
          }
          continue;
        }

        if (
          firstNeighbour.index !== -1 &&
          firstNeighbour.number === currentValue
        ) {
          if (isLeftRightDirection) {
            this.state[firstIndex][firstNeighbour.index] = currentValue * 2;

            this.addNumberToTable(
              firstIndex,
              firstNeighbour.index,
              currentValue * 2,
            );

            emptyCell = isUpLeft
              ? Math.min(emptyCell, secondIndex)
              : Math.max(emptyCell, secondIndex);
            emptyCell = emptyCell === -1 ? secondIndex : emptyCell;
          } else {
            this.state[firstNeighbour.index][secondIndex] = currentValue * 2;

            this.addNumberToTable(
              firstNeighbour.index,
              secondIndex,
              currentValue * 2,
            );

            emptyCell = isUpLeft
              ? Math.min(emptyCell, firstIndex)
              : Math.max(emptyCell, firstIndex);
            emptyCell = emptyCell === -1 ? firstIndex : emptyCell;
          }
          this.state[firstIndex][secondIndex] = 0;
          this.changeScore(currentValue * 2);
          this.removeNumberFromTable(firstIndex, secondIndex);

          firstNeighbour.index = -1;
          firstNeighbour.number = -1;

          if (currentValue * 2 === 2048) {
            this.win();
          }

          continue;
        }

        if (emptyCell !== -1) {
          if (isLeftRightDirection) {
            this.state[firstIndex][emptyCell] = currentValue;

            this.addNumberToTable(firstIndex, emptyCell, currentValue);
          } else {
            this.state[emptyCell][secondIndex] = currentValue;

            this.addNumberToTable(emptyCell, secondIndex, currentValue);
          }
          this.removeNumberFromTable(firstIndex, secondIndex);

          this.state[firstIndex][secondIndex] = 0;

          firstNeighbour.index = emptyCell;
          firstNeighbour.number = currentValue;
          emptyCell += isUpLeft ? 1 : -1;

          continue;
        }

        firstNeighbour.index = isLeftRightDirection ? secondIndex : firstIndex;
        firstNeighbour.number = currentValue;
      }
    }

    if (!this.isEqualStates(previousState, this.state)) {
      if (this.isEmptyCells()) {
        const [randomRow, randomColumn, randomNumber] = this.generateNumber();

        this.state[randomRow][randomColumn] = randomNumber;
        this.addNumberToTable(randomRow, randomColumn, randomNumber);
      }
    }

    if (!this.hasAvailableMoves()) {
      this.gameOver();
    }
  }

  changeScore(newScore) {
    const score = document.querySelector('.game-score');

    score.textContent = newScore;
    this.score = newScore;
  }

  isEmptyCells() {
    for (const row of this.state) {
      for (const column of row) {
        if (column === 0) {
          return true;
        }
      }
    }

    return false;
  }

  hasAvailableMoves() {
    if (this.isEmptyCells()) {
      return true;
    }

    for (let row = 0; row < 4; row++) {
      for (let column = 0; column < 4; column++) {
        if (row - 1 >= 0) {
          if (this.state[row][column] === this.state[row - 1][column]) {
            return true;
          }
        }

        if (row + 1 <= 3) {
          if (this.state[row][column] === this.state[row + 1][column]) {
            return true;
          }
        }

        if (column - 1 >= 0) {
          if (this.state[row][column] === this.state[row][column - 1]) {
            return true;
          }
        }

        if (column + 1 <= 3) {
          if (this.state[row][column] === this.state[row][column + 1]) {
            return true;
          }
        }
      }
    }

    return false;
  }
}
