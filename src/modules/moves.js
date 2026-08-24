'use strict';

const { BOARD_SIZE } = require('./config');
const Board = require('./Board');

const collapseLine = (line) => {
  const values = line.filter((cell) => cell !== 0);
  const collapsed = [];
  let gained = 0;
  let index = 0;

  while (index < values.length) {
    if (values[index] === values[index + 1]) {
      const merged = values[index] * 2;

      collapsed.push(merged);
      gained += merged;
      index += 2;
    } else {
      collapsed.push(values[index]);
      index += 1;
    }
  }

  while (collapsed.length < BOARD_SIZE) {
    collapsed.push(0);
  }

  return { line: collapsed, gained };
};

const collapseBoard = (board) => {
  let gained = 0;

  const lines = board.map((line) => {
    const result = collapseLine(line);

    gained += result.gained;

    return result.line;
  });

  return { board: lines, gained };
};

const DIRECTIONS = {
  left: {
    toLines: (board) => board,
    toBoard: (lines) => lines,
  },
  right: {
    toLines: Board.reverseRows,
    toBoard: Board.reverseRows,
  },
  up: {
    toLines: Board.transpose,
    toBoard: Board.transpose,
  },
  down: {
    toLines: (board) => Board.reverseRows(Board.transpose(board)),
    toBoard: (lines) => Board.transpose(Board.reverseRows(lines)),
  },
};

const move = (board, direction) => {
  const { toLines, toBoard } = DIRECTIONS[direction];
  const collapsed = collapseBoard(toLines(board));

  return { board: toBoard(collapsed.board), gained: collapsed.gained };
};

module.exports = { collapseLine, move };
