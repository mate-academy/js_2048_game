
import {
  moveAllToDownWithSumm,
  moveAllToLeftWithSumm,
  moveAllToRightWithSumm,
  moveAllToUpWithSumm,
  setRandomValue,
  getEmptyCellCount,
  isWin,
  isLose,
  copyField,
  isArraysDifferent,
} from './game_logic';

export class Game {
  render() {}

  constructor(render) {
    this.scoreCount = 0;
    this.play = 'NOT_STARTED'; // 'NOT_STARTED' 'STARTED' 'WIN' 'DEFEAT'

    this.field = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];

    this.render = render;
    this.render.bind(this);
    this.startRestartGame.bind(this);
    this.nextStep.bind(this);
    this.move.bind(this);
  }

  startRestartGame() {
    if (this.play === 'STARTED'
    || this.play === 'DEFEAT'
    || this.play === 'WIN'
    ) {
      this.field = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
      this.scoreCount = 0;
    }

    this.play = 'STARTED';

    setRandomValue(this.field);
    setRandomValue(this.field);

    this.render();
  }

  nextStep(previousField) {
    const win = isWin(this.field);

    if (win === true) {
      this.play = 'WIN';
    } else {
      if (isLose(this.field)) {
        this.play = 'DEFEAT';

        return;
      }

      if (getEmptyCellCount(this.field) > 0) {
        if (isArraysDifferent(previousField, this.field)) {
          setRandomValue(this.field);
        }

        if (isLose(this.field)) {
          this.play = 'DEFEAT';
        }
      }
    }
  }

  move(direction) {
    const previousField = copyField(this.field);

    if (direction === 'ArrowUp') {
      const addedScore = moveAllToUpWithSumm(this.field);

      this.scoreCount += addedScore;

      this.nextStep(previousField);
    }

    if (direction === 'ArrowDown') {
      const addedScore = moveAllToDownWithSumm(this.field);

      this.scoreCount += addedScore;

      this.nextStep(previousField);
    }

    if (direction === 'ArrowRight') {
      const addedScore = moveAllToRightWithSumm(this.field);

      this.scoreCount += addedScore;

      this.nextStep(previousField);
    }

    if (direction === 'ArrowLeft') {
      const addedScore = moveAllToLeftWithSumm(this.field);

      this.scoreCount += addedScore;

      this.nextStep(previousField);
    }

    this.render();
  }
}
