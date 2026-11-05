/* eslint-env jest */
'use strict';

const Game = require('../src/modules/Game.class');

const board = (firstRow) => [
  firstRow,
  [0, 0, 0, 0],
  [0, 0, 0, 0],
  [0, 0, 0, 0],
];

afterEach(() => jest.restoreAllMocks());

function startedGame(state) {
  const game = new Game(state);

  jest.spyOn(game, 'addTile').mockImplementation(() => {});
  game.start();

  return game;
}

test('merges each tile at most once and scores the resulting tiles', () => {
  const game = startedGame(board([2, 2, 4, 4]));

  game.moveLeft();

  expect(game.getState()[0]).toEqual([4, 8, 0, 0]);
  expect(game.getScore()).toBe(12);
});

test('does not spawn a tile after an unchanged move', () => {
  const game = startedGame(board([2, 4, 8, 16]));

  game.addTile.mockClear();
  game.moveLeft();

  expect(game.addTile).not.toHaveBeenCalled();
});

test('protects the initial and returned boards from mutation', () => {
  const initial = board([2, 2, 0, 0]);
  const game = startedGame(initial);

  initial[0][0] = 1024;
  game.getState()[0][0] = 512;
  game.moveLeft();
  game.restart();

  expect(game.getState()).toEqual(board([2, 2, 0, 0]));
  expect(game.getStatus()).toBe('idle');
  expect(game.getScore()).toBe(0);
});

test('stops accepting moves after winning', () => {
  const game = startedGame(board([1024, 1024, 0, 0]));

  game.moveRight();

  const wonState = game.getState();

  game.moveLeft();

  expect(game.getStatus()).toBe('win');
  expect(game.getState()).toEqual(wonState);
  expect(game.getScore()).toBe(2048);
});

test('recognizes a full board with only a vertical merge available', () => {
  const game = startedGame([
    [2, 4, 8, 16],
    [2, 8, 16, 32],
    [4, 16, 32, 64],
    [8, 32, 64, 128],
  ]);

  expect(game.getStatus()).toBe('playing');
  game.moveUp();
  expect(game.getScore()).toBe(4);
});

test('recognizes a board with no legal moves', () => {
  const game = startedGame([
    [2, 4, 2, 4],
    [4, 2, 4, 2],
    [2, 4, 2, 4],
    [4, 2, 4, 2],
  ]);

  expect(game.getStatus()).toBe('lose');
});
