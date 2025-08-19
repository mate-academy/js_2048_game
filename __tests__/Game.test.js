import { Game } from '../src/modules/Game.class.js';

describe('Game class basic tests', () => {
  test('initial score is zero', () => {
    const game = new Game();
    expect(game.getScore()).toBe(0);
  });

  test('initial board has exactly two tiles (2 or 4)', () => {
    const game = new Game();
    const tiles = game.getState().flat().filter(val => val !== 0);
    expect(tiles.length).toBe(2);
    tiles.forEach(tile => expect([2, 4]).toContain(tile));
  });

  test('moveLeft merges tiles and updates score', () => {
    const initialBoard = [
      [2, 2, 0, 0],
      [4, 4, 4, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const game = new Game(initialBoard);

    const moved = game.moveLeft();
    expect(moved).toBe(true);

    const newState = game.getState();

    // First row: [4, 0, 0, 0] (2+2 merged)
    expect(newState[0][0]).toBe(4);
    expect(newState[0][1]).toBe(0);

    // Second row: [8, 4, 0, 0] (4+4 merged, one 4 remains)
    expect(newState[1][0]).toBe(8);
    expect(newState[1][1]).toBe(4);

    // Score should be sum of merged tiles: 4 (2+2) + 8 (4+4) = 12
    expect(game.getScore()).toBe(12);
  });

  test('cannot move if board is full and no merges possible', () => {
    const fullBoard = [
      [2, 4, 2, 4],
      [4, 2, 4, 2],
      [2, 4, 2, 4],
      [4, 2, 4, 2],
    ];
    const game = new Game(fullBoard);

    expect(game.canMove()).toBe(false);
    expect(game.getStatus()).toBe('playing'); // status changes after moves, so still "playing" here

    // Try moving left - should return false as no moves possible
    expect(game.moveLeft()).toBe(false);
  });

  test('winning the game updates status to "won"', () => {
    const winningBoard = [
      [1024, 1024, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    const game = new Game(winningBoard);

    expect(game.getStatus()).toBe('playing');
    const moved = game.moveLeft();
    expect(moved).toBe(true);

    expect(game.getStatus()).toBe('won');
    expect(game.getScore()).toBe(2048);
  });
});
