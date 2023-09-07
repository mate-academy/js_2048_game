export default class PlayingField {
  constructor() {
    this.field = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
  }

  start() {
    this.field[this.randomIndex()][this.randomIndex()] = this.randomNumber();

    this.generateExtraNumber();
  }

  randomNumber() {
    return Math.random() < 0.5 ? 2 : 4;
  }

  randomIndex(lengthOfLine = 4) {
    return Math.floor(Math.random() * lengthOfLine);
  }

  generateExtraNumber() {
    const emptyValues = [];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.field[i][j] === 0) {
          emptyValues.push([i, j]);
        }
      }
    }

    const randPairs = emptyValues[this.randomIndex(emptyValues.length)];

    this.field[randPairs[0]][randPairs[1]] = this.randomNumber();
  }

  transpose(matrix) {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
  }

  countScore(number) {
    this.score += number;
  }

  uncorrectSwipe(copyField) {
    let result = true;

    for (let i = 0; i < copyField.length; i++) {
      if (copyField[i] !== this.field.flat()[i]) {
        result = false;
      }
    }

    if (result === true) {
      return false;
    }

    return true;
  }

  left() {
    try {
      const copyField = [...this.field.flat()];

      for (let i = 0; i < 4; i++) {
        this.field[i] = this.field[i].filter(el => el !== 0);

        if (this.field[i].length < 4) {
          for (let j = this.field[i].length; j < 4; j++) {
            this.field[i].push(0);
          }
        }
      }

      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          if (this.field[i][j] === this.field[i][j + 1]) {
            this.field[i][j] *= 2;
            this.countScore(this.field[i][j]);
            this.field[i][j + 1] = 0;
            this.field[i] = this.field[i].filter(el => el !== 0);

            if (this.field[i].length < 4) {
              for (let k = this.field[i].length; k < 4; k++) {
                this.field[i].push(0);
              }
            }
          }
        }
      }

      if (this.uncorrectSwipe(copyField) === true) {
        this.generateExtraNumber();
      } else {

      }
    } catch (e) {

    }
  }

  right() {
    try {
      const copyField = [...this.field.flat()];

      for (let i = 0; i < 4; i++) {
        this.field[i] = this.field[i].filter(el => el !== 0);

        if (this.field[i].length < 4) {
          for (let j = this.field[i].length; j < 4; j++) {
            this.field[i].unshift(0);
          }
        }
      }

      for (let i = 0; i < 4; i++) {
        for (let j = 3; j >= 0; j--) {
          if (this.field[i][j] === this.field[i][j - 1]) {
            this.field[i][j] *= 2;
            this.countScore(this.field[i][j]);
            this.field[i][j - 1] = 0;
            this.field[i] = this.field[i].filter(el => el !== 0);

            if (this.field[i].length < 4) {
              for (let k = this.field[i].length; k < 4; k++) {
                this.field[i].unshift(0);
              }
            }
          }
        }
      }

      if (this.uncorrectSwipe(copyField) === true) {
        this.generateExtraNumber();
      } else {

      }
    } catch (el) {}
  }

  up() {
    this.field = this.transpose(this.field);

    this.left();

    this.field = this.transpose(this.field);
  }

  down() {
    this.field = this.transpose(this.field);

    this.right();

    this.field = this.transpose(this.field);
  }
}
