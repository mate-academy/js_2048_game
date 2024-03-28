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
  constructor(initialState) {
    // eslint-disable-next-line no-console
    if (!initialState) {
      this.start();
    }
    this.size = 4;
  }

  moveLeft() {
    let limit;

    for(let line = 0; line < 4; line++) {
      limit = this.size - 1;
      for (let column = 0; column  < limit; column++) {
        if (this.state[line][column] === 0) {
          for (let idx = column; idx < this.size - 1; idx++) {
            this.state[line][idx] = this.state[line][idx + 1];
            this.state[line][idx + 1] = 0;
          }

          column--;
          limit--;
          continue;
        } else if (this.state[line][column + 1] === 0) {
          for (let idx = column + 1; idx < this.size - 1; idx++) {
            this.state[line][idx] = this.state[line][idx + 1];
            this.state[line][idx + 1] = 0;
          }

          limit--;
          column--;
          continue;
        } else if (this.state[line][column] === this.state[line][column + 1] ) {
          this.state[line][column] *= 2;
          this.state[line][column + 1] = 0;
          this.score += this.state[line][column];
          if ( this.state[line][column] === 2048) {
            this.status = 'win';
          }
        }
      }
    }

    this.todoEveryMovement();
  }

  moveRight() {
    let limit;

    for(let line = 0; line < 4; line++) {
      limit = 0;
      for (let column = 3; column  > limit; column--) {
        if (this.state[line][column] === 0) {
          for (let idx = column; idx > 0; idx--) {
            this.state[line][idx] = this.state[line][idx - 1];
            this.state[line][idx - 1] = 0;
          }

          column++;
          limit++;
          continue;
        } else if (this.state[line][column - 1] === 0) {
          for (let idx = column - 1; idx > 0; idx--) {
            this.state[line][idx] = this.state[line][idx - 1];
            this.state[line][idx - 1] = 0;
          }

          limit++;
          column++;
          continue;
        } else if (this.state[line][column] === this.state[line][column - 1] ) {
          this.state[line][column] *= 2;
          this.state[line][column - 1] = 0;
          this.score += this.state[line][column];
          if ( this.state[line][column] === 2048) {
            this.status = 'win';
          }
        }
      }
    }

    this.todoEveryMovement();
  }

  moveUp() {
    let limit;

    for(let column = 0; column < 4; column++) {
      limit = this.size - 1;
      for (let line = 0; line  < limit; line++) {
        if (this.state[line][column] === 0) {
          for (let idx = line; idx < this.size - 1; idx++) {
            this.state[idx][column] = this.state[idx + 1][column];
            this.state[idx + 1][column] = 0;
          }

          line--;
          limit--;
          continue;
        } else if (this.state[line + 1][column] === 0) {
          for (let idx = line + 1; idx < this.size - 1; idx++) {
            this.state[idx][column] = this.state[idx + 1][column];
            this.state[idx + 1][column] = 0;
          }

          limit--;
          line--;
          continue;
        } else if (this.state[line][column] === this.state[line + 1][column] ) {
          this.state[line][column] *= 2;
          this.state[line + 1][column] = 0;
          this.score += this.state[line][column];
          if ( this.state[line][column] === 2048) {
            this.status = 'win';
          }
        }
      }
    }
    
    this.todoEveryMovement();
  }

  moveDown() {
    let limit;

    for(let column = 0; column < 4; column++) {
      limit = 0;
      for (let line = 3; line > limit; line--) {
        if (this.state[line][column] === 0) {
          for (let idx = line; idx > 0; idx--) {
            this.state[idx][column] = this.state[idx - 1][column];
            this.state[idx - 1][column] = 0;
          }

          line++;
          limit++;
          continue;
        } else if (this.state[line - 1][column] === 0) {
          for (let idx = line - 1; idx > 0; idx--) {
            this.state[idx][column] = this.state[idx - 1][column];
            this.state[idx - 1][column] = 0;
          }

          limit++;
          line++;
          continue;
        } else if (this.state[line][column] === this.state[line - 1][column] ) {
          this.state[line][column] *= 2;
          this.state[line - 1][column] = 0;
          this.score += this.state[line][column];
          if ( this.state[line][column] === 2048) {
            this.status = 'win';
          }
        }
      }
    }

    this.todoEveryMovement();
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
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
    this.score = 0;
    this.status = 'idle';
    this.state = new Array(4).fill(0);
    for (const i in this.state) {
      this.state[i] = new Array(4).fill(0);
    }
    this.randomizer();
  }

  /**
   * Resets the game.
   */
  restart() {
    this.start();
  }

  // Add your own methods here
  /** 
   * Put 2 or 4 in freely cells if they exists in this.state var
  */
  randomizer() {
    const empties = [];
    for (let line = 0; line < 4; line++) {
      for (let column = 0; column < 4; column++) {
        if (this.state[line][column] === 0) {
          empties.push([line, column]);
        }
      }
    }

    const idx_sorted = Math.floor(Math.random() * empties.length);

    if (empties.length > 0) {
      this.state[empties[idx_sorted][0]][empties[idx_sorted][1]] 
        = (Math.floor(Math.random() * 10) < 9) ? 2 : 4 ;
    }
  }


  /** Check if player lose the game
   * If player lose this method update this.status = 'lose'
   * 
   * @returns {undefined}
  */
  checkIfLose() {
    let allSides = [];
    if (this.status === 'playing' || this.status === 'idle') {
      for(let column = 0; column < this.size; column++) {
        for (let line = 0; line < this.size; line++) {
          if (this.state[line][column] !== 0){
            allSides.push((this.state[line - 1] !== undefined) ? this.state[line - 1][column] : undefined);
            allSides.push((this.state[line + 1] !== undefined) ? this.state[line + 1][column]: undefined);
            allSides.push(this.state[line][column + 1]);
            allSides.push(this.state[line][column - 1]);
            if (allSides.includes(0) || allSides.includes(this.state[line][column])) {
              return;
            }
          }
          allSides = [];
        }
      }
      
      this.status = 'lose';
    }
  }

  todoEveryMovement() {
    if (this.status === 'playing' || this.status === 'idle') {
      this.checkIfLose();
      this.randomizer();
    }
  }
}

module.exports = Game;
