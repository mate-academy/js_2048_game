import addNewNumToState from './addNewNum';

const initialState = () => {
  const state = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ];

  const newState = addNewNumToState(state);

  return addNewNumToState(newState);
};

export default initialState;
