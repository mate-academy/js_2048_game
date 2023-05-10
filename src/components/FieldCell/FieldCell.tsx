import { Cell } from '../../types/Cell';

interface Props {
  cell: Cell;
}

export const FieldCell: React.FC<Props> = ({ cell }) => {
  return <td className="field-cell">{cell.value || ''}</td>;
};
