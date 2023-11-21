'use strict';

const Game = require('./main');

describe('class Game logic', () => {
  describe('initial state', () => {
    const game = new Game();

    it('score should be set to 0', () => {
      expect(game.score).toEqual(0);
    });

    it('game state should be START', () => {
      expect(game.state).toEqual('start');
    });

    it('field content should be clear', () => {
      expect(game.field.length).toEqual(4);

      game.field.forEach(el => {
        expect(el.length).toEqual(4);

        el.forEach(cell => {
          expect(cell).toEqual(0);
        });
      });
    });
  });

  describe('starting game', () => {
    const game = new Game();

    game.startingNewGame();

    it('should change game state to STARTED', () => {
      expect(game.state).toEqual('started');
    });

    it('should add two initial cells', () => {
      let counter = 0;

      game.cellsValues().forEach(cell => {
        if (cell === 2) {
          counter++;
        }
      });

      expect(counter).toEqual(2);
    });
  });

  describe('moving left', () => {
    it('should place all tiles to left side', () => {
      const game = new Game();

      game.startingNewGame();
      game.moveLeft();

      game.field.forEach(row => {
        const indexOfZero = row.findIndex(cell => cell === 0);

        if (indexOfZero === -1) {
          return;
        }

        for (let i = indexOfZero; i < row.length; i++) {
          expect(row[i]).toEqual(0);
        }
      });
    });

    it('should collapse tiles if they are equal', () => {
      const game = new Game();

      game.field = [
        [2, 2, 2, 2],
        [0, 0, 0, 0],
        [0, 0, 4, 4],
        [2, 4, 8, 16],
      ];
      game.moveLeft();

      expect(game.field).toEqual([
        [4, 4, 0, 0],
        [0, 0, 0, 0],
        [8, 0, 0, 0],
        [2, 4, 8, 16],
      ]);
    });
  });
});
