const TableColumn = (className) => {
  const td = document.createElement('td');

  td.classList.add(className);

  return td;
};

export default TableColumn;
