import { Cell } from '../../types/Cell';
import { FieldRow } from '../FieldRow/FieldRow';

interface Props {
  board: Array<Cell[]>;
}

export const GameField: React.FC<Props> = ({ board }) => {
  return (
    <table className="game-field">
      <tbody>
        {board.map((row) => (
          <FieldRow row={row} key={row[0].key} />
        ))}
      </tbody>
    </table>
  );
};
