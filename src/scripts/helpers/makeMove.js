
import { checkLose } from './checkLose';
import { resetBeforeMove, afterMove } from './beforeAfterMove';
import { realizeAlgorithmBy } from './realizeAlgorithmBy';

export const makeMove = (firstLoopParamIsRow, secondLoopIsIncrease) => {
  resetBeforeMove();
  realizeAlgorithmBy(firstLoopParamIsRow, secondLoopIsIncrease);
  afterMove();
  checkLose();
};
