'use strict';

const BOARD_SIZE = 4;

class Game {
  constructor(initialState = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]]) {
    this.score = 0;
    this.initialState = initialState;
    this.currentState = initialState;
    this.isStarted = false;
  }

  moveLeft() {
    let isAbleToMove = false;

    for (let j = 0; j < BOARD_SIZE; j++) {
      for (let l = 1; l < BOARD_SIZE; l++) {
        if (this.currentState[j][l] === 0) {
          isAbleToMove = true;
        } else if (this.currentState[j][l] === this.currentState[j][l - 1]) {
          isAbleToMove = true;
        } else if (this.currentState[j][0] === 0) {
          isAbleToMove = true;
        }
      }
    }

    if (isAbleToMove && this.isStarted) {
      for (let i = 0; i < BOARD_SIZE; i++) { // changes numbers in array
        for (let n = 0; n < BOARD_SIZE; n++) {
          let changed = false;
          const CURRENT = this.currentState[i][n];

          if (CURRENT !== 0) {
            for (let k = n + 1; k < BOARD_SIZE; k++) {
              const NEIGHBOR = this.currentState[i][k];

              if (NEIGHBOR !== 0) {
                if (NEIGHBOR === CURRENT) {
                  this.currentState[i][n] = CURRENT * 2;
                  this.currentState[i][k] = 0;
                  this.score += CURRENT * 2;
                  changed = true;
                }
              } else if (NEIGHBOR === 0 && !changed) {
                switch (k) {
                  case 1 :
                    if (this.currentState[i][k + 1] === 0) {
                      if (this.currentState[i][k + 2] === CURRENT) {
                        this.currentState[i][n] = CURRENT * 2;
                        this.currentState[i][k + 2] = 0;
                        changed = true;
                        this.score += CURRENT * 2;
                      }
                    } else if (
                      this.currentState[i][k + 1]
                      === CURRENT && !changed) {
                      this.currentState[i][n] = CURRENT * 2;
                      this.currentState[i][k + 1] = 0;
                      this.score += CURRENT * 2;
                    }
                    break;
                  case 2 :
                    if (this.currentState[i][k + 1] === CURRENT) {
                      this.currentState[i][n] = CURRENT * 2;
                      this.currentState[i][k + 1] = 0;
                      this.score += CURRENT * 2;
                    }
                    break;
                }
              }
            }
          }
        }
      }

      for (let i = 0; i < BOARD_SIZE; i++) { // moves numbers to the left side
        for (let n = 1; n < BOARD_SIZE; n++) {
          if (this.currentState[i][n] !== 0) {
            const current = this.currentState[i][n];

            switch (n) {
              case 1:
                if (this.currentState[i][0] === 0) {
                  this.currentState[i][0] = current;
                  this.currentState[i][n] = 0;
                }

                break;

              case 2:
                if (this.currentState[i][1] === 0) {
                  if (this.currentState[i][0] === 0) {
                    this.currentState[i][0] = current;
                    this.currentState[i][n] = 0;
                  } else {
                    this.currentState[i][1] = current;
                    this.currentState[i][n] = 0;
                  }
                }

                break;

              case 3:
                if (this.currentState[i][2] === 0) {
                  if (this.currentState[i][1] === 0) {
                    if (this.currentState[i][0] === 0) {
                      this.currentState[i][0] = current;
                      this.currentState[i][n] = 0;
                    } else {
                      this.currentState[i][1] = current;
                      this.currentState[i][n] = 0;
                    }
                  } else {
                    this.currentState[i][2] = current;
                    this.currentState[i][n] = 0;
                  }
                }
            }
          }
        }
      }

      this.clearField();
      this.redrawGameField();
      this.createPlayCell();
    }
  }

  moveRight() {
    let isAbleToMove = false;

    for (let j = 0; j < BOARD_SIZE; j++) {
      for (let l = 1; l < BOARD_SIZE; l++) {
        if (this.currentState[j][l] === 0) {
          isAbleToMove = true;
        } else if (this.currentState[j][l] === this.currentState[j][l - 1]) {
          isAbleToMove = true;
        }
      }
    }

    if (isAbleToMove && this.isStarted) {
      for (let i = 0; i < BOARD_SIZE; i++) { // changes numbers in array
        for (let n = BOARD_SIZE - 1; n >= 0; n--) {
          let changed = false;
          const CURRENT = this.currentState[i][n];

          if (CURRENT !== 0) {
            for (let k = n - 1; k >= 0; k--) {
              const NEIGHBOR = this.currentState[i][k];

              if (NEIGHBOR !== 0) {
                if (NEIGHBOR === CURRENT && k === n - 1) {
                  this.currentState[i][n] = CURRENT * 2;
                  this.currentState[i][k] = 0;
                  changed = true;
                }
              } else if (NEIGHBOR === CURRENT && !changed) {
                switch (k) {
                  case 0 :
                    if (this.currentState[i][1] === 0 && !changed) {
                      if (this.currentState[i][2] === 0) {
                        this.currentState[i][n] = CURRENT * 2;
                        this.currentState[i][k] = 0;
                        changed = true;
                        this.score += CURRENT * 2;
                      }
                    }
                    break;
                  case 1 :
                    if (this.currentState[i][2] === 0 && !changed) {
                      this.currentState[i][n] = CURRENT * 2;
                      this.currentState[i][k] = 0;
                      changed = true;
                      this.score += CURRENT * 2;
                    }
                    break;
                }
              }
            }
          }
        }
      }

      for (let i = 0; i < BOARD_SIZE; i++) { // moves numbers to the right side
        for (let n = BOARD_SIZE - 1; n >= 0; n--) {
          if (this.currentState[i][n] !== 0) {
            const current = this.currentState[i][n];

            switch (n) {
              case 0:
                if (this.currentState[i][1] === 0) {
                  if (this.currentState[i][2] === 0) {
                    if (this.currentState[i][3] === 0) {
                      this.currentState[i][3] = current;
                      this.currentState[i][n] = 0;
                    } else {
                      this.currentState[i][2] = current;
                      this.currentState[i][n] = 0;
                    }
                  } else {
                    this.currentState[i][1] = current;
                    this.currentState[i][n] = 0;
                  }
                }

                break;

              case 1:
                if (this.currentState[i][2] === 0) {
                  if (this.currentState[i][3] === 0) {
                    this.currentState[i][3] = current;
                    this.currentState[i][n] = 0;
                  } else {
                    this.currentState[i][2] = current;
                    this.currentState[i][n] = 0;
                  }
                }

                break;

              case 2:
                if (this.currentState[i][3] === 0) {
                  this.currentState[i][3] = current;
                  this.currentState[i][n] = 0;
                }
            }
          }
        }
      }

      this.clearField();
      this.redrawGameField();
      this.createPlayCell();
    }
  }

  moveUp() {
    let isAbleToMove = false;

    for (let j = 1; j < BOARD_SIZE; j++) {
      for (let l = 0; l < BOARD_SIZE; l++) {
        if (this.currentState[j][l] === 0) {
          isAbleToMove = true;
        } else if (this.currentState[j][l] === this.currentState[j - 1][l]) {
          isAbleToMove = true;
        } else if (this.currentState[0][l] === 0) {
          isAbleToMove = true;
        }
      }
    }

    if (isAbleToMove && this.isStarted) {
      for (let i = 0; i < BOARD_SIZE; i++) { // merges numbers
        for (let n = 0; n < BOARD_SIZE; n++) {
          const CURRENT = this.currentState[i][n];

          switch (i) {
            case 0:
              if (this.currentState[1][n] === 0) {
                if (this.currentState[2][n] === 0) {
                  if (this.currentState[3][n] === CURRENT) {
                    this.currentState[i][n] = 2 * CURRENT;
                    this.currentState[3][n] = 0;
                    this.score += CURRENT * 2;
                  }
                } else if (this.currentState[2][n] === CURRENT) {
                  this.currentState[i][n] = 2 * CURRENT;
                  this.currentState[2][n] = 0;
                  this.score += CURRENT * 2;
                }
              } else if (this.currentState[1][n] === CURRENT) {
                this.currentState[i][n] = 2 * CURRENT;
                this.currentState[1][n] = 0;
                this.score += CURRENT * 2;
              }

              break;

            case 1 :
              if (this.currentState[2][n] === 0) {
                if (this.currentState[3][n] === CURRENT) {
                  this.currentState[i][n] = 2 * CURRENT;
                  this.currentState[3][n] = 0;
                  this.score += CURRENT * 2;
                }
              } else if (this.currentState[2][n] === CURRENT) {
                this.currentState[i][n] = 2 * CURRENT;
                this.currentState[2][n] = 0;
                this.score += CURRENT * 2;
              }

              break;

            case 2:
              if (this.currentState[3][n] === CURRENT) {
                this.currentState[i][n] = 2 * CURRENT;
                this.currentState[3][n] = 0;
                this.score += CURRENT * 2;
              }
          }
        }
      }

      for (let i = 0; i < BOARD_SIZE; i++) { // moves numbers in array
        for (let n = 0; n < BOARD_SIZE; n++) {
          switch (i) {
            case 1:
              if (this.currentState[0][n] === 0) {
                this.currentState[0][n] = this.currentState[i][n];
                this.currentState[i][n] = 0;
              }

              break;

            case 2:
              if (this.currentState[1][n] === 0) {
                if (this.currentState[0][n] === 0) {
                  this.currentState[0][n] = this.currentState[i][n];
                  this.currentState[i][n] = 0;
                } else {
                  this.currentState[1][n] = this.currentState[i][n];
                  this.currentState[i][n] = 0;
                }
              }

              break;

            case 3:
              if (this.currentState[2][n] === 0) {
                if (this.currentState[1][n] === 0) {
                  if (this.currentState[0][n] === 0) {
                    this.currentState[0][n] = this.currentState[i][n];
                    this.currentState[i][n] = 0;
                  } else {
                    this.currentState[1][n] = this.currentState[i][n];
                    this.currentState[i][n] = 0;
                  }
                } else {
                  this.currentState[2][n] = this.currentState[i][n];
                  this.currentState[i][n] = 0;
                }
              }
          }
        }
      }

      this.clearField();
      this.redrawGameField();
      this.createPlayCell();
    }
  }

  moveDown() {
    let isAbleToMove = false;

    for (let j = 1; j < BOARD_SIZE; j++) {
      for (let l = 0; l < BOARD_SIZE; l++) {
        if (this.currentState[j][l] === 0) {
          isAbleToMove = true;
        } else if (this.currentState[j][l] === this.currentState[j - 1][l]) {
          isAbleToMove = true;
        }
      }
    }

    if (isAbleToMove && this.isStarted) {
      for (let i = BOARD_SIZE - 1; i >= 0; i--) { // merges numbers
        for (let n = BOARD_SIZE - 1; n >= 0; n--) {
          const CURRENT = this.currentState[i][n];

          switch (i) {
            case 3:
              if (this.currentState[2][n] === 0) {
                if (this.currentState[1][n] === 0) {
                  if (this.currentState[0][n] === CURRENT) {
                    this.currentState[i][n] = 2 * CURRENT;
                    this.currentState[0][n] = 0;
                    this.score += CURRENT * 2;
                  }
                } else if (this.currentState[1][n] === CURRENT) {
                  this.currentState[i][n] = 2 * CURRENT;
                  this.currentState[1][n] = 0;
                  this.score += CURRENT * 2;
                }
              } else if (this.currentState[2][n] === CURRENT) {
                this.currentState[i][n] = 2 * CURRENT;
                this.currentState[2][n] = 0;
                this.score += CURRENT * 2;
              }

              break;

            case 2 :
              if (this.currentState[1][n] === 0) {
                if (this.currentState[0][n] === CURRENT) {
                  this.currentState[i][n] = 2 * CURRENT;
                  this.currentState[0][n] = 0;
                  this.score += CURRENT * 2;
                }
              } else if (this.currentState[1][n] === CURRENT) {
                this.currentState[i][n] = 2 * CURRENT;
                this.currentState[1][n] = 0;
                this.score += CURRENT * 2;
              }

              break;

            case 1:
              if (this.currentState[0][n] === CURRENT) {
                this.currentState[i][n] = 2 * CURRENT;
                this.currentState[0][n] = 0;
                this.score += CURRENT * 2;
              }
          }
        }
      }

      for (let i = BOARD_SIZE - 1; i >= 0; i--) { // moves numbers in array
        for (let n = BOARD_SIZE - 1; n >= 0; n--) {
          switch (i) {
            case 2:
              if (this.currentState[3][n] === 0) {
                this.currentState[3][n] = this.currentState[i][n];
                this.currentState[i][n] = 0;
              }

              break;

            case 1:
              if (this.currentState[2][n] === 0) {
                if (this.currentState[3][n] === 0) {
                  this.currentState[3][n] = this.currentState[i][n];
                  this.currentState[i][n] = 0;
                } else {
                  this.currentState[2][n] = this.currentState[i][n];
                  this.currentState[i][n] = 0;
                }
              }

              break;

            case 0:
              if (this.currentState[1][n] === 0) {
                if (this.currentState[2][n] === 0) {
                  if (this.currentState[3][n] === 0) {
                    this.currentState[3][n] = this.currentState[i][n];
                    this.currentState[i][n] = 0;
                  } else {
                    this.currentState[2][n] = this.currentState[i][n];
                    this.currentState[i][n] = 0;
                  }
                } else {
                  this.currentState[1][n] = this.currentState[i][n];
                  this.currentState[i][n] = 0;
                }
              }
          }
        }
      }

      this.clearField();
      this.redrawGameField();
      this.createPlayCell();
    }
  }

  /**
   * @returns {number}
   */
  getScore() {
    return this.score;
  }

  getState() {
    return this.currentState;
  }

  getStatus() {
    let result = 0;

    for (let i = 0; i < BOARD_SIZE; i++) {
      this.currentState[i].forEach((a) => {
        result += a;
      });
    }

    if (result === 0) {
      return 'idle';
    }

    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let n = 0; n < BOARD_SIZE; n++) {
        if (this.currentState[i][n] >= 2048) {
          return 'win';
        }
      }
    }

    if (this.checkForLose()) {
      return 'lose';
    }

    return 'playing';
  }

  start() {
    this.isStarted = true;
    this.createPlayCell();
    this.createPlayCell();
  }

  restart() {
    this.isStarted = false;
    this.score = 0;

    this.currentState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.clearField();
  }

  clearField() {
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let n = 0; n < BOARD_SIZE; n++) {
        const CELL_TO_CLEAR = document.querySelector('.cell' + i + '-' + n);

        CELL_TO_CLEAR.innerHTML = '';
      }
    }
  }

  redrawGameField() {
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let n = 0; n < BOARD_SIZE; n++) {
        const NUM_OF_CELL = this.currentState[i][n];

        if (NUM_OF_CELL !== 0) {
          const CELL = document.querySelector(`.cell${i}-${n}`);
          const CELL_INSIDE = document.createElement('div');

          CELL_INSIDE.textContent = NUM_OF_CELL;
          CELL_INSIDE.classList.add('field-cell--' + NUM_OF_CELL);
          CELL.appendChild(CELL_INSIDE);
        }
      }
    }
  }

  generateRandom() {
    return Math.floor(Math.random() * 4);
  }

  checkForLose() {
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (let n = 0; n < BOARD_SIZE; n++) {
        if (this.currentState[i][n] === 0) {
          return false;
        }

        if (
          n + 1 < BOARD_SIZE
          && this.currentState[i][n] === this.currentState[i][n + 1]) {
          return false;
        }

        if (
          n - 1 >= 0
          && this.currentState[i][n] === this.currentState[i][n - 1]) {
          return false;
        }

        if
        (
          i + 1 < BOARD_SIZE
          && this.currentState[i][n] === this.currentState[i + 1][n]) {
          return false;
        }

        if (
          i - 1 >= 0
          && this.currentState[i][n] === this.currentState[i - 1][n]) {
          return false;
        }
      }
    }

    return true;
  }

  createPlayCell() {
    while (true) {
      const ROW = this.generateRandom();
      const COLL = this.generateRandom();
      const RANDOM_CELL = this.currentState[ROW][COLL];

      if (RANDOM_CELL === 0) {
        const NUM = Math.floor(Math.random() * 10);
        let content = 0;

        if (NUM === 0) {
          this.currentState[ROW][COLL] = 4;
          content = 4;
        } else {
          this.currentState[ROW][COLL] = 2;
          content = 2;
        }

        const CELL = document.querySelector(`.cell${ROW}-${COLL}`);
        const CELL_INSIDE = document.createElement('div');

        CELL_INSIDE.textContent = content;
        CELL_INSIDE.classList.add('field-cell--' + content);
        CELL.appendChild(CELL_INSIDE);

        break;
      }
    }
  }

  anilizeStatus() {
    const result = this.getStatus();

    if (result === 'win') {
      this.isStarted = false;

      return 'win';
    } else if (result === 'lose') {
      this.isStarted = false;

      return 'lose';
    }
  }

  visualiseScore(scoreElement) {
    scoreElement.textContent = this.score;
  }
}

module.exports = Game;
