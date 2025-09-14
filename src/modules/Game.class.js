'use strict';

import {
  preenche,
  changeScore,
  randomPosition,
  randomNumber,
} from '../functions/functions.js';

class Game {
  status = 'idle';
  score = 0;

  constructor(initialState) {
    if (initialState === undefined) {
      this.table = [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ];
    } else {
      this.table = initialState;
    }

    preenche(this.table);
  }

  moveRight() {
    let row1 = [];
    let row2 = [];
    let row3 = [];
    let row4 = [];

    row1 = this.table[0];
    row2 = this.table[1];
    row3 = this.table[2];
    row4 = this.table[3];

    const vetTemp1 = [];
    const vetTemp2 = [];
    const vetTemp3 = [];
    const vetTemp4 = [];

    const vetTemp11 = [];
    const vetTemp22 = [];
    const vetTemp33 = [];
    const vetTemp44 = [];

    for (let i = 0; i < 4; i++) {
      // Row1
      if (row1[i] !== 0) {
        vetTemp1.push(row1[i]);
      }
    }

    const temp = vetTemp1.length;

    for (let i = 1; i <= 4 - temp; i++) {
      vetTemp1.unshift(0);
    }

    //

    for (let i = 0; i < 4; i++) {
      // Row2
      if (row2[i] !== 0) {
        vetTemp2.push(row2[i]);
      }
    }

    const temp2 = vetTemp2.length;

    for (let i = 0; i < 4 - temp2; i++) {
      vetTemp2.unshift(0);
    }

    //

    for (let i = 0; i < 4; i++) {
      // Row3
      if (row3[i] !== 0) {
        vetTemp3.push(row3[i]);
      }
    }

    const temp3 = vetTemp3.length;

    for (let i = 0; i < 4 - temp3; i++) {
      vetTemp3.unshift(0);
    }

    //

    for (let i = 0; i < 4; i++) {
      // Row4
      if (row4[i] !== 0) {
        vetTemp4.push(row4[i]);
      }
    }

    const temp4 = vetTemp4.length;

    for (let i = 0; i < 4 - temp4; i++) {
      vetTemp4.unshift(0);
    }

    //

    for (let i = 0; i < 3; i++) {
      // Evaluate row1
      if (vetTemp1[i] === vetTemp1[i + 1]) {
        vetTemp1[i] += vetTemp1[i + 1];
        this.score += vetTemp1[i];
        changeScore(this.score);
        vetTemp1[i + 1] = 0;
        i++;
      }
    }

    for (let i = 0; i < 4; i++) {
      // Enumerating Row1
      if (vetTemp1[i] !== 0) {
        vetTemp11.push(vetTemp1[i]);
      }
    }

    const temp11 = vetTemp11.length;

    for (let i = 1; i <= 4 - temp11; i++) {
      // Adjusting Row1
      vetTemp11.unshift(0);
    }

    //

    for (let i = 0; i < 3; i++) {
      // Evaluate row2
      if (vetTemp2[i] === vetTemp2[i + 1]) {
        vetTemp2[i] += vetTemp2[i + 1];
        this.score += vetTemp2[i];
        changeScore(this.score);
        vetTemp2[i + 1] = 0;
        i++;
      }
    }

    for (let i = 0; i < 4; i++) {
      // Enumerating Row2
      if (vetTemp2[i] !== 0) {
        vetTemp22.push(vetTemp2[i]);
      }
    }

    const temp22 = vetTemp22.length;

    for (let i = 1; i <= 4 - temp22; i++) {
      // Adjusting Row2
      vetTemp22.unshift(0);
    }

    //

    for (let i = 0; i < 3; i++) {
      // Evaluate row3
      if (vetTemp3[i] === vetTemp3[i + 1]) {
        vetTemp3[i] += vetTemp3[i + 1];
        this.score += vetTemp3[i];
        changeScore(this.score);
        vetTemp3[i + 1] = 0;
        i++;
      }
    }

    for (let i = 0; i < 4; i++) {
      // Enumerating Row3
      if (vetTemp3[i] !== 0) {
        vetTemp33.push(vetTemp3[i]);
      }
    }

    const temp33 = vetTemp33.length;

    for (let i = 1; i <= 4 - temp33; i++) {
      // Adjusting Row3
      vetTemp33.unshift(0);
    }

    //

    for (let i = 0; i < 3; i++) {
      // Evaluate row4
      if (vetTemp4[i] === vetTemp4[i + 1]) {
        vetTemp4[i] += vetTemp4[i + 1];
        this.score += vetTemp4[i];
        changeScore(this.score);
        vetTemp4[i + 1] = 0;
        i++;
      }
    }

    for (let i = 0; i < 4; i++) {
      // Enumerating Row4
      if (vetTemp4[i] !== 0) {
        vetTemp44.push(vetTemp4[i]);
      }
    }

    const temp44 = vetTemp44.length;

    for (let i = 1; i <= 4 - temp44; i++) {
      // Adjusting Row4
      vetTemp44.unshift(0);
    }

    this.table[0] = vetTemp11;
    this.table[1] = vetTemp22;
    this.table[2] = vetTemp33;
    this.table[3] = vetTemp44;
  }

  moveLeft() {
    let row1 = [];
    let row2 = [];
    let row3 = [];
    let row4 = [];

    row1 = this.table[0];
    row2 = this.table[1];
    row3 = this.table[2];
    row4 = this.table[3];

    const vetTemp1 = [];
    const vetTemp2 = [];
    const vetTemp3 = [];
    const vetTemp4 = [];

    const vetTemp11 = [];
    const vetTemp22 = [];
    const vetTemp33 = [];
    const vetTemp44 = [];

    for (let i = 0; i < 4; i++) {
      // Row1
      if (row1[i] !== 0) {
        vetTemp1.push(row1[i]);
      }
    }

    const temp1 = vetTemp1.length;

    for (let i = 1; i <= 4 - temp1; i++) {
      vetTemp1.push(0);
    }

    //

    for (let i = 0; i < 4; i++) {
      // Row2
      if (row2[i] !== 0) {
        vetTemp2.push(row2[i]);
      }
    }

    const temp2 = vetTemp2.length;

    for (let i = 0; i < 4 - temp2; i++) {
      vetTemp2.push(0);
    }

    //

    for (let i = 0; i < 4; i++) {
      // Row3
      if (row3[i] !== 0) {
        vetTemp3.push(row3[i]);
      }
    }

    const temp3 = vetTemp3.length;

    for (let i = 0; i < 4 - temp3; i++) {
      vetTemp3.push(0);
    }

    //

    for (let i = 0; i < 4; i++) {
      // Row4
      if (row4[i] !== 0) {
        vetTemp4.push(row4[i]);
      }
    }

    const temp4 = vetTemp4.length;

    for (let i = 0; i < 4 - temp4; i++) {
      vetTemp4.push(0);
    }

    //

    for (let i = 0; i < 3; i++) {
      // Evaluate row1
      if (vetTemp1[i] === vetTemp1[i + 1]) {
        vetTemp1[i] += vetTemp1[i + 1];
        this.score += vetTemp1[i];
        changeScore(this.score);
        vetTemp1[i + 1] = 0;
        i++;
      }
    }

    for (let i = 0; i < 4; i++) {
      // Enumerating Row1
      if (vetTemp1[i] !== 0) {
        vetTemp11.push(vetTemp1[i]);
      }
    }

    const temp11 = vetTemp11.length;

    for (let i = 1; i <= 4 - temp11; i++) {
      // Aadjusting Row1
      vetTemp11.push(0);
    }

    //

    for (let i = 0; i < 3; i++) {
      // Evaluate row2
      if (vetTemp2[i] === vetTemp2[i + 1]) {
        vetTemp2[i] += vetTemp2[i + 1];
        this.score += vetTemp2[i];
        changeScore(this.score);
        vetTemp2[i + 1] = 0;
        i++;
      }
    }

    for (let i = 0; i < 4; i++) {
      // Enumerating Row2
      if (vetTemp2[i] !== 0) {
        vetTemp22.push(vetTemp2[i]);
      }
    }

    const temp22 = vetTemp22.length;

    for (let i = 1; i <= 4 - temp22; i++) {
      // Adjusting Row2
      vetTemp22.push(0);
    }

    //

    for (let i = 0; i < 3; i++) {
      // Evaluate row3
      if (vetTemp3[i] === vetTemp3[i + 1]) {
        vetTemp3[i] += vetTemp3[i + 1];
        this.score += vetTemp3[i];
        changeScore(this.score);
        vetTemp3[i + 1] = 0;
        i++;
      }
    }

    for (let i = 0; i < 4; i++) {
      // Enumerating Row3
      if (vetTemp3[i] !== 0) {
        vetTemp33.push(vetTemp3[i]);
      }
    }

    const temp33 = vetTemp33.length;

    for (let i = 1; i <= 4 - temp33; i++) {
      // Adjusting Row3
      vetTemp33.push(0);
    }

    //

    for (let i = 0; i < 3; i++) {
      // Evaluate row4
      if (vetTemp4[i] === vetTemp4[i + 1]) {
        vetTemp4[i] += vetTemp4[i + 1];
        this.score += vetTemp4[i];
        changeScore(this.score);
        vetTemp4[i + 1] = 0;
        i++;
      }
    }

    for (let i = 0; i < 4; i++) {
      // Enumerating Row4
      if (vetTemp4[i] !== 0) {
        vetTemp44.push(vetTemp4[i]);
      }
    }

    const temp44 = vetTemp44.length;

    for (let i = 1; i <= 4 - temp44; i++) {
      // Adjusting Row4
      vetTemp44.push(0);
    }

    //

    this.table[0] = vetTemp11;
    this.table[1] = vetTemp22;
    this.table[2] = vetTemp33;
    this.table[3] = vetTemp44;
  }

  moveUp() {
    const vetTemp1 = [];
    const vetTemp2 = [];
    const vetTemp3 = [];
    const vetTemp4 = [];

    const vetTemp11 = [];
    const vetTemp22 = [];
    const vetTemp33 = [];
    const vetTemp44 = [];

    let temp;

    for (let i = 0; i < 4; i++) {
      // Column1
      if (this.table[i][0] !== 0) {
        vetTemp1.push(this.table[i][0]);
      }
    }

    for (let i = 0; i < 4; i++) {
      // Column2
      if (this.table[i][1] !== 0) {
        vetTemp2.push(this.table[i][1]);
      }
    }

    for (let i = 0; i < 4; i++) {
      // Column3
      if (this.table[i][2] !== 0) {
        vetTemp3.push(this.table[i][2]);
      }
    }

    for (let i = 0; i < 4; i++) {
      // Column4
      if (this.table[i][3] !== 0) {
        vetTemp4.push(this.table[i][3]);
      }
    }

    //

    temp = vetTemp1.length;

    for (let i = 0; i < 4 - temp; i++) {
      // Fix Column1
      vetTemp1.push(0);
    }

    temp = vetTemp2.length;

    for (let i = 0; i < 4 - temp; i++) {
      // Fix Column2
      vetTemp2.push(0);
    }

    temp = vetTemp3.length;

    for (let i = 0; i < 4 - temp; i++) {
      // Fix Column3
      vetTemp3.push(0);
    }

    temp = vetTemp4.length;

    for (let i = 0; i < 4 - temp; i++) {
      // Fix Column4
      vetTemp4.push(0);
    }

    //

    for (let i = 0; i < 3; i++) {
      // Evaluate column1
      if (vetTemp1[i] === vetTemp1[i + 1]) {
        vetTemp1[i] += vetTemp1[i + 1];
        this.score += vetTemp1[i];
        changeScore(this.score);
        vetTemp1[i + 1] = 0;
        i++;
      }
    }

    for (let i = 0; i < 4; i++) {
      // Enumerating column1
      if (vetTemp1[i] !== 0) {
        vetTemp11.push(vetTemp1[i]);
      }
    }

    const temp11 = vetTemp11.length;

    for (let i = 1; i <= 4 - temp11; i++) {
      // Adjusting column1
      vetTemp11.push(0);
    }

    //

    for (let i = 0; i < 3; i++) {
      // Evaluate column2
      if (vetTemp2[i] === vetTemp2[i + 1]) {
        vetTemp2[i] += vetTemp2[i + 1];
        this.score += vetTemp2[i];
        changeScore(this.score);
        vetTemp2[i + 1] = 0;
        i++;
      }
    }

    for (let i = 0; i < 4; i++) {
      // Enumerating column2
      if (vetTemp2[i] !== 0) {
        vetTemp22.push(vetTemp2[i]);
      }
    }

    const temp22 = vetTemp22.length;

    for (let i = 1; i <= 4 - temp22; i++) {
      // Adjusting column2
      vetTemp22.push(0);
    }

    //

    for (let i = 0; i < 3; i++) {
      // Evaluate column3
      if (vetTemp3[i] === vetTemp3[i + 1]) {
        vetTemp3[i] += vetTemp3[i + 1];
        this.score += vetTemp3[i];
        changeScore(this.score);
        vetTemp3[i + 1] = 0;
        i++;
      }
    }

    for (let i = 0; i < 4; i++) {
      // Enumerating column3
      if (vetTemp3[i] !== 0) {
        vetTemp33.push(vetTemp3[i]);
      }
    }

    const temp33 = vetTemp33.length;

    for (let i = 1; i <= 4 - temp33; i++) {
      // Adjusting column3
      vetTemp33.push(0);
    }

    //

    for (let i = 0; i < 3; i++) {
      // Evaluate column4
      if (vetTemp4[i] === vetTemp4[i + 1]) {
        vetTemp4[i] += vetTemp4[i + 1];
        this.score += vetTemp4[i];
        changeScore(this.score);
        vetTemp4[i + 1] = 0;
        i++;
      }
    }

    for (let i = 0; i < 4; i++) {
      // Enumerating column4
      if (vetTemp4[i] !== 0) {
        vetTemp44.push(vetTemp4[i]);
      }
    }

    const temp44 = vetTemp44.length;

    for (let i = 1; i <= 4 - temp44; i++) {
      // Adjusting column4
      vetTemp44.push(0);
    }

    //

    for (let i = 0; i < 4; i++) {
      // Fill table column1
      this.table[i][0] = vetTemp11[i];
    }

    for (let i = 0; i < 4; i++) {
      // Fill table column2
      this.table[i][1] = vetTemp22[i];
    }

    for (let i = 0; i < 4; i++) {
      // Fill table column3
      this.table[i][2] = vetTemp33[i];
    }

    for (let i = 0; i < 4; i++) {
      // Fill table column4
      this.table[i][3] = vetTemp44[i];
    }
  }

  moveDown() {
    const vetTemp1 = [];
    const vetTemp2 = [];
    const vetTemp3 = [];
    const vetTemp4 = [];

    const vetTemp11 = [];
    const vetTemp22 = [];
    const vetTemp33 = [];
    const vetTemp44 = [];

    let temp;

    for (let i = 0; i < 4; i++) {
      // Column1
      if (this.table[i][0] !== 0) {
        vetTemp1.push(this.table[i][0]);
      }
    }

    for (let i = 0; i < 4; i++) {
      // Column2
      if (this.table[i][1] !== 0) {
        vetTemp2.push(this.table[i][1]);
      }
    }

    for (let i = 0; i < 4; i++) {
      // Column3
      if (this.table[i][2] !== 0) {
        vetTemp3.push(this.table[i][2]);
      }
    }

    for (let i = 0; i < 4; i++) {
      // Column4
      if (this.table[i][3] !== 0) {
        vetTemp4.push(this.table[i][3]);
      }
    }

    //

    temp = vetTemp1.length;

    for (let i = 0; i < 4 - temp; i++) {
      // Fix Column1
      vetTemp1.unshift(0);
    }

    temp = vetTemp2.length;

    for (let i = 0; i < 4 - temp; i++) {
      // Fix Column2
      vetTemp2.unshift(0);
    }

    temp = vetTemp3.length;

    for (let i = 0; i < 4 - temp; i++) {
      // Fix Column3
      vetTemp3.unshift(0);
    }

    temp = vetTemp4.length;

    for (let i = 0; i < 4 - temp; i++) {
      // Fix Column4
      vetTemp4.unshift(0);
    }

    //

    for (let i = 0; i < 3; i++) {
      // Evaluate column1
      if (vetTemp1[i] === vetTemp1[i + 1]) {
        vetTemp1[i] += vetTemp1[i + 1];
        this.score += vetTemp1[i];
        changeScore(this.score);
        vetTemp1[i + 1] = 0;
        i++;
      }
    }

    for (let i = 0; i < 4; i++) {
      // Enumerating column1
      if (vetTemp1[i] !== 0) {
        vetTemp11.push(vetTemp1[i]);
      }
    }

    const temp11 = vetTemp11.length;

    for (let i = 1; i <= 4 - temp11; i++) {
      // Adjusting column1
      vetTemp11.unshift(0);
    }

    //

    for (let i = 0; i < 3; i++) {
      // Evaluate column2
      if (vetTemp2[i] === vetTemp2[i + 1]) {
        vetTemp2[i] += vetTemp2[i + 1];
        this.score += vetTemp2[i];
        changeScore(this.score);
        vetTemp2[i + 1] = 0;
        i++;
      }
    }

    for (let i = 0; i < 4; i++) {
      // Enumerating column2
      if (vetTemp2[i] !== 0) {
        vetTemp22.push(vetTemp2[i]);
      }
    }

    const temp22 = vetTemp22.length;

    for (let i = 1; i <= 4 - temp22; i++) {
      // Adjusting column2
      vetTemp22.unshift(0);
    }

    //

    for (let i = 0; i < 3; i++) {
      // Evaluate column3
      if (vetTemp3[i] === vetTemp3[i + 1]) {
        vetTemp3[i] += vetTemp3[i + 1];
        this.score += vetTemp3[i];
        changeScore(this.score);
        vetTemp3[i + 1] = 0;
        i++;
      }
    }

    for (let i = 0; i < 4; i++) {
      // Enumerating column3
      if (vetTemp3[i] !== 0) {
        vetTemp33.push(vetTemp3[i]);
      }
    }

    const temp33 = vetTemp33.length;

    for (let i = 1; i <= 4 - temp33; i++) {
      // Adjusting column3
      vetTemp33.unshift(0);
    }

    //

    for (let i = 0; i < 3; i++) {
      // Evaluate column4
      if (vetTemp4[i] === vetTemp4[i + 1]) {
        vetTemp4[i] += vetTemp4[i + 1];
        this.score += vetTemp4[i];
        changeScore(this.score);
        vetTemp4[i + 1] = 0;
        i++;
      }
    }

    for (let i = 0; i < 4; i++) {
      // Enumerating column4
      if (vetTemp4[i] !== 0) {
        vetTemp44.push(vetTemp4[i]);
      }
    }

    const temp44 = vetTemp44.length;

    for (let i = 1; i <= 4 - temp44; i++) {
      // Adjusting column4
      vetTemp44.unshift(0);
    }

    //

    for (let i = 0; i < 4; i++) {
      // Fill table column1
      this.table[i][0] = vetTemp11[i];
    }

    for (let i = 0; i < 4; i++) {
      // Fill table column2
      this.table[i][1] = vetTemp22[i];
    }

    for (let i = 0; i < 4; i++) {
      // Fill table column3
      this.table[i][2] = vetTemp33[i];
    }

    for (let i = 0; i < 4; i++) {
      // Fill table column4
      this.table[i][3] = vetTemp44[i];
    }
  }

  moveRightCheck() {
    let row1 = [];
    let row2 = [];
    let row3 = [];
    let row4 = [];

    row1 = this.table[0];
    row2 = this.table[1];
    row3 = this.table[2];
    row4 = this.table[3];

    const vetTemp1 = [];
    const vetTemp2 = [];
    const vetTemp3 = [];
    const vetTemp4 = [];

    for (let i = 0; i < 4; i++) {
      // Row1
      if (row1[i] !== 0) {
        vetTemp1.push(row1[i]);
      }
    }

    const temp = vetTemp1.length;

    for (let i = 1; i <= 4 - temp; i++) {
      vetTemp1.unshift(0);
    }

    //

    for (let i = 0; i < 4; i++) {
      // Row2
      if (row2[i] !== 0) {
        vetTemp2.push(row2[i]);
      }
    }

    const temp2 = vetTemp2.length;

    for (let i = 0; i < 4 - temp2; i++) {
      vetTemp2.unshift(0);
    }

    //

    for (let i = 0; i < 4; i++) {
      // Row3
      if (row3[i] !== 0) {
        vetTemp3.push(row3[i]);
      }
    }

    const temp3 = vetTemp3.length;

    for (let i = 0; i < 4 - temp3; i++) {
      vetTemp3.unshift(0);
    }

    //

    for (let i = 0; i < 4; i++) {
      // Row4
      if (row4[i] !== 0) {
        vetTemp4.push(row4[i]);
      }
    }

    const temp4 = vetTemp4.length;

    for (let i = 0; i < 4 - temp4; i++) {
      vetTemp4.unshift(0);
    }

    //

    for (let i = 0; i < 3; i++) {
      // Evaluate row1
      if (vetTemp1[i] !== 0 && vetTemp1[i] === vetTemp1[i + 1]) {
        return true;
      }
    }

    for (let i = 0; i < 3; i++) {
      // Evaluate row2
      if (vetTemp2[i] !== 0 && vetTemp2[i] === vetTemp2[i + 1]) {
        return true;
      }
    }

    for (let i = 0; i < 3; i++) {
      // Evaluate row3
      if (vetTemp3[i] !== 0 && vetTemp3[i] === vetTemp3[i + 1]) {
        return true;
      }
    }

    for (let i = 0; i < 3; i++) {
      // Evaluate row4
      if (vetTemp4[i] !== 0 && vetTemp4[i] === vetTemp4[i + 1]) {
        return true;
      }
    }

    return false;
  }

  moveLeftCheck() {
    let row1 = [];
    let row2 = [];
    let row3 = [];
    let row4 = [];

    row1 = this.table[0];
    row2 = this.table[1];
    row3 = this.table[2];
    row4 = this.table[3];

    const vetTemp1 = [];
    const vetTemp2 = [];
    const vetTemp3 = [];
    const vetTemp4 = [];

    for (let i = 0; i < 4; i++) {
      // Row1
      if (row1[i] !== 0) {
        vetTemp1.push(row1[i]);
      }
    }

    const temp1 = vetTemp1.length;

    for (let i = 1; i <= 4 - temp1; i++) {
      vetTemp1.push(0);
    }

    //

    for (let i = 0; i < 4; i++) {
      // Row2
      if (row2[i] !== 0) {
        vetTemp2.push(row2[i]);
      }
    }

    const temp2 = vetTemp2.length;

    for (let i = 0; i < 4 - temp2; i++) {
      vetTemp2.push(0);
    }

    //

    for (let i = 0; i < 4; i++) {
      // Row3
      if (row3[i] !== 0) {
        vetTemp3.push(row3[i]);
      }
    }

    const temp3 = vetTemp3.length;

    for (let i = 0; i < 4 - temp3; i++) {
      vetTemp3.push(0);
    }

    //

    for (let i = 0; i < 4; i++) {
      // Row4
      if (row4[i] !== 0) {
        vetTemp4.push(row4[i]);
      }
    }

    const temp4 = vetTemp4.length;

    for (let i = 0; i < 4 - temp4; i++) {
      vetTemp4.push(0);
    }

    //

    for (let i = 0; i < 3; i++) {
      // Evaluate row1
      if (vetTemp1[i] !== 0 && vetTemp1[i] === vetTemp1[i + 1]) {
        return true;
      }
    }

    for (let i = 0; i < 3; i++) {
      // Evaluate row2
      if (vetTemp2[i] !== 0 && vetTemp2[i] === vetTemp2[i + 1]) {
        return true;
      }
    }

    for (let i = 0; i < 3; i++) {
      // Evaluate row3
      if (vetTemp3[i] !== 0 && vetTemp3[i] === vetTemp3[i + 1]) {
        return true;
      }
    }

    for (let i = 0; i < 3; i++) {
      // Evaluate row4
      if (vetTemp4[i] !== 0 && vetTemp4[i] === vetTemp4[i + 1]) {
        return true;
      }
    }

    return false;
  }

  moveUpCheck() {
    const vetTemp1 = [];
    const vetTemp2 = [];
    const vetTemp3 = [];
    const vetTemp4 = [];

    let temp;

    for (let i = 0; i < 4; i++) {
      // Column1
      if (this.table[i][0] !== 0) {
        vetTemp1.push(this.table[i][0]);
      }
    }

    for (let i = 0; i < 4; i++) {
      // Column2
      if (this.table[i][1] !== 0) {
        vetTemp2.push(this.table[i][1]);
      }
    }

    for (let i = 0; i < 4; i++) {
      // Column3
      if (this.table[i][2] !== 0) {
        vetTemp3.push(this.table[i][2]);
      }
    }

    for (let i = 0; i < 4; i++) {
      // Column4
      if (this.table[i][3] !== 0) {
        vetTemp4.push(this.table[i][3]);
      }
    }

    //

    temp = vetTemp1.length;

    for (let i = 0; i < 4 - temp; i++) {
      // Fix Column1
      vetTemp1.push(0);
    }

    temp = vetTemp2.length;

    for (let i = 0; i < 4 - temp; i++) {
      // Fix Column2
      vetTemp2.push(0);
    }

    temp = vetTemp3.length;

    for (let i = 0; i < 4 - temp; i++) {
      // Fix Column3
      vetTemp3.push(0);
    }

    temp = vetTemp4.length;

    for (let i = 0; i < 4 - temp; i++) {
      // Fix Column4
      vetTemp4.push(0);
    }

    //

    for (let i = 0; i < 3; i++) {
      // Evaluate column1
      if (vetTemp1[i] !== 0 && vetTemp1[i] === vetTemp1[i + 1]) {
        return true;
      }
    }

    for (let i = 0; i < 3; i++) {
      // Evaluate column2
      if (vetTemp2[i] !== 0 && vetTemp2[i] === vetTemp2[i + 1]) {
        return true;
      }
    }

    for (let i = 0; i < 3; i++) {
      // Evaluate column3
      if (vetTemp3[i] !== 0 && vetTemp3[i] === vetTemp3[i + 1]) {
        return true;
      }
    }

    for (let i = 0; i < 3; i++) {
      // Evaluate column4
      if (vetTemp4[i] !== 0 && vetTemp4[i] === vetTemp4[i + 1]) {
        return true;
      }
    }

    return false;
  }

  moveDownCheck() {
    const vetTemp1 = [];
    const vetTemp2 = [];
    const vetTemp3 = [];
    const vetTemp4 = [];

    let temp;

    for (let i = 0; i < 4; i++) {
      // Column1
      if (this.table[i][0] !== 0) {
        vetTemp1.push(this.table[i][0]);
      }
    }

    for (let i = 0; i < 4; i++) {
      // Column2
      if (this.table[i][1] !== 0) {
        vetTemp2.push(this.table[i][1]);
      }
    }

    for (let i = 0; i < 4; i++) {
      // Column3
      if (this.table[i][2] !== 0) {
        vetTemp3.push(this.table[i][2]);
      }
    }

    for (let i = 0; i < 4; i++) {
      // Column4
      if (this.table[i][3] !== 0) {
        vetTemp4.push(this.table[i][3]);
      }
    }

    //

    temp = vetTemp1.length;

    for (let i = 0; i < 4 - temp; i++) {
      // Fix Column1
      vetTemp1.unshift(0);
    }

    temp = vetTemp2.length;

    for (let i = 0; i < 4 - temp; i++) {
      // Fix Column2
      vetTemp2.unshift(0);
    }

    temp = vetTemp3.length;

    for (let i = 0; i < 4 - temp; i++) {
      // Fix Column3
      vetTemp3.unshift(0);
    }

    temp = vetTemp4.length;

    for (let i = 0; i < 4 - temp; i++) {
      // Fix Column4
      vetTemp4.unshift(0);
    }

    //

    for (let i = 0; i < 3; i++) {
      // Evaluate column1
      if (vetTemp1[i] !== 0 && vetTemp1[i] === vetTemp1[i + 1]) {
        return true;
      }
    }

    for (let i = 0; i < 3; i++) {
      // Evaluate column2
      if (vetTemp2[i] !== 0 && vetTemp2[i] === vetTemp2[i + 1]) {
        return true;
      }
    }

    for (let i = 0; i < 3; i++) {
      // Evaluate column3
      if (vetTemp3[i] !== 0 && vetTemp3[i] === vetTemp3[i + 1]) {
        return true;
      }
    }

    for (let i = 0; i < 3; i++) {
      // Evaluate column4
      if (vetTemp4[i] !== 0 && vetTemp4[i] === vetTemp4[i + 1]) {
        return true;
      }
    }

    return false;
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.table;
  }

  getStatus() {
    return this.status;
  }

  setStatus(status2) {
    this.status = status2;
  }

  start() {
    this.status = 'playing';
  }

  restart() {
    this.table = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ];
    this.score = 0;
    this.status = 'playing';
    changeScore(this.score);
  }

  checkWin() {
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (this.table[i][j] === 2048) {
          return true;
        }
      }
    }

    return false;
  }

  insert2RandomNumbersStart() {
    let obj1;

    do {
      obj1 = randomPosition(this.table);
    } while (Number.parseInt(obj1.column) === 3);

    this.table[obj1.row][obj1.column] = 2;
    this.table[obj1.row][Number.parseInt(obj1.column) + 1] = 2;
  }

  insert1RandomNumber() {
    const obj1 = randomPosition(this.table);

    const n1 = randomNumber();

    this.table[obj1.row][obj1.column] = n1;
  }
}

module.exports = Game;
