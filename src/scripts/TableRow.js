const TableRow = (className) => {
  const tr = document.createElement('tr');

  tr.classList.add(className);

  return tr;
};

export default TableRow;
