/* eslint-disable max-len */
'use strict';

const Game = require('../src/modules/Game.class');

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
        [0, 0, 0, 16]];

      const game2048 = new Game(initialState);

      const state = game2048.getState();

      expect(state).toEqual(initialState);
    });

    it('should have a score of a custom value if the initial score is provided', () => {
      const initialScore = 42;

      const game2048 = new Game(null, initialScore);

      expect(game2048.getScore()).toBe(initialScore);
    });

    it('should have a status of a custom value if the initial status is provided', () => {
      const initialStatus = 'win';

      const game2048 = new Game(null, null, initialStatus);

      expect(game2048.getStatus()).toBe(initialStatus);
    });
  });

  describe('after start', () => {
    it('should have a score of 0 after start', () => {
      const game2048 = new Game();

      game2048.start();

      expect(game2048.getScore()).toBe(0);
    });

    it('should have a status of "playing" after start', () => {
      const game2048 = new Game();

      game2048.start();

      expect(game2048.getStatus()).toBe('playing');
    });

    it('should have a state with two random cells with 2 or 4 after start', () => {
      const game2048 = new Game();

      game2048.start();

      const flatState = game2048.getState().flat();

      expect(
        flatState.filter((cell) => [2, 4].includes(cell)),
      ).toHaveLength(2);
    });

    it('should initialize the board with 4s less often than with 2s', () => {
      const game2048 = new Game();

      let statesCombined = [];

      let twos = 0;
      let fours = 0;

      for (let i = 0; i < 100; i++) {
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
  });

  describe('board movement methods', () => {
    const initialStateNoStacking = [
      [2, 0, 0, 0],
      [0, 4, 0, 0],
      [0, 0, 8, 0],
      [0, 0, 0, 16],
    ];

    const initialStateStacking = [
      [0, 4, 0, 2],
      [2, 0, 4, 0],
      [0, 2, 0, 8],
      [8, 0, 2, 0],
    ];

    const initialStateMergingSingle = [
      [2, 2, 0, 0],
      [0, 0, 2, 2],
      [0, 2, 2, 0],
      [2, 0, 0, 2],
    ];

    const initialStateMergingMultiple = [
      [2, 2, 4, 4],
      [2, 2, 4, 4],
      [8, 8, 2, 2],
      [8, 8, 2, 2],
    ];

    const initialStateMergingAndStacking = [
      [2, 2, 0, 2],
      [0, 0, 2, 2],
      [4, 2, 2, 0],
      [4, 0, 0, 2],
    ];

    describe('moveLeft', () => {
      it('should not move the board if the game is not in the "playing" state', () => {
        const game2048 = new Game(initialStateNoStacking, 0, 'win');

        game2048.moveLeft();

        const state = game2048.getState();

        expect(state).toEqual(initialStateNoStacking);
      });

      it('should move all non-empty cells to the left and don\'t change the score', () => {
        const game2048 = new Game(initialStateNoStacking, 0, 'playing');

        game2048.moveLeft();

        const state = game2048.getState();

        expect(state[0][0]).toBe(2);
        expect(state[1][0]).toBe(4);
        expect(state[2][0]).toBe(8);
        expect(state[3][0]).toBe(16);

        expect(game2048.getScore()).toBe(0);
      });

      it('should add a random cell with 2 or 4 at an empty position after the move', () => {
        const game2048 = new Game(initialStateNoStacking, 0, 'playing');

        game2048.moveLeft();

        const flatState = game2048.getState().flat();

        expect(
          flatState
            .some((cell, index) => (
              index % 4 !== 0 && [2, 4].includes(cell)
            )),
        ).toBe(true);
      });

      it('should stack cells to the left without merging and don\'t change the score', () => {
        const game2048 = new Game(initialStateStacking, 0, 'playing');

        game2048.moveLeft();

        const state = game2048.getState();

        expect(state[0][0]).toBe(4);
        expect(state[0][1]).toBe(2);
        expect(state[1][0]).toBe(2);
        expect(state[1][1]).toBe(4);
        expect(state[2][0]).toBe(2);
        expect(state[2][1]).toBe(8);
        expect(state[3][0]).toBe(8);
        expect(state[3][1]).toBe(2);

        expect(game2048.getScore()).toBe(0);
      });

      it('should merge cells with the same value to the left and update the score', () => {
        const game2048 = new Game(initialStateMergingSingle, 0, 'playing');

        game2048.moveLeft();

        const state = game2048.getState();

        expect(state[0][0]).toBe(4);
        expect(state[1][0]).toBe(4);
        expect(state[2][0]).toBe(4);
        expect(state[3][0]).toBe(4);

        expect(game2048.getScore()).toBe(16);
      });

      it('should merge cells with the same value to the left multiple times if possible and update the score', () => {
        const game2048 = new Game(initialStateMergingMultiple, 0, 'playing');

        game2048.moveLeft();

        const state = game2048.getState();

        expect(state[0][0]).toBe(4);
        expect(state[0][1]).toBe(8);
        expect(state[1][0]).toBe(4);
        expect(state[1][1]).toBe(8);
        expect(state[2][0]).toBe(16);
        expect(state[2][1]).toBe(4);
        expect(state[3][0]).toBe(16);
        expect(state[3][1]).toBe(4);

        expect(game2048.getScore()).toBe(64);
      });

      it('should merge cells with the same value and stack with those that are not merged to the left and update the score', () => {
        const game2048 = new Game(initialStateMergingAndStacking, 0, 'playing');

        game2048.moveLeft();

        const state = game2048.getState();

        expect(state[0][0]).toBe(4);
        expect(state[0][1]).toBe(2);
        expect(state[1][0]).toBe(4);
        expect(state[2][0]).toBe(4);
        expect(state[2][1]).toBe(4);
        expect(state[3][0]).toBe(4);
        expect(state[3][1]).toBe(2);

        expect(game2048.getScore()).toBe(12);
      });
    });

    describe('moveRight', () => {
      it('should not move the board if the game is not in the "playing" state', () => {
        const game2048 = new Game(initialStateNoStacking);

        game2048.moveRight();

        const state = game2048.getState();

        expect(state).toEqual(initialStateNoStacking);
      });

      it('should move all non-empty cells to the right and don\'t change the score', () => {
        const game2048 = new Game(initialStateNoStacking, 0, 'playing');

        game2048.moveRight();

        const state = game2048.getState();

        expect(state[0][3]).toBe(2);
        expect(state[1][3]).toBe(4);
        expect(state[2][3]).toBe(8);
        expect(state[3][3]).toBe(16);

        expect(game2048.getScore()).toBe(0);
      });

      it('should add a random cell with 2 or 4 at an empty position after the move', () => {
        const game2048 = new Game(initialStateNoStacking, 0, 'playing');

        game2048.moveRight();

        const flatState = game2048.getState().flat();

        expect(
          flatState
            .some((cell, index) => (
              index % 4 !== 3 && [2, 4].includes(cell)
            )),
        ).toBe(true);
      });

      it('should stack cells to the right without merging and don\'t change the score', () => {
        const game2048 = new Game(initialStateStacking, 0, 'playing');

        game2048.moveRight();

        const state = game2048.getState();

        expect(state[0][2]).toBe(4);
        expect(state[0][3]).toBe(2);
        expect(state[1][2]).toBe(2);
        expect(state[1][3]).toBe(4);
        expect(state[2][2]).toBe(2);
        expect(state[2][3]).toBe(8);
        expect(state[3][2]).toBe(8);
        expect(state[3][3]).toBe(2);

        expect(game2048.getScore()).toBe(0);
      });

      it('should merge cells with the same value to the right and update the score', () => {
        const game2048 = new Game(initialStateMergingSingle, 0, 'playing');

        game2048.moveRight();

        const state = game2048.getState();

        expect(state[0][3]).toBe(4);
        expect(state[1][3]).toBe(4);
        expect(state[2][3]).toBe(4);
        expect(state[3][3]).toBe(4);

        expect(game2048.getScore()).toBe(16);
      });

      it('should merge cells with the same value to the right multiple times if possible and update the score', () => {
        const game2048 = new Game(initialStateMergingMultiple, 0, 'playing');

        game2048.moveRight();

        const state = game2048.getState();

        expect(state[0][2]).toBe(4);
        expect(state[0][3]).toBe(8);
        expect(state[1][2]).toBe(4);
        expect(state[1][3]).toBe(8);
        expect(state[2][2]).toBe(16);
        expect(state[2][3]).toBe(4);
        expect(state[3][2]).toBe(16);
        expect(state[3][3]).toBe(4);

        expect(game2048.getScore()).toBe(64);
      });

      it('should merge cells with the same value and stack with those that are not merged to the right and update the score', () => {
        const game2048 = new Game(initialStateMergingAndStacking, 0, 'playing');

        game2048.moveRight();

        const state = game2048.getState();

        expect(state[0][2]).toBe(2);
        expect(state[0][3]).toBe(4);
        expect(state[1][3]).toBe(4);
        expect(state[2][2]).toBe(4);
        expect(state[2][3]).toBe(4);
        expect(state[3][2]).toBe(4);
        expect(state[3][3]).toBe(2);

        expect(game2048.getScore()).toBe(12);
      });
    });

    describe('moveUp', () => {
      it('should not move the board if the game is not in the "playing" state', () => {
        const game2048 = new Game(initialStateNoStacking, 0, 'lose');

        game2048.moveUp();

        const state = game2048.getState();

        expect(state).toEqual(initialStateNoStacking);
      });

      it('should move all non-empty cells up and don\'t change the score', () => {
        const game2048 = new Game(initialStateNoStacking, 0, 'playing');

        game2048.moveUp();

        const state = game2048.getState();

        expect(state[0][0]).toBe(2);
        expect(state[0][1]).toBe(4);
        expect(state[0][2]).toBe(8);
        expect(state[0][3]).toBe(16);

        expect(game2048.getScore()).toBe(0);
      });

      it('should add a random cell with 2 or 4 at an empty position after the move', () => {
        const game2048 = new Game(initialStateNoStacking, 0, 'playing');

        game2048.moveUp();

        const flatState = game2048.getState().flat();

        expect(
          flatState
            .some((cell, index) => (
              index > 3 && [2, 4].includes(cell)
            )),
        ).toBe(true);
      });

      it('should stack cells up without merging and don\'t change the score', () => {
        const game2048 = new Game(initialStateStacking, 0, 'playing');

        game2048.moveUp();

        const state = game2048.getState();

        expect(state[0][0]).toBe(2);
        expect(state[0][1]).toBe(4);
        expect(state[0][2]).toBe(4);
        expect(state[0][3]).toBe(2);
        expect(state[1][0]).toBe(8);
        expect(state[1][1]).toBe(2);
        expect(state[1][2]).toBe(2);
        expect(state[1][3]).toBe(8);

        expect(game2048.getScore()).toBe(0);
      });

      it('should merge cells with the same value up and update the score', () => {
        const game2048 = new Game(initialStateMergingSingle, 0, 'playing');

        game2048.moveUp();

        const state = game2048.getState();

        expect(state[0][0]).toBe(4);
        expect(state[0][1]).toBe(4);
        expect(state[0][2]).toBe(4);
        expect(state[0][3]).toBe(4);

        expect(game2048.getScore()).toBe(16);
      });

      it('should merge cells with the same value up multiple times if possible and update the score', () => {
        const game2048 = new Game(initialStateMergingMultiple, 0, 'playing');

        game2048.moveUp();

        const state = game2048.getState();

        expect(state[0][0]).toBe(4);
        expect(state[0][1]).toBe(4);
        expect(state[0][2]).toBe(8);
        expect(state[0][3]).toBe(8);
        expect(state[1][0]).toBe(16);
        expect(state[1][1]).toBe(16);
        expect(state[1][2]).toBe(4);
        expect(state[1][3]).toBe(4);

        expect(game2048.getScore()).toBe(64);
      });

      it('should merge cells with the same value and stack with those that are not merged up and update the score', () => {
        const game2048 = new Game(initialStateMergingAndStacking, 0, 'playing');

        game2048.moveUp();

        const state = game2048.getState();

        expect(state[0][0]).toBe(2);
        expect(state[0][1]).toBe(4);
        expect(state[0][2]).toBe(4);
        expect(state[0][3]).toBe(4);
        expect(state[1][0]).toBe(8);
        expect(state[1][3]).toBe(2);

        expect(game2048.getScore()).toBe(20);
      });
    });

    describe('moveDown', () => {
      it('should not move the board if the game is not in the "playing" state', () => {
        const game2048 = new Game(initialStateNoStacking, 0, 'win');

        game2048.moveDown();

        const state = game2048.getState();

        expect(state).toEqual(initialStateNoStacking);
      });

      it('should move all non-empty cells down and don\'t change the score', () => {
        const game2048 = new Game(initialStateNoStacking, 0, 'playing');

        game2048.moveDown();

        const state = game2048.getState();

        expect(state[3][0]).toBe(2);
        expect(state[3][1]).toBe(4);
        expect(state[3][2]).toBe(8);
        expect(state[3][3]).toBe(16);

        expect(game2048.getScore()).toBe(0);
      });

      it('should add a random cell with 2 or 4 at an empty position after the move', () => {
        const game2048 = new Game(initialStateNoStacking, 0, 'playing');

        game2048.moveDown();

        const flatState = game2048.getState().flat();

        expect(
          flatState
            .some((cell, index) => (
              index < 12 && [2, 4].includes(cell)
            )),
        ).toBe(true);
      });

      it('should stack cells down without merging and don\'t change the score', () => {
        const game2048 = new Game(initialStateStacking, 0, 'playing');

        game2048.moveDown();

        const state = game2048.getState();

        expect(state[2][0]).toBe(2);
        expect(state[2][1]).toBe(4);
        expect(state[2][2]).toBe(4);
        expect(state[2][3]).toBe(2);
        expect(state[3][0]).toBe(8);
        expect(state[3][1]).toBe(2);
        expect(state[3][2]).toBe(2);
        expect(state[3][3]).toBe(8);

        expect(game2048.getScore()).toBe(0);
      });

      it('should merge cells with the same value down and update the score', () => {
        const game2048 = new Game(initialStateMergingSingle, 0, 'playing');

        game2048.moveDown();

        const state = game2048.getState();

        expect(state[3][0]).toBe(4);
        expect(state[3][1]).toBe(4);
        expect(state[3][2]).toBe(4);
        expect(state[3][3]).toBe(4);

        expect(game2048.getScore()).toBe(16);
      });

      it('should merge cells with the same value down multiple times if possible and update the score', () => {
        const game2048 = new Game(initialStateMergingMultiple, 0, 'playing');

        game2048.moveDown();

        const state = game2048.getState();

        expect(state[2][0]).toBe(4);
        expect(state[2][1]).toBe(4);
        expect(state[2][2]).toBe(8);
        expect(state[2][3]).toBe(8);
        expect(state[3][0]).toBe(16);
        expect(state[3][1]).toBe(16);
        expect(state[3][2]).toBe(4);
        expect(state[3][3]).toBe(4);

        expect(game2048.getScore()).toBe(64);
      });

      it('should merge cells with the same value and stack with those that are not merged down and update the score', () => {
        const game2048 = new Game(initialStateMergingAndStacking, 0, 'playing');

        game2048.moveDown();

        const state = game2048.getState();

        expect(state[2][0]).toBe(2);
        expect(state[2][3]).toBe(2);
        expect(state[3][0]).toBe(8);
        expect(state[3][1]).toBe(4);
        expect(state[3][2]).toBe(4);
        expect(state[3][3]).toBe(4);

        expect(game2048.getScore()).toBe(20);
      });
    });
  });

  describe('game status', () => {
    it('should be a "win" after player has moved and a 2048 tile is created', () => {
      const game2048 = new Game([
        [0, 0, 0, 0],
        [0, 0, 1024, 1024],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ], 0, 'playing');

      game2048.moveRight();

      const state = game2048.getState();

      expect(game2048.getStatus()).toBe('win');
      expect(state[1][3]).toBe(2048);
    });

    it('should be a "playing" after player has moved and board is full but new move is still possible with added tile', () => {
      const game2048 = new Game([
        [2, 2, 8, 16],
        [2, 8, 16, 32],
        [8, 16, 32, 64],
        [16, 32, 64, 128],
      ], 0, 'playing');

      game2048.moveDown();

      expect(game2048.getStatus()).toBe('playing');
    });

    it('should be a "playing" after player has moved and board is full but move is still possible with old tiles', () => {
      const game2048 = new Game([
        [128, 128, 8, 16],
        [16, 8, 16, 32],
        [8, 16, 32, 64],
        [16, 32, 64, 128],
      ], 0, 'playing');

      game2048.moveLeft();

      expect(game2048.getStatus()).toBe('playing');
    });

    it('should be a "lose" after player has moved and board is full and no more moves are possible', () => {
      const game2048 = new Game([
        [128, 128, 16, 8],
        [16, 8, 16, 32],
        [8, 16, 32, 64],
        [16, 32, 64, 128],
      ], 0, 'playing');

      game2048.moveLeft();

      expect(game2048.getStatus()).toBe('lose');
    });
  });

  describe('game reset', () => {
    it('should reset the game score, status and set the board to the empty state after restart', () => {
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
  });
});
