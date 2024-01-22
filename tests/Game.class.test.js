/* eslint-disable max-len */
'use strict';

const Game = require('../src/modules/Game.class');

describe('Game class', () => {
  describe('getters and setters', () => {
    let game2048;

    beforeEach(() => {
      game2048 = new Game();
    });

    it('should correctly set and get the state', () => {
      const newState = [
        [2, 0, 0, 0],
        [0, 4, 0, 0],
        [0, 0, 8, 0],
        [0, 0, 0, 16],
      ];

      game2048.state = newState;

      expect(game2048.state).toEqual(newState);
    });

    it('should correctly set and get the score', () => {
      const newScore = 42;

      game2048.score = newScore;

      expect(game2048.score).toBe(newScore);
    });

    it('should correctly set and get the status', () => {
      const newStatus = 'playing';

      game2048.status = newStatus;

      expect(game2048.status).toBe(newStatus);
    });
  });

  describe('initialization', () => {
    it('should have a state of an empty board by default', () => {
      const game2048 = new Game();

      expect(game2048.state).toEqual([
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);
    });

    it('should have a score of 0 by default', () => {
      const game2048 = new Game();

      expect(game2048.score).toBe(0);
    });

    it('should have a status of "idle" by default', () => {
      const game2048 = new Game();

      expect(game2048.status).toBe('idle');
    });

    it('should have a state of a custom board if the initial state is provided', () => {
      const initialState = [
        [2, 0, 0, 0],
        [0, 4, 0, 0],
        [0, 0, 8, 0],
        [0, 0, 0, 16]];

      const game2048 = new Game(initialState);

      expect(game2048.state).toEqual(initialState);
    });

    it('should have a score of a custom value if the initial score is provided', () => {
      const initialScore = 42;

      const game2048 = new Game(null, initialScore);

      expect(game2048.score).toBe(initialScore);
    });
  });

  describe('after start', () => {
    it('should have a score of 0 after start', () => {
      const game2048 = new Game();

      game2048.start();

      expect(game2048.score).toBe(0);
    });

    it('should have a status of "playing" after start', () => {
      const game2048 = new Game();

      game2048.start();

      expect(game2048.status).toBe('playing');
    });

    it('should have a state with two random cells with 2 or 4 after start', () => {
      const game2048 = new Game();

      game2048.start();

      const flatState = game2048.state.flat();

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

        statesCombined = [
          ...statesCombined,
          ...game2048.state.flat(),
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
        const game2048 = new Game(initialStateNoStacking);

        game2048.status = 'win';

        game2048.moveLeft();

        expect(game2048.state).toEqual(initialStateNoStacking);
      });

      it('should return current game status after the move', () => {
        const game2048 = new Game(initialStateNoStacking);

        game2048.status = 'playing';

        expect(game2048.moveLeft()).toBe('playing');
      });

      it('should move all non-empty cells to the left and don\'t change the score', () => {
        const game2048 = new Game(initialStateNoStacking);

        game2048.status = 'playing';

        game2048.moveLeft();

        expect(game2048.state[0][0]).toBe(2);
        expect(game2048.state[1][0]).toBe(4);
        expect(game2048.state[2][0]).toBe(8);
        expect(game2048.state[3][0]).toBe(16);

        expect(game2048.score).toBe(0);
      });

      it('should add a random cell with 2 or 4 at an empty position after the move', () => {
        const game2048 = new Game(initialStateNoStacking);

        game2048.status = 'playing';

        game2048.moveLeft();

        const flatState = game2048.state.flat();

        expect(
          flatState
            .some((cell, index) => (
              index % 4 !== 0 && [2, 4].includes(cell)
            )),
        ).toBe(true);
      });

      it('should stack cells to the left without merging and don\'t change the score', () => {
        const game2048 = new Game(initialStateStacking);

        game2048.status = 'playing';

        game2048.moveLeft();

        expect(game2048.state[0][0]).toBe(4);
        expect(game2048.state[0][1]).toBe(2);
        expect(game2048.state[1][0]).toBe(2);
        expect(game2048.state[1][1]).toBe(4);
        expect(game2048.state[2][0]).toBe(2);
        expect(game2048.state[2][1]).toBe(8);
        expect(game2048.state[3][0]).toBe(8);
        expect(game2048.state[3][1]).toBe(2);

        expect(game2048.score).toBe(0);
      });

      it('should merge cells with the same value to the left and update the score', () => {
        const game2048 = new Game(initialStateMergingSingle);

        game2048.status = 'playing';

        game2048.moveLeft();

        expect(game2048.state[0][0]).toBe(4);
        expect(game2048.state[1][0]).toBe(4);
        expect(game2048.state[2][0]).toBe(4);
        expect(game2048.state[3][0]).toBe(4);

        expect(game2048.score).toBe(16);
      });

      it('should merge cells with the same value to the left multiple times if possible and update the score', () => {
        const game2048 = new Game(initialStateMergingMultiple);

        game2048.status = 'playing';

        game2048.moveLeft();

        expect(game2048.state[0][0]).toBe(4);
        expect(game2048.state[0][1]).toBe(8);
        expect(game2048.state[1][0]).toBe(4);
        expect(game2048.state[1][1]).toBe(8);
        expect(game2048.state[2][0]).toBe(16);
        expect(game2048.state[2][1]).toBe(4);
        expect(game2048.state[3][0]).toBe(16);
        expect(game2048.state[3][1]).toBe(4);

        expect(game2048.score).toBe(64);
      });

      it('should merge cells with the same value and stack with those that are not merged to the left and update the score', () => {
        const game2048 = new Game(initialStateMergingAndStacking);

        game2048.status = 'playing';

        game2048.moveLeft();

        expect(game2048.state[0][0]).toBe(4);
        expect(game2048.state[0][1]).toBe(2);
        expect(game2048.state[1][0]).toBe(4);
        expect(game2048.state[2][0]).toBe(4);
        expect(game2048.state[2][1]).toBe(4);
        expect(game2048.state[3][0]).toBe(4);
        expect(game2048.state[3][1]).toBe(2);

        expect(game2048.score).toBe(12);
      });
    });

    describe('moveRight', () => {
      it('should not move the board if the game is not in the "playing" state', () => {
        const game2048 = new Game(initialStateNoStacking);

        game2048.status = 'idle';

        game2048.moveRight();

        expect(game2048.state).toEqual(initialStateNoStacking);
      });

      it('should return current game status after the move', () => {
        const game2048 = new Game(initialStateNoStacking);

        game2048.status = 'playing';

        expect(game2048.moveRight()).toBe('playing');
      });

      it('should move all non-empty cells to the right and don\'t change the score', () => {
        const game2048 = new Game(initialStateNoStacking);

        game2048.status = 'playing';

        game2048.moveRight();

        expect(game2048.state[0][3]).toBe(2);
        expect(game2048.state[1][3]).toBe(4);
        expect(game2048.state[2][3]).toBe(8);
        expect(game2048.state[3][3]).toBe(16);

        expect(game2048.score).toBe(0);
      });

      it('should add a random cell with 2 or 4 at an empty position after the move', () => {
        const game2048 = new Game(initialStateNoStacking);

        game2048.status = 'playing';

        game2048.moveRight();

        const flatState = game2048.state.flat();

        expect(
          flatState
            .some((cell, index) => (
              index % 4 !== 3 && [2, 4].includes(cell)
            )),
        ).toBe(true);
      });

      it('should stack cells to the right without merging and don\'t change the score', () => {
        const game2048 = new Game(initialStateStacking);

        game2048.status = 'playing';

        game2048.moveRight();

        expect(game2048.state[0][2]).toBe(4);
        expect(game2048.state[0][3]).toBe(2);
        expect(game2048.state[1][2]).toBe(2);
        expect(game2048.state[1][3]).toBe(4);
        expect(game2048.state[2][2]).toBe(2);
        expect(game2048.state[2][3]).toBe(8);
        expect(game2048.state[3][2]).toBe(8);
        expect(game2048.state[3][3]).toBe(2);

        expect(game2048.score).toBe(0);
      });

      it('should merge cells with the same value to the right and update the score', () => {
        const game2048 = new Game(initialStateMergingSingle);

        game2048.status = 'playing';

        game2048.moveRight();

        expect(game2048.state[0][3]).toBe(4);
        expect(game2048.state[1][3]).toBe(4);
        expect(game2048.state[2][3]).toBe(4);
        expect(game2048.state[3][3]).toBe(4);

        expect(game2048.score).toBe(16);
      });

      it('should merge cells with the same value to the right multiple times if possible and update the score', () => {
        const game2048 = new Game(initialStateMergingMultiple);

        game2048.status = 'playing';

        game2048.moveRight();

        expect(game2048.state[0][2]).toBe(4);
        expect(game2048.state[0][3]).toBe(8);
        expect(game2048.state[1][2]).toBe(4);
        expect(game2048.state[1][3]).toBe(8);
        expect(game2048.state[2][2]).toBe(16);
        expect(game2048.state[2][3]).toBe(4);
        expect(game2048.state[3][2]).toBe(16);
        expect(game2048.state[3][3]).toBe(4);

        expect(game2048.score).toBe(64);
      });

      it('should merge cells with the same value and stack with those that are not merged to the right and update the score', () => {
        const game2048 = new Game(initialStateMergingAndStacking);

        game2048.status = 'playing';

        game2048.moveRight();

        expect(game2048.state[0][2]).toBe(2);
        expect(game2048.state[0][3]).toBe(4);
        expect(game2048.state[1][3]).toBe(4);
        expect(game2048.state[2][2]).toBe(4);
        expect(game2048.state[2][3]).toBe(4);
        expect(game2048.state[3][2]).toBe(4);
        expect(game2048.state[3][3]).toBe(2);

        expect(game2048.score).toBe(12);
      });
    });

    describe('moveUp', () => {
      it('should not move the board if the game is not in the "playing" state', () => {
        const game2048 = new Game(initialStateNoStacking);

        game2048.status = 'lose';

        game2048.moveUp();

        expect(game2048.state).toEqual(initialStateNoStacking);
      });

      it('should return current game status after the move', () => {
        const game2048 = new Game(initialStateNoStacking);

        game2048.status = 'playing';

        expect(game2048.moveUp()).toBe('playing');
      });

      it('should move all non-empty cells up and don\'t change the score', () => {
        const game2048 = new Game(initialStateNoStacking);

        game2048.status = 'playing';

        game2048.moveUp();

        expect(game2048.state[0][0]).toBe(2);
        expect(game2048.state[0][1]).toBe(4);
        expect(game2048.state[0][2]).toBe(8);
        expect(game2048.state[0][3]).toBe(16);

        expect(game2048.score).toBe(0);
      });

      it('should add a random cell with 2 or 4 at an empty position after the move', () => {
        const game2048 = new Game(initialStateNoStacking);

        game2048.status = 'playing';

        game2048.moveUp();

        const flatState = game2048.state.flat();

        expect(
          flatState
            .some((cell, index) => (
              index > 3 && [2, 4].includes(cell)
            )),
        ).toBe(true);
      });

      it('should stack cells up without merging and don\'t change the score', () => {
        const game2048 = new Game(initialStateStacking);

        game2048.status = 'playing';

        game2048.moveUp();

        expect(game2048.state[0][0]).toBe(2);
        expect(game2048.state[0][1]).toBe(4);
        expect(game2048.state[0][2]).toBe(4);
        expect(game2048.state[0][3]).toBe(2);
        expect(game2048.state[1][0]).toBe(8);
        expect(game2048.state[1][1]).toBe(2);
        expect(game2048.state[1][2]).toBe(2);
        expect(game2048.state[1][3]).toBe(8);

        expect(game2048.score).toBe(0);
      });

      it('should merge cells with the same value up and update the score', () => {
        const game2048 = new Game(initialStateMergingSingle);

        game2048.status = 'playing';

        game2048.moveUp();

        expect(game2048.state[0][0]).toBe(4);
        expect(game2048.state[0][1]).toBe(4);
        expect(game2048.state[0][2]).toBe(4);
        expect(game2048.state[0][3]).toBe(4);

        expect(game2048.score).toBe(16);
      });

      it('should merge cells with the same value up multiple times if possible and update the score', () => {
        const game2048 = new Game(initialStateMergingMultiple);

        game2048.status = 'playing';

        game2048.moveUp();

        expect(game2048.state[0][0]).toBe(4);
        expect(game2048.state[0][1]).toBe(4);
        expect(game2048.state[0][2]).toBe(8);
        expect(game2048.state[0][3]).toBe(8);
        expect(game2048.state[1][0]).toBe(16);
        expect(game2048.state[1][1]).toBe(16);
        expect(game2048.state[1][2]).toBe(4);
        expect(game2048.state[1][3]).toBe(4);

        expect(game2048.score).toBe(64);
      });

      it('should merge cells with the same value and stack with those that are not merged up and update the score', () => {
        const game2048 = new Game(initialStateMergingAndStacking);

        game2048.status = 'playing';

        game2048.moveUp();

        expect(game2048.state[0][0]).toBe(2);
        expect(game2048.state[0][1]).toBe(4);
        expect(game2048.state[0][2]).toBe(4);
        expect(game2048.state[0][3]).toBe(4);
        expect(game2048.state[1][0]).toBe(8);
        expect(game2048.state[1][3]).toBe(2);

        expect(game2048.score).toBe(20);
      });
    });

    describe('moveDown', () => {
      it('should not move the board if the game is not in the "playing" state', () => {
        const game2048 = new Game(initialStateNoStacking);

        game2048.status = 'win';

        game2048.moveDown();

        expect(game2048.state).toEqual(initialStateNoStacking);
      });

      it('should return current game status after the move', () => {
        const game2048 = new Game(initialStateNoStacking);

        game2048.status = 'playing';

        expect(game2048.moveDown()).toBe('playing');
      });

      it('should move all non-empty cells down and don\'t change the score', () => {
        const game2048 = new Game(initialStateNoStacking);

        game2048.status = 'playing';

        game2048.moveDown();

        expect(game2048.state[3][0]).toBe(2);
        expect(game2048.state[3][1]).toBe(4);
        expect(game2048.state[3][2]).toBe(8);
        expect(game2048.state[3][3]).toBe(16);

        expect(game2048.score).toBe(0);
      });

      it('should add a random cell with 2 or 4 at an empty position after the move', () => {
        const game2048 = new Game(initialStateNoStacking);

        game2048.status = 'playing';

        game2048.moveDown();

        const flatState = game2048.state.flat();

        expect(
          flatState
            .some((cell, index) => (
              index < 12 && [2, 4].includes(cell)
            )),
        ).toBe(true);
      });

      it('should stack cells down without merging and don\'t change the score', () => {
        const game2048 = new Game(initialStateStacking);

        game2048.status = 'playing';

        game2048.moveDown();

        expect(game2048.state[2][0]).toBe(2);
        expect(game2048.state[2][1]).toBe(4);
        expect(game2048.state[2][2]).toBe(4);
        expect(game2048.state[2][3]).toBe(2);
        expect(game2048.state[3][0]).toBe(8);
        expect(game2048.state[3][1]).toBe(2);
        expect(game2048.state[3][2]).toBe(2);
        expect(game2048.state[3][3]).toBe(8);

        expect(game2048.score).toBe(0);
      });

      it('should merge cells with the same value down and update the score', () => {
        const game2048 = new Game(initialStateMergingSingle);

        game2048.status = 'playing';

        game2048.moveDown();

        expect(game2048.state[3][0]).toBe(4);
        expect(game2048.state[3][1]).toBe(4);
        expect(game2048.state[3][2]).toBe(4);
        expect(game2048.state[3][3]).toBe(4);

        expect(game2048.score).toBe(16);
      });

      it('should merge cells with the same value down multiple times if possible and update the score', () => {
        const game2048 = new Game(initialStateMergingMultiple);

        game2048.status = 'playing';

        game2048.moveDown();

        expect(game2048.state[2][0]).toBe(4);
        expect(game2048.state[2][1]).toBe(4);
        expect(game2048.state[2][2]).toBe(8);
        expect(game2048.state[2][3]).toBe(8);
        expect(game2048.state[3][0]).toBe(16);
        expect(game2048.state[3][1]).toBe(16);
        expect(game2048.state[3][2]).toBe(4);
        expect(game2048.state[3][3]).toBe(4);

        expect(game2048.score).toBe(64);
      });

      it('should merge cells with the same value and stack with those that are not merged down and update the score', () => {
        const game2048 = new Game(initialStateMergingAndStacking);

        game2048.status = 'playing';

        game2048.moveDown();

        expect(game2048.state[2][0]).toBe(2);
        expect(game2048.state[2][3]).toBe(2);
        expect(game2048.state[3][0]).toBe(8);
        expect(game2048.state[3][1]).toBe(4);
        expect(game2048.state[3][2]).toBe(4);
        expect(game2048.state[3][3]).toBe(4);

        expect(game2048.score).toBe(20);
      });
    });
  });

  describe('game status', () => {
    it('should return "win" when moved and a 2048 tile is created', () => {
      const game2048 = new Game([
        [0, 0, 0, 0],
        [0, 0, 1024, 1024],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);

      game2048.status = 'playing';

      expect(game2048.moveRight()).toBe('win');
      expect(game2048.status).toBe('win');

      expect(game2048.state[1][3]).toBe(2048);
    });

    it('should return "playing" when moved and board is full but move is possible with new cell', () => {
      const game2048 = new Game([
        [2, 2, 8, 16],
        [2, 8, 16, 32],
        [8, 16, 32, 64],
        [16, 32, 64, 128],
      ]);

      game2048.status = 'playing';

      expect(game2048.moveDown()).toBe('playing');
      expect(game2048.status).toBe('playing');
    });

    it('should return "playing" when moved and board is full but move is possible with shifted cells', () => {
      const game2048 = new Game([
        [128, 128, 8, 16],
        [16, 8, 16, 32],
        [8, 16, 32, 64],
        [16, 32, 64, 128],
      ]);

      game2048.status = 'playing';

      expect(game2048.moveLeft()).toBe('playing');
      expect(game2048.status).toBe('playing');
    });

    it('should return "lose" when moved and board is full and no moves are possible', () => {
      const game2048 = new Game([
        [128, 128, 16, 8],
        [16, 8, 16, 32],
        [8, 16, 32, 64],
        [16, 32, 64, 128],
      ]);

      game2048.status = 'playing';

      expect(game2048.moveLeft()).toBe('lose');
      expect(game2048.status).toBe('lose');
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

      expect(game2048.score).toBe(0);
      expect(game2048.status).toBe('idle');

      expect(game2048.state).toEqual([
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ]);
    });
  });
});
