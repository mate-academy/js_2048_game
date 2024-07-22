'use strict';

class Game {
  constructor(initialState) {
    this.score = 0;
    this.state = 'idle';
    this.button = document.querySelector('.start');

    this.gameActive = false;

    this.board = initialState || [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  getState() {
    return this.board;
  }

  updateBoard() {
    const rows = document.querySelectorAll('.field-row');

    rows.forEach((row, rowIndex) => {
      for (let col = 0; col < 4; col++) {
        const cell = row.children[col];

        if (cell && cell.textContent !== undefined) {
          const value = parseInt(cell.textContent) || 0;

          this.board[rowIndex][col] = value;
        } else {
          this.board[rowIndex][col] = 0;
        }
      }
    });
  }

  updateState(newState) {
    this.state = newState;
    console.log(this.state);
  }

  addScore(value) {
    this.score += value;

    const scoreElement = document.querySelector('.game-score');

    if (scoreElement) {
      scoreElement.textContent = this.score;
    }
  }

  getScore() {
    return this.score;
  }

  initializeGame() {
    this.score = 0;
    this.addScore(0);
    this.hideMessages();

    const cells = document.querySelectorAll('.field-cell');

    cells.forEach((cell) => {
      cell.textContent = '';
      cell.className = 'field-cell';
    });

    this.board = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.spawnNumbers();
  }

  start() {
    this.updateState('playing');
    this.initializeGame();
    this.updateBoard();

    if (this.button) {
      this.button.textContent = 'Restart';
      this.button.classList.remove('start');
      this.button.classList.add('restart');
    }
  }

  restart() {
    this.updateState('idle');
    this.gameActive = true;

    if (this.button) {
      this.button.classList.remove('restart');
      this.button.classList.add('start');
    }

    this.initializeGame();
  }

  getStatus() {
    return this.state;
  }

  moveLeft() {
    const rows = document.querySelectorAll('.field-row');
    let hasChanged = false;

    rows.forEach((row) => {
      const merged = [false, false, false, false];

      for (let col = 1; col < 4; col++) {
        let cell = row?.children[col];

        if (cell && cell.textContent !== '') {
          let currentCol = col;

          while (currentCol > 0) {
            const targetCell = row.children[currentCol - 1];

            if (targetCell && targetCell.textContent === '') {
              targetCell.textContent = cell.textContent;
              targetCell.className = cell.className;
              cell.textContent = '';
              cell.className = 'field-cell';
              cell = targetCell;
              currentCol--;
              hasChanged = true;
            } else if (
              targetCell &&
              targetCell.textContent === cell.textContent &&
              !merged[currentCol - 1]
            ) {
              const newValue = parseInt(targetCell.textContent) * 2;

              targetCell.textContent = newValue.toString();
              targetCell.className = `field-cell field-cell--${newValue}`;
              cell.textContent = '';
              cell.className = 'field-cell';
              merged[currentCol - 1] = true;
              this.addScore(newValue);
              hasChanged = true;

              if (newValue === 2048) {
                this.hideMessages();
                this.updateState('win');

                document
                  .querySelector('.message-win')
                  .classList.remove('hidden');
                this.gameActive = false;
              }
              break;
            } else {
              break;
            }
            currentCol--;
          }
        }
      }
    });

    this.updateBoard();

    return hasChanged;
  }

  moveRight() {
    const rows = document.querySelectorAll('.field-row');
    let hasChanged = false;

    rows.forEach((row) => {
      const merged = [false, false, false, false];

      for (let col = 2; col >= 0; col--) {
        let cell = row?.children[col];

        if (cell && cell.textContent !== '') {
          let currentCol = col;

          while (currentCol < 3) {
            const targetCell = row.children[currentCol + 1];

            if (targetCell && targetCell.textContent === '') {
              targetCell.textContent = cell.textContent;
              targetCell.className = cell.className;
              cell.textContent = '';
              cell.className = 'field-cell';
              cell = targetCell;
              hasChanged = true;
            } else if (
              targetCell &&
              targetCell.textContent === cell.textContent &&
              !merged[currentCol + 1]
            ) {
              const newValue = parseInt(targetCell.textContent) * 2;

              targetCell.textContent = newValue.toString();
              targetCell.className = `field-cell field-cell--${newValue}`;
              cell.textContent = '';
              cell.className = 'field-cell';
              merged[currentCol + 1] = true;
              this.addScore(newValue);
              hasChanged = true;

              if (newValue === 2048) {
                this.hideMessages();
                this.updateState('win');

                document
                  .querySelector('.message-win')
                  .classList.remove('hidden');
                this.gameActive = false;
              }

              break;
            } else {
              break;
            }
            currentCol++;
          }
        }
      }
    });
    this.updateBoard();

    return hasChanged;
  }

  moveUp() {
    const rows = document.querySelectorAll('.field-row');
    let hasChanged = false;

    for (let col = 0; col < 4; col++) {
      const merged = [false, false, false, false];

      for (let row = 1; row < 4; row++) {
        let cell = rows[row]?.children[col];

        if (cell && cell.textContent !== '') {
          let currentRow = row;

          while (currentRow > 0) {
            const targetCell = rows[currentRow - 1].children[col];

            if (targetCell && targetCell.textContent === '') {
              targetCell.textContent = cell.textContent;
              targetCell.className = cell.className;
              cell.textContent = '';
              cell.className = 'field-cell';
              cell = targetCell;
              hasChanged = true;
            } else if (
              targetCell &&
              targetCell.textContent === cell.textContent &&
              !merged[currentRow - 1]
            ) {
              const newValue = parseInt(targetCell.textContent) * 2;

              targetCell.textContent = newValue.toString();
              targetCell.className = `field-cell field-cell--${newValue}`;
              cell.textContent = '';
              cell.className = 'field-cell';
              merged[currentRow - 1] = true;
              this.addScore(newValue);
              hasChanged = true;

              if (newValue === 2048) {
                this.hideMessages();
                this.updateState('win');

                document
                  .querySelector('.message-win')
                  .classList.remove('hidden');
                this.gameActive = false;
              }
              break;
            } else {
              break;
            }
            currentRow--;
          }
        }
      }
    }
    this.updateBoard();

    return hasChanged;
  }

  moveDown() {
    const rows = document.querySelectorAll('.field-row');
    let hasChanged = false;

    for (let col = 0; col < 4; col++) {
      const merged = [false, false, false, false];

      for (let row = 2; row >= 0; row--) {
        let cell = rows[row]?.children[col];

        if (cell && cell.textContent !== '') {
          let currentRow = row;

          while (currentRow < 3) {
            const targetCell = rows[currentRow + 1].children[col];

            if (targetCell && targetCell.textContent === '') {
              targetCell.textContent = cell.textContent;
              targetCell.className = cell.className;
              cell.textContent = '';
              cell.className = 'field-cell';
              cell = targetCell;
              hasChanged = true;
            } else if (
              targetCell &&
              targetCell.textContent === cell.textContent &&
              !merged[currentRow + 1]
            ) {
              const newValue = parseInt(targetCell.textContent) * 2;

              targetCell.textContent = newValue.toString();
              targetCell.className = `field-cell field-cell--${newValue}`;
              cell.textContent = '';
              cell.className = 'field-cell';
              merged[currentRow + 1] = true;
              this.addScore(newValue);
              hasChanged = true;

              if (newValue === 2048) {
                this.hideMessages();
                this.updateState('win');

                document
                  .querySelector('.message-win')
                  .classList.remove('hidden');
                this.gameActive = false;
              }
              break;
            } else {
              break;
            }
            currentRow++;
          }
        }
      }
    }
    this.updateBoard();

    return hasChanged;
  }

  spawnNumbers() {
    const cels = document.querySelectorAll('.field-cell');
    const emptyCells = Array.from(cels).filter((cell) => cell.textContent === '');

    if (emptyCells.length < 2) {
      this.hideMessages();

      const messageLoseElement = document.querySelector('.message-lose');

      if (messageLoseElement) {
        messageLoseElement.classList.remove('hidden');
      }
      this.gameActive = false;

      return;
    }

    const randomIndex1 = Math.floor(Math.random() * emptyCells.length);
    const cell1 = emptyCells[randomIndex1];

    emptyCells.splice(randomIndex1, 1);

    const randomIndex2 = Math.floor(Math.random() * emptyCells.length);
    const cell2 = emptyCells[randomIndex2];

    cell1.innerHTML = '2';
    cell1.classList.add('field-cell--2');

    const number2 = Math.random() < 0.1 ? 4 : 2;

    cell2.innerHTML = number2.toString();
    cell2.classList.add(`field-cell--${number2}`);

    if (number2 === 2048) {
      this.hideMessages();
      document.querySelector('.message-win').classList.remove('hidden');
      this.gameActive = false;
    }
  }

  handleKeyDown(evt) {
    const validKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];

    if (!validKeys.includes(evt.key)) {
      return;
    }

    let hasChanged = false;

    switch (evt.key) {
      case 'ArrowUp':
        hasChanged = this.moveUp();
        break;
      case 'ArrowDown':
        hasChanged = this.moveDown();
        break;
      case 'ArrowLeft':
        hasChanged = this.moveLeft();
        break;
      case 'ArrowRight':
        hasChanged = this.moveRight();
        break;
    }

    if (hasChanged) {
      this.spawnRandomNumber();
      this.checkLoseCondition();
    }
  }

  spawnRandomNumber() {
    const cels = document.querySelectorAll('.field-cell');
    const emptyCells = Array.from(cels).filter((cell) => cell.textContent === '');

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex];
    const number = Math.random() < 0.1 ? 4 : 2;

    randomCell.innerHTML = number.toString();
    randomCell.classList.add(`field-cell--${number}`);
  }

  hideMessages() {
    const messageLose = document.querySelector('.message-lose');
    const messageWin = document.querySelector('.message-win');
    const messageStart = document.querySelector('.message-start');

    if (messageLose) {
      messageLose.classList.add('hidden');
    }

    if (messageWin) {
      messageWin.classList.add('hidden');
    }

    if (messageStart) {
      messageStart.classList.add('hidden');
    }
  }

  checkLoseCondition() {
    const cels = document.querySelectorAll('.field-cell');
    const emptyCells = Array.from(cels).filter((cell) => cell.textContent === '');

    if (emptyCells.length === 0) {
      const canMerge = this.checkPossibleMerges(cels);

      if (!canMerge) {
        this.hideMessages();
        this.updateState('lose');
        document.querySelector('.message-lose').classList.remove('hidden');
        this.gameActive = false;
      }
    }
  }

  checkPossibleMerges(cels) {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const cell = cels[row * 4 + col].textContent;

        if (cell === '') {
          return true;
        }

        if (col < 3 && cell === cels[row * 4 + (col + 1)].textContent) {
          return true;
        }

        if (row < 3 && cell === cels[(row + 1) * 4 + col].textContent) {
          return true;
        }
      }
    }

    return false;
  }
}

module.exports = Game;
