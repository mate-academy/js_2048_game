'use strict';

import { ANIMATION_DURATION } from '../scripts/main';

class AnimationManager {
  constructor(cells) {
    this.cells = cells;
    this.actions = [];
    this.isMoving = false;
  }

  calculateAction(prevDash, newDash, direction) {
    const size = 4;

    this.actions = [];

    // Helper to get lines based on transpose flag
    const getLines = (grid, transpose) => {
      const lines = [];

      for (let i = 0; i < size; i++) {
        const line = [];

        for (let j = 0; j < size; j++) {
          line.push(transpose ? grid[j][i] : grid[i][j]);
        }
        lines.push(line);
      }

      return lines;
    };

    const isTranspose = direction === 'up' || direction === 'down';
    const reverse = direction === 'right' || direction === 'down';

    const prevLines = getLines(prevDash, isTranspose);
    const newLines = getLines(newDash, isTranspose);

    for (let row = 0; row < size; row++) {
      const prevLine = [...prevLines[row]];
      const newLine = [...newLines[row]];

      if (reverse) {
        prevLine.reverse();
        newLine.reverse();
      }

      // Step 1: Extract non-zero values and track original positions
      const originalIndices = [];

      for (let j = 0; j < size; j++) {
        const val = prevLine[j];

        if (val !== 0) {
          const indexInLine = reverse ? size - 1 - j : j;
          const oldRow = isTranspose ? indexInLine : row;
          const oldCol = isTranspose ? row : indexInLine;

          originalIndices.push({ value: val, oldRow, oldCol });
        }
      }

      // Step 2: Reconstruct how new line was formed
      let targetIndex = 0;
      let i = 0;

      while (i < originalIndices.length) {
        const from1 = originalIndices[i];
        const from2 = originalIndices[i + 1];

        const newIndex = reverse ? size - 1 - targetIndex : targetIndex;
        const newRow = isTranspose ? newIndex : row;
        const newCol = isTranspose ? row : newIndex;

        if (from2 && from1.value === from2.value) {
          // Merge both tiles into one
          this.addAction(
            from1.oldRow * size + from1.oldCol,
            from1.oldRow,
            from1.oldCol,
            newRow,
            newCol,
            'merge',
          );

          this.addAction(
            from2.oldRow * size + from2.oldCol,
            from2.oldRow,
            from2.oldCol,
            newRow,
            newCol,
            'merge',
          );

          i += 2;
          targetIndex++;
        } else {
          // Move single tile
          if (from1.oldRow !== newRow || from1.oldCol !== newCol) {
            this.addAction(
              from1.oldRow * size + from1.oldCol,
              from1.oldRow,
              from1.oldCol,
              newRow,
              newCol,
              'move',
            );
          }

          i++;
          targetIndex++;
        }
      }
    }
  }

  /**
   * Add actions to the this.actions
   */
  addAction(index, oldRow, oldCol, newRow, newCol, type) {
    // Type should be either 'move' or 'merge'
    this.actions.push({
      cellIndex: index,
      oldRow: oldRow,
      oldCol: oldCol,
      newRow: newRow,
      newCol: newCol,
      type: type,
    });
  }

  /**
   * Runs HTML animation for each cell
   */
  updateHtmlAnimation() {
    this.isMoving = true;

    for (const action of this.actions) {
      const cell = this.cells[action.oldRow][action.oldCol];
      const type = action.type;

      if (type === 'pop') {
        cell.classList.add('pop');
        continue;
      }

      const direction =
        action.oldRow === action.newRow ? 'horizontally' : 'vertically';

      const oldPos =
        direction === 'horizontally' ? action.oldCol : action.oldRow;
      const newPos =
        direction === 'horizontally' ? action.newCol : action.newRow;

      cell.classList.add(`${type}-${direction}-${oldPos + 1}-${newPos + 1}`);
    }

    setTimeout(() => {
      this.clearAnimationClasses();
    }, ANIMATION_DURATION);
  }

  /**
   * Clear animation classes and clear this.actions
   */
  clearAnimationClasses() {
    for (const action of this.actions) {
      const cell = this.cells[action.oldRow][action.oldCol];
      const type = action.type;

      for (let i = 0; i < cell.classList.length; i++) {
        const className = cell.classList[i];

        if (className.startsWith(type)) {
          cell.classList.remove(className);
        }
      }
    }

    this.actions = [];
    this.isMoving = false;
  }
}

module.exports = AnimationManager;
