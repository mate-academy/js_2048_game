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
    this.boardLayout = initialState;

    // To create 2D Array and board related stuff. (IMPORTANT)
    this.gameField = document.querySelector('.game-field');
    this.fieldRows = Array.from(this.gameField.querySelectorAll('tr'));

    this.emptyCells = [];

    // Access  messages
    this.startMessage = document.querySelector('.message-start');
    this.loseMessage = document.querySelector('.message-lose');
    this.winMessage = document.querySelector('.message-win');
    this.totalScoreMessage = document.querySelector('.message-tatal__score');

    // Access controls
    this.controlButton = document.querySelector('.button');
    this.cheatButton = document.querySelector('.cheat-button');

    // Game utility
    this.state = 'idle';
    this.status = 'process';

    // Player can move by default
    this.canMove = true;

    this.oppositeMoveDirections = {
      left: 'right',
      right: 'left',
      up: 'down',
      down: 'up',
    };
    this.lastMoveDirection = '';
  }

  moveLeft() {
    // Don't allow player to move unless...
    this.canMove = false;

    let moved = false;

    this.boardLayout.forEach((row) => {
      // Merge
      for (let i = 0; i < row.length - 1; i++) {
        if (row[i] !== 0 && row[i] === row[i + 1]) {
          row[i] *= 2;
          row[i + 1] = 0;

          // Allow player to move, cells were merged
          this.canMove = true;
          moved = true;
        }
      }

      // Move numbers to the left
      for (let i = 0; i < row.length; i++) {
        if (row[i] === 0) {
          // Iterate inside the row
          for (let j = i + 1; j < row.length; j++) {
            if (row[j] !== 0) {
              row[i] = row[j];
              row[j] = 0;

              // Allow player to move, cells were moved to the left
              this.canMove = true;
              moved = true;
              break;
            }
          }
        }
      }
    });

    if (
      this.lastMoveDirection &&
      this.lastMoveDirection === this.oppositeMoveDirections['left']
    ) {
      this.canMove = true;
    }

    this.lastMoveDirection = 'left';
    this.updateBoardDisplay();

    return moved;
  }

  moveRight() {
    // Don't allow player to move unless...
    this.canMove = false;

    let moved = false;

    this.boardLayout.forEach((row) => {
      // Merge
      for (let i = row.length - 2; i >= 0; i--) {
        if (row[i] !== 0 && row[i] === row[i + 1]) {
          row[i + 1] *= 2;
          row[i] = 0;

          // Allow player to move, cells were merged
          this.canMove = true;
          moved = true;
        }
      }

      // Move numbers to the right
      for (let i = row.length - 1; i >= 0; i--) {
        if (row[i] === 0) {
          for (let j = i - 1; j >= 0; j--) {
            if (row[j] !== 0) {
              row[i] = row[j];
              row[j] = 0;

              // Allow player to move, cells were moved to the left
              this.canMove = true;
              moved = true;
              break;
            }
          }
        }
      }
    });

    if (
      this.lastMoveDirection &&
      this.lastMoveDirection === this.oppositeMoveDirections['right']
    ) {
      this.canMove = true;
    }

    this.lastMoveDirection = 'left';
    this.updateBoardDisplay();

    return moved;
  }

  moveUp() {
    let moved = false;

    // Copy, will be used to compare change in the columns
    const originalBoard = JSON.parse(JSON.stringify(this.boardLayout));

    const columns = this.boardLayout[0].map((_, colIndex) =>
      this.boardLayout.map((row) => row[colIndex]));

    columns.forEach((column, colIndex) => {
      const newColumn = column.filter((num) => num !== 0);
      const mergedColumn = [];

      for (let i = 0; i < newColumn.length; i++) {
        if (newColumn[i] === newColumn[i + 1]) {
          mergedColumn.push(newColumn[i] * 2);
          moved = true;
          i++;
        } else {
          mergedColumn.push(newColumn[i]);
        }
      }

      // Fill the rest with the zeroes
      while (mergedColumn.length < column.length) {
        mergedColumn.push(0);
      }

      mergedColumn.forEach((value, rowIndex) => {
        this.boardLayout[rowIndex][colIndex] = value;
      });

      if (!this.areBoardsEqual(originalBoard, this.boardLayout)) {
        moved = true;
      }
    });

    return moved;
  }

  moveDown() {
    let moved = false;

    // Copy, will be used to compare change in the columns
    const originalBoard = JSON.parse(JSON.stringify(this.boardLayout));

    const columns = this.boardLayout[0].map((_, colIndex) =>
      this.boardLayout.map((row) => row[colIndex]));

    columns.forEach((column, colIndex) => {
      const newColumn = column.filter((num) => num !== 0).reverse();
      const mergedColumn = [];

      for (let i = 0; i < newColumn.length; i++) {
        if (newColumn[i] === newColumn[i + 1]) {
          mergedColumn.push(newColumn[i] * 2);
          moved = true;
          i++;
        } else {
          mergedColumn.push(newColumn[i]);
        }
      }

      while (mergedColumn.length < column.length) {
        mergedColumn.push(0);
      }

      mergedColumn.reverse();

      // Apply merged column to the game board
      mergedColumn.forEach((value, rowIndex) => {
        this.boardLayout[rowIndex][colIndex] = value;
      });

      if (!this.areBoardsEqual(originalBoard, this.boardLayout)) {
        moved = true;
      }
    });

    return moved;
  }

  /**
   * @returns {number}
   */
  getScore() {
    const gameScore = document.querySelector('.game-score');
    const cellsScore = [];

    this.boardLayout.forEach((row) => {
      const rowSum = row.reduce((init, currScore) => init + currScore, 0);

      cellsScore.push(rowSum);
    });

    gameScore.textContent = cellsScore.reduce((init, curr) => init + curr, 0);

    return gameScore.textContent;
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
  start() {
    const controlHandler = () => {
      if (this.getState() === 'idle') {
        this.startGame();
        this.state = 'playing';
        this.controlButton.className = 'button restart';
        this.controlButton.textContent = 'Restart';
        this.startMessage.classList.add('hidden');
      } else if (
        this.getState() === 'playing' ||
        this.getState() === 'win' ||
        this.getState() === 'lose'
      ) {
        this.restart();
      }
    };

    // Ensure only one event listener is attached
    this.controlButton.removeEventListener('click', this.controlHandler);
    this.controlButton.addEventListener('click', controlHandler);

    // Save the handler to allow proper removal if needed later
    this.controlHandler = controlHandler;
  }

  /**
   * Resets the game.
   */
  restart() {
    this.state = 'idle';
    this.status = 'process';
    this.startMessage.classList.remove('hidden');

    // Hide all external messages.
    this.winMessage.classList.add('hidden');
    this.loseMessage.classList.add('hidden');
    this.totalScoreMessage.classList.add('hidden');

    this.controlButton.className = 'button start';
    this.controlButton.textContent = 'Start';

    // Reset all the cell's positions on the board
    this.boardLayout = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.updateBoardDisplay();
  }

  // Add your own methods here ----------------------------------------------------------------------------------------------

  // Method to start game
  startGame() {
    this.state = 'playing';
    this.controlButton.className = 'button restart';
    this.controlButton.textContent = 'Restart';

    this.getScore();
    this.initPLayerInput();
    this.initCheats();
    // Generate two random cells on the grid.
    this.generateNewCells();
    this.generateNewCells();
  }

  // Input stuff =======================================================================================================================

  // Initialize inputs
  initPLayerInput() {
    // Remove existing event listeners
    this.resetInput();

    if (this.state === 'playing') {
      this.bindPlayerInput();
    }
  }

  initCheats() {
    this.resetCheats();

    if (this.state === 'playing') {
      this.bindCheats();
    }
  }

  bindPlayerInput() {
    document.addEventListener('keydown', this.handleInput);
  }

  bindCheats() {
    this.cheatButton.addEventListener('click', this.cheats);
  }

  resetInput() {
    document.removeEventListener('keydown', this.handleInput);
  }

  resetCheats() {
    this.cheatButton.removeEventListener('click', this.cheats);
  }

  handleInput = (e) => {
    if (this.state !== 'playing') {
      return;
    }

    const key = e.key.toLowerCase();
    const moved = (() => {
      switch (key) {
        case 'a':
          return this.moveLeft();
        case 'd':
          return this.moveRight();
        case 'w':
          return this.moveUp();
        case 's':
          return this.moveDown();
        default:
          return false;
      }
    })();

    if (moved) {
      this.generateNewCells();
      this.getScore();
      this.handleGameResolvment();
      this.lastMoveDirection = key;
    }
  };

  cheats = () => {
    if (this.state !== 'playing') {
      return;
    }

    // Don't create extra cheat-menu containers
    if (document.querySelector('.cheat-menu-container')) {
      return;
    }

    // Create cheat menu.
    const cheatMenu = document.createElement('form');

    cheatMenu.className = 'cheat-menu-container';

    const cheatMenuDesc = document.createElement('p');

    cheatMenuDesc.innerHTML =
      'I used this to test <span style="color: green;">Win</span>/<span style="color: red;">Lose</span> system.<br>' +
      'You used this because you are a <span style="color: red;">cheater</span>.<br>' +
      'Its an open source game so you can add infinite money or whatever...<br>' +
      'Add animations if you want, im not doing this...';

    const labelWinOption = document.createElement('label');

    labelWinOption.textContent = 'Win option: ';

    const inputWinOption = document.createElement('select');

    inputWinOption.className = 'cheat-menu__input';

    const autoWin = document.createElement('option');

    autoWin.text = 'Auto Win';

    const autoLose = document.createElement('option');

    autoLose.text = 'Auto Lose';

    inputWinOption.add(autoWin);
    inputWinOption.add(autoLose);

    labelWinOption.appendChild(inputWinOption);

    const applyButton = document.createElement('button');

    applyButton.className = 'apply-cheat-button';
    applyButton.type = 'button';
    applyButton.textContent = 'Apply';

    cheatMenu.appendChild(labelWinOption);
    cheatMenu.appendChild(applyButton);
    cheatMenu.appendChild(cheatMenuDesc);
    document.body.appendChild(cheatMenu);

    // Add event listener for the Apply button
    applyButton.addEventListener('click', () => {
      if (inputWinOption.value === 'Auto Win') {
        this.boardLayout.forEach((row, rowIndex) => {
          row.forEach((_, colIndex) => {
            this.boardLayout[rowIndex][colIndex] = 2048;
          });
        });
        this.updateBoardDisplay();
      } else if (inputWinOption.value === 'Auto Lose') {
        this.boardLayout.forEach((row, rowIndex) => {
          row.forEach((_, colIndex) => {
            this.boardLayout[rowIndex][colIndex] = 0;
          });
        });
        this.updateBoardDisplay();
        this.showLoseMessage();
      }

      // Remove cheat menu after applying
      cheatMenu.remove();
    });
  };

  // Generate number cells randomly
  generateNewCells() {
    const cellValue = Math.random() < 0.9 ? 2 : 4;

    // Clear the emptyCells array before using it
    this.emptyCells = [];

    // Find all empty cells and store their positions in the emptyCells array
    this.boardLayout.forEach((row, rowIndex) => {
      row.forEach((cell, colIndex) => {
        if (cell === 0) {
          this.emptyCells.push({ rowIndex, colIndex });
        }
      });
    });

    // Check if there are empty cells
    if (this.emptyCells.length > 0) {
      // Randomly select one empty cell
      const randomIndex = Math.floor(Math.random() * this.emptyCells.length);
      const { rowIndex, colIndex } = this.emptyCells[randomIndex];

      // Set the value to the randomly selected cell
      this.boardLayout[rowIndex][colIndex] = cellValue;

      // Update the DOM to reflect the change
      this.updateBoardDisplay();
    }
  }

  // Update Table (on page)
  updateBoardDisplay() {
    this.fieldRows.forEach((row, rowIndex) => {
      const cells = Array.from(row.children);

      cells.forEach((cell, colIndex) => {
        const cellValue = this.boardLayout[rowIndex][colIndex];

        cell.textContent = cellValue !== 0 ? cellValue : '';
        cell.className = `field-cell field-cell--${cellValue}`;

        // In case there is cell with 2048, show message immidietly
        if (cellValue === 2048) {
          this.status = 'win';
          this.state = 'win';
          this.totalScoreMessage.textContent = `Your total score is: ${this.getScore()}`;
          this.totalScoreMessage.classList.remove('hidden');
          this.showWinMessage();
        }
      });
    });
  }

  areBoardsEqual(orgBoard, currentBoard) {
    return JSON.stringify(orgBoard) === JSON.stringify(currentBoard);
  }

  showLoseMessage() {
    this.loseMessage.classList.remove('hidden');
  }

  showWinMessage() {
    this.winMessage.classList.remove('hidden');
  }

  handleGameResolvment() {
    const losePromise = new Promise((resolve) => {
      const isLose = !this.boardLayout.some((row, rowIndex) =>
        row.some((cell, colIndex) => {
          // Check if there is any move possible, left or right, or up or down
          return (
            (colIndex < row.length - 1 &&
              row[colIndex] === row[colIndex + 1]) ||
            (rowIndex < this.boardLayout.length - 1 &&
              this.boardLayout[rowIndex][colIndex] ===
                this.boardLayout[rowIndex + 1][colIndex])
          );
        }));

      if (isLose) {
        resolve('lose');
      }
    });

    losePromise.then(() => {
      this.status = 'lose';
      this.state = 'lose';
      this.totalScoreMessage.textContent = `Your total score is: ${this.getScore()}`;
      this.totalScoreMessage.classList.remove('hidden');
      this.showLoseMessage();
    });
  }
}

module.exports = Game;
