export class Game2048 {
  constructor(size = 4) {
    this.size = size;
    this.score = 0;

    this.gameField = Array.from({ length: this.size },
      () => Array(this.size).fill(0));
  };

  removeZeros(arr) {
    return arr.filter(row => row !== 0);
  }
}
