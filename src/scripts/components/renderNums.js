const renderNums = (state) => {
  const table = document.querySelector('tbody');
  const rows = [...table.children];

  rows.forEach((row, index) => {
    const cells = [...row.children];

    cells.forEach((cell, i) => {
      cell.classList = '';
      cell.classList.add('field-cell');

      const num = state[index][i];
      const content = num === 0 ? '' : num;

      if (num) {
        cell.classList.add(`field-cell--${num}`);
      }

      cell.textContent = content;
    });
  });
};

export default renderNums;
