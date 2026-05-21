'use strict';

const { default: Cell } = require('./Cell.class');

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
    this.gameBoard = document.querySelector('.game-board');

    this.handleKeyDown = (event2) => {
      switch (event2.code) {
        case 'ArrowDown':
        case 'KeyS':
          this.moveDown();
          break;

        case 'ArrowUp':
        case 'KeyW':
          this.moveUp();
          break;

        case 'ArrowRight':
        case 'KeyD':
          this.moveRight();
          break;

        case 'ArrowLeft':
        case 'KeyA':
          this.moveLeft();
          break;

        default:
          break;
      }
    };

    const poinerEvent = () => {
      let lastPosition = null;

      this.gameBoard.addEventListener('pointerdown', (event2) => {
        lastPosition = { x: event2.pageX, y: event2.pageY };
      });

      this.gameBoard.addEventListener('pointerup', (event2) => {
        lastPosition = null;
      });

      this.gameBoard.addEventListener('pointermove', (event2) => {
        if (this.getStatus() !== 'playing') {
          return;
        }

        if (!lastPosition) {
          return;
        }

        const moveX = event2.pageX - lastPosition.x;
        const moveY = event2.pageY - lastPosition.y;

        if (moveX < -40) {
          this.moveLeft();
          lastPosition = null;
        }

        if (moveX > 40) {
          this.moveRight();
          lastPosition = null;
        }

        if (moveY > 40) {
          this.moveDown();
          lastPosition = null;
        }

        if (moveY < -40) {
          this.moveUp();
          lastPosition = null;
        }
      });
    };

    poinerEvent();

    /** @type {'idle' | 'playing' | 'win' | 'lose'} */
    this.status = 'idle';
    this.initialState = initialState;

    this.state = Array(this.initialState.length)
      .fill([])
      .map(() => {
        return Array(this.initialState[0].length).fill(null);
      });

    this.sizeFiled = { y: initialState.length, x: initialState[0].length };
    this.score = 0;
    this.scoreElement = document.querySelector('.game-score');
    this.cellElements = document.querySelector('.game-board__cells');
    this.setMessage('start');
  }

  setInitialFilds() {
    this.setStatus('playing');

    [...this.cellElements.children].forEach((child) => {
      child.remove();
    });

    this.state = Array(this.initialState.length)
      .fill([])
      .map(() => {
        return Array(this.initialState[0].length).fill(null);
      });

    if (
      this.initialState.every((row) => {
        return row.every((cell) => cell === 0);
      })
    ) {
      this.createRandomCell();
      this.createRandomCell();

      return;
    }

    this.initialState.forEach((row, y) => {
      row.forEach((cellValue, x) => {
        if (cellValue === 0) {
          return;
        }

        const newCell = new Cell({ y, x }, cellValue);

        this.setCell({ y, x }, newCell);
        this.cellElements.append(this.state[y][x].element);
      });
    });

    if (!this.haveFreeMove()) {
      this.gameOver();
    }

    this.state.forEach((row) => {
      row.forEach((cell) => {
        if (cell && cell.value >= 2048) {
          this.win();
        }
      });
    });
  }

  createRandomCell() {
    const emptyFilds = this.getEmptyField();

    if (emptyFilds.length === 0) {
      return;
    }

    const randomPosition =
      emptyFilds[Math.round(Math.random() * (emptyFilds.length - 1))];

    const randomValue = Math.random() > 0.1 ? 2 : 4;

    const newCell = new Cell(randomPosition, randomValue);

    this.cellElements.append(newCell.element);

    this.setCell(randomPosition, newCell);
  }

  getCell({ x, y }) {
    return this.state[y][x];
  }

  setCell({ x, y }, value) {
    this.state[y][x] = value;
  }

  moveLeft() {
    for (let y = 0; y < this.sizeFiled.y; y++) {
      const mergedCells = [];

      for (let x = 0; x < this.sizeFiled.x; x++) {
        const currentCell = this.getCell({ y, x });

        if (!currentCell) {
          continue;
        }

        let nextPositionX = x;
        let mergeCell = null;

        while (nextPositionX > 0) {
          const nextCell = this.getCell({ y, x: nextPositionX - 1 });

          if (!nextCell) {
            nextPositionX--;
            continue;
          }

          if (
            nextCell.value === currentCell.value &&
            !mergedCells.includes(nextCell)
          ) {
            nextPositionX--;
            mergeCell = nextCell;
          }

          break;
        }

        if (mergeCell) {
          this.mergeCells({ currentCell, mergeCell, mergedCells });

          continue;
        }

        if (nextPositionX === x) {
          continue;
        }

        const nextPosition = { y, x: nextPositionX };

        this.setCell(currentCell.getPosition(), null);
        this.setCell(nextPosition, currentCell);
        currentCell.setPosition(nextPosition);
      }
    }

    this.createRandomCell();

    if (!this.haveFreeMove()) {
      this.gameOver();
    }
  }

  moveRight() {
    for (let y = 0; y < this.sizeFiled.y; y++) {
      const mergedCells = [];

      for (let x = this.sizeFiled.x - 1; x >= 0; x--) {
        const currentCell = this.getCell({ y, x });

        if (!currentCell) {
          continue;
        }

        let nextPositionX = x;
        let mergeCell = null;

        while (nextPositionX < this.sizeFiled.x - 1) {
          const nextCell = this.getCell({ y, x: nextPositionX + 1 });

          if (!nextCell) {
            nextPositionX++;
            continue;
          }

          if (
            nextCell.value === currentCell.value &&
            !mergedCells.includes(nextCell)
          ) {
            nextPositionX++;
            mergeCell = nextCell;
          }

          break;
        }

        if (mergeCell) {
          this.mergeCells({ currentCell, mergeCell, mergedCells });

          continue;
        }

        if (nextPositionX === x) {
          continue;
        }

        const nextPosition = { y, x: nextPositionX };

        this.setCell(currentCell.getPosition(), null);
        this.setCell(nextPosition, currentCell);
        currentCell.setPosition(nextPosition);
      }
    }

    this.createRandomCell();

    if (!this.haveFreeMove()) {
      this.gameOver();
    }
  }

  moveUp() {
    for (let x = 0; x < this.sizeFiled.x; x++) {
      const mergedCells = [];

      for (let y = 0; y < this.sizeFiled.y; y++) {
        const currentCell = this.getCell({ y, x });

        if (!currentCell) {
          continue;
        }

        let nextPositionX = y;
        let mergeCell = null;

        while (nextPositionX > 0) {
          const nextCell = this.getCell({ x, y: nextPositionX - 1 });

          if (!nextCell) {
            nextPositionX--;
            continue;
          }

          if (
            nextCell.value === currentCell.value &&
            !mergedCells.includes(nextCell)
          ) {
            nextPositionX--;
            mergeCell = nextCell;
          }

          break;
        }

        if (mergeCell) {
          this.mergeCells({ currentCell, mergeCell, mergedCells });
          continue;
        }

        if (nextPositionX === y) {
          continue;
        }

        const nextPosition = { x, y: nextPositionX };

        this.setCell(currentCell.getPosition(), null);
        this.setCell(nextPosition, currentCell);
        currentCell.setPosition(nextPosition);
      }
    }

    this.createRandomCell();

    if (!this.haveFreeMove()) {
      this.gameOver();
    }
  }

  moveDown() {
    for (let x = 0; x < this.sizeFiled.x; x++) {
      const mergedCells = [];

      for (let y = this.sizeFiled.y - 1; y >= 0; y--) {
        const currentCell = this.getCell({ y, x });

        if (!currentCell) {
          continue;
        }

        let nextPositionX = y;
        let mergeCell = null;

        while (nextPositionX < this.sizeFiled.y - 1) {
          const nextCell = this.getCell({ x, y: nextPositionX + 1 });

          if (!nextCell) {
            nextPositionX++;
            continue;
          }

          if (
            nextCell.value === currentCell.value &&
            !mergedCells.includes(nextCell)
          ) {
            nextPositionX++;
            mergeCell = nextCell;
          }

          break;
        }

        if (mergeCell) {
          this.mergeCells({ currentCell, mergeCell, mergedCells });
          continue;
        }

        if (nextPositionX === y) {
          continue;
        }

        const nextPosition = { x, y: nextPositionX };

        this.setCell(currentCell.getPosition(), null);
        this.setCell(nextPosition, currentCell);
        currentCell.setPosition(nextPosition);
      }
    }

    this.createRandomCell();

    if (!this.haveFreeMove()) {
      this.gameOver();
    }
  }

  mergeCells({ currentCell, mergeCell, mergedCells }) {
    currentCell.element.classList.add('game-board__cell--deactive');
    mergedCells.push(mergeCell);
    mergeCell.setValue(mergeCell.value * 2);
    this.setScore(this.getScore() + mergeCell.value);
    this.setCell(currentCell.getPosition(), null);

    currentCell.setPosition(mergeCell.getPosition());

    if (mergeCell.value * 2 >= 2048) {
      this.win();
    }

    setTimeout(() => {
      currentCell.element.remove();
    }, 180);
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  setScore(value) {
    this.scoreElement.textContent = `${value}`;
    this.score = value;
  }

  /**
   * @returns {number[][]}
   */
  getState() {
    return this.state.map((row) => row.map((item) => (item ? item.value : 0)));
  }

  /**
   * Returns the current game status.
   *
   * @returns {'idle' | 'playing' | 'win' | 'lose'}
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {
    return this.status;
  }

  gameOver() {
    this.setStatus('lose');
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  haveFreeMove() {
    if (this.getEmptyField().length !== 0) {
      return true;
    }

    for (let x = 0; x < this.sizeFiled.x; x++) {
      for (let y = 1; y < this.sizeFiled.y; y++) {
        if (
          this.getCell({ x, y }).value === this.getCell({ x, y: y - 1 }).value
        ) {
          return true;
        }
      }
    }

    for (let y = 0; y < this.sizeFiled.y; y++) {
      for (let x = 1; x < this.sizeFiled.x; x++) {
        if (
          this.getCell({ x, y }).value === this.getCell({ x: x - 1, y }).value
        ) {
          return true;
        }
      }
    }
  }

  /**
   * @param {'start' | 'lose' | 'win' | null} message
   */
  setMessage(message) {
    const messageElements = document.querySelectorAll('.message');

    messageElements.forEach((messageElement) => {
      if (messageElement.classList.contains(`message-${message}`)) {
        messageElement.classList.remove('hidden');
      } else {
        messageElement.classList.add('hidden');
      }
    });
  }

  /**
   * @param {'idle' | 'playing' | 'win' | 'lose'} gameStatus
   */
  setStatus(gameStatus) {
    switch (gameStatus) {
      case 'playing':
        this.setMessage(null);
        break;
      case 'lose':
        this.setMessage('lose');
        break;
      case 'win':
        this.setMessage('win');
        break;
      default:
        break;
    }
    this.status = gameStatus;
  }

  getEmptyField() {
    const emptyFild = [];

    this.getState().forEach((row, indexY) => {
      row.forEach((cell, indexX) => {
        if (!cell) {
          emptyFild.push({ y: indexY, x: indexX });
        }
      });
    });

    return emptyFild;
  }

  win() {
    this.setStatus('win');
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  /**
   * Starts the game.
   */
  start() {
    if (this.getStatus() !== 'idle') {
      return;
    }
    document.addEventListener('keydown', this.handleKeyDown);

    this.setStatus('playing');
    this.setInitialFilds();
  }

  /**
   * Resets the game.
   */
  restart() {
    if (this.getStatus() === 'idle') {
      return;
    }
    this.setInitialFilds();
    this.setScore(0);

    document.removeEventListener('keydown', this.handleKeyDown);
    document.addEventListener('keydown', this.handleKeyDown);
  }
  // Add your own methods here
}

module.exports = Game;
