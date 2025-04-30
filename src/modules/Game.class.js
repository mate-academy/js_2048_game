export default class Game {
  constructor(initialState = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]) {
    this.state = initialState; // The game board (4x4 matrix)
    this.score = 0; // Total score
    this.status = 'playing'; // Status can be 'playing', 'win', or 'game over'
  }

  // Return the current state of the board
  getState() {
    return this.state;
  }

  // Return the current score
  getScore() {
    return this.score;
  }

  // Return the current game status
  getStatus() {
    return this.status;
  }

  // Add a random 2 or 4 to the board
  addRandomTile() {
    const emptyCells = [];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    if (emptyCells.length === 0) return;

    const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    this.state[row][col] = Math.random() < 0.9 ? 2 : 4;
  }

  // Move and merge tiles left
  moveLeft() {
    const newState = this.state.map(row => {
      const filtered = row.filter(cell => cell !== 0); // Remove zeros
      for (let i = 0; i < filtered.length - 1; i++) {
        if (filtered[i] === filtered[i + 1]) {
          filtered[i] *= 2;
          this.score += filtered[i]; // Add to score
          filtered.splice(i + 1, 1); // Remove merged cell
        }
      }
      return [...filtered, ...Array(4 - filtered.length).fill(0)]; // Fill with zeros
    });

    this.updateState(newState);
  }

  // Move and merge tiles right
  moveRight() {
    const newState = this.state.map(row => {
      const reversed = [...row].reverse().filter(cell => cell !== 0); // Reverse and remove zeros
      for (let i = 0; i < reversed.length - 1; i++) {
        if (reversed[i] === reversed[i + 1]) {
          reversed[i] *= 2;
          this.score += reversed[i]; // Add to score
          reversed.splice(i + 1, 1); // Remove merged cell
        }
      }
      const updatedRow = [...reversed, ...Array(4 - reversed.length).fill(0)].reverse();
      return updatedRow;
    });

    this.updateState(newState);
  }

  // Move and merge tiles up
  moveUp() {
    this.state = this.transpose(this.state);
    this.moveLeft();
    this.state = this.transpose(this.state);
  }

  // Move and merge tiles down
  moveDown() {
    this.state = this.transpose(this.state);
    this.moveRight();
    this.state = this.transpose(this.state);
  }

  // Transpose the matrix
  transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
  }

  // Update the board state and check game status
  updateState(newState) {
    if (JSON.stringify(this.state) !== JSON.stringify(newState)) {
      this.state = newState;
      this.addRandomTile();
      this.checkGameStatus();
    }
  }

  // Check if the game is won or over
  checkGameStatus() {
    if (this.state.flat().includes(2048)) {
      this.status = 'win';
      return;
    }

    if (!this.canMove()) {
      this.status = 'game over';
    }
  }

  // Check if any moves are possible
  canMove() {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const cell = this.state[row][col];
        if (cell === 0) return true;

        // Check adjacent cells
        if (row > 0 && this.state[row - 1][col] === cell) return true;
        if (row < 3 && this.state[row + 1][col] === cell) return true;
        if (col > 0 && this.state[row][col - 1] === cell) return true;
        if (col < 3 && this.state[row][col + 1] === cell) return true;
      }
    }
    return false;
  }

  // Start the game
  start() {
    this.state = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];
    this.score = 0;
    this.status = 'playing';
    this.addRandomTile();
    this.addRandomTile();
  }

  // Restart the game
  restart() {
    this.start();
  }
}
