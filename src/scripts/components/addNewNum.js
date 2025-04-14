import random from './random';

const addNewNumToState = (state) => {
  const newState = state.map((row) => [...row]);

  const num = random.num();

  const [first, second] = random.position(newState);

  newState[first][second] = num;

  return newState;
};

export default addNewNumToState;
