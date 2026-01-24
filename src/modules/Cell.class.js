'use strict';

class CellService {
  findRandomEmptyCell(board) {
    const emptyCells = [];

    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        if (board[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    // TODO: add logic when there no place for cell
    if (emptyCells.length === 0) {
      throw new Error('No place for cell');
    }

    const cords = emptyCells[Math.floor(Math.random() * emptyCells.length)];

    return cords;
  }

  addRandomCell(board, amount = 1) {
    for (let i = 0; i < amount; i++) {
      const { row, col } = this.findRandomEmptyCell(board);
      const randomNumber = Math.random() <= 0.1 ? 4 : 2;

      board[row][col] = randomNumber;
    }
  }
}

module.exports = CellService;
