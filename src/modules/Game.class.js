'use strict';

export default class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.board = initialState;
    this.gameActive = false;
  }

  moveLeft() {
    if (!this.getStatus()) {
      return;
    }

    if (!this.canMoveLeft() && this.hasLevalMoves()) {
      return;
    } else {
      this.checkLoss();
    }

    let scoreIncreases = 0;

    for (let row = 0; row < this.board.length; row++) {
      let newRow = this.board[row].filter((num) => num !== 0);

      for (let i = 0; i < newRow.length; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] += newRow[i + 1];
          newRow[i + 1] = 0;
          scoreIncreases += newRow[i];
        }
      }

      newRow = newRow.filter((num) => num !== 0);

      while (newRow.length < 4) {
        newRow.push(0);
      }

      this.board[row] = newRow;
    }

    if (scoreIncreases > 0) {
      this.getScore(scoreIncreases);
    }

    this.checkWin();
    this.addNewCell();
    this.render();
  }
  moveRight() {
    if (!this.getStatus()) {
      return;
    }

    if (!this.canMoveRight() && this.hasLevalMoves()) {
      return;
    } else {
      this.checkLoss();
    }

    let scoreIncreases = 0;

    for (let row = 0; row < this.board.length; row++) {
      let newRow = this.board[row].filter((num) => num !== 0);

      for (let i = newRow.length - 1; i > 0; i--) {
        if (newRow[i] === newRow[i - 1]) {
          newRow[i] += newRow[i - 1];
          newRow[i - 1] = 0;
          scoreIncreases += newRow[i];
        }
      }

      newRow = newRow.filter((num) => num !== 0);

      while (newRow.length < 4) {
        newRow.unshift(0);
      }

      this.board[row] = newRow;
    }

    if (scoreIncreases > 0) {
      this.getScore(scoreIncreases);
    }

    this.checkWin();
    this.addNewCell();
    this.render();
  }

  moveUp() {
    if (!this.getStatus()) {
      return;
    }

    if (!this.canMoveUp() && this.hasLevalMoves()) {
      return;
    } else {
      this.checkLoss();
    }

    let scoreIncreases = 0;

    for (let col = 0; col < 4; col++) {
      let newCol = [];

      for (let row = 0; row < 4; row++) {
        if (this.board[row][col] !== 0) {
          newCol.push(this.board[row][col]);
        }
      }

      for (let i = 0; i < newCol.length; i++) {
        if (newCol[i] === newCol[i + 1]) {
          newCol[i] += newCol[i + 1];
          newCol[i + 1] = 0;
          scoreIncreases += newCol[i];
        }
      }

      newCol = newCol.filter((num) => num !== 0);

      while (newCol.length < 4) {
        newCol.push(0);
      }

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = newCol[row];
      }
    }

    if (scoreIncreases > 0) {
      this.getScore(scoreIncreases);
    }
    this.checkWin();
    this.addNewCell();
    this.render();
  }

  moveDown() {
    if (!this.getStatus()) {
      return;
    }

    if (!this.canMoveDown() && this.hasLevalMoves()) {
      return;
    } else {
      this.checkLoss();
    }

    let scoreIncreases = 0;

    for (let col = 0; col < 4; col++) {
      let newCol = [];

      for (let row = 3; row >= 0; row--) {
        if (this.board[row][col] !== 0) {
          newCol.push(this.board[row][col]);
        }
      }

      for (let i = newCol.length - 1; i > 0; i--) {
        if (newCol[i] === newCol[i - 1]) {
          newCol[i] += newCol[i - 1];
          newCol[i - 1] = 0;
          scoreIncreases += newCol[i];
        }
      }

      newCol = newCol.filter((num) => num !== 0);
      newCol.reverse();

      while (newCol.length < 4) {
        newCol.unshift(0);
      }

      for (let row = 0; row < 4; row++) {
        this.board[row][col] = newCol[row];
      }
    }

    if (scoreIncreases > 0) {
      this.getScore(scoreIncreases);
    }
    this.checkWin();
    this.addNewCell();
    this.render();
  }

  getScore(points) {
    const scoreField = document.querySelector('.game-score');

    this.score = (this.score || 0) + points; // Уникнення NaN
    scoreField.textContent = this.score;
  }
  getState() {
    return this.board;
  }
  getStatus() {
    return this.gameActive;
  }
  start() {
    this.changeStartBtn();
  }
  restart() {
    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.getScore(0);

    this.render();
  }

  getAllCoordinates() {
    const coordinates = [];

    for (let row = 0; row < this.board.length; row++) {
      for (let col = 0; col < this.board[row].length; col++) {
        if (this.board[row][col] === 0) {
          coordinates.push([row, col]);
        }
      }
    }

    return coordinates;
  }

  addTwoRandomCells() {
    const emtyCells = this.getAllCoordinates();

    emtyCells.sort(() => Math.random() - 0.5);

    const [first, second] = emtyCells.slice(0, 2);

    if (Math.random() < 0.1) {
      this.board[first[0]][first[1]] = 4;
    } else {
      this.board[first[0]][first[1]] = 2;
    }

    if (Math.random() < 0.1) {
      this.board[second[0]][second[1]] = 4;
    } else {
      this.board[second[0]][second[1]] = 2;
    }
  }

  render() {
    const cells = document.querySelectorAll('.game-field tbody td');
    const flat = this.board.flat();

    cells.forEach((cell, index) => {
      if (flat[index] !== 0) {
        cell.textContent = flat[index];
      } else {
        cell.textContent = '';
      }
    });

    this.setSellsColor();
  }

  addNewCell() {
    const emptyCells = this.getAllCoordinates();

    if (emptyCells.length > 0) {
      const randomCoordd =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const randomValue = Math.random();
      const [row, col] = randomCoordd;

      if (randomValue < 0.1) {
        this.board[row][col] = 4;
      } else {
        this.board[row][col] = 2;
      }
    } else {
    }
  }

  checkWin() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.board[row][col] === 2048) {
          this.createMessage('win');

          return true;
        }
      }
    }

    return false;
  }

  checkLoss() {
    if (!this.hasLevalMoves()) {
      this.createMessage('loss');
    }
  }

  hasLevalMoves() {
    return (
      this.canMoveLeft() ||
      this.canMoveRight() ||
      this.canMoveDown() ||
      this.canMoveUp()
    );
  }

  canMoveLeft() {
    for (let row = 0; row < 4; row++) {
      for (let col = 1; col < 4; col++) {
        if (this.board[row][col] !== 0) {
          if (
            this.board[row][col - 1] === 0 ||
            this.board[row][col] === this.board[row][col - 1]
          ) {
            return true;
          }
        }
      }
    }

    return false;
  }

  canMoveRight() {
    for (let row = 0; row < 4; row++) {
      for (let col = 2; col >= 0; col--) {
        if (this.board[row][col] !== 0) {
          if (
            this.board[row][col + 1] === 0 ||
            this.board[row][col] === this.board[row][col + 1]
          ) {
            return true;
          }
        }
      }
    }

    return false;
  }

  canMoveUp() {
    for (let col = 0; col < 4; col++) {
      for (let row = 1; row < 4; row++) {
        if (this.board[row][col] !== 0) {
          if (
            this.board[row - 1][col] === 0 ||
            this.board[row][col] === this.board[row - 1][col]
          ) {
            return true;
          }
        }
      }
    }

    return false;
  }

  canMoveDown() {
    for (let col = 0; col < 4; col++) {
      for (let row = 2; row >= 0; row--) {
        if (this.board[row][col] !== 0) {
          if (
            this.board[row + 1][col] === 0 ||
            this.board[row][col] === this.board[row + 1][col]
          ) {
            return true;
          }
        }
      }
    }

    return false;
  }

  changeStartBtn() {
    if (!this.getStatus()) {
      const startBt = document.querySelector('.start');

      startBt.classList.add('restart');
      startBt.classList.remove('start');

      this.gameActive = true;
      startBt.textContent = 'Restart';
      startBt.style.fontSize = '18px';

      this.addTwoRandomCells();
      this.render();

      return;
    }

    if (this.getStatus()) {
      this.createMessage('restart');
      this.gameActive = false;
    }
  }

  setSellsColor() {
    const cells = document.querySelectorAll('td');

    cells.forEach((cell) => {
      const value = Number(cell.textContent);

      cell.className = 'field-cell';

      if (value !== 0) {
        cell.classList.add(`field-cell--${value}`);
      } else {
        cell.textContent = '';
      }
    });
  }

  createMessage(value) {
    const check = document.querySelector('.message-body');

    if (check) {
      return;
    }

    const body = document.querySelector('body');
    const messageWrapper = document.createElement('div');

    messageWrapper.classList.add('message', 'message-wrapper');
    body.append(messageWrapper);

    const messageBody = document.createElement('div');

    messageBody.classList.add('message-body');
    messageWrapper.append(messageBody);

    const messageLabel = document.createElement('div');

    messageLabel.classList.add('message-label');

    messageBody.append(messageLabel);

    const messageText = document.createElement('div');

    messageText.classList.add('message-text');

    messageBody.append(messageText);

    const confirmBtn = document.createElement('button');

    confirmBtn.classList.add('button-confirm');
    confirmBtn.textContent = 'Restart';
    messageBody.append(confirmBtn);

    confirmBtn.addEventListener('click', () => {
      messageWrapper.remove();
      this.gameActive = true;

      this.restart();
      this.addTwoRandomCells();
      this.render();
    });

    if (value === 'restart') {
      const cancelBtn = document.createElement('button');

      cancelBtn.classList.add('button-cancel');
      cancelBtn.textContent = 'Cancel';
      messageBody.append(cancelBtn);

      cancelBtn.addEventListener('click', () => {
        messageWrapper.remove();
        this.gameActive = true;
      });

      messageLabel.textContent = 'Restart?';

      messageText.textContent =
        'Are you sure you want to start a new game? All progress will be lost.';
      this.addTwoRandomCells();
    }

    if (value === 'loss') {
      messageLabel.textContent = 'You lost';

      messageText.textContent =
        'There is no awaliable moves left. Do you want start new game?';

      confirmBtn.textContent = 'New Game';
    }

    if (value === 'win') {
      messageLabel.textContent = 'Congratulations! You won';

      messageText.textContent =
        'You got 2048, champion! Do you want try again?';

      confirmBtn.textContent = 'New Game';
    }

    body.append(messageWrapper);
  }
}
