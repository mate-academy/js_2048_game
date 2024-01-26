/* eslint-disable max-len */
'use strict';

const Game = require('../src/modules/Game.class');
const {
  checkIsCorrectlyAlignedToStart,
  checkIsCorrectlyAlignedToEnd,
  getCellFromState,
  transposeState,
} = require('./test.helpers');

describe('Game class', () => {
  it('should be a function', () => {
    expect(typeof Game).toBe('function');
  });

  it('should have a constructor', () => {
    expect(typeof Game.prototype.constructor).toBe('function');
  });

  describe('core methods', () => {
    let game2048;

    beforeEach(() => {
      game2048 = new Game();
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
        expect(typeof game2048[method]).toBe('function');
      });
    });
  });

  describe('initial state', () => {
    it('should have a state of an empty board by default', () => {
      const game2048 = new Game();
      const state = game2048.getState();

      expect(state).toEqual([
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);
    });

    it('should have a score of 0 by default', () => {
      const game2048 = new Game();

      expect(game2048.getScore()).toBe(0);
    });

    it('should have a status of "idle" by default', () => {
      const game2048 = new Game();

      expect(game2048.getStatus()).toBe('idle');
    });

    it('should have a state of a custom board if the initial state is provided', () => {
      const initialState = [
        [2, 0, 0, 0],
        [0, 4, 0, 0],
        [0, 0, 8, 0],
        [0, 0, 0, 16],
      ];

      const game2048 = new Game(initialState.map((row) => [...row]));
      const state = game2048.getState();

      expect(state).toEqual(initialState);
    });
  });

  describe('after start', () => {
    it('should have a score of 0', () => {
      const game2048 = new Game();

      game2048.start();

      expect(game2048.getScore()).toBe(0);
    });

    it('should have a status of "playing"', () => {
      const game2048 = new Game();

      game2048.start();

      expect(game2048.getStatus()).toBe('playing');
    });

    it('should have a state with two cells with values 2 or 4', () => {
      const game2048 = new Game();

      game2048.start();

      const flatState = game2048.getState().flat();
      const nonEmptyCells = flatState.filter((cell) => cell !== 0);

      expect(nonEmptyCells).toHaveLength(2);

      expect(
        nonEmptyCells.every((cell) => [2, 4].includes(cell)),
      ).toBe(true);
    });

    it('should generate the board with 4s less often than with 2s', () => {
      let statesCombined = [];
      let twos = 0;
      let fours = 0;

      for (let i = 0; i < 100; i++) {
        const game2048 = new Game();

        game2048.start();

        const flatState = game2048.getState().flat();

        statesCombined = [
          ...statesCombined,
          ...flatState,
        ];
      }

      statesCombined.forEach((cell) => {
        if (cell === 2) {
          twos++;
        } else if (cell === 4) {
          fours++;
        }
      });

      expect(fours < twos).toBe(true);
    });

    it('should generate the board with cells in random positions', () => {
      const cellPositions = new Map();

      for (let i = 0; i < 1000; i++) {
        const game2048 = new Game();

        game2048.start();

        const flatState = game2048.getState().flat();

        flatState.forEach((cell, index) => {
          if (cell !== 0) {
            if (cellPositions.has(index)) {
              cellPositions.set(index, cellPositions.get(index) + 1);
            } else {
              cellPositions.set(index, 1);
            }
          }
        });
      }

      expect(cellPositions.size >= 12).toBe(true);
    });
  });

  describe('board movement methods', () => {
    describe('moveLeft', () => {
      it('should not move the board if the game is not started', () => {
        const game2048 = new Game([
          [8, 0, 0, 0],
          [0, 16, 0, 0],
          [0, 0, 32, 0],
          [0, 0, 0, 64],
        ]);

        game2048.moveLeft();

        const state = game2048.getState();

        expect(state).toEqual([
          [8, 0, 0, 0],
          [0, 16, 0, 0],
          [0, 0, 32, 0],
          [0, 0, 0, 64],
        ]);
      });

      it('should move all non-zero cells to the left', () => {
        const initialState = [
          [8, 0, 0, 0],
          [0, 16, 0, 0],
          [0, 0, 32, 0],
          [0, 0, 0, 64],
        ];

        const game2048 = new Game(initialState.map((row) => [...row]));

        game2048.start();
        game2048.moveLeft();

        const state = game2048.getState();

        state.forEach((row, rowIndex) => {
          const cursor = initialState[rowIndex].find((cell) => cell !== 0);

          expect(checkIsCorrectlyAlignedToStart(row, cursor)).toBe(true);
        });
      });

      it('should add a random cell with 2 or 4 at an empty position after the move', () => {
        const initialState = [
          [8, 0, 16, 0],
          [0, 16, 0, 32],
          [8, 0, 32, 0],
          [0, 16, 0, 64],
        ];

        const game2048 = new Game(initialState.map((row) => [...row]));

        game2048.start();

        const stateAfterStart = [...game2048.getState()];

        game2048.moveLeft();

        const stateAfterMove = game2048.getState();

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

      it('should stack cells to the left without merging', () => {
        const initialState = [
          [0, 16, 0, 8],
          [8, 0, 16, 0],
          [0, 8, 0, 32],
          [32, 0, 8, 0],
        ];

        const game2048 = new Game(initialState.map((row) => [...row]));

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
        const initialState = [
          [16, 8, 0, 0],
          [0, 0, 8, 8],
          [0, 8, 8, 0],
          [8, 0, 0, 16],
        ];

        const game2048 = new Game(initialState.map((row) => [...row]));

        game2048.start();
        game2048.moveLeft();

        const state = game2048.getState();

        state.forEach((row) => {
          expect(row.includes(16)).toBe(true);
        });
      });

      it('should merge multiple cells with the same value to the left', () => {
        const initialState = [
          [8, 8, 16, 16],
          [16, 16, 8, 8],
          [32, 32, 8, 8],
          [16, 16, 64, 64],
        ];

        const game2048 = new Game(initialState.map((row) => [...row]));

        game2048.start();
        game2048.moveLeft();

        const getCell = getCellFromState(game2048);

        expect(getCell(0, 0)).toBe(16);
        expect(getCell(0, 1)).toBe(32);
        expect(getCell(1, 0)).toBe(32);
        expect(getCell(1, 1)).toBe(16);
        expect(getCell(2, 0)).toBe(64);
        expect(getCell(2, 1)).toBe(16);
        expect(getCell(3, 0)).toBe(32);
        expect(getCell(3, 1)).toBe(128);
      });

      it('should not merge multiple cells with the same value to the left multiple times during the move', () => {
        const initialState = [
          [8, 8, 8, 8],
          [16, 16, 16, 16],
          [32, 32, 64, 128],
          [2, 2, 4, 8],
        ];

        const game2048 = new Game(initialState.map((row) => [...row]));

        game2048.start();
        game2048.moveLeft();

        const getCell = getCellFromState(game2048);

        expect(getCell(0, 0)).toBe(16);
        expect(getCell(0, 1)).toBe(16);
        expect(getCell(1, 0)).toBe(32);
        expect(getCell(1, 1)).toBe(32);
        expect(getCell(2, 0)).toBe(64);
        expect(getCell(2, 1)).toBe(64);
        expect(getCell(2, 2)).toBe(128);
        expect(getCell(3, 0)).toBe(4);
        expect(getCell(3, 1)).toBe(4);
        expect(getCell(3, 2)).toBe(8);
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

        const game2048 = new Game(initialState.map((row) => [...row]));

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

        const game2048 = new Game(initialState.map((row) => [...row]));

        game2048.start();

        const stateAfterStart = [...game2048.getState()];

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

        const game2048 = new Game(initialState.map((row) => [...row]));

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

        const game2048 = new Game(initialState.map((row) => [...row]));

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

        const game2048 = new Game(initialState.map((row) => [...row]));

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

        const game2048 = new Game(initialState.map((row) => [...row]));

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

        const game2048 = new Game(initialState.map((row) => [...row]));

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

        const game2048 = new Game(initialState.map((row) => [...row]));

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

        const game2048 = new Game(initialState.map((row) => [...row]));

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

        const game2048 = new Game(initialState.map((row) => [...row]));

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

        const game2048 = new Game(initialState.map((row) => [...row]));

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

        const game2048 = new Game(initialState.map((row) => [...row]));

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

        const game2048 = new Game(initialState.map((row) => [...row]));

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

        const game2048 = new Game(initialState.map((row) => [...row]));

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

        const game2048 = new Game(initialState.map((row) => [...row]));

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

        const game2048 = new Game(initialState.map((row) => [...row]));

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

        const game2048 = new Game(initialState.map((row) => [...row]));

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

        const game2048 = new Game(initialState.map((row) => [...row]));

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
    });
  });

  describe('game status', () => {
    it('should be a "playing" when board is full but moves are still possible', () => {
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

  describe('game score', () => {
    it('should be updated after cells are merged horizontally', () => {
      const game2048 = new Game([
        [16, 0, 32, 0],
        [32, 0, 8, 8],
        [0, 8, 8, 0],
        [8, 8, 0, 16],
      ]);

      game2048.start();

      const scoreAfterStart = game2048.getScore();

      game2048.moveLeft();

      const scoreAfterMove = game2048.getScore();

      expect(scoreAfterMove > scoreAfterStart).toBe(true);
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

      const scoreAfterStart = game2048.getScore();

      game2048.moveUp();

      const scoreAfterMove = game2048.getScore();

      expect(scoreAfterMove > scoreAfterStart).toBe(true);
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

      const scoreAfterStart = game2048.getScore();

      game2048.moveRight();

      const scoreAfterMove = game2048.getScore();

      expect(scoreAfterMove > scoreAfterStart).toBe(true);
      expect(game2048.getScore()).toBe(192);
    });
  });

  describe('game reset', () => {
    it('should reset the game score, status and set the board to the empty state', () => {
      const game2048 = new Game();

      game2048.start();

      game2048.moveLeft();
      game2048.moveRight();
      game2048.moveUp();
      game2048.moveDown();

      game2048.restart();

      expect(game2048.getScore()).toBe(0);
      expect(game2048.getStatus()).toBe('idle');

      expect(game2048.getState()).toEqual([
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);
    });

    it('should reset the game to the initial state if it was provided', () => {
      const initialState = [
        [2, 0, 0, 0],
        [0, 4, 0, 0],
        [0, 0, 8, 0],
        [0, 0, 0, 16],
      ];

      const game2048 = new Game(initialState);

      game2048.start();

      game2048.moveUp();
      game2048.moveRight();
      game2048.moveDown();
      game2048.moveLeft();

      game2048.restart();

      expect(game2048.getState()).toEqual(initialState);
    });
  });
});
