import { BaseClass } from './baseClass';
import { FIELD_SIZE } from './constants';

export class Move extends BaseClass {
  goLeft() {
    for (let rowIndex = 0; rowIndex < FIELD_SIZE; rowIndex++) {
      let index = 0;

      for (let cellIndex = 0; cellIndex < FIELD_SIZE; cellIndex++) {
        const cell = this.fields[rowIndex][cellIndex];
        const prevCell = this.fields[rowIndex][index - 1];

        if (!cell) {
          continue;
        }

        if (index && prevCell === cell) {
          const value = cell * 2;

          this.fields[rowIndex][index - 1] = value;
          this.fields[rowIndex][cellIndex] = 0;

          this.score += value;
        } else {
          this.fields[rowIndex][index] = cell;

          if (index !== cellIndex) {
            this.fields[rowIndex][cellIndex] = 0;
          }
          index++;
        }
      }
    }
  }

  goRight() {
    for (let rowIndex = FIELD_SIZE - 1; rowIndex >= 0; rowIndex--) {
      let index = FIELD_SIZE - 1;

      for (let cellIndex = FIELD_SIZE - 1; cellIndex >= 0; cellIndex--) {
        const cell = this.fields[rowIndex][cellIndex];
        const prevCell = this.fields[rowIndex][index + 1];

        if (!cell) {
          continue;
        }

        if (index !== FIELD_SIZE - 1 && prevCell === cell) {
          const value = cell * 2;

          this.fields[rowIndex][index + 1] = value;
          this.fields[rowIndex][cellIndex] = 0;

          this.score += value;
        } else {
          this.fields[rowIndex][index] = cell;

          if (index !== cellIndex) {
            this.fields[rowIndex][cellIndex] = 0;
          }
          index--;
        }
      }
    }
  }

  goUp() {
    for (let cellIndex = 0; cellIndex < FIELD_SIZE; cellIndex++) {
      let index = 0;

      for (let columnIndex = 0; columnIndex < FIELD_SIZE; columnIndex++) {
        const cell = this.fields[columnIndex][cellIndex];
        const prevCell = index ? this.fields[index - 1][cellIndex] : undefined;

        if (!cell) {
          continue;
        }

        if (index && prevCell === cell) {
          const value = cell * 2;

          this.fields[index - 1][cellIndex] = value;
          this.fields[columnIndex][cellIndex] = 0;

          this.score += value;
        } else {
          this.fields[index][cellIndex] = cell;

          if (index !== columnIndex) {
            this.fields[columnIndex][cellIndex] = 0;
          }
          index += 1;
        }
      }
    }
  }

  goDown() {
    for (let cellIndex = FIELD_SIZE - 1; cellIndex >= 0; cellIndex--) {
      let index = FIELD_SIZE - 1;

      for (let columnIndex = FIELD_SIZE - 1; columnIndex >= 0; columnIndex--) {
        const cell = this.fields[columnIndex][cellIndex];
        const prevCell
          = index !== FIELD_SIZE - 1 ? this.fields[index + 1][cellIndex] : null;

        if (!cell) {
          continue;
        }

        if (index !== FIELD_SIZE - 1 && prevCell === cell) {
          const value = cell * 2;

          this.fields[index + 1][cellIndex] = value;
          this.fields[columnIndex][cellIndex] = 0;

          this.score += value;
        } else {
          this.fields[index][cellIndex] = cell;

          if (index !== columnIndex) {
            this.fields[columnIndex][cellIndex] = 0;
          }
          index -= 1;
        }
      }
    }
  }
}
