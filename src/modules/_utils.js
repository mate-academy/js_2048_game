// для транспонування масиву якщо рух вверх чи вниз

export function transponMatrix(field) {
  if (!field || field.length === 0) {
    return field;
  }

  return field[0].map((_, i) => field.map((row) => row[i]));
}
