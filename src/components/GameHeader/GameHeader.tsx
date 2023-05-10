interface Props {
  score: number;
  isGameStarted: boolean;
  onStartGame: () => void;
}

export const GameHeader: React.FC<Props> = ({
  score,
  isGameStarted,
  onStartGame,
}) => {
  return (
    <div className="game-header">
      <h1>2048</h1>
      <div className="controls">
        <p className="info">
          Score:
          <span className="game-score">{score}</span>
        </p>
        <button type="button" className="button start" onClick={onStartGame}>
          {isGameStarted ? 'Restart' : 'Start'}
        </button>
      </div>
    </div>
  );
};
