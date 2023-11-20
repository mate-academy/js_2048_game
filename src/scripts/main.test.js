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
});
