class Game {
  constructor(initialState = null) {
    this.board = initialState || this.createEmptyBoard();
    this.score = 0;
    this.status = 'running';
    this.mergedThisMove = [];
  }

  // Create an empty 4x4 board
  createEmptyBoard() {
    return Array.from({ length: 4 }, () => Array(4).fill(0));
  }

  // Get the current game state (board and score)
  getState() {
    return {
      board: this.board,
      score: this.score,
      status: this.status,
    };
  }

  // Get the current score
  getScore() {
    return this.score;
  }

  // Get the current status (running, won, game over)
  getStatus() {
    return this.status;
  }

  // Start the game (initialize the board and reset score)
  start() {
    this.board = this.createEmptyBoard();
    this.score = 0;
    this.status = 'running';
    this.mergedThisMove = [];
    this.addRandomTile();
    this.addRandomTile();
    this.updateUI();
  }

  // Restart the game
  restart() {
    this.start();
  }

  // Add a random tile (2 or 4) in a random empty cell
  addRandomTile() {
    const emptyCells = [];

    // Loop to find all empty cells
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.board[i][j] === 0) {
          emptyCells.push([i, j]);
        }
      }
    }

    // If there are any empty cells, place a random tile
    if (emptyCells.length > 0) {
      const [x, y] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      const newValue = Math.random() < 0.9 ? 2 : 4;

      this.board[x][y] = newValue;
    }
  }

  // Check if a move is valid (if any tile moves or merges)
  isValidMove() {
    return this.board.some((row) => row.some((cell) => cell === 0));
  }

  // Check win or game over
  checkGameStatus() {
    if (this.board.some((row) => row.includes(2048))) {
      this.status = 'won';
      this.updateUI();
      alert('You win!');
    } else if (!this.isValidMove()) {
      this.status = 'game over';
      this.updateUI();
      alert('Game Over!');
    }
  }

  // Move left
  moveLeft() {
    let moved = false;

    this.board.forEach((row, rowIndex) => {
      const newRow = this.slideAndMerge(row);

      if (newRow !== row) {
        moved = true;
      }
      this.board[rowIndex] = newRow;
    });

    if (moved) {
      this.addRandomTile();
    }

    this.checkGameStatus();
    this.updateUI();
  }

  // Move right (reverse left movement)
  moveRight() {
    let moved = false;

    this.board.forEach((row, rowIndex) => {
      const reversedRow = row.reverse();
      const newRow = this.slideAndMerge(reversedRow).reverse();

      if (newRow !== row) {
        moved = true;
      }
      this.board[rowIndex] = newRow;
    });

    if (moved) {
      this.addRandomTile();
    }

    this.checkGameStatus();
    this.updateUI();
  }

  // Move up (transpose, move left, then transpose back)
  moveUp() {
    let moved = false;

    this.board = this.transposeBoard();

    this.board.forEach((row, rowIndex) => {
      const newRow = this.slideAndMerge(row);

      if (newRow !== row) {
        moved = true;
      }
      this.board[rowIndex] = newRow;
    });

    this.board = this.transposeBoard();

    if (moved) {
      this.addRandomTile();
    }

    this.checkGameStatus();
    this.updateUI();
  }

  // Move down (transpose, move right, then transpose back)
  moveDown() {
    let moved = false;

    this.board = this.transposeBoard();

    this.board.forEach((row, rowIndex) => {
      const reversedRow = row.reverse();
      const newRow = this.slideAndMerge(reversedRow).reverse();

      if (newRow !== row) {
        moved = true;
      }
      this.board[rowIndex] = newRow;
    });

    this.board = this.transposeBoard();

    if (moved) {
      this.addRandomTile();
    }

    this.checkGameStatus();
    this.updateUI();
  }

  // Transpose the board (swap rows and columns)
  transposeBoard() {
    return this.board[0].map((_, colIndex) => {
      return this.board.map((row) => row[colIndex]);
    });
  }

  slideAndMerge(row) {
    const newRow = row.filter((cell) => cell !== 0);
    const mergedRow = [];

    this.mergedThisMove = [];

    for (let i = 0; i < newRow.length; i++) {
      if (newRow[i] === newRow[i + 1] && !this.mergedThisMove.includes(i)) {
        mergedRow.push(newRow[i] * 2);
        this.score += newRow[i] * 2;
        this.mergedThisMove.push(i);
        i++;
      } else {
        mergedRow.push(newRow[i]);
      }
    }

    while (mergedRow.length < 4) {
      mergedRow.push(0);
    }

    return mergedRow;
  }

  updateUI() {
    this.board.forEach((row, i) => {
      row.forEach((cell, j) => {
        const cellElement = document.querySelector(
          `.cell[data-row="${i}"][data-col="${j}"]`,
        );

        cellElement.textContent = cell === 0 ? '' : cell;
        cellElement.className = `cell field-cell--${cell === 0 ? '' : cell}`;
      });
    });

    document.querySelector('.score').textContent = `Score: ${this.score}`;

    const statusElement = document.querySelector('.status');

    if (this.status === 'won') {
      statusElement.textContent = 'You Win!';
    } else if (this.status === 'game over') {
      statusElement.textContent = 'Game Over';
    } else {
      statusElement.textContent = '';
    }

    document.querySelector('.start').style.display =
      this.status === 'running' ? 'none' : 'inline-block';

    document.querySelector('.restart').style.display =
      this.status === 'running' ? 'inline-block' : 'none';
  }

  // Add keyboard listener to control movement
  addKeyboardListeners() {
    document.addEventListener('keydown', (eve) => {
      if (this.status !== 'running') {
        return;
      }

      if (eve.key === 'ArrowLeft') {
        this.moveLeft();
      } else if (eve.key === 'ArrowRight') {
        this.moveRight();
      } else if (eve.key === 'ArrowUp') {
        this.moveUp();
      } else if (eve.key === 'ArrowDown') {
        this.moveDown();
      }
    });
  }
}

export default Game;
