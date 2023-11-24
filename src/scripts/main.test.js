'use strict';

const Game = require('./main');

function countEmptyCells(game) {
  return game.field.reduce((prev, curr) => prev + curr
    .reduce((counter, cell) => cell === 0 ? counter + 1 : counter, 0), 0);
}

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

  describe('movement logic', () => {
    const game = new Game();

    beforeEach(() => {
      game.field = [
        [2, 2, 0, 0],
        [2, 2, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    });

    it('should place all tiles to left side on moveLeft()', () => {
      game.moveLeft();

      expect(game.field[0][0]).toEqual(4);
      expect(game.field[1][0]).toEqual(4);
      expect(countEmptyCells(game)).toEqual(13);
    });

    it('should place all tiles to right side on moveRight()', () => {
      game.moveRight();

      expect(game.field[0][3]).toEqual(4);
      expect(game.field[1][3]).toEqual(4);
      expect(countEmptyCells(game)).toEqual(13);
    });

    it('should place all tiles to top side on moveTop()', () => {
      game.moveTop();

      expect(game.field[0][0]).toEqual(4);
      expect(game.field[0][1]).toEqual(4);
      expect(countEmptyCells(game)).toEqual(13);
    });

    it('should place all tiles to bottom side on moveBottom()', () => {
      game.moveBottom();

      expect(game.field[3][0]).toEqual(4);
      expect(game.field[3][1]).toEqual(4);
      expect(countEmptyCells(game)).toEqual(13);
    });

    it('should stack only nearby cells', () => {
      game.field = [
        [2, 4, 2, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];

      game.moveLeft();

      expect(game.field[0][0]).toEqual(2);
      expect(game.field[0][1]).toEqual(4);
      expect(game.field[0][2]).toEqual(2);
    });

    it('should add one random new cell to field after each move', () => {
      game.field = [
        [2, 4, 2, 4],
        [4, 2, 4, 2],
        [2, 4, 0, 0],
        [2, 2, 4, 4],
      ];
      game.moveLeft();

      expect(game.cellsValues().filter(el => el === 0).length).toEqual(3);
    });
  });

  describe('rotating field', () => {
    it('should rotate field to 90 deg clockwise', () => {
      const game = new Game();

      game.field = [
        [2, 4, 8, 16],
        [2, 2, 0, 2],
        [4, 0, 0, 8],
        [2, 2, 2, 0],
      ];

      game.rotateField();

      expect(game.field).toEqual([
        [2, 4, 2, 2],
        [2, 0, 2, 4],
        [2, 0, 0, 8],
        [0, 8, 2, 16],
      ]);
    });
  });

  describe('score counting', () => {
    const game = new Game();

    beforeEach(() => {
      game.field = [
        [2, 2, 2, 2],
        [0, 0, 0, 0],
        [0, 0, 4, 4],
        [2, 4, 8, 16],
      ];
    });

    it('should add collapced cells values to score', () => {
      game.moveLeft();

      expect(game.score).toEqual(16);
    });
  });

  describe('win or loss logic', () => {
    it('should set state to win if there is a 2048 cell', () => {
      const game = new Game();

      game.field = [
        [1024, 1024, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
      game.moveLeft();

      expect(game.state).toEqual('win');
    });

    it('should set state to loss if there is no possible moves', () => {
      const game = new Game();

      game.field = [
        [2, 4, 2, 4],
        [4, 2, 4, 2],
        [64, 4, 2, 8],
        [4, 8, 8, 32],
      ];

      game.moveLeft();

      expect(game.state).toEqual('loss');
    });
  });
});
