/* eslint-disable no-param-reassign */
import { EMPTY_CELL, TARGET_SCORE } from './constants';

export const generateRandomIndex = (maxNumber) => {
  return Math.floor(Math.random() * maxNumber);
};

export const capitalize = (str) => {
  return str[0].toUpperCase() + str.slice(1);
};

export const rollDie = () => {
  const result = Math.floor(Math.random() * 10) + 1;

  return result === 1;
};

export const isFilledBoard = (board) => {
  return board.every((row) => row.every((cell) => cell !== EMPTY_CELL));
};

export const isWinGame = (board) => {
  return board.some((row) => row.some((cell) => cell === TARGET_SCORE));
};
