import { useState, useMemo, useEffect } from 'react';
import { GameField } from './components/GameField/GameField';
import { GameHeader } from './components/GameHeader/GameHeader';
import { DEFAULT_BOARD } from './constants/game.constants';

function App() {
  const [board] = useState(DEFAULT_BOARD);
  const [isGameStarted, setIsGameStarted] = useState(false);

  const score = useMemo(() => {
    return board.reduce((totalAcc, row) => {
      return totalAcc + row.reduce((rowAcc, cell) => rowAcc + cell.value, 0);
    }, 0);
  }, [board]);

  const isLosing = useMemo(() => {
    return board.every((row) => {
      return row.every((cell) => cell.value !== 0);
    });
  }, [board]);

  const isWinning = useMemo(() => {
    return board.some((row) => {
      return row.some((cell) => cell.value === 2048);
    });
  }, [board]);

  const handleStartGame = () => {
    setIsGameStarted(true);
  };

  const handleArrowPress = (event: KeyboardEvent) => {
    if (!isGameStarted) {
      return;
    }

    switch (event.code) {
      case 'ArrowUp':
        // eslint-disable-next-line no-console
        console.log('up');
        break;
      case 'ArrowDown':
        // eslint-disable-next-line no-console
        console.log('down');
        break;
      case 'ArrowRight':
        // eslint-disable-next-line no-console
        console.log('right');
        break;
      case 'ArrowLeft':
        // eslint-disable-next-line no-console
        console.log('left');
        break;
      default:
    }
  };

  useEffect(() => {
    document.addEventListener('keyup', handleArrowPress);

    return () => {
      document.removeEventListener('keyup', handleArrowPress);
    };
  }, [isGameStarted]);

  return (
    <div className="container">
      <GameHeader
        score={score}
        isGameStarted={isGameStarted}
        onStartGame={handleStartGame}
      />

      <GameField board={board} />

      <div className="message-container">
        {isLosing && (
          <p className="message message-lose hidden">
            You lose! Restart the game?
          </p>
        )}

        {isWinning && (
          <p className="message message-win hidden">
            Winner! Congrats! You did it!
          </p>
        )}

        {!isGameStarted && (
          <p className="message message-start">
            Press &quot;Start&quot; to begin game. Good luck!
          </p>
        )}
      </div>
    </div>
  );
}

export default App;
