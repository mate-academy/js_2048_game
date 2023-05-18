import { Board } from '../../types/Board';
import { FieldRow } from '../FieldRow/FieldRow';

interface Props {
  board: Board;
}

export const GameField: React.FC<Props> = ({ board }) => (
  <table className="game-field">
    <tbody>
      {board.map((row) => (
        <FieldRow row={row} key={row[0].key} />
      ))}
    </tbody>
  </table>
);
