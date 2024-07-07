function wait(delay) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), delay);
  });
}

const renderNums = (state) => {
  const table = document.querySelector('tbody');
  const rows = [...table.children];

  rows.forEach((row, index) => {
    const cells = [...row.children];

    cells.forEach((cell, i) => {
      if (cell.children.length) {
        cell.lastChild.classList.add('hide');

        wait(75).then(() => {
          cell.removeChild(cell.lastChild);

          const divTag = document.createElement('div');

          divTag.classList.add('field-cell');
          divTag.style.cssText = `display: flex; justify-content: center; align-items: center;`;

          const num = state[index][i];
          const content = num === 0 ? '' : num;

          if (num) {
            divTag.classList.add(`field-cell--${num}`);
          }

          divTag.textContent = content;
          cell.append(divTag);
        });
      } else {
        const divTag = document.createElement('div');

        divTag.classList.add('field-cell');
        divTag.style.cssText = `display: flex; justify-content: center; align-items: center;`;

        const num = state[index][i];
        const content = num === 0 ? '' : num;

        if (num) {
          divTag.classList.add(`field-cell--${num}`);
        }

        divTag.textContent = content;
        cell.append(divTag);
      }
    });
  });
};

export default renderNums;
