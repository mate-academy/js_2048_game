import cn from 'classnames';
import { cloneDeep } from 'lodash';
import { useState, useMemo, useEffect } from 'react';
import { GameField } from './components/GameField/GameField';
import { GameHeader } from './components/GameHeader/GameHeader';
import { DEFAULT_BOARD } from './constants/game.constants';
import { Board } from './types/Board';
import { addRandomNumToBoard } from './utils/addRandomNumToBoard';
import { calculateScore } from './utils/calculateScore';
import { checkIsLosing } from './utils/checkIsLosing';
import { checkIsWinning } from './utils/checkIsWinning';
import {
  handleSlideDown,
  handleSlideLeft,
  handleSlideRight,
  handleSlideUp,
} from './utils/slideBoard';

const App: React.FC = () => {
  const [board, setBoard] = useState<Board>(cloneDeep(DEFAULT_BOARD));
  const [isGameStarted, setIsGameStarted] = useState(false);

  const score = useMemo(() => calculateScore(board), [board]);

  const isLosing = useMemo(() => checkIsLosing(board), [board]);
  const isWinning = useMemo(() => checkIsWinning(board), [board]);

  const handleStartGame = () => {
    const defaultBoard = cloneDeep(DEFAULT_BOARD);

    const boardWithNum = addRandomNumToBoard(defaultBoard);

    setBoard(boardWithNum);
    setIsGameStarted(true);
  };

  const handleArrowPress = (event: KeyboardEvent) => {
    const isArrowButtonClicked = event.code.includes('Arrow');

    const isGameBlocked = !isGameStarted || isWinning || !isArrowButtonClicked;

    if (isGameBlocked) {
      return;
    }

    const clonedBoard = cloneDeep(board);

    let updatedBoard: Board = clonedBoard;

    switch (event.code) {
      case 'ArrowUp':
        updatedBoard = handleSlideUp(clonedBoard);
        break;
      case 'ArrowDown':
        updatedBoard = handleSlideDown(clonedBoard);
        break;
      case 'ArrowRight':
        updatedBoard = handleSlideRight(clonedBoard);
        break;
      case 'ArrowLeft':
        updatedBoard = handleSlideLeft(clonedBoard);
        break;
      default:
    }

    updatedBoard = addRandomNumToBoard(updatedBoard);

    setBoard(updatedBoard);
  };

  useEffect(() => {
    document.addEventListener('keyup', handleArrowPress);

    return () => {
      document.removeEventListener('keyup', handleArrowPress);
    };
  }, [isGameStarted, board]);

  return (
    <div className="container">
      <GameHeader
        score={score}
        isGameStarted={isGameStarted}
        onStartGame={handleStartGame}
      />

      <GameField board={board} />

      <div className="message-container">
        <p className={cn('message message-lose', { hidden: !isLosing })}>
          You lose! Restart the game?
        </p>

        {isWinning && (
          <p
            className={cn('message message-win', {
              hidden: !isWinning,
            })}
          >
            Winner! Congrats! You did it!
          </p>
        )}

        <p className={cn('message message-start', { hidden: isGameStarted })}>
          Press &quot;Start&quot; to begin game. Good luck!
        </p>
      </div>
    </div>
  );
};

export default App;
