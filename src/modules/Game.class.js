'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */

const randomizer = (state) => {
  const stateRow = Math.floor(Math.random() * 4);
  const stateColumn = Math.floor(Math.random() * 4);

  if (state[stateRow][stateColumn] === 0) {
    return [stateRow, stateColumn];
  } else {
    return randomizer(state);
  }
};

const randomNumber = () => {
  const random = Math.floor(Math.random() * 10) + 1;

  if (random <= 1) {
    return 4;
  } else {
    return 2;
  }
};

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
    this.initialState = initialState;
    this.score = 0;
    this.status = 'none';
  }

  async gameAdderItem(addWith = '') {
    const startGameAdder = async () => {
      const [stateRow, stateColumn] = randomizer(this.initialState);

      this.initialState[stateRow][stateColumn] = randomNumber();
    };

    const isItemsZero = this.initialState.reduce((prevItem, currentItem) => {
      return (
        prevItem +
        currentItem.reduce((prevItem1, currentItem1) => {
          return prevItem1 + (currentItem1 === 0 ? 1 : 0);
        }, 0)
      );
    }, 0);

    if (addWith === 'start') {
      await startGameAdder();
      await startGameAdder();
    } else if (isItemsZero >= 1) {
      await startGameAdder();
    }
  }

  async moveLeft() {
    const tempState = this.initialState;

    const goToLeft = async () => {
      this.initialState = this.initialState.map((item, index) => {
        const zeroItem = item.filter((num) => num === 0);
        const numberItem = item.filter((num) => num !== 0);

        const result = [...numberItem, ...zeroItem];

        for (let i = 0; i < 3; i++) {
          if (result[i] === result[i + 1] && result[i] !== 0) {
            result[i] = result[i] + result[i + 1];
            this.score += result[i];
            result[i + 1] = 0;
            i = i + 1;
          }
        }

        return result;
      });
    };

    const goToLefttLast = async () => {
      this.initialState = this.initialState.map((item, index) => {
        const zeroItem = item.filter((num) => num === 0);
        const numberItem = item.filter((num) => num !== 0);

        return [...numberItem, ...zeroItem];
      });
    };

    await goToLeft();
    await goToLefttLast();

    if (tempState.toString() === this.initialState.toString()) {
      return;
    }

    await this.gameAdderItem();
  }
  async moveRight() {
    const tempState = this.initialState;

    const goToRight = async () => {
      this.initialState = this.initialState.map((item, index) => {
        const zeroItem = item.filter((num) => num === 0);
        const numberItem = item.filter((num) => num !== 0);

        const result = [...zeroItem, ...numberItem];

        for (let i = 3; i > 0; i--) {
          if (result[i] === result[i - 1] && result[i] !== 0) {
            result[i] = result[i] + result[i - 1];
            this.score += result[i];
            result[i - 1] = 0;
            i = i - 1;
          }
        }

        return result;
      });
    };

    const goToRightLast = async () => {
      this.initialState = this.initialState.map((item, index) => {
        const zeroItem = item.filter((num) => num === 0);
        const numberItem = item.filter((num) => num !== 0);

        return [...zeroItem, ...numberItem];
      });
    };

    await goToRight();
    await goToRightLast();

    if (tempState.toString() === this.initialState.toString()) {
      return;
    }

    await this.gameAdderItem();
  }
  async moveUp() {
    const tempState = this.initialState;

    const goToTop = async () => {
      const columnsItems = [
        this.initialState.map((item) => item[0]),
        this.initialState.map((item) => item[1]),
        this.initialState.map((item) => item[2]),
        this.initialState.map((item) => item[3]),
      ].map((item, index) => {
        const zeroItem = item.filter((num) => num === 0);
        const numberItem = item.filter((num) => num !== 0);

        const result = [...numberItem, ...zeroItem];

        for (let i = 0; i < 3; i++) {
          if (result[i] === result[i + 1] && result[i] !== 0) {
            result[i] = result[i] + result[i + 1];
            this.score += result[i];
            result[i + 1] = 0;
            i = i + 1;
          }
        }

        return result;
      });

      this.initialState = [
        columnsItems.map((item) => item[0]),
        columnsItems.map((item) => item[1]),
        columnsItems.map((item) => item[2]),
        columnsItems.map((item) => item[3]),
      ];
    };

    const goToTopLast = async () => {
      const columnsItems = [
        this.initialState.map((item) => item[0]),
        this.initialState.map((item) => item[1]),
        this.initialState.map((item) => item[2]),
        this.initialState.map((item) => item[3]),
      ].map((item, index) => {
        const zeroItem = item.filter((num) => num === 0);
        const numberItem = item.filter((num) => num !== 0);

        return [...numberItem, ...zeroItem];
      });

      this.initialState = [
        columnsItems.map((item) => item[0]),
        columnsItems.map((item) => item[1]),
        columnsItems.map((item) => item[2]),
        columnsItems.map((item) => item[3]),
      ];
    };

    await goToTop();
    await goToTopLast();

    if (tempState.toString() === this.initialState.toString()) {
      return;
    }

    await this.gameAdderItem();
  }
  async moveDown() {
    const tempState = this.initialState;

    const goToDown = async () => {
      const columnsItems = [
        this.initialState.map((item) => item[0]),
        this.initialState.map((item) => item[1]),
        this.initialState.map((item) => item[2]),
        this.initialState.map((item) => item[3]),
      ].map((item, index) => {
        const zeroItem = item.filter((num) => num === 0);
        const numberItem = item.filter((num) => num !== 0);

        const result = [...zeroItem, ...numberItem];

        for (let i = 3; i > 0; i--) {
          if (result[i] === result[i - 1] && result[i] !== 0) {
            result[i] = result[i] + result[i - 1];
            this.score += result[i];
            result[i - 1] = 0;
            i = i - 1;
          }
        }

        return result;
      });

      this.initialState = [
        columnsItems.map((item) => item[0]),
        columnsItems.map((item) => item[1]),
        columnsItems.map((item) => item[2]),
        columnsItems.map((item) => item[3]),
      ];
    };

    const goToDownLast = async () => {
      const columnsItems = [
        this.initialState.map((item) => item[0]),
        this.initialState.map((item) => item[1]),
        this.initialState.map((item) => item[2]),
        this.initialState.map((item) => item[3]),
      ].map((item, index) => {
        const zeroItem = item.filter((num) => num === 0);
        const numberItem = item.filter((num) => num !== 0);

        return [...zeroItem, ...numberItem];
      });

      this.initialState = [
        columnsItems.map((item) => item[0]),
        columnsItems.map((item) => item[1]),
        columnsItems.map((item) => item[2]),
        columnsItems.map((item) => item[3]),
      ];
    };

    await goToDown();
    await goToDownLast();

    if (tempState.toString() === this.initialState.toString()) {
      return;
    }

    await this.gameAdderItem();
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
    return this.initialState;
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
  setStatus() {
    if (this.initialState.some((items) => items.includes(2048))) {
      if (this.status !== 'win') {
        this.status = 'win';
      }

      return this.status;
    }

    let isGamingTime = false;

    this.initialState.forEach((item, index) => {
      const zeroItem = item.filter((num) => num === 0);
      const numberItem = item.filter((num) => num !== 0);

      const result = [...numberItem, ...zeroItem];

      for (let i = 0; i < 3; i++) {
        if (result[i] === result[i + 1] && result[i] !== 0) {
          isGamingTime = true;
        }
      }

      for (let i = 3; i > 0; i--) {
        if (result[i] === result[i - 1] && result[i] !== 0) {
          isGamingTime = true;
        }
      }
    });

    [
      this.initialState.map((item) => item[0]),
      this.initialState.map((item) => item[1]),
      this.initialState.map((item) => item[2]),
      this.initialState.map((item) => item[3]),
    ].forEach((item, index) => {
      const zeroItem = item.filter((num) => num === 0);
      const numberItem = item.filter((num) => num !== 0);

      const result = [...numberItem, ...zeroItem];

      for (let i = 0; i < 3; i++) {
        if (result[i] === result[i + 1] && result[i] !== 0) {
          isGamingTime = true;
        }
      }

      for (let i = 3; i > 0; i--) {
        if (result[i] === result[i - 1] && result[i] !== 0) {
          isGamingTime = true;
        }
      }
    });

    this.initialState.forEach((item) => {
      if (item.includes(0)) {
        isGamingTime = true;
      }
    });

    if (isGamingTime) {
      return this.status;
    }

    this.status = 'lose';

    return this.status;
  }

  getStatus() {
    return this.status;
  }

  /**
   * Starts the game.
   */
  async start() {
    await this.gameAdderItem('start');
    this.status = 'start';
  }

  /**
   * Resets the game.
   */
  async restart() {
    this.initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.start();
    this.score = 0;
    this.status = 'start';
  }

  // Add your own methods here
}

module.exports = Game;
