export function rotateField(tabel, size) {
  const rotatedField = [];

  for (let c = 0; c < size; c++) {
    const row = [tabel[0][c], tabel[1][c], tabel[2][c], tabel[3][c]];
    rotatedField.push(row);
  }

  return rotatedField;
};

export function checkPossibleMoves(field, size) {
  let possibleMoves = [];

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (possibleMoves.length === 4) {
        break;
      }

      const center = field[r][c];
      
      if (center !== 0) {
        console.log(center, 'center')
        const Up = (r > 0) ? field[r - 1][c] : null;
        const Down = (r < size - 1) ? field[r + 1][c] : null;
        const Left = (c > 0) ? field[r][c - 1] : null;
        const Right = (c < size - 1) ? field[r][c + 1] : null;

        if (Left === 0 || Left === center) {
        console.log(Left, 'left')

          !possibleMoves.includes('ArrowLeft') && possibleMoves.push('ArrowLeft');
        }
  
        if (Right === 0 || Right === center) {
          console.log(Right, 'Right')
          !possibleMoves.includes('ArrowRight') && possibleMoves.push('ArrowRight');
        }
  
        if (Up === 0 || Up === center) {
          console.log(Up, 'Up')
          !possibleMoves.includes('ArrowUp') && possibleMoves.push('ArrowUp');
        }
  
        if (Down === 0 || Down === center) {
          console.log(Down, 'Down')
          !possibleMoves.includes('ArrowDown') && possibleMoves.push('ArrowDown');
        }
      }
    }
  }

  return possibleMoves;
}
