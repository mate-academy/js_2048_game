function shiftRow(array, shiftLeft) {
  const result = array.filter((num) => num !== 0);
  let zeroCount = array.length - result.length;

  while (zeroCount > 0) {
    if (shiftLeft) {
      result.push(0);
    } else {
      result.unshift(0);
    }
    zeroCount--;
  }

  return result;
}

export default shiftRow;
