'use strict';

// const Cell = require('../modules/Cell.class');
// const Tile = require('../modules/Tile.class');

class Game {
  static gameStatus = {
    idle: 'idle',
    playing: 'playing',
    win: 'win',
    lose: 'lose',
  };

  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.initialState = initialState;
    // const cellElements = [...document.querySelectorAll('.field-cell')];
    this.score = 0;
    //this.gameBoard = document.querySelector('.game-field');
    this.gameStatus = Game.gameStatus.idle;
    this.state = initialState.map((row) => [...row]);

    // this.cells = cellElements.map((cellElement, index) => {
    //   return new Cell(cellElement, index % 4, Math.floor(index / 4));
    // });
  }

  // get cellsByColumn() {
  //   return this.cells.reduce((cellGrid, cell) => {
  //     cellGrid[cell.x] = cellGrid[cell.x] || [];
  //     cellGrid[cell.x][cell.y] = cell;
  //
  //     return cellGrid;
  //   }, []);
  // }
  //
  // get cellsByRow() {
  //   return this.cells.reduce((cellGrid, cell) => {
  //     cellGrid[cell.y] = cellGrid[cell.y] || [];
  //     cellGrid[cell.y][cell.x] = cell;
  //
  //     return cellGrid;
  //   }, []);
  // }

  // get emptyCells() {
  //   return this.cells.filter((cell) => cell.tile == null);
  // }
  //

  randomEmptyCell(emptyCells) {
    return Math.floor(Math.random() * emptyCells.length);
  }

  addRandomTile() {
    const emptyCells = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (this.state[row][col] === 0) {
          emptyCells.push([row, col]);
        }
      }
    }

    if (emptyCells.length > 0) {
      const [row, col] =
        emptyCells[Math.floor(Math.random() * emptyCells.length)];

      this.state[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  }

  // moveUp() {
  //   return this.slideTiles(this.cellsByColumn);
  // }

  // moveDown() {
  //   return this.slideTiles(
  //     this.cellsByColumn.map((column) => [...column].reverse()),
  //   );
  // }
  //
  // moveLeft() {
  //   return this.slideTiles(this.cellsByRow);
  // }
  //
  // moveRight() {
  //   return this.slideTiles(this.cellsByRow.map((row) => [...row].reverse()));
  // }
  //
  // canMove() {
  //   return (
  //     this.canMoveInDirection(this.cellsByColumn) ||
  //     this.canMoveInDirection(
  //       this.cellsByColumn.map((column) => [...column].reverse()),
  //     ) ||
  //     this.canMoveInDirection(this.cellsByRow) ||
  //     this.canMoveInDirection(this.cellsByRow.map((row) => [...row].reverse()))
  //   );
  // }
  //
  // canMoveInDirection(cells) {
  //   return cells.some((group) => {
  //     return group.some((cell, index) => {
  //       if (index === 0 || cell.tile == null) {
  //         return false;
  //       }
  //
  //       const moveToCell = group[index - 1];
  //
  //       return moveToCell.canAccept(cell.tile);
  //     });
  //   });
  // }

  //TODO need to remake it

  // slideTiles(cells) {
  //   return Promise.all(
  //     cells.map((group) => {
  //       const promises = [];
  //
  //       for (let i = 1; i < group.length; i++) {
  //         const cell = group[i];
  //
  //         if (cell.tile == null) {
  //           continue;
  //         }
  //
  //         let lastValidCell;
  //
  //         for (let j = i - 1; j >= 0; j--) {
  //           const moveToCell = group[j];
  //
  //           if (!moveToCell.canAccept(cell.tile)) {
  //             break;
  //           }
  //           lastValidCell = moveToCell;
  //         }
  //
  //         if (lastValidCell != null) {
  //           promises.push(cell.tile.waitForTransition());
  //
  //           if (lastValidCell.tile != null) {
  //             lastValidCell.mergeTile = cell.tile;
  //           } else {
  //             lastValidCell.tile = cell.tile;
  //           }
  //           // Use the score callback to update the score when merging tiles
  //           lastValidCell.mergeTiles(this.updateScore.bind(this));
  //
  //           cell.tile = null;
  //         }
  //       }
  //     }),
  //   );
  // }

  // updateScore(value = 0) {
  //   this.score += value;
  //
  //   // Update your score display here, for example:
  //   document.querySelector('.game-score').textContent = `${this.score}`;
  //
  //   if (this.score >= 2048) {
  //     this.gameStatus = 'win';
  //   } else if (!this.canMove()) {
  //     this.gameStatus = 'lose';
  //   } else {
  //     this.gameStatus = 'playing';
  //   }
  // }

  getScore() {
    // return this.cells.reduce((total, cell) => {
    //   if (cell.tile) {
    //     return total + cell.tile;
    //   }
    //
    //   return total;
    // }, 0);
    return this.score;
  }

  getState() {
    return this.state;
  }

  getStatus() {
    return this.gameStatus;
  }

  start() {
    if (this.gameStatus === Game.gameStatus.idle) {
      this.gameStatus = Game.gameStatus.playing;
      this.addRandomTile();
      this.addRandomTile();
    }
  }

  restart() {
    this.score = 0;
    this.state = this.initialState;
    this.gameStatus = Game.gameStatus.idle;
  }

  // restart() {
  //   this.cells.forEach((cell) => {
  //     if (cell.tile) {
  //       cell.tile.remove();
  //       cell.tile = null;
  //     }
  //
  //     if (cell.mergeTile) {
  //       cell._mergeTile = null;
  //     }
  //   });
  //
  //   this.addRandomTile();
  //   this.addRandomTile();
  //   // update score
  //   this.updateScore();
  // }
}

module.exports = Game;
