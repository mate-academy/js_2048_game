'use strict';

class Board {
  static SIZE = 4;
  #state;

  /**
   *
   * @param {number[][]} state
   */

  constructor(state) {
    this.#state = state;
  }

  /**
   *
   *
   * @param {(
   *  boardItemValue: number,
   *  indexes: {x: number, y: number},
   *  board: number[][]
   * ) => boolean} filterFn
   * @returns {{x: number, y: number}[]}
   */

  filterCells(filterFn) {
    const result = [];
    const state = this.getState();

    for (const y in state) {
      for (const x in state[y]) {
        const indexes = { x, y };

        if (filterFn(state[y][x], indexes, state)) {
          result.push(indexes);
        }
      }
    }

    return result;
  }

  /**
   *
   * @returns {number[][]}
   */
  getState() {
    return [...this.#state].map((row) => [...row]);
  }

  getMovedLeftState() {
    const newState = [];
    const mergedValues = [];
    const state = this.getState();

    for (const row of state) {
      const { mergedValues: mergedAxisValues, newAxis } = this.#moveAxis(row);

      newState.push(newAxis);
      mergedValues.push(...mergedAxisValues);
    }

    return { newState, mergedValues };
  }

  getMovedRightState() {
    const newState = [];
    const mergedValues = [];
    const state = this.getState();

    for (const row of state) {
      const { mergedValues: mergedAxisValues, newAxis } = this.#moveAxis(
        row.reverse(),
      );

      newState.push(newAxis.reverse());
      mergedValues.push(...mergedAxisValues);
    }

    return { newState, mergedValues };
  }

  getMovedUpState() {
    const state = this.getState();
    const mergedValues = [];

    for (const x in state) {
      const column = [];

      for (const y in state[x]) {
        column.push(state[y][x]);
      }

      const { mergedValues: mergedAxisValues, newAxis: newColumn } =
        this.#moveAxis(column);

      for (const y in state[x]) {
        state[y][x] = newColumn[y];
      }

      mergedValues.push(...mergedAxisValues);
    }

    return { newState: state, mergedValues };
  }

  getMovedDownState() {
    const state = this.getState().reverse();
    const mergedValues = [];

    for (const x in state) {
      const column = [];

      for (const y in state[x]) {
        column.push(state[y][x]);
      }

      const { mergedValues: mergedAxisValues, newAxis: newColumn } =
        this.#moveAxis(column);

      for (const y in state[x]) {
        state[y][x] = newColumn[y];
      }

      mergedValues.push(...mergedAxisValues);
    }

    return { newState: state.reverse(), mergedValues };
  }
  /**
   *
   * @param {number[]} axis
   */
  #moveAxis(axis) {
    const nonEmptyCells = axis.filter((item) => item !== 0);
    const newAxis = [];
    const mergedValues = [];

    for (let index = 0; index < nonEmptyCells.length; index++) {
      let currentValue = nonEmptyCells[index];
      const nextValue = nonEmptyCells[index + 1];

      if (currentValue === nextValue) {
        currentValue = currentValue + nextValue;
        mergedValues.push(currentValue);
        index++;
      }

      newAxis.push(currentValue);
    }

    while (newAxis.length < axis.length) {
      newAxis.push(0);
    }

    return { newAxis, mergedValues };
  }
}

module.exports = Board;
