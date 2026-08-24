'use strict';

const { BOARD_SIZE } = require('./config');

const create = () =>
  Array.from({ length: BOARD_SIZE }, () => new Array(BOARD_SIZE).fill(0));

const copy = (board) => board.map((row) => [...row]);

const equals = (first, second) => {
  const firstCells = first.flat();
  const secondCells = second.flat();

  return firstCells.every((cell, i) => cell === secondCells[i]);
};

const transpose = (board) =>
  board[0].map((cell, index) => board.map((row) => row[index]));

const reverseRows = (board) => board.map((row) => [...row].reverse());

const contains = (board, value) => board.some((row) => row.includes(value));

const emptyCells = (board) => {
  const cells = [];

  board.forEach((row, rowIndex) => {
    row.forEach((cell, cellIndex) => {
      if (cell === 0) {
        cells.push([rowIndex, cellIndex]);
      }
    });
  });

  return cells;
};

const hasMoves = (board) => {
  const cells = board.flat();

  return cells.some((cell, index) => {
    const isLastColumn = index % BOARD_SIZE === BOARD_SIZE - 1;
    const isLastRow = index >= cells.length - BOARD_SIZE;
    const nextInRow = isLastColumn ? null : cells[index + 1];
    const nextInColumn = isLastRow ? null : cells[index + BOARD_SIZE];

    return cell === 0 || cell === nextInRow || cell === nextInColumn;
  });
};

module.exports = {
  create,
  copy,
  equals,
  transpose,
  reverseRows,
  contains,
  emptyCells,
  hasMoves,
};
