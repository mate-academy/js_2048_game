
import { letVariables } from '../main';
import { addNewTile } from '../helpers/addNewTile';

export const resetBeforeMove = () => {
  letVariables.moves = 0;
  letVariables.dontAddCells.map(cell => cell.classList.remove('notAdd'));
};

export const afterMove = () => {
  if (letVariables.moves > 0) {
    addNewTile();
    letVariables.dontAddCells = [...document.querySelectorAll('.notAdd')];
  }
};
