import { Cell } from '../../types/Cell';
import { FieldCell } from '../FieldCell/FieldCell';

interface Props {
  row: Cell[];
}
export const FieldRow: React.FC<Props> = ({ row }) => {
  return (
    <tr className="field-row">
      {row.map((cell) => (
        <FieldCell cell={cell} key={cell.key} />
      ))}
    </tr>
  );
};
