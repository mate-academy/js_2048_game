const toRowArray = (singleArray) => {
  const newArray = [];

  for (let i = 0; i < 4; i++) {
    const row = [];

    for (let j = i * 4; j < 4 + i * 4; j++) {
      row.push(singleArray[j]);
    }
    newArray.push(row);
  }

  return newArray;
};

const toColumnArray = (singleArray) => {
  const newArray = [];

  for (let i = 0; i < 4; i++) {
    const column = [];

    for (let j = i; j < 16; j += 4) {
      column.push(singleArray[j]);
    }
    newArray.push(column);
  }

  return newArray;
};

const rowToSingleArray = (rowArray) => {
  let newArray = [];

  for (const row of rowArray) {
    newArray = [...newArray, ...row];
  }

  return newArray;
};

const columnsToSingleArray = (columnArray) => {
  const newArray = [];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      newArray[ j * 4 + i ] = columnArray[i][j];
    }
  }

  return newArray;
};

export { toRowArray, toColumnArray, rowToSingleArray, columnsToSingleArray };
