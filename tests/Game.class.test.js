/* eslint-disable max-len */
'use strict';

function sum(game) {
  let result = 0;

  for (const row of game.getState()) {
    for (const n of row) {
      result += n;
    }
  }

  return result;
}

function count(game) {
  return game.getState().flat().filter(n => n).length;
}

function copyState(state) {
  return state.map(row => [...row]);
}

const Game = require('../src/modules/Game.class');
const {
  checkIsCorrectlyAlignedToStart,
  checkIsCorrectlyAlignedToEnd,
  getCellFromState,
  transposeState,
} = require('./test.helpers');

describe('Game', () => {
  describe('', () => {
    it('should have a constructor', () => {
      expect(typeof Game).toBe('function');
      expect(typeof Game.prototype.constructor).toBe('function');
    });

    [
      'getState',
      'getScore',
      'getStatus',
      'moveLeft',
      'moveRight',
      'moveUp',
      'moveDown',
      'start',
      'restart',
    ].forEach((method) => {
      it(`should have a "${method}" method`, () => {
        const game2048 = new Game();

        expect(typeof game2048[method]).toBe('function');
      });
    });
  });

  describe('state', () => {
    it('should be empty by default', () => {
      const game2048 = new Game();

      expect(game2048.getState()).toEqual([
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);
    });

    it('should be equal to a given initial state before start', () => {
      const initialState = [
        [2, 0, 0, 0],
        [0, 4, 0, 0],
        [0, 0, 8, 0],
        [0, 0, 0, 16],
      ];

      const game2048 = new Game(copyState(initialState));

      expect(game2048.getState()).toEqual(initialState);
    });
  });

  describe('after start', () => {
    it('should have a state with two cells with values 2 or 4', () => {
      const game2048 = new Game();

      game2048.start();

      expect(count(game2048)).toBe(2);
      expect(sum(game2048)).toBeGreaterThanOrEqual(4);
      expect(sum(game2048)).toBeLessThanOrEqual(8);
    });

    it('should add two cells with values 2 or 4 to a custom state', () => {
      const game2048 = new Game([
        [2, 0, 0, 0],
        [0, 4, 0, 0],
        [0, 0, 8, 0],
        [0, 0, 0, 16],
      ]);

      game2048.start();

      expect(count(game2048)).toBe(6);
      expect(sum(game2048)).toBeGreaterThanOrEqual(34);
      expect(sum(game2048)).toBeLessThanOrEqual(38);
    });

    it('should generate 4 less often than 2', () => {
      let totalSum = 0;

      for (let i = 0; i < 100; i++) {
        const game2048 = new Game();

        game2048.start();

        totalSum += sum(game2048);
      }

      expect(totalSum).toBeGreaterThan(400);
      expect(totalSum).toBeLessThan(600);
    });

    it('should generate the board with cells in random positions', () => {
      const positions = new Set();

      for (let interation = 0; interation < 200; interation++) {
        const game2048 = new Game();

        game2048.start();

        const [first, second] = game2048.getState().flat().flatMap((n, i) => n > 0 ? [i] : []);

        positions.add(first);
        positions.add(second);
      }

      expect(positions.size).toBeGreaterThan(12);
    });
  });

  describe('movement methods', () => {
    describe('moveLeft', () => {
      it('should not move the board if the game is not started', () => {
        const initialState = [
          [8, 0, 0, 0],
          [0, 16, 0, 0],
          [0, 0, 32, 0],
          [0, 0, 0, 64],
        ];

        const game2048 = new Game(copyState(initialState));

        game2048.moveLeft();

        expect(game2048.getState()).toEqual(initialState);
      });

      it('should move all non-zero cells to the left', () => {
        const initialState = [
          [8, 0, 0, 0],
          [0, 16, 0, 0],
          [0, 0, 32, 0],
          [0, 0, 0, 64],
        ];

        const game2048 = new Game(initialState);

        game2048.start();
        game2048.moveLeft();

        const state = game2048.getState();

        expect(state[0][0]).not.toBe(0);
        expect(state[1][0]).not.toBe(0);
        expect(state[2][0]).not.toBe(0);
        expect(state[3][0]).not.toBe(0);
      });

      it('should add a new cell with 2 or 4', () => {
        const initialState = [
          [8, 0, 16, 0],
          [0, 16, 0, 32],
          [8, 0, 32, 0],
          [0, 16, 0, 64],
        ];

        const game2048 = new Game(initialState);

        game2048.start();

        const sumBeforeTheMove = sum(game2048);

        game2048.moveLeft();

        expect(count(game2048)).toBe(11);
        expect(sum(game2048)).toBeGreaterThanOrEqual(sumBeforeTheMove + 2);
        expect(sum(game2048)).toBeLessThanOrEqual(sumBeforeTheMove + 4);
      });

      it('should stack cells to the left without merging', () => {
        const initialState = [
          [0, 16, 0, 8],
          [8, 0, 16, 0],
          [0, 8, 0, 32],
          [32, 0, 8, 0],
        ];

        const game2048 = new Game(copyState(initialState));

        game2048.start();
        game2048.moveLeft();

        const state = game2048.getState();

        state.forEach((row, rowIndex) => {
          const initialRow = initialState[rowIndex];
          const nonEmptyCells = initialRow.filter((cell) => cell !== 0);
          const cursor = nonEmptyCells.slice(-1)[0];

          expect(checkIsCorrectlyAlignedToStart(row, cursor)).toBe(true);

          nonEmptyCells.forEach((cell) => {
            expect(row.includes(cell)).toBe(true);
          });
        });
      });

      it('should merge cells with the same value', () => {
        const game2048 = new Game([
          [16, 8, 0, 0],
          [0, 0, 8, 8],
          [0, 8, 8, 0],
          [8, 0, 0, 16],
        ]);

        game2048.start();
        game2048.moveLeft();

        expect(game2048.getState().every(row => row.includes(16)))
          .toBe(true);
      });

      it('should merge multiple cells with the same value to the left', () => {
        const game2048 = new Game([
          [8, 8, 16, 16],
          [16, 16, 8, 8],
          [32, 32, 0, 0],
          [16, 16, 64, 64],
        ]);

        game2048.start();
        game2048.moveLeft();

        const state = game2048.getState();

        expect(state[0][0]).toBe(16);
        expect(state[0][1]).toBe(32);
        expect(state[1][0]).toBe(32);
        expect(state[1][1]).toBe(16);
        expect(state[2][0]).toBe(64);
        expect(state[3][0]).toBe(32);
        expect(state[3][1]).toBe(128);
      });

      it('should not merge multiple cells with the same value to the left multiple times during the move', () => {
        const game2048 = new Game([
          [8, 8, 0, 0],
          [16, 16, 16, 16],
          [32, 32, 64, 128],
          [2, 2, 4, 8],
        ]);

        game2048.start();
        game2048.moveLeft();

        const state = game2048.getState();

        expect(state[0][0]).toBe(16);
        expect(state[1][0]).toBe(32);
        expect(state[1][1]).toBe(32);
        expect(state[2][0]).toBe(64);
        expect(state[2][1]).toBe(64);
        expect(state[2][2]).toBe(128);
        expect(state[3][0]).toBe(4);
        expect(state[3][1]).toBe(4);
        expect(state[3][2]).toBe(8);
      });

      it('should not move cells to the left if the move does not change the board', () => {
        const game2048 = new Game([
          [64, 32, 16, 0],
          [128, 64, 32, 0],
          [256, 128, 64, 0],
          [512, 256, 128, 0],
        ]);

        game2048.start();

        const stateAfterStart = copyState(game2048.getState());

        game2048.moveLeft();

        expect(game2048.getState()).toEqual(stateAfterStart);
      });
    });

    describe('moveRight', () => {
      it('should not move the board if the game is not started', () => {
        const game2048 = new Game([
          [8, 0, 0, 0],
          [0, 16, 0, 0],
          [0, 0, 32, 0],
          [0, 0, 0, 64],
        ]);

        game2048.moveRight();

        const state = game2048.getState();

        expect(state).toEqual([
          [8, 0, 0, 0],
          [0, 16, 0, 0],
          [0, 0, 32, 0],
          [0, 0, 0, 64],
        ]);
      });

      it('should move all non-zero cells to the right', () => {
        const initialState = [
          [8, 0, 0, 0],
          [0, 16, 0, 0],
          [0, 0, 32, 0],
          [0, 0, 0, 64],
        ];

        const game2048 = new Game(copyState(initialState));

        game2048.start();
        game2048.moveRight();

        const state = game2048.getState();

        state.forEach((row, rowIndex) => {
          const cursor = initialState[rowIndex].find((cell) => cell !== 0);

          expect(checkIsCorrectlyAlignedToEnd(row, cursor)).toBe(true);
        });
      });

      it('should add a random cell with 2 or 4 at an empty position after the move', () => {
        const initialState = [
          [8, 0, 16, 0],
          [0, 16, 0, 32],
          [8, 0, 32, 0],
          [0, 16, 0, 64],
        ];

        const game2048 = new Game(copyState(initialState));

        game2048.start();

        const stateAfterStart = copyState(game2048.getState());

        game2048.moveRight();

        const stateAfterMove = game2048.getState();
        const addedCells = stateAfterMove
          .reduce((acc, row, rowIndex) => {
            const countBeforeMove = stateAfterStart[rowIndex].filter((cell) => cell !== 0).length;

            if (countBeforeMove === 4) {
              return acc;
            }

            const newCells = row.slice(0, 4 - countBeforeMove).filter((cell) => cell !== 0);

            return [
              ...acc,
              ...newCells,
            ];
          }, []);

        expect(addedCells.length).toBe(1);
        expect([2, 4].includes(addedCells[0])).toBe(true);
      });

      it('should stack cells to the right without merging', () => {
        const initialState = [
          [0, 16, 0, 8],
          [8, 0, 16, 0],
          [0, 8, 0, 32],
          [32, 0, 8, 0],
        ];

        const game2048 = new Game(copyState(initialState));

        game2048.start();
        game2048.moveRight();

        const state = game2048.getState();

        state.forEach((row, rowIndex) => {
          const initialRow = initialState[rowIndex];
          const nonEmptyCells = initialRow.filter((cell) => cell !== 0);
          const cursor = nonEmptyCells[0];

          expect(checkIsCorrectlyAlignedToEnd(row, cursor)).toBe(true);

          nonEmptyCells.forEach((cell) => {
            expect(row.includes(cell)).toBe(true);
          });
        });
      });

      it('should merge cells with the same value to the right', () => {
        const initialState = [
          [16, 8, 0, 0],
          [0, 0, 8, 8],
          [0, 8, 8, 0],
          [8, 0, 0, 16],
        ];

        const game2048 = new Game(copyState(initialState));

        game2048.start();
        game2048.moveRight();

        const state = game2048.getState();

        state.forEach((row) => {
          expect(row.includes(16)).toBe(true);
        });
      });

      it('should merge multiple cells with the same value to the right', () => {
        const initialState = [
          [8, 8, 16, 16],
          [16, 16, 8, 8],
          [32, 32, 8, 8],
          [16, 16, 64, 64],
        ];

        const game2048 = new Game(copyState(initialState));

        game2048.start();
        game2048.moveRight();

        const getCell = getCellFromState(game2048);

        expect(getCell(0, 2)).toBe(16);
        expect(getCell(0, 3)).toBe(32);
        expect(getCell(1, 2)).toBe(32);
        expect(getCell(1, 3)).toBe(16);
        expect(getCell(2, 2)).toBe(64);
        expect(getCell(2, 3)).toBe(16);
        expect(getCell(3, 2)).toBe(32);
        expect(getCell(3, 3)).toBe(128);
      });

      it('should not merge multiple cells with the same value to the right multiple times during the move', () => {
        const initialState = [
          [8, 8, 8, 8],
          [16, 16, 16, 16],
          [32, 32, 64, 128],
          [2, 2, 4, 8],
        ];

        const game2048 = new Game(copyState(initialState));

        game2048.start();
        game2048.moveRight();

        const getCell = getCellFromState(game2048);

        expect(getCell(0, 2)).toBe(16);
        expect(getCell(0, 3)).toBe(16);
        expect(getCell(1, 2)).toBe(32);
        expect(getCell(1, 3)).toBe(32);
        expect(getCell(2, 1)).toBe(64);
        expect(getCell(2, 2)).toBe(64);
        expect(getCell(2, 3)).toBe(128);
        expect(getCell(3, 1)).toBe(4);
        expect(getCell(3, 2)).toBe(4);
        expect(getCell(3, 3)).toBe(8);
      });

      it('should not move cells to the right if the move does not change the board', () => {
        const initialState = [
          [0, 16, 32, 64],
          [0, 32, 64, 128],
          [0, 64, 128, 256],
          [0, 128, 256, 512],
        ];

        const game2048 = new Game(copyState(initialState));

        game2048.start();

        const stateAfterStart = copyState(game2048.getState());

        game2048.moveRight();

        const stateAfterMove = game2048.getState();

        expect(stateAfterMove).toEqual(stateAfterStart);
      });
    });

    describe('moveUp', () => {
      it('should not move the board if the game is not started', () => {
        const game2048 = new Game([
          [8, 0, 0, 0],
          [0, 16, 0, 0],
          [0, 0, 32, 0],
          [0, 0, 0, 64],
        ]);

        game2048.moveUp();

        const state = game2048.getState();

        expect(state).toEqual([
          [8, 0, 0, 0],
          [0, 16, 0, 0],
          [0, 0, 32, 0],
          [0, 0, 0, 64],
        ]);
      });

      it('should move all non-zero cells up', () => {
        const initialState = [
          [8, 0, 0, 0],
          [0, 16, 0, 0],
          [0, 0, 32, 0],
          [0, 0, 0, 64],
        ];

        const game2048 = new Game(copyState(initialState));

        game2048.start();
        game2048.moveUp();

        const state = game2048.getState();
        const stateTransposed = transposeState(state);
        const initialStateTransposed = transposeState(initialState);

        stateTransposed.forEach((column, colIndex) => {
          const cursor = initialStateTransposed[colIndex].find((cell) => cell !== 0);

          expect(checkIsCorrectlyAlignedToStart(column, cursor)).toBe(true);
        });
      });

      it('should add a random cell with 2 or 4 at an empty position after the move', () => {
        const initialState = [
          [8, 0, 16, 0],
          [0, 16, 0, 8],
          [16, 0, 32, 0],
          [0, 32, 0, 64],
        ];

        const game2048 = new Game(copyState(initialState));

        game2048.start();

        const stateAfterStart = transposeState(game2048.getState());

        game2048.moveUp();

        const stateAfterMove = transposeState(game2048.getState());
        const addedCells = stateAfterMove
          .reduce((acc, row, rowIndex) => {
            const countBeforeMove = stateAfterStart[rowIndex].filter((cell) => cell !== 0).length;

            if (countBeforeMove === 4) {
              return acc;
            }

            const newCells = row.slice(countBeforeMove).filter((cell) => cell !== 0);

            return [
              ...acc,
              ...newCells,
            ];
          }, []);

        expect(addedCells.length).toBe(1);
        expect([2, 4].includes(addedCells[0])).toBe(true);
      });

      it('should stack cells up without merging', () => {
        const initialState = [
          [0, 16, 0, 8],
          [8, 0, 16, 0],
          [0, 8, 0, 32],
          [32, 0, 8, 0],
        ];

        const game2048 = new Game(copyState(initialState));

        game2048.start();
        game2048.moveUp();

        const state = game2048.getState();
        const stateTransposed = transposeState(state);
        const initialStateTransposed = transposeState(initialState);

        stateTransposed.forEach((column, colIndex) => {
          const initialColumn = initialStateTransposed[colIndex];
          const nonEmptyCells = initialColumn.filter((cell) => cell !== 0);
          const cursor = nonEmptyCells.slice(-1)[0];

          expect(checkIsCorrectlyAlignedToStart(column, cursor)).toBe(true);

          nonEmptyCells.forEach((cell) => {
            expect(column.includes(cell)).toBe(true);
          });
        });
      });

      it('should merge cells with the same value up', () => {
        const initialState = [
          [16, 0, 0, 0],
          [0, 0, 8, 8],
          [0, 8, 8, 0],
          [8, 8, 0, 16],
        ];

        const game2048 = new Game(copyState(initialState));

        game2048.start();
        game2048.moveUp();

        const state = game2048.getState();
        const stateTransposed = transposeState(state);

        stateTransposed.forEach((column) => {
          expect(column.includes(16)).toBe(true);
        });
      });

      it('should merge multiple cells with the same value up', () => {
        const initialState = [
          [8, 16, 32, 16],
          [8, 16, 32, 16],
          [16, 8, 8, 64],
          [16, 8, 8, 64],
        ];

        const game2048 = new Game(copyState(initialState));

        game2048.start();
        game2048.moveUp();

        const getCell = getCellFromState(game2048);

        expect(getCell(0, 0)).toBe(16);
        expect(getCell(0, 1)).toBe(32);
        expect(getCell(0, 2)).toBe(64);
        expect(getCell(0, 3)).toBe(32);
        expect(getCell(1, 0)).toBe(32);
        expect(getCell(1, 1)).toBe(16);
        expect(getCell(1, 2)).toBe(16);
        expect(getCell(1, 3)).toBe(128);
      });

      it('should not merge multiple cells with the same value up multiple times during the move', () => {
        const initialState = [
          [8, 16, 32, 2],
          [8, 16, 32, 2],
          [8, 16, 64, 4],
          [8, 16, 128, 8],
        ];

        const game2048 = new Game(copyState(initialState));

        game2048.start();
        game2048.moveUp();

        const getCell = getCellFromState(game2048);

        expect(getCell(0, 0)).toBe(16);
        expect(getCell(0, 1)).toBe(32);
        expect(getCell(0, 2)).toBe(64);
        expect(getCell(0, 3)).toBe(4);
        expect(getCell(1, 0)).toBe(16);
        expect(getCell(1, 1)).toBe(32);
        expect(getCell(1, 2)).toBe(64);
        expect(getCell(1, 3)).toBe(4);
        expect(getCell(2, 2)).toBe(128);
        expect(getCell(2, 3)).toBe(8);
      });

      it('should not move cells up if the move does not change the board', () => {
        const initialState = [
          [512, 256, 128, 64],
          [256, 128, 64, 32],
          [128, 64, 32, 16],
          [0, 0, 0, 0],
        ];

        const game2048 = new Game(copyState(initialState));

        game2048.start();

        const stateAfterStart = copyState(game2048.getState());

        game2048.moveUp();

        const stateAfterMove = game2048.getState();

        expect(stateAfterMove).toEqual(stateAfterStart);
      });
    });

    describe('moveDown', () => {
      it('should not move the board if the game is not started', () => {
        const game2048 = new Game([
          [8, 0, 0, 0],
          [0, 16, 0, 0],
          [0, 0, 32, 0],
          [0, 0, 0, 64],
        ]);

        game2048.moveDown();

        const state = game2048.getState();

        expect(state).toEqual([
          [8, 0, 0, 0],
          [0, 16, 0, 0],
          [0, 0, 32, 0],
          [0, 0, 0, 64],
        ]);
      });

      it('should move all non-zero cells down', () => {
        const initialState = [
          [8, 0, 0, 0],
          [0, 16, 0, 0],
          [0, 0, 32, 0],
          [0, 0, 0, 64],
        ];

        const game2048 = new Game(copyState(initialState));

        game2048.start();
        game2048.moveDown();

        const state = game2048.getState();
        const stateTransposed = transposeState(state);
        const initialStateTransposed = transposeState(initialState);

        stateTransposed.forEach((column, colIndex) => {
          const cursor = initialStateTransposed[colIndex].find((cell) => cell !== 0);

          expect(checkIsCorrectlyAlignedToEnd(column, cursor)).toBe(true);
        });
      });

      it('should add a random cell with 2 or 4 at an empty position after the move', () => {
        const initialState = [
          [8, 0, 16, 0],
          [0, 16, 0, 8],
          [16, 0, 32, 0],
          [0, 32, 0, 64],
        ];

        const game2048 = new Game(copyState(initialState));

        game2048.start();

        const stateAfterStart = transposeState(game2048.getState());

        game2048.moveDown();

        const stateAfterMove = transposeState(game2048.getState());
        const addedCells = stateAfterMove
          .reduce((acc, row, rowIndex) => {
            const countBeforeMove = stateAfterStart[rowIndex].filter((cell) => cell !== 0).length;

            if (countBeforeMove === 4) {
              return acc;
            }

            const newCells = row.slice(0, 4 - countBeforeMove).filter((cell) => cell !== 0);

            return [
              ...acc,
              ...newCells,
            ];
          }, []);

        expect(addedCells.length).toBe(1);
        expect([2, 4].includes(addedCells[0])).toBe(true);
      });

      it('should stack cells down without merging', () => {
        const initialState = [
          [0, 16, 0, 8],
          [8, 0, 16, 0],
          [0, 8, 0, 32],
          [32, 0, 8, 0],
        ];

        const game2048 = new Game(copyState(initialState));

        game2048.start();
        game2048.moveDown();

        const state = game2048.getState();
        const stateTransposed = transposeState(state);
        const initialStateTransposed = transposeState(initialState);

        stateTransposed.forEach((column, colIndex) => {
          const initialColumn = initialStateTransposed[colIndex];
          const nonEmptyCells = initialColumn.filter((cell) => cell !== 0);
          const cursor = nonEmptyCells[0];

          expect(checkIsCorrectlyAlignedToEnd(column, cursor)).toBe(true);

          nonEmptyCells.forEach((cell) => {
            expect(column.includes(cell)).toBe(true);
          });
        });
      });

      it('should merge cells with the same value down', () => {
        const initialState = [
          [16, 0, 0, 0],
          [0, 0, 8, 8],
          [0, 8, 8, 0],
          [8, 8, 0, 16],
        ];

        const game2048 = new Game(copyState(initialState));

        game2048.start();
        game2048.moveDown();

        const state = game2048.getState();
        const stateTransposed = transposeState(state);

        stateTransposed.forEach((column) => {
          expect(column.includes(16)).toBe(true);
        });
      });

      it('should merge multiple cells with the same value down', () => {
        const initialState = [
          [8, 16, 32, 16],
          [8, 16, 32, 16],
          [16, 8, 8, 64],
          [16, 8, 8, 64],
        ];

        const game2048 = new Game(copyState(initialState));

        game2048.start();
        game2048.moveDown();

        const getCell = getCellFromState(game2048);

        expect(getCell(2, 0)).toBe(16);
        expect(getCell(2, 1)).toBe(32);
        expect(getCell(2, 2)).toBe(64);
        expect(getCell(2, 3)).toBe(32);
        expect(getCell(3, 0)).toBe(32);
        expect(getCell(3, 1)).toBe(16);
        expect(getCell(3, 2)).toBe(16);
        expect(getCell(3, 3)).toBe(128);
      });

      it('should not merge multiple cells with the same value down multiple times during the move', () => {
        const initialState = [
          [8, 16, 32, 2],
          [8, 16, 32, 2],
          [8, 16, 64, 4],
          [8, 16, 128, 8],
        ];

        const game2048 = new Game(copyState(initialState));

        game2048.start();
        game2048.moveDown();

        const getCell = getCellFromState(game2048);

        expect(getCell(1, 2)).toBe(64);
        expect(getCell(1, 3)).toBe(4);
        expect(getCell(2, 0)).toBe(16);
        expect(getCell(2, 1)).toBe(32);
        expect(getCell(2, 2)).toBe(64);
        expect(getCell(2, 3)).toBe(4);
        expect(getCell(3, 0)).toBe(16);
        expect(getCell(3, 1)).toBe(32);
        expect(getCell(3, 2)).toBe(128);
        expect(getCell(3, 3)).toBe(8);
      });

      it('should not move cells down if the move does not change the board', () => {
        const initialState = [
          [0, 0, 0, 0],
          [128, 64, 32, 16],
          [256, 128, 64, 32],
          [512, 256, 128, 64],
        ];

        const game2048 = new Game(copyState(initialState));

        game2048.start();

        const stateAfterStart = copyState(game2048.getState());

        game2048.moveDown();

        const stateAfterMove = game2048.getState();

        expect(stateAfterMove).toEqual(stateAfterStart);
      });
    });
  });

  describe('status', () => {
    it('should be "idle" by default', () => {
      const game2048 = new Game();

      expect(game2048.getStatus()).toBe('idle');
    });

    it('should be "playing" after start', () => {
      const game2048 = new Game();

      game2048.start();

      expect(game2048.getStatus()).toBe('playing');
    });

    it('should be "playing" when board is full but moves are still possible', () => {
      const game2048 = new Game([
        [128, 128, 0, 8],
        [16, 8, 16, 32],
        [8, 16, 32, 64],
        [16, 32, 0, 128],
      ]);

      game2048.start();

      expect(game2048.getStatus()).toBe('playing');
    });

    it('should be a "win" when a 2048 tile is created', () => {
      const game2048 = new Game([
        [0, 0, 0, 0],
        [0, 0, 1024, 1024],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);

      game2048.start();
      game2048.moveRight();

      expect(game2048.getStatus()).toBe('win');
    });

    it('should be a "lose" when no more moves are possible', () => {
      const game2048 = new Game([
        [128, 128, 0, 8],
        [16, 8, 16, 32],
        [8, 16, 32, 64],
        [16, 32, 0, 128],
      ]);

      game2048.start();
      game2048.moveLeft();

      expect(game2048.getStatus()).toBe('lose');
    });
  });

  describe('score', () => {
    it('should be 0 by default', () => {
      const game2048 = new Game();

      expect(game2048.getScore()).toBe(0);
    });

    it('should be 0 for a custom state', () => {
      const game2048 = new Game([
        [16, 0, 32, 0],
        [32, 0, 8, 8],
        [0, 8, 8, 0],
        [8, 8, 0, 16],
      ]);

      expect(game2048.getScore()).toBe(0);
    });

    it('should be 0 after start with a custom state', () => {
      const game2048 = new Game([
        [16, 0, 32, 0],
        [32, 0, 8, 8],
        [0, 8, 8, 0],
        [8, 8, 0, 16],
      ]);

      game2048.start();

      expect(game2048.getScore()).toBe(0);
    });

    it('should be updated after cells are merged horizontally', () => {
      const game2048 = new Game([
        [16, 0, 32, 0],
        [32, 0, 8, 8],
        [0, 8, 8, 0],
        [8, 8, 0, 16],
      ]);

      game2048.start();
      game2048.moveLeft();

      expect(game2048.getScore()).toBe(48);
    });

    it('should be updated after cells are merged vertically', () => {
      const game2048 = new Game([
        [16, 0, 32, 0],
        [32, 8, 8, 8],
        [0, 8, 8, 0],
        [8, 0, 0, 16],
      ]);

      game2048.start();
      game2048.moveUp();

      expect(game2048.getScore()).toBe(32);
    });

    it('should be updated after cells are merged multiple times per line', () => {
      const game2048 = new Game([
        [16, 16, 32, 32],
        [32, 32, 8, 8],
        [0, 8, 8, 8],
        [8, 0, 16, 8],
      ]);

      game2048.start();
      game2048.moveRight();

      expect(game2048.getScore()).toBe(192);
    });
  });

  describe('reset', () => {
    const INITIAL_STATE = [
      [2, 2, 4, 4],
      [2, 2, 4, 4],
      [2, 2, 4, 4],
      [0, 0, 4, 4],
    ];

    let game2048;

    beforeEach(() => {
      game2048 = new Game(copyState(INITIAL_STATE));
      game2048.start();
      game2048.moveLeft();
    });

    it('should set score to 0', () => {
      game2048.restart();

      expect(game2048.getScore()).toBe(0);
      expect(game2048.getStatus()).toBe('idle');
    });

    it('should set status to "idle"', () => {
      game2048.restart();

      expect(game2048.getStatus()).toBe('idle');
    });

    it('should reset the game to the initial state', () => {
      game2048.restart();

      expect(game2048.getState()).toEqual(INITIAL_STATE);
    });

    it('should allow to start a new game', () => {
      game2048.restart();
      game2048.start();

      expect(game2048.getStatus()).toBe('playing');
    });
  });
});
