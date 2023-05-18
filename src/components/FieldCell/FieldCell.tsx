import { Cell } from '../../types/Cell';

interface Props {
  cell: Cell;
}

export const FieldCell: React.FC<Props> = ({ cell }) => (
  <td className={`field-cell field-cell--${cell.value}`}>{cell.value || ''}</td>
);
