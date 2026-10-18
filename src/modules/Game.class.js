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

  score = 0;
  status = 'idle';
  emptyState;
  apearCells = [];
  unitedCells = [];

  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.state = initialState;
    this.emptyState = initialState.map((row) => [...row]);
  }

  moveLeft() {
    const oldState = this.getState();

    for (let i = 0; i < this.state.length; i++) {
      let fullPlates = this.state[i].filter((plate) => plate > 0);

      for (let j = 1; j < fullPlates.length; j++) {
        if (fullPlates[j] === fullPlates[j - 1]) {
          fullPlates[j - 1] = fullPlates[j] + fullPlates[j - 1];
          fullPlates[j] = 0;
          this.unitedCells.push([i, j - 1]);
          this.score += fullPlates[j - 1];
          continue;
        }
      }
      fullPlates = fullPlates.filter((plate) => plate > 0);
      this.state[i] = [...fullPlates];

      for (let y = 0; y < 4 - fullPlates.length; y++) {
        this.state[i].push(0);
      }
    }

    if (this.hasChanged(oldState)) {
      this.apearCells.push(this.spawnTile());
    }

    const winning = this.hasWon();

    if (!winning) {
      const continiuPlaying = this.hasAvailableMoves();

      if (!continiuPlaying) {
        this.status = 'lost';
      }
    }
  }

  moveRight() {
    const oldState = this.getState();

    for (let i = 0; i < this.state.length; i++) {
      let fullPlates = [...this.state[i]]
        .reverse()
        .filter((plate) => plate > 0);

      for (let j = 1; j < fullPlates.length; j++) {
        if (fullPlates[j] === fullPlates[j - 1]) {
          fullPlates[j - 1] = fullPlates[j] + fullPlates[j - 1];
          fullPlates[j] = 0;

          const compactIndex =
            fullPlates.slice(0, j).filter((plate) => plate > 0).length - 1;

          this.unitedCells.push([i, 3 - compactIndex]);
          this.score += fullPlates[j - 1];
          continue;
        }
      }
      fullPlates = fullPlates.filter((plate) => plate > 0);
      this.state[i] = [...fullPlates];

      for (let y = 0; y < 4 - fullPlates.length; y++) {
        this.state[i].push(0);
      }

      this.state[i].reverse();
    }

    if (this.hasChanged(oldState)) {
      this.apearCells.push(this.spawnTile());
    }

    const winning = this.hasWon();

    if (!winning) {
      const continiuPlaying = this.hasAvailableMoves();

      if (!continiuPlaying) {
        this.status = 'lost';
      }
    }
  }

  moveUp() {
    const oldState = this.getState();

    for (let i = 0; i < this.state.length; i++) {
      const column = this.state.map((row) => row[i]);

      let fullPlates = column.filter((plate) => plate > 0);

      for (let j = 1; j < fullPlates.length; j++) {
        if (fullPlates[j] === fullPlates[j - 1]) {
          fullPlates[j - 1] += fullPlates[j];
          fullPlates[j] = 0;
          this.unitedCells.push([j - 1, i]);
          this.score += fullPlates[j - 1];
          j++;
        }
      }

      fullPlates = fullPlates.filter((plate) => plate > 0);

      while (fullPlates.length < 4) {
        fullPlates.push(0);
      }

      for (let j = 0; j < this.state.length; j++) {
        this.state[j][i] = fullPlates[j];
      }
    }

    if (this.hasChanged(oldState)) {
      this.apearCells.push(this.spawnTile());
    }

    const winning = this.hasWon();

    if (!winning) {
      const continiuPlaying = this.hasAvailableMoves();

      if (!continiuPlaying) {
        this.status = 'lost';
      }
    }
  }

  moveDown() {
    const oldState = this.getState();

    for (let i = 0; i < this.state.length; i++) {
      const column = [...this.state].reverse().map((row) => row[i]);

      let fullPlates = column.filter((plate) => plate > 0);

      for (let j = 1; j < fullPlates.length; j++) {
        if (fullPlates[j] === fullPlates[j - 1]) {
          fullPlates[j - 1] += fullPlates[j];
          fullPlates[j] = 0;

          const compactIndex =
            fullPlates.slice(0, j).filter((plate) => plate > 0).length - 1;

          this.unitedCells.push([3 - compactIndex, i]);
          this.score += fullPlates[j - 1];
          j++;
        }
      }

      fullPlates = fullPlates.filter((plate) => plate > 0);

      while (fullPlates.length < 4) {
        fullPlates.push(0);
      }

      fullPlates.reverse();

      for (let j = 0; j < this.state.length; j++) {
        this.state[j][i] = fullPlates[j];
      }
    }

    if (this.hasChanged(oldState)) {
      this.apearCells.push(this.spawnTile());
    }

    const winning = this.hasWon();

    if (!winning) {
      const continiuPlaying = this.hasAvailableMoves();

      if (!continiuPlaying) {
        this.status = 'lost';
      }
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.state.map((row) => [...row]);
  }

  getStatus() {
    return this.status;
  }

  start() {
    if (this.status === 'idle') {
      this.status = 'playing';

      const coord1 = this.spawnTile();
      const coord2 = this.spawnTile();

      if (coord1) {
        this.apearCells.push(coord1);
      }

      if (coord2) {
        this.apearCells.push(coord2);
      }
    }
  }

  restart() {
    this.apearCells.length = 0;

    this.status = 'idle';
    this.score = 0;
    this.state = this.emptyState.map((row) => [...row]);
  }

  // Add your own methods here
  getEmptyCells() {
    const coords = [];

    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        if (this.state[i][j] === 0) {
          coords.push([i, j]);
        }
      }
    }

    return coords;
  }

  getRandomEmptyCell() {
    const emptyStates = this.getEmptyCells();
    const index = Math.floor(Math.random() * emptyStates.length);

    return emptyStates[index];
  }

  spawnTile() {
    const coordinate = this.getRandomEmptyCell();

    if (!coordinate) {
      return;
    }

    if (Math.random() < 0.9) {
      this.state[coordinate[0]][coordinate[1]] = 2;
    } else {
      this.state[coordinate[0]][coordinate[1]] = 4;
    }

    return [...coordinate];
  }

  getAnimatedCoords() {
    return [...this.apearCells];
  }

  getUnitedCoords() {
    return [...this.unitedCells];
  }

  hasChanged(oldState) {
    for (let i = 0; i < this.state.length; i++) {
      const ifHasChanged = this.state[i].some(
        (plate, index) => oldState[i][index] !== plate,
      );

      if (ifHasChanged) {
        return true;
      }
    }

    return false;
  }

  hasWon() {
    const currentState = this.getState();

    for (const row of currentState) {
      for (const plate of row) {
        if (plate === 2048) {
          this.status = 'won';

          return true;
        }
      }
    }

    return false;
  }

  hasAvailableMoves() {
    const currentState = this.getState();

    // проверка на горизонтальные обьединения и пустые ячейки
    for (let i = 0; i < currentState.length; i++) {
      for (let j = 0; j < currentState[i].length; j++) {
        if (currentState[i][j] === 0) {
          return true;
        }

        if (j === currentState[i].length - 1) {
          break;
        }

        if (currentState[i][j] === currentState[i][j + 1]) {
          return true;
        }
      }
    }

    // проверка на вертикальные обьединения и пустые ячейки
    for (let i = 0; i < currentState.length; i++) {
      const column = currentState.map((row) => row[i]);

      for (let j = 0; j < column.length; j++) {
        if (column[j] === 0) {
          return true;
        }

        if (j === column.length - 1) {
          break;
        }

        if (column[j] === column[j + 1]) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
