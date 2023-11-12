import { createCell } from './Cell';
import { createCard } from './Card';

export const BOARD_SIZE = 4;

const WEIGHT_TO_WIN_GAME = 2048;

export class Board extends Array {
  constructor(boardElement, scoreCounter) {
    super();

    this.boardElement = boardElement;
    this.scoreCounter = scoreCounter;

    this.fillBoardThis = this.fillBoard.bind(this);
    document.addEventListener('DOMContentLoaded', this.fillBoardThis);
  }

  fillBoard() {
    const allCells = document.querySelectorAll('.cell');

    for (let i = 0; i < allCells.length; i++) {
      const cell = createCell(allCells[i], i);

      this.push(cell);
    }
  };

  resetLinkedCards() {
    this.forEach(cell => {
      cell.resetLinkedCard();
    });
  };

  getRandomEmptyCell() {
    const emptyCells = this.filter(cell => cell.isEmpty());

    if (emptyCells.length === 0) {
      return;
    }

    const randomIndex = Math.floor(Math.random() * emptyCells.length);
    const randomCell = emptyCells[randomIndex];

    return randomCell;
  };

  clear() {
    this.resetLinkedCards();

    const cardsToRemove = [...this.boardElement.childNodes]
      .filter(child => child.classList && child.classList.contains('card'));

    cardsToRemove.forEach(card => {
      this.boardElement.removeChild(card);
    });
  };

  spawnCard() {
    const emptyCell = this.getRandomEmptyCell();

    if (emptyCell === undefined) {
      return;
    }

    const card = createCard();

    card.setXY(emptyCell.x, emptyCell.y);

    emptyCell.linkCard = card;

    this.boardElement.appendChild(card);
  };

  firstSpawn(amount = 1) {
    for (let i = 0; i < amount; i++) {
      this.spawnCard();
    }
  };

  getGroupForCell(cell, direction) {
    if (direction === 'Up' || direction === 'Down') {
      return this
        .filter(cell2 => cell.x === cell2.x)
        .sort((cell1, cell2) => cell1.y - cell2.y);
    }

    if (direction === 'Left' || direction === 'Right') {
      return this
        .filter(cell2 => cell.y === cell2.y)
        .sort((cell1, cell2) => cell1.x - cell2.x);
    }

    throw new Error('Error, in shift method you can use'
      + 'only this value: Up, Down, Right, Left'
    );
  };

  getCellForMerge(startCell, direction) {
    const thisGroup = this.getGroupForCell(startCell, direction);

    const cellIndex = thisGroup
      .findIndex(cell => cell.y === startCell.y && cell.x === startCell.x);

    switch (direction) {
      case 'Up':
        for (let y = cellIndex - 1; y >= 0; y--) {
          const cell = thisGroup[y];

          if (cell.isEmpty()) {
            continue;
          }

          if (cell.canMergeWith(startCell)) {
            return cell;
          }
          break;
        } break;
      case 'Down':
        for (let y = cellIndex + 1; y < thisGroup.length; y++) {
          const cell = thisGroup[y];

          if (cell.isEmpty()) {
            continue;
          }

          if (cell.canMergeWith(startCell)) {
            return cell;
          }
          break;
        } break;
      case 'Left':
        for (let x = cellIndex - 1; x >= 0; x--) {
          const cell = thisGroup[x];

          if (cell.isEmpty()) {
            continue;
          }

          if (cell.canMergeWith(startCell)) {
            return cell;
          }
          break;
        } break;
      case 'Right':
        for (let x = cellIndex + 1; x < thisGroup.length; x++) {
          const cell = thisGroup[x];

          if (cell.isEmpty()) {
            continue;
          }

          if (cell.canMergeWith(startCell)) {
            return cell;
          }
          break;
        } break;
      default:
        throw new Error('Error, in shift method you can use'
          + 'only this value: Up, Down, Right, Left'
        );
    }

    return null;
  };

  isCellOnPath(cell, target, direction) {
    if (!cell.isEmpty()) {
      return false;
    }

    switch (direction) {
      case 'Up':
        return cell.x === target.x && cell.y < target.y;
      case 'Down':
        return cell.x === target.x && cell.y > target.y;
      case 'Left':
        return cell.y === target.y && cell.x < target.x;
      case 'Right':
        return cell.y === target.y && cell.x > target.x;
      default:
        throw new Error('Error, in shift method you can use'
          + 'only this value: Up, Down, Right, Left'
        );
    }
  };

  getCellForMove(cellWithCard, direction) {
    let targetCoords = {
      x: cellWithCard.x, y: cellWithCard.y,
    };
    let lastFreeCell = null;

    for (const cell of this) {
      if (this.isCellOnPath(cell, targetCoords, direction)) {
        lastFreeCell = cell;

        targetCoords = {
          x: cell.x, y: cell.y,
        };
      }
    }

    return lastFreeCell;
  };

  getCellsInOrder(direction) {
    const sortedCells = [...this];

    switch (direction) {
      case 'Up':
        return sortedCells;
      case 'Down':
        return sortedCells.reverse();
      case 'Left':
        return sortedCells.sort((cell1, cell2) =>
          cell1.y - cell2.y || cell1.x - cell2.x
        );
      case 'Right':
        return sortedCells.sort((cell1, cell2) =>
          cell1.y - cell2.y || cell2.x - cell1.x
        );
      default:
        throw new Error('Error,'
          + 'in getCellsInOrder method you can use'
          + 'only this value: Up, Down, Right, Left'
        );
    }
  };

  getTargetCell(startCell, direction) {
    return this.getCellForMerge(startCell, direction)
      || this.getCellForMove(startCell, direction);
  };

  swipe(direction) {
    const cellsWithCard = this
      .getCellsInOrder(direction)
      .filter(cell => !cell.isEmpty());
    let needSpawn = false;
    let scoresAmount = 0;

    for (const cell of cellsWithCard) {
      const targetCell = this.getTargetCell(cell, direction);

      if (targetCell === null) {
        continue;
      }

      needSpawn = true;

      if (targetCell.canMergeWith(cell)) {
        targetCell.mergeWith(cell);
        scoresAmount += targetCell.linkCard.weight;

        if (targetCell.linkCard.weight >= WEIGHT_TO_WIN_GAME) {
          return 'Win';
        }

        continue;
      }

      const card = cell.linkCard;

      card.setXY(targetCell.x, targetCell.y);
      targetCell.linkCard = card;
      cell.resetLinkedCard();
    }

    this.forEach(cell => {
      cell.wasMerged = false;
    });

    if (scoresAmount > 0) {
      this.scoreCounter.add(scoresAmount);
    }

    if (needSpawn) {
      this.spawnCard();
    }

    return this.continueGame();
  };

  haveTargetCell(cell) {
    if (this.getTargetCell(cell, 'Up')) {
      return true;
    }

    if (this.getTargetCell(cell, 'Down')) {
      return true;
    }

    if (this.getTargetCell(cell, 'Right')) {
      return true;
    }

    if (this.getTargetCell(cell, 'Left')) {
      return true;
    }

    return false;
  }

  continueGame() {
    const haveEmpty = this.getRandomEmptyCell() !== undefined;

    if (haveEmpty) {
      return 'continue';
    }

    for (const cell of this) {
      if (this.haveTargetCell(cell)) {
        return 'continue';
      }
    }

    return 'Lose';
  }
}
