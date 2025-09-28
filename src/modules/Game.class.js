'use strict';

class Game {
  constructor() {
    this.state = [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    this.score = 0;
    this.status = 'idle';
    this.moved = false;
    this.nextCellId = 1;
  }

  getState() {
    return this.state;
  }

  getScore() {
    return this.score;
  }

  getStatus() {
    return this.status;
  }

  moveLeft() {
    const stateCopy = this.state.map((row) => {
      return row.map((cell) => (cell ? { ...cell } : null));
    });
    const transitions = [];

    this.moved = false;

    for (let i = 0; i < stateCopy.length; i++) {
      const merged = [false, false, false, false];

      for (let j = 0; j < stateCopy[i].length; j++) {
        if (stateCopy[i][j] === null) {
          continue;
        }

        let k = j;

        while (k > 0 && stateCopy[i][k - 1] === null) {
          k--;
        }

        if (k !== j) {
          stateCopy[i][k] = stateCopy[i][j];
          stateCopy[i][j] = null;
          this.moved = true;

          transitions.push({
            id: stateCopy[i][k].id,
            type: 'move',
            from: [i, j],
            to: [i, k],
          });
        }

        if (
          k > 0 &&
          stateCopy[i][k - 1] !== null &&
          stateCopy[i][k].value === stateCopy[i][k - 1].value &&
          !merged[k - 1]
        ) {
          transitions.push({
            id: stateCopy[i][k].id,
            type: 'merge',
            from: [i, k],
            to: [i, k - 1],
            mergeIntoId: stateCopy[i][k - 1].id,
          });

          stateCopy[i][k - 1].value *= 2;
          this.score += stateCopy[i][k - 1].value;
          stateCopy[i][k] = null;
          merged[k - 1] = true;
          this.moved = true;
        }
      }
    }

    return { newState: stateCopy, transitions, moved: this.moved };
  }

  moveRight() {
    const stateCopy = this.state.map((row) => {
      return row.map((cell) => (cell ? { ...cell } : null));
    });
    const transitions = [];

    this.moved = false;

    for (let i = 0; i < stateCopy.length; i++) {
      const merged = [false, false, false, false];

      for (let j = stateCopy[i].length - 1; j >= 0; j--) {
        if (stateCopy[i][j] === null) {
          continue;
        }

        let k = j;

        while (k < stateCopy[i].length - 1 && stateCopy[i][k + 1] === null) {
          k++;
        }

        if (k !== j) {
          stateCopy[i][k] = stateCopy[i][j];
          stateCopy[i][j] = null;
          this.moved = true;

          transitions.push({
            id: stateCopy[i][k].id,
            type: 'move',
            from: [i, j],
            to: [i, k],
          });
        }

        if (
          k < stateCopy[i].length - 1 &&
          stateCopy[i][k + 1] !== null &&
          stateCopy[i][k].value === stateCopy[i][k + 1].value &&
          !merged[k + 1]
        ) {
          transitions.push({
            id: stateCopy[i][k].id,
            type: 'merge',
            from: [i, k],
            to: [i, k + 1],
            mergeIntoId: stateCopy[i][k + 1].id,
          });

          stateCopy[i][k + 1].value *= 2;
          this.score += stateCopy[i][k + 1].value;
          stateCopy[i][k] = null;
          merged[k + 1] = true;
          this.moved = true;
        }
      }
    }

    return { newState: stateCopy, transitions, moved: this.moved };
  }

  moveUp() {
    const stateCopy = this.state.map((row) => {
      return row.map((cell) => (cell ? { ...cell } : null));
    });
    const transitions = [];

    this.moved = false;

    for (let j = 0; j < stateCopy[0].length; j++) {
      const merged = [false, false, false, false];

      for (let i = 0; i < stateCopy.length; i++) {
        if (stateCopy[i][j] === null) {
          continue;
        }

        let k = i;

        while (k > 0 && stateCopy[k - 1][j] === null) {
          k--;
        }

        if (k !== i) {
          stateCopy[k][j] = stateCopy[i][j];
          stateCopy[i][j] = null;
          this.moved = true;

          transitions.push({
            id: stateCopy[k][j].id,
            type: 'move',
            from: [i, j],
            to: [k, j],
          });
        }

        if (
          k > 0 &&
          stateCopy[k - 1][j] !== null &&
          stateCopy[k][j].value === stateCopy[k - 1][j].value &&
          !merged[k - 1]
        ) {
          transitions.push({
            id: stateCopy[k][j].id,
            type: 'merge',
            from: [k, j],
            to: [k - 1, j],
            mergeIntoId: stateCopy[k - 1][j].id,
          });

          stateCopy[k - 1][j].value *= 2;
          this.score += stateCopy[k - 1][j].value;
          stateCopy[k][j] = null;
          merged[k - 1] = true;
          this.moved = true;
        }
      }
    }

    return { newState: stateCopy, transitions, moved: this.moved };
  }

  moveDown() {
    const stateCopy = this.state.map((row) => {
      return row.map((cell) => (cell ? { ...cell } : null));
    });
    const transitions = [];

    this.moved = false;

    for (let j = 0; j < stateCopy[0].length; j++) {
      const merged = [false, false, false, false];

      for (let i = stateCopy.length - 1; i >= 0; i--) {
        if (stateCopy[i][j] === null) {
          continue;
        }

        let k = i;

        while (k < stateCopy.length - 1 && stateCopy[k + 1][j] === null) {
          k++;
        }

        if (k !== i) {
          stateCopy[k][j] = stateCopy[i][j];
          stateCopy[i][j] = null;
          this.moved = true;

          transitions.push({
            id: stateCopy[k][j].id,
            type: 'move',
            from: [i, j],
            to: [k, j],
          });
        }

        if (
          k < stateCopy.length - 1 &&
          stateCopy[k + 1][j] !== null &&
          stateCopy[k][j].value === stateCopy[k + 1][j].value &&
          !merged[k + 1]
        ) {
          transitions.push({
            id: stateCopy[k][j].id,
            type: 'merge',
            from: [k, j],
            to: [k + 1, j],
            mergeIntoId: stateCopy[k + 1][j].id,
          });

          stateCopy[k + 1][j].value *= 2;
          this.score += stateCopy[k + 1][j].value;
          stateCopy[k][j] = null;
          merged[k + 1] = true;
          this.moved = true;
        }
      }
    }

    return { newState: stateCopy, transitions, moved: this.moved };
  }

  defineStep([rowIndex, columnIndex], direction) {
    const currentItem = this.state[rowIndex][columnIndex];
    const currentRow = this.state[rowIndex];
    const currentColumn = this.state.map((row) => row[columnIndex]);
    let step = 0;

    switch (direction) {
      case 'left':
        for (let i = columnIndex - 1; i >= 0; i--) {
          if (currentRow[i] === 0) {
            step++;
          } else if (currentRow[i] === currentItem) {
            return step + 1;
          } else {
            break;
          }
        }

        return step;
      case 'right':
        for (let i = columnIndex + 1; i < currentRow.length; i++) {
          if (currentRow[i] === 0) {
            step++;
          } else if (currentRow[i] === currentItem) {
            return step + 1;
          } else {
            break;
          }
        }

        return step;
      case 'up':
        for (let i = rowIndex - 1; i >= 0; i--) {
          if (currentColumn[i] === 0) {
            step++;
          } else if (currentColumn[i] === currentItem) {
            return step + 1;
          } else {
            break;
          }
        }

        return step;
      case 'down':
        for (let i = rowIndex + 1; i < currentColumn.length; i++) {
          if (currentColumn[i] === 0) {
            step++;
          } else if (currentColumn[i] === currentItem) {
            return step + 1;
          } else {
            break;
          }
        }

        return step;
    }
  }

  start() {
    this.born();
    this.born();
    this.status = 'playing';
  }

  restart() {
    this.state = [
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
      [null, null, null, null],
    ];
    this.status = 'idle';
    this.score = 0;
    this.nextCellId = 1;
  }

  check() {
    for (let i = 0; i < this.state.length; i++) {
      for (let j = 0; j < this.state[i].length; j++) {
        const current = this.state[i][j];

        if (current !== null && current.value >= 2048) {
          this.status = 'win';

          return;
        }

        if (!current) {
          return;
        }

        if (j < this.state[i].length - 1) {
          const rightCell = this.state[i][j + 1];

          if (rightCell !== null && rightCell.value === current.value) {
            return;
          }
        }

        if (i < this.state.length - 1) {
          const downCell = this.state[i + 1][j];

          if (downCell !== null && downCell.value === current.value) {
            return;
          }
        }
      }
    }

    this.status = 'lose';
  }

  born() {
    const emptyCells = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.state[i][j] === null) {
          emptyCells.push([i, j]);
        }
      }
    }

    if (emptyCells.length === 0) {
      return;
    }

    const [row, col] =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const value = Math.random() < 0.1 ? 4 : 2;
    const clearStateCell = { id: this.nextCellId++, value };

    this.state[row][col] = clearStateCell;

    const spawnTransition = {
      id: clearStateCell.id,
      type: 'spawn',
      to: [row, col],
      value,
    };

    return spawnTransition;
  }

  performMove(direction) {
    let moveResult;

    switch (direction) {
      case 'LEFT':
        moveResult = this.moveLeft();
        break;
      case 'RIGHT':
        moveResult = this.moveRight();
        break;
      case 'UP':
        moveResult = this.moveUp();
        break;
      case 'DOWN':
        moveResult = this.moveDown();
        break;
      default:
        return { newState: this.state, transitions: [], moved: false };
    }

    if (moveResult.moved) {
      this.state = moveResult.newState;

      const spawnTransition = this.born();

      moveResult.transitions.push(spawnTransition);
      this.check();
    }

    return moveResult;
  }
}

module.exports = Game;
