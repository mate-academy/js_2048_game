import { getRandomCell } from './helpers';
import { rows, cells } from './main';

export const GRID_SIZE = 4;

const removeModifierClass = (domNode) => {
  const classModifier = domNode.classList.item(1);

  if (classModifier) {
    domNode.classList.remove(classModifier);
  }
};

export const fillCell = (cell, value) => {
  removeModifierClass(cell);

  cell.textContent = value;
  cell.classList.add(`field-cell--${value}`);
};

export const clearCells = () => {
  [...cells].forEach((cell) => {
    cell.textContent = null;
    removeModifierClass(cell);
  });
};

export const createEmptyCell = () => {
  const cell = document.createElement('td');

  cell.classList.add('field-cell');

  return cell;
};

export const addRandomCell = () => {
  const randomCell
    = rows[getRandomCell(GRID_SIZE)].children[getRandomCell(GRID_SIZE)];
  const value = Math.random() < 0.1 ? 4 : 2;

  if (randomCell.textContent) {
    addRandomCell();
  } else {
    fillCell(randomCell, value);
  }
};

export const handleButtonChange = (targetedButton, newButtonType) => {
  removeModifierClass(targetedButton);

  targetedButton.classList.add(newButtonType.toLowerCase());
  targetedButton.textContent = newButtonType;
};

export const updateBoard = (newCells) => {
  [...rows].forEach((row, i) => {
    row.innerHTML = '';
    row.append(...newCells[i]);
  });

  addRandomCell();
};
