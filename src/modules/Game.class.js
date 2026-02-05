'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  #fieldSize = 4;
  #score = 0;
  #field;
  #blocked = false;
  #status = 'idle';
  #newTilesCoords = [];
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
  constructor(initialState) {
    if (initialState) {
      this.#field = initialState;

      this.#displayUpdates();
    } else {
      this.#field = Array.from({ length: this.#fieldSize }, () => {
        return Array.from({ length: this.#fieldSize }, () => 0);
      });
    }

    // eslint-disable-next-line no-console
    console.log(initialState);
  }

  moveLeft() {
    const tempField = [];

    for (let r = 0; r < this.#fieldSize; r++) {
      const trimmedRow = [];

      for (let c = 0; c < this.#fieldSize; c++) {
        const number = this.#field[r][c];

        if (number !== 0) {
          trimmedRow.push(number);
        }
      }

      const finalRow = this.#processLine(trimmedRow, false);

      tempField.push(finalRow);
    }

    const hasChanged = this.#hasChanged(this.#field, tempField);

    this.#field = tempField;

    if (hasChanged) {
      this.#fillRandomCell();
    }

    this.#displayUpdates();
  }

  moveRight() {
    const tempField = [];

    for (let r = 0; r < this.#fieldSize; r++) {
      const trimmedRow = [];

      for (let c = 0; c < this.#fieldSize; c++) {
        const number = this.#field[r][c];

        if (number !== 0) {
          trimmedRow.push(number);
        }
      }

      const finalRow = this.#processLine(trimmedRow, true);

      tempField.push(finalRow);
    }

    const hasChanged = this.#hasChanged(this.#field, tempField);

    this.#field = tempField;

    if (hasChanged) {
      this.#fillRandomCell();
    }

    this.#displayUpdates();
  }

  moveUp() {
    const tempField = Array.from({ length: this.#fieldSize }, () => []);

    for (let r = 0; r < this.#fieldSize; r++) {
      const trimmedColumn = [];

      for (let c = 0; c < this.#fieldSize; c++) {
        const elem = this.#field[c][r];

        if (elem !== 0) {
          trimmedColumn.push(elem);
        }
      }

      const finalColumn = this.#processLine(trimmedColumn, false);

      for (let i = 0; i < finalColumn.length; i++) {
        tempField[i].push(finalColumn[i]);
      }
    }

    const hasChanged = this.#hasChanged(this.#field, tempField);

    this.#field = tempField;

    if (hasChanged) {
      this.#fillRandomCell();
    }

    this.#displayUpdates();
  }

  moveDown() {
    const tempField = Array.from({ length: this.#fieldSize }, () => []);

    for (let r = 0; r < this.#fieldSize; r++) {
      const trimmedColumn = [];

      for (let c = 0; c < this.#fieldSize; c++) {
        const elem = this.#field[c][r];

        if (elem !== 0) {
          trimmedColumn.push(elem);
        }
      }

      const finalColumn = this.#processLine(trimmedColumn, true);

      for (let i = 0; i < finalColumn.length; i++) {
        tempField[i].push(finalColumn[i]);
      }
    }

    const hasChanged = this.#hasChanged(this.#field, tempField);

    this.#field = tempField;

    if (hasChanged) {
      this.#fillRandomCell();
    }

    this.#displayUpdates();
  }

  #processLine(trimmed, isReverse) {
    const result = [];

    if (isReverse) {
      for (let i = trimmed.length - 1; i >= 0; i--) {
        const current = trimmed[i];
        const prev = trimmed[i - 1];

        if (current === prev) {
          const sum = current + prev;

          result.unshift(sum);
          this.#setScore(sum);

          i--;
        } else {
          result.unshift(current);
        }
      }

      while (result.length < this.#fieldSize) {
        result.unshift(0);
      }
    } else {
      for (let i = 0; i < trimmed.length; i++) {
        const current = trimmed[i];
        const next = trimmed[i + 1];

        if (current === next) {
          const sum = current + next;

          result.push(sum);
          this.#setScore(sum);

          i++;
        } else {
          result.push(current);
        }
      }

      while (result.length < 4) {
        result.push(0);
      }
    }

    return result;
  }

  #hasChanged(original, modified) {
    for (let r = 0; r < this.#fieldSize; r++) {
      for (let c = 0; c < this.#fieldSize; c++) {
        if (original[r][c] !== modified[r][c]) {
          return true;
        }
      }
    }

    return false;
  }

  get blocked() {
    return this.#blocked;
  }
  /**
   * @returns {number}
   */
  getScore() {
    return this.#score;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.#field;
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
    return this.#status;
  }

  /**
   * Starts the game.
   */
  start() {
    this.#status = 'playing';

    this.#buttonManager('start');

    this.#messageManager('start');

    this.#fillRandomCell();
    this.#fillRandomCell();

    this.#displayUpdates();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.#status = 'idle';

    this.#buttonManager('restart');

    this.#messageManager('restart');

    this.#clearField();

    this.#unblockGame();

    this.#resetScore();

    this.#displayUpdates();
  }

  #clearField() {
    for (let r = 0; r < this.#fieldSize; r++) {
      for (let c = 0; c < this.#fieldSize; c++) {
        this.#field[r][c] = 0;
      }
    }
  }

  #getRandomEmptyCell() {
    const cells = this.#getEmptyCells();

    const multiplier = cells.length;
    const randomIndex = Math.trunc(Math.random() * multiplier);

    return cells[randomIndex];
  }

  #getEmptyCells() {
    const emptyCells = [];

    for (let r = 0; r < this.#fieldSize; r++) {
      for (let c = 0; c < this.#fieldSize; c++) {
        if (this.#field[r][c] === 0) {
          emptyCells.push({
            row: r,
            col: c,
          });
        }
      }
    }

    return emptyCells;
  }

  #fillRandomCell() {
    const randomEmptyCell = this.#getRandomEmptyCell();

    this.#newTilesCoords.push({
      row: randomEmptyCell.row,
      col: randomEmptyCell.col,
    });

    this.#field[randomEmptyCell.row][randomEmptyCell.col] =
      Math.random() < 0.1 ? 4 : 2;
  }

  #displayUpdates() {
    const table = document.querySelector('table');
    let isWinPresent = false;

    for (let r = 0; r < this.#fieldSize; r++) {
      for (let c = 0; c < this.#fieldSize; c++) {
        const elem = this.#field[r][c];

        if (elem === 2048) {
          isWinPresent = true;
        }

        const tableCell = table.rows[r].cells[c];

        const currentValue = tableCell.textContent;
        const newValue = elem === 0 ? '' : elem.toString();

        if (currentValue !== newValue) {
          tableCell.className = 'field-cell';

          if (elem !== 0) {
            tableCell.className = `field-cell field-cell--${elem}`;

            for (const tile of this.#newTilesCoords) {
              if (tile && tile.row === r && tile.col === c) {
                tableCell.classList.add('field-cell--new');
              }
            }

            tableCell.textContent = elem.toString();
          } else {
            tableCell.textContent = '';
          }
        }
      }
    }

    this.#newTilesCoords = [];

    this.#displayScore();

    if (isWinPresent) {
      this.#status = 'win';

      this.#blockGame();

      this.#messageManager('win');
    }

    if (!this.#canMakeMove()) {
      this.#status = 'lose';

      this.#blockGame();

      this.#messageManager('lose');
    }
  }

  #canMakeMove() {
    for (let r = 0; r < this.#fieldSize - 1; r++) {
      for (let c = 0; c < this.#fieldSize; c++) {
        const current = this.#field[r][c];
        const comparedRight = this.#field[r][c + 1];
        const comparedBottom = this.#field[r + 1][c];

        if (current === 0 || comparedRight === 0 || comparedBottom === 0) {
          return true;
        }

        if (current === comparedRight || current === comparedBottom) {
          return true;
        }
      }
    }

    return false;
  }

  #blockGame() {
    this.#blocked = true;
  }

  #unblockGame() {
    this.#blocked = false;
  }

  #buttonManager(state) {
    const button = document.querySelector('.button');

    switch (state) {
      case 'start':
        button.classList.remove('start');
        button.classList.add('restart');
        button.textContent = 'Restart';

        break;
      case 'restart':
        button.classList.remove('restart');
        button.classList.add('start');
        button.textContent = 'Start';

        break;
    }
  }

  #displayScore() {
    const score = document.querySelector('.game-score');

    score.textContent = this.#score.toString();
  }

  #resetScore() {
    this.#score = 0;
  }

  #setScore(amount) {
    this.#score += amount;
  }

  #hideAllMessages() {
    const messageContainer = document.querySelector('.message-container');

    for (const message of messageContainer.children) {
      message.classList.add('hidden');
    }
  }

  #messageManager(state) {
    const messageContainer = document.querySelector('.message-container');
    const startMessage = messageContainer.querySelector('.message-start');
    const loseMessage = messageContainer.querySelector('.message-lose');
    const winMessage = messageContainer.querySelector('.message-win');

    switch (state) {
      case 'start':
        this.#hideAllMessages();

        startMessage.classList.add('hidden');

        break;
      case 'restart':
        this.#hideAllMessages();

        startMessage.classList.remove('hidden');

        break;
      case 'lose':
        this.#hideAllMessages();

        loseMessage.classList.remove('hidden');

        break;
      case 'win':
        this.#hideAllMessages();

        winMessage.classList.remove('hidden');

        break;
    }
  }
}

module.exports = Game;
