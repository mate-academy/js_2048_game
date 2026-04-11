'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  /**
   * Creates a new game instance.
   *
   * @param {number[][]} initialState
   * The initial state of the board.
   * @default
   * [[0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0],
   *  [0, 0, 0, 0]]
   *
   * If passed, the board will be initialized with the provided
   * initial state.
   */
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.score = 0;
    this.initialState = initialState;
    this.state = initialState.map((row) => [...row]); // копия
    this.status = 'idle';
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    let moveScore = 0;

    const newState = this.state.map((row) => {
      moveScore += this.countScore(row);

      return this.logicMoveLeft(row);
    });

    this.applyMove(newState, moveScore);
  }

  logicMoveLeft(row) {
    // console.log('row default:', row);

    const deleteZeros = row.filter((num) => num !== 0);
    const arrayResult = [];

    for (let i = 0; i < deleteZeros.length; i++) {
      if (deleteZeros[i] === deleteZeros[i + 1]) {
        arrayResult.push(deleteZeros[i] + deleteZeros[i + 1]);
        i++; // пропускаем следующий
      } else {
        arrayResult.push(deleteZeros[i]);
      }
    }

    while (arrayResult.length < 4) {
      arrayResult.push(0);
    }

    return arrayResult;
  }

  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    let moveScore = 0;

    const newState = this.state.map((row) => {
      moveScore += this.countScore(row);

      return this.logicMoveRight(row);
    });

    this.applyMove(newState, moveScore);
  }

  logicMoveRight(row) {
    const reversedArray = [...row].reverse();

    const movedLeft = this.logicMoveLeft(reversedArray);

    return movedLeft.reverse();
  }

  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    let moveScore = 0;

    const newState = [[], [], [], []];

    for (let i = 0; i < 4; i++) {
      const column = this.state.map((row) => row[i]);
      // console.log('column:', column);

      moveScore += this.countScore(column);

      const newColumn = this.logicMoveLeft(column);

      for (let j = 0; j < 4; j++) {
        newState[j][i] = newColumn[j];
      }
    }

    this.applyMove(newState, moveScore);
  }
  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    let moveScore = 0;

    const newState = [[], [], [], []];

    for (let i = 0; i < 4; i++) {
      const column = this.state.map((row) => row[i]);
      const reversedColumn = [...column].reverse();

      moveScore += this.countScore(reversedColumn);

      const movedColumn = this.logicMoveLeft(reversedColumn);
      const finalColumn = [...movedColumn].reverse();

      for (let j = 0; j < 4; j++) {
        newState[j][i] = finalColumn[j];
      }
    }

    this.applyMove(newState, moveScore);
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.state;
  }

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {
    return this.status;
  }

  /**
   * Starts the game.
   */

  addRandomBlocks() {
    // координаты всех пустых клеток :)
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomNum = Math.floor(Math.random() * emptyCells.length);
    const [row, col] = emptyCells[randomNum];

    this.state[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  start() {
    if (this.status !== 'idle') {
      return;
    }

    this.status = 'playing';

    this.addRandomBlocks();
    this.addRandomBlocks();
  }

  /**
   * Resets the game.
   */
  restart() {
    // создаём копию, чтобы не сломать restart
    this.state = this.initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
  }

  // Add your own methods here

  // сравниваем старое и новое состояние,
  // чтобы не добавлять плитку при пустом ходе
  applyMove(newState, moveScore) {
    let isChanged = false;

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] !== newState[i][j]) {
          isChanged = true;
          break;
        }
      }
    }

    if (isChanged) {
      this.state = newState;
      this.score += moveScore;
      this.addRandomBlocks();

      if (this.checkWin()) {
        this.status = 'win';

        return;
      }

      if (this.checkLose()) {
        this.status = 'lose';
      }
    }
  }

  countScore(row) {
    const deleteZeros = row.filter((num) => num !== 0);

    let score = 0;

    for (let i = 0; i < deleteZeros.length; i++) {
      if (deleteZeros[i] === deleteZeros[i + 1]) {
        const mergedValue = deleteZeros[i] + deleteZeros[i + 1];

        score += mergedValue;
        i++; // пропускаем следующий
      }
    }

    return score;
  }

  checkWin() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  checkLose() {
    // есть ли пустые клетки
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === 0) {
          return false;
        }
      }
    }

    // проверка по горизонтали
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        if (this.state[i][j] === this.state[i][j + 1]) {
          return false;
        }
      }
    }

    // проверка по вертикали
    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < 3; i++) {
        if (this.state[i][j] === this.state[i + 1][j]) {
          return false;
        }
      }
    }

    return true;
  }
}

module.exports = Game;
