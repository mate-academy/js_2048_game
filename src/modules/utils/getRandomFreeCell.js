function getRandomFreeCell(freeCells) {
  if (freeCells.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * freeCells.length);

  return freeCells[randomIndex];
}

export default getRandomFreeCell;
