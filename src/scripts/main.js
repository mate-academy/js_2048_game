'use strict';

const DOM_SELECTORS = {
  get GAME_FIELD() {
    return document.querySelector('.game-field');
  },
  get ARRAY_OF_CELLS() {
    return document.getElementsByClassName('field-cell');
  },
  get ARRAY_OF_ROWS() {
    return document.getElementsByClassName('field-row');
  },
  get START() {
    return document.querySelector('.start')
      || document.querySelector('.restart');
  },
  get SCORE() {
    return document.querySelector('.game-score');
  },
  MESSAGE: {
    get START() {
      return document.querySelector('.message-start');
    },
    get WIN() {
      return document.querySelector('.message-win');
    },
    get LOSE() {
      return document.querySelector('.message-lose');
    },
  },
};

const FIELD_SIZE = {
  get ROWS() {
    return DOM_SELECTORS.ARRAY_OF_ROWS.length;
  },
  get COLUMNS() {
    return DOM_SELECTORS.ARRAY_OF_CELLS.length / this.ROWS;
  },
};

const SWIPE_STATES = {
  RIGHT: 'right',
  LEFT: 'left',
  TOP: 'top',
  BOTTOM: 'bottom',
};

const BUTTONS = {
  RIGHT: 'ArrowRight',
  DOWN: 'ArrowDown',
  UP: 'ArrowUp',
  LEFT: 'ArrowLeft',
};

class Game {
  constructor() {
    this.field = [];
  }

  get isGameOver() {
    return this.winCheck()
      ? this.win() && true
      : this.loseCheck()
        ? this.lose() && true
        : false;
  }

  winCheck() {
    return this.field.some(item => item.value >= 2048);
  }

  loseCheck() {
    const hasEqualInRow = this.rows
      .map(row =>
        row.filter(item => !item.isEmpty)
      )
      .some(row => row.some((current, index, array) => {
        const next = array[index + 1];

        return next && next.value === current.value;
      }));

    const hasEqualInColumn = this.columns
      .map(row =>
        row.filter(item => !item.isEmpty)
      )
      .some(row => row.some((current, index, array) => {
        const next = array[index + 1];

        return next && next.value === current.value;
      }));

    return !hasEqualInColumn && !hasEqualInRow && !this.getEmptyCells();
  }

  win() {
    const messageWin = DOM_SELECTORS.MESSAGE.WIN;

    messageWin.classList.contains('hidden')
      && messageWin.classList.remove('hidden');
    messageWin.className = 'message message-win';

    return true;
  }

  lose() {
    const messageLose = DOM_SELECTORS.MESSAGE.LOSE;

    messageLose.classList.contains('hidden')
      && messageLose.classList.remove('hidden');
    messageLose.className = 'message message-lose';

    return true;
  }

  zeroField() {
    this.field = [];

    for (let y = 0; y < FIELD_SIZE.ROWS; y++) {
      for (let x = 0; x < FIELD_SIZE.COLUMNS; x++) {
        this.field.push(new Cell({
          x,
          y,
          value: 0,
        })
        );
      }
    }
  }

  setField(array) {
    this.zeroField();

    array && array.forEach((cell) => {
      this.field[cell.index] = cell;
    });
  }

  get columns() {
    return Array.from({ length: 4 }, (elem, index) =>
      this.field.filter(({ x }) => x === index)
    );
  }

  get rows() {
    return Array.from({ length: 4 }, (elem, index) =>
      this.field.filter(({ y }) => y === index)
    );
  }

  refresh() {
    this.field.forEach(cell => {
      cell.drawValue();
    });

    DOM_SELECTORS.SCORE.innerHTML = this.score;

    if (this.score >= 2048) {
      this.win();
    }
  }

  start() {
    const buttonStart = DOM_SELECTORS.START;
    const messageStart = DOM_SELECTORS.MESSAGE.START;
    const messageWin = DOM_SELECTORS.MESSAGE.WIN;
    const messageLose = DOM_SELECTORS.MESSAGE.LOSE;

    messageLose.className = 'message message-lose';

    !messageLose.classList.contains('hidden')
      && messageLose.classList.add('hidden');
    messageWin.className = 'message message-win';

    !messageWin.classList.contains('hidden')
      && messageWin.classList.add('hidden');

    !messageStart.classList.contains('hidden')
      && messageStart.classList.add('hidden');
    buttonStart.classList.remove('start');
    buttonStart.classList.add('restart');
    buttonStart.innerHTML = 'Restart';

    this.field.forEach(cell =>
      (cell.value = 0)
    );
    this.zeroField();
    this.score = 0;

    this.randomFill();
    this.randomFill();
    this.refresh();
  }

  getEmptyCells() {
    const emptyCeils = this.field.filter(row => row.isEmpty);

    return emptyCeils.length === 0
      ? null
      : emptyCeils;
  }

  randomNumber() {
    return Math.random() <= 0.1
      ? 4
      : 2;
  }

  randomFill() {
    const cellsToFill = this.getEmptyCells();

    if (cellsToFill) {
      const randomIndex = Math.floor(Math.random() * cellsToFill.length);

      cellsToFill[randomIndex].value = this.randomNumber();
      cellsToFill[randomIndex].isAdded = true;
    }
  }

  mergeRow(row) {
    return row.map((item, x, array) => {
      const next = array[x + 1];
      const itemEqualsNext = next && next.value === item.value;

      if (itemEqualsNext) {
        item.value *= 2;
        item.isSummed = true;
        this.score += item.value;
        array.splice(x + 1, 1);
      }

      return item;
    });
  }

  swipe(state) {
    const topOrBottom = state === SWIPE_STATES.TOP
      || state === SWIPE_STATES.BOTTOM;
    const rightOrBottom = state === SWIPE_STATES.RIGHT
      || state === SWIPE_STATES.BOTTOM;
    const direction = topOrBottom
      ? this.columns
      : this.rows;

    const currentField = this.field.splice(0);

    const cells = direction.map((row, y) => {
      let resultRow = row.filter(item => !item.isEmpty);

      if (rightOrBottom) {
        resultRow = this
          .mergeRow([...resultRow].reverse())
          .filter(item => item)
          .reverse();
      } else {
        resultRow = this
          .mergeRow(resultRow)
          .filter(item => item);
      }

      resultRow.forEach((item, x, array) => {
        const fromEnd = [...array].reverse()[x];

        switch (state) {
          case SWIPE_STATES.TOP :
            item.x = y;
            item.y = x;
            break;

          case SWIPE_STATES.BOTTOM :
            fromEnd.x = y;
            fromEnd.y = (FIELD_SIZE.COLUMNS - 1) - x;
            break;

          case SWIPE_STATES.LEFT :
            item.x = x;
            item.y = y;
            break;

          case SWIPE_STATES.RIGHT :
            fromEnd.x = (FIELD_SIZE.ROWS - 1) - x;
            fromEnd.y = y;
            break;

          default: break;
        }
      });

      return resultRow;
    });

    this.setField(cells.flat());

    const fieldChanged = !currentField.every((item, index, array) =>
      item.value === this.field[index].value
    );

    if (!fieldChanged) {
      this.refresh();

      return;
    }

    this.randomFill();
    this.refresh();
  }
};

class Cell {
  constructor({ value = 0, x, y }) {
    this.value = value;
    this.x = x;
    this.y = y;
    this.isAdded = false;
    this.isSummed = false;

    this.selectInDom().className = 'field-cell';
  };

  get isEmpty() {
    return !this.value;
  };

  get index() {
    return this.x + FIELD_SIZE.COLUMNS * this.y;
  }

  drawValue() {
    if (!this.isEmpty) {
      this.isAdded && this.selectInDom().classList.add('show');
      this.isSummed && this.selectInDom().classList.add('summed');
      this.selectInDom().classList.add(`field-cell--${this.value}`);
      this.selectInDom().innerHTML = this.value;
      this.isSummed = false;
      this.isAdded = false;
    } else {
      this.selectInDom().className = 'field-cell';
      this.selectInDom().innerHTML = '';
    }
  };

  selectInDom() {
    return DOM_SELECTORS.ARRAY_OF_CELLS[this.index];
  }
};

const game = new Game();

DOM_SELECTORS.START.addEventListener('click', e => {
  game.start();
});

document.addEventListener('keydown', e => {
  if (game.field.length > 0 && !game.isGameOver) {
    switch (e.key) {
      case BUTTONS.UP:
        game.swipe(SWIPE_STATES.TOP);
        break;

      case BUTTONS.DOWN:
        game.swipe(SWIPE_STATES.BOTTOM);
        break;

      case BUTTONS.LEFT:
        game.swipe(SWIPE_STATES.LEFT);
        break;

      case BUTTONS.RIGHT:
        game.swipe(SWIPE_STATES.RIGHT);
        break;

      default:
        break;
    }
  }
});
