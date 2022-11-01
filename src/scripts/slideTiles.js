function slideTiles(cells) {
  cells.map(group => {
    for (let i = 1; i < group.length; i++) {
      const cell = group[i];

      if (!cell.tile) {
        continue;
      }

      let lastValidCell;

      for (let j = i - 1; j >= 0; j--) {
        const moveToCell = group[j];

        if (!moveToCell.canAccept(cell.tile)) {
          break;
        }
        lastValidCell = moveToCell;
      }

      if (lastValidCell) {
        if (lastValidCell._tile) {
          lastValidCell.mergeTile = cell.tile;
        } else {
          lastValidCell.tile = cell.tile;
        }
        cell.tile = null;
      }
    }
  });
}

function canMove(cells) {
  return cells.some(group => {
    return group.some((cell, index) => {
      if (index === 0) {
        return false;
      }

      if (!cell.tile) {
        return false;
      }

      const moveToCell = group[index - 1];

      return moveToCell.canAccept(cell.tile);
    });
  });
}

module.exports = {
  slideTiles,
  canMove,
};
