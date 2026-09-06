'use strict';
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

  moveLeft() {
    const newState = this.moveLeftRight(this.state);

    for (const arr of newState) {
      while (arr.length < 4) {
        arr.push(0);
      }
    }

    this.movingAndEnding(this.state, newState);
    this.isGameOver();
  }

  moveRight() {
    const newState = this.moveLeftRight(this.state);

    for (const arr of newState) {
      while (arr.length < 4) {
        arr.unshift(0);
      }
    }

    this.movingAndEnding(this.state, newState);
    this.isGameOver();
  }

  moveUp() {
    const useState = [[], [], [], []];
    const result = [[], [], [], []];

    for (let i = 0; i < 4; i++) {
      for (let o = 0; o < 4; o++) {
        useState[o].push(this.state[i][o]);
      }
    }

    const newState = this.moveLeftRight(useState);

    for (const arr of newState) {
      while (arr.length < 4) {
        arr.push(0);
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let o = 0; o < 4; o++) {
        result[o].push(newState[i][o]);
      }
    }

    this.movingAndEnding(this.state, result);
    this.isGameOver();
  }

  moveDown() {
    const useState = [[], [], [], []];
    const result = [[], [], [], []];

    for (let i = 0; i < 4; i++) {
      for (let o = 0; o < 4; o++) {
        useState[o].push(this.state[i][o]);
      }
    }

    const newState = this.moveLeftRight(useState);

    for (const arr of newState) {
      while (arr.length < 4) {
        arr.unshift(0);
      }
    }

    for (let i = 0; i < 4; i++) {
      for (let o = 0; o < 4; o++) {
        result[o].push(newState[i][o]);
      }
    }

    this.movingAndEnding(this.state, result);
    this.isGameOver();
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

  start(initialState) {
    const score = document.querySelector('.game-score');
    const startButton = document.querySelector('.button');

    startButton.classList.remove('start');
    startButton.classList.add('restart');
    startButton.innerText = 'Restart';
    document.querySelector('.message-start').classList.add('hidden');
    document.querySelector('.message-lose').classList.add('hidden');
    this.state = initialState;
    this.stateIntoTable(initialState);

    score.innerText = 0;
    this.status = 'playing';
    this.score = 0;
  }

  restart(newState) {
    this.state = newState;
    this.start(newState);
  }

  lose() {
    document.querySelector('.message-lose').classList.remove('hidden');
    this.status = 'lose';
  }

  win() {
    document.querySelector('.message-win').classList.remove('hidden');
    this.status = 'win';
  }

  stateIntoTable(stateArray) {
    const table = document.querySelector('.game-field');

    for (let i = 0; i < 4; i++) {
      for (let o = 0; o < 4; o++) {
        table.rows[i].cells[o].className = 'field-cell';

        if (stateArray[i][o] === 0) {
          table.rows[i].cells[o].innerText = '';
        } else {
          table.rows[i].cells[o].classList.add(
            `field-cell--${stateArray[i][o]}`,
          );
          table.rows[i].cells[o].innerText = `${stateArray[i][o]}`;
        }
      }
    }
  }

  moveLeftRight(state) {
    const newState = [];
    const score = document.querySelector('.game-score');

    for (let i = 0; i < 4; i++) {
      if (state[i].every((x) => x === 0)) {
        newState.push([...state[i]]);
        continue;
      }

      let currentNumbers = state[i].filter((x) => x !== 0);

      if (currentNumbers.length > 1) {
        for (let c = 0; c < currentNumbers.length - 1; c++) {
          if (currentNumbers[c] === currentNumbers[c + 1]) {
            currentNumbers[c] *= 2;
            this.score += currentNumbers[c];
            currentNumbers[c + 1] = 0;

            if (currentNumbers[c] === 2048) {
              this.win();
            }
          }
        }
      }

      currentNumbers = currentNumbers.filter((x) => x !== 0);

      newState.push(currentNumbers);
    }

    score.innerText = this.score;

    return newState;
  }

  addRandomTiles() {
    const table = document.querySelector('.game-field');
    const flatState = this.state.flat();
    const emptyCells = [];

    flatState.forEach((num, index) => {
      if (num === 0) {
        emptyCells.push(index);
      }
    });

    const firstNum = Math.floor(Math.random() * emptyCells.length);

    for (let i = 0; i < 16; i++) {
      if (i === emptyCells[firstNum]) {
        const row = Math.floor(i / 4);
        const cell = i % 4;
        const newNum = Math.random() > 0.9 ? 4 : 2;

        this.state[row][cell] = newNum;

        table.rows[row].cells[cell].className = 'field-cell';
        table.rows[row].cells[cell].classList.add(`field-cell--${newNum}`);
        table.rows[row].cells[cell].innerText = `${newNum}`;
      }
    }
  }

  isGameOver() {
    const flatState = this.state.flat();

    if (flatState.includes(0)) {
      return false;
    }

    for (let row = 0; row < 4; row++) {
      for (let cell = 0; cell < 4; cell++) {
        if (cell < 3 && this.state[row][cell] === this.state[row][cell + 1]) {
          return false;
        } else if (
          row < 3 &&
          this.state[row][cell] === this.state[row + 1][cell]
        ) {
          return false;
        }
      }
    }

    this.lose();
  }

  movingAndEnding(oldState, newState) {
    if (JSON.stringify(oldState) !== JSON.stringify(newState)) {
      this.state = newState;

      this.stateIntoTable(newState);

      if (newState.some((arr) => arr.some((num) => num === 2048))) {
        this.win();
      }
      this.addRandomTiles();
    }
  }
}
module.exports = Game;
