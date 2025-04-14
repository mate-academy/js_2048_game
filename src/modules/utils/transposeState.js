function transposeState(state) {
  return state[0].map((_, colIndex) => state.map((row) => row[colIndex]));
}

export default transposeState;
