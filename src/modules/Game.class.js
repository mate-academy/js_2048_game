'use strict';
class Game {
  static defaultState = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  static FOUR_SPAWN_CHANCE = 0.1;

  static getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  constructor(initialState = Game.defaultState) {
    this.initialState = initialState.map((row) => [...row]);
    this.state = initialState.map((row) => [...row]);
    this.score = 0;
    this.status = 'idle';
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

  updateStatus() {
    if (this.checkWin()) {
      this.status = 'win';
    } else if (this.checkLose()) {
      this.status = 'lose';
    }
  }

  start() {
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }
  restart() {
    this.status = 'idle';
    this.score = 0;
    this.state = this.initialState.map((row) => [...row]);
  }

  checkWin() {
    return this.getState().some((row) => row.some((cell) => cell === 2048));
  }

  checkLose() {
    const currentState = this.getState();

    for (let i = 0; i < currentState.length; i++) {
      if (currentState[i].some((cell) => cell === 0)) {
        return false;
      }

      for (let j = 0; j < currentState[i].length - 1; j++) {
        if (currentState[i][j] === currentState[i][j + 1]) {
          return false;
        }
      }
    }

    for (let i = 0; i < currentState.length; i++) {
      const collumnToCheck = [];

      for (let j = 0; j < currentState.length; j++) {
        collumnToCheck.push(currentState[j][i]);
      }

      for (let j = 0; j < currentState[i].length - 1; j++) {
        if (collumnToCheck[j] === collumnToCheck[j + 1]) {
          return false;
        }
      }
    }

    return true;
  }

  addRandomTile() {
    const emptyCells = [];

    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (this.state[r][c] === 0) {
          emptyCells.push([r, c]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Game.getRandomInt(emptyCells.length);

    if (Math.random() < Game.FOUR_SPAWN_CHANCE) {
      this.state[emptyCells[randomIndex][0]][emptyCells[randomIndex][1]] = 4;
    } else {
      this.state[emptyCells[randomIndex][0]][emptyCells[randomIndex][1]] = 2;
    }
  }

  moveLeft() {
    if (this.status !== 'playing') {
      return;
    }

    const currentState = this.getState();

    for (let i = 0; i < currentState.length; i++) {
      currentState[i] = this.mergeArray(currentState[i]);
    }

    this.state = currentState;
    this.addRandomTile();
    this.updateStatus();
  }
  moveRight() {
    if (this.status !== 'playing') {
      return;
    }

    const currentState = this.getState();

    for (let i = 0; i < currentState.length; i++) {
      currentState[i] = this.mergeArray(currentState[i].reverse()).reverse();
    }

    this.state = currentState;
    this.addRandomTile();
    this.updateStatus();
  }
  moveUp() {
    if (this.status !== 'playing') {
      return;
    }

    const currentState = this.getState();

    for (let i = 0; i < currentState.length; i++) {
      let collumnToPass = [];

      for (let j = 0; j < currentState.length; j++) {
        collumnToPass.push(currentState[j][i]);
      }
      collumnToPass = this.mergeArray(collumnToPass);

      for (let j = 0; j < currentState.length; j++) {
        currentState[j][i] = collumnToPass[j];
      }
    }

    this.state = currentState;
    this.addRandomTile();
    this.updateStatus();
  }
  moveDown() {
    if (this.status !== 'playing') {
      return;
    }

    const currentState = this.getState();

    for (let i = 0; i < currentState.length; i++) {
      let collumnToPass = [];

      for (let j = 0; j < currentState.length; j++) {
        collumnToPass.push(currentState[j][i]);
      }
      collumnToPass = this.mergeArray(collumnToPass.reverse()).reverse();

      for (let j = 0; j < currentState.length; j++) {
        currentState[j][i] = collumnToPass[j];
      }
    }

    this.state = currentState;
    this.addRandomTile();
    this.updateStatus();
  }

  mergeArray(row) {
    const filtered = row.filter((cell) => cell !== 0);

    const merged = [];
    let i = 0;

    while (i < filtered.length) {
      if (filtered[i] === filtered[i + 1]) {
        merged.push(filtered[i] * 2);
        this.score += filtered[i] * 2;
        i += 2;
      } else {
        merged.push(filtered[i]);
        i++;
      }
    }

    while (merged.length < row.length) {
      merged.push(0);
    }

    return merged;
  }
}

export default Game;
