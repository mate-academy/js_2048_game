'use strict';

import { preenche, changeScore, randomPosition, randomNumber } from "../functions/functions.js"

export class Game {

  state = 'idle';
  score = 0;

  constructor(initialState) {
    if (initialState === undefined) {
      this.table = [[0, 0, 0, 0],
                   [0, 0, 0, 0],
                   [0, 0, 0, 0],
                   [0, 0, 0, 0]];
    } else {
      this.table = initialState;
    }

    preenche(this.table)
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

    let vetTemp1 = [];
    let vetTemp2 = [];
    let vetTemp3 = [];
    let vetTemp4 = [];

    let vetTemp1_1 = [];
    let vetTemp2_2 = [];
    let vetTemp3_3 = [];
    let vetTemp4_4 = [];

    for (let i = 0; i < 4; i++) { // Row1
      if (row1[i] !== 0) {
        vetTemp1.push(row1[i]);
      }
    }

    let temp = vetTemp1.length;

    for (let i = 1; i <= 4 - temp; i++) {
      vetTemp1.unshift(0);
    }

    //

    for (let i = 0; i < 4; i++) { // Row2
      if (row2[i] !== 0) {
        vetTemp2.push(row2[i]);
      }
    }

    let temp2 = vetTemp2.length;

    for (let i = 0; i < 4 - temp2; i++) {
      vetTemp2.unshift(0);
    }

    //

    for (let i = 0; i < 4; i++) { // Row3
      if (row3[i] !== 0) {
        vetTemp3.push(row3[i]);
      }
    }

    let temp3 = vetTemp3.length;

    for (let i = 0; i < 4 - temp3; i++) {
      vetTemp3.unshift(0);
    }

    //

    for (let i = 0; i < 4; i++) { // Row4
      if (row4[i] !== 0) {
        vetTemp4.push(row4[i]);
      }
    }

    let temp4 = vetTemp4.length;

    for (let i = 0; i < 4 - temp4; i++) {
      vetTemp4.unshift(0);
    }

    //

    for (let i = 0; i < 3; i++) { // Evaluate row1
      if (vetTemp1[i] === vetTemp1[i + 1]) {
        vetTemp1[i] += vetTemp1[i + 1];
        this.score += vetTemp1[i];
        changeScore(this.score);
        vetTemp1[i + 1] = 0;
        i++;
      }
    }

    for (let i = 0; i < 4; i++) { // Enumerating Row1
      if (vetTemp1[i] !== 0) {
        vetTemp1_1.push(vetTemp1[i]);
      }
    }

    let temp1_1 = vetTemp1_1.length;

    for (let i = 1; i <= 4 - temp1_1; i++) { // Adjusting Row1
      vetTemp1_1.unshift(0);
    }

    //

    for (let i = 0; i < 3; i++) { // Evaluate row2
      if (vetTemp2[i] === vetTemp2[i + 1]) {
        vetTemp2[i] += vetTemp2[i + 1];
        this.score += vetTemp2[i];
        changeScore(this.score);
        vetTemp2[i + 1] = 0;
        i++;
      }
    }

    for (let i = 0; i < 4; i++) { // Enumerating Row2
      if (vetTemp2[i] !== 0) {
        vetTemp2_2.push(vetTemp2[i]);
      }
    }

    let temp2_2 = vetTemp2_2.length;

    for (let i = 1; i <= 4 - temp2_2; i++) { // Adjusting Row2
      vetTemp2_2.unshift(0);
    }

    //

    for (let i = 0; i < 3; i++) { // Evaluate row3
      if (vetTemp3[i] === vetTemp3[i + 1]) {
        vetTemp3[i] += vetTemp3[i + 1];
        this.score += vetTemp3[i];
        changeScore(this.score);
        vetTemp3[i + 1] = 0;
        i++;
      }
    }

    for (let i = 0; i < 4; i++) { // Enumerating Row3
      if (vetTemp3[i] !== 0) {
        vetTemp3_3.push(vetTemp3[i]);
      }
    }

    let temp3_3 = vetTemp3_3.length;

    for (let i = 1; i <= 4 - temp3_3; i++) { // Adjusting Row3
      vetTemp3_3.unshift(0);
    }

    //

    for (let i = 0; i < 3; i++) { // Evaluate row4
      if (vetTemp4[i] === vetTemp4[i + 1]) {
        vetTemp4[i] += vetTemp4[i + 1];
        this.score += vetTemp4[i];
        changeScore(this.score);
        vetTemp4[i + 1] = 0;
        i++;
      }
    }

    for (let i = 0; i < 4; i++) { // Enumerating Row4
      if (vetTemp4[i] !== 0) {
        vetTemp4_4.push(vetTemp4[i]);
      }
    }

    let temp4_4 = vetTemp4_4.length;

    for (let i = 1; i <= 4 - temp4_4; i++) { // Adjusting Row4
      vetTemp4_4.unshift(0);
    }

    this.table[0] = vetTemp1_1;
    this.table[1] = vetTemp2_2;
    this.table[2] = vetTemp3_3;
    this.table[3] = vetTemp4_4;
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

    let vetTemp1 = [];
    let vetTemp2 = [];
    let vetTemp3 = [];
    let vetTemp4 = [];

    let vetTemp1_1 = [];
    let vetTemp2_2 = [];
    let vetTemp3_3 = [];
    let vetTemp4_4 = [];

    for (let i = 0; i < 4; i++) { // Row1
      if (row1[i] !== 0) {
        vetTemp1.push(row1[i]);
      }
    }

    let temp1 = vetTemp1.length;

    for (let i = 1; i <= 4 - temp1; i++) {
      vetTemp1.push(0);
    }

    //

    for (let i = 0; i < 4; i++) { // Row2
      if (row2[i] !== 0) {
        vetTemp2.push(row2[i]);
      }
    }

    let temp2 = vetTemp2.length;

    for (let i = 0; i < 4 - temp2; i++) {
      vetTemp2.push(0);
    }

    //

    for (let i = 0; i < 4; i++) { // Row3
      if (row3[i] !== 0) {
        vetTemp3.push(row3[i]);
      }
    }

    let temp3 = vetTemp3.length;

    for (let i = 0; i < 4 - temp3; i++) {
      vetTemp3.push(0);
    }

    //

    for (let i = 0; i < 4; i++) { // Row4
      if (row4[i] !== 0) {
        vetTemp4.push(row4[i]);
      }
    }

    let temp4 = vetTemp4.length;

    for (let i = 0; i < 4 - temp4; i++) {
      vetTemp4.push(0);
    }

    //

    for (let i = 0; i < 3; i++) { // Evaluate row1
      if (vetTemp1[i] === vetTemp1[i + 1]) {
        vetTemp1[i] += vetTemp1[i + 1];
        this.score += vetTemp1[i];
        changeScore(this.score);
        vetTemp1[i + 1] = 0;
        i++;
      }
    }

    for (let i = 0; i < 4; i++) { // Enumerating Row1
      if (vetTemp1[i] !== 0) {
        vetTemp1_1.push(vetTemp1[i]);
      }
    }

    let temp1_1 = vetTemp1_1.length;

    for (let i = 1; i <= 4 - temp1_1; i++) { // Aadjusting Row1
      vetTemp1_1.push(0);
    }

    //

    for (let i = 0; i < 3; i++) { // Evaluate row2
      if (vetTemp2[i] === vetTemp2[i + 1]) {
        vetTemp2[i] += vetTemp2[i + 1];
        this.score += vetTemp2[i];
        changeScore(this.score);
        vetTemp2[i + 1] = 0;
        i++;
      }
    }

    for (let i = 0; i < 4; i++) { // Enumerating Row2
      if (vetTemp2[i] !== 0) {
        vetTemp2_2.push(vetTemp2[i]);
      }
    }

    let temp2_2 = vetTemp2_2.length;

    for (let i = 1; i <= 4 - temp2_2; i++) { // Adjusting Row2
      vetTemp2_2.push(0);
    }

    //

    for (let i = 0; i < 3; i++) { // Evaluate row3
      if (vetTemp3[i] === vetTemp3[i + 1]) {
        vetTemp3[i] += vetTemp3[i + 1];
        changeScore(this.score);
        vetTemp3[i + 1] = 0;
        i++;
      }
    }

    for (let i = 0; i < 4; i++) { // Enumerating Row3
      if (vetTemp3[i] !== 0) {
        vetTemp3_3.push(vetTemp3[i]);
      }
    }

    let temp3_3 = vetTemp3_3.length;

    for (let i = 1; i <= 4 - temp3_3; i++) { // Adjusting Row3
      vetTemp3_3.push(0);
    }

    //

    for (let i = 0; i < 3; i++) { // Evaluate row4
      if (vetTemp4[i] === vetTemp4[i + 1]) {
        vetTemp4[i] += vetTemp4[i + 1];
        this.score += vetTemp4[i];
        changeScore(this.score);
        vetTemp4[i + 1] = 0;
        i++;
      }
    }

    for (let i = 0; i < 4; i++) { // Enumerating Row4
      if (vetTemp4[i] !== 0) {
        vetTemp4_4.push(vetTemp4[i]);
      }
    }

    let temp4_4 = vetTemp4_4.length;

    for (let i = 1; i <= 4 - temp4_4; i++) { // Adjusting Row4
      vetTemp4_4.push(0);
    }

    //

    this.table[0] = vetTemp1_1;
    this.table[1] = vetTemp2_2;
    this.table[2] = vetTemp3_3;
    this.table[3] = vetTemp4_4;
  }

  moveUp() {

    let row1 = [];
    let row2 = [];
    let row3 = [];
    let row4 = [];

    let vetTemp1 = [];
    let vetTemp2 = [];
    let vetTemp3 = [];
    let vetTemp4 = [];

    let vetTemp1_1 = [];
    let vetTemp2_2 = [];
    let vetTemp3_3 = [];
    let vetTemp4_4 = [];

    let temp;

    for (let i = 0; i < 4; i++) { // Column1
      if (this.table[i][0] !== 0) {
        vetTemp1.push(this.table[i][0]);
      }
    }

    for (let i = 0; i < 4; i++) { // Column2
      if (this.table[i][1] !== 0) {
        vetTemp2.push(this.table[i][1]);
      }
    }

    for (let i = 0; i < 4; i++) { // Column3
      if (this.table[i][2] !== 0) {
        vetTemp3.push(this.table[i][2]);
      }
    }

    for (let i = 0; i < 4; i++) { // Column4
      if (this.table[i][3] !== 0) {
        vetTemp4.push(this.table[i][3]);
      }
    }

    //

    temp  = vetTemp1.length;

    for (let i = 0; i < 4 - temp; i++) { // Fix Column1
      vetTemp1.push(0);
    }

    temp  = vetTemp2.length;

    for (let i = 0; i < 4 - temp; i++) { // Fix Column2
      vetTemp2.push(0);
    }

    temp  = vetTemp3.length;

    for (let i = 0; i < 4 - temp; i++) { // Fix Column3
      vetTemp3.push(0);
    }

    temp  = vetTemp4.length;

    for (let i = 0; i < 4 - temp; i++) { // Fix Column4
      vetTemp4.push(0);
    }

    //

    for (let i = 0; i < 3; i++) { // Evaluate column1
      if (vetTemp1[i] === vetTemp1[i + 1]) {
        vetTemp1[i] += vetTemp1[i + 1];
        this.score += vetTemp1[i];
        changeScore(this.score);
        vetTemp1[i + 1] = 0;
        i++;
      }
    }

    for (let i = 0; i < 4; i++) { // Enumerating column1
      if (vetTemp1[i] !== 0) {
        vetTemp1_1.push(vetTemp1[i]);
      }
    }

    let temp1_1 = vetTemp1_1.length;

    for (let i = 1; i <= 4 - temp1_1; i++) { // Adjusting column1
      vetTemp1_1.push(0);
    }

    //

    for (let i = 0; i < 3; i++) { // Evaluate column2
      if (vetTemp2[i] === vetTemp2[i + 1]) {
        vetTemp2[i] += vetTemp2[i + 1];
        this.score += vetTemp2[i];
        changeScore(this.score);
        vetTemp2[i + 1] = 0;
        i++;
      }
    }

    for (let i = 0; i < 4; i++) { // Enumerating column2
      if (vetTemp2[i] !== 0) {
        vetTemp2_2.push(vetTemp2[i]);
      }
    }

    let temp2_2 = vetTemp2_2.length;

    for (let i = 1; i <= 4 - temp2_2; i++) { // Adjusting column2
      vetTemp2_2.push(0);
    }

    //

    for (let i = 0; i < 3; i++) { // Evaluate column3
      if (vetTemp3[i] === vetTemp3[i + 1]) {
        vetTemp3[i] += vetTemp3[i + 1];
        this.score += vetTemp3[i];
        changeScore(this.score);
        vetTemp3[i + 1] = 0;
        i++;
      }
    }

    for (let i = 0; i < 4; i++) { // Enumerating column3
      if (vetTemp3[i] !== 0) {
        vetTemp3_3.push(vetTemp3[i]);
      }
    }

    let temp3_3 = vetTemp3_3.length;

    for (let i = 1; i <= 4 - temp3_3; i++) { // Adjusting column3
      vetTemp3_3.push(0);
    }

    //

    for (let i = 0; i < 3; i++) { // Evaluate column4
      if (vetTemp4[i] === vetTemp4[i + 1]) {
        vetTemp4[i] += vetTemp4[i + 1];
        this.score += vetTemp4[i];
        changeScore(this.score);
        vetTemp4[i + 1] = 0;
        i++;
      }
    }

    for (let i = 0; i < 4; i++) { // Enumerating column4
      if (vetTemp4[i] !== 0) {
        vetTemp4_4.push(vetTemp4[i]);
      }
    }

    let temp4_4 = vetTemp4_4.length;

    for (let i = 1; i <= 4 - temp4_4; i++) { // Adjusting column4
      vetTemp4_4.push(0);
    }

    //

    for (let i = 0; i < 4; i++) { // Fill table column1
      this.table[i][0] = vetTemp1_1[i];
    }

    for (let i = 0; i < 4; i++) { // Fill table column2
      this.table[i][1] = vetTemp2_2[i];
    }

    for (let i = 0; i < 4; i++) { // Fill table column3
      this.table[i][2] = vetTemp3_3[i];
    }

    for (let i = 0; i < 4; i++) { // Fill table column4
      this.table[i][3] = vetTemp4_4[i];
    }
  }

  moveDown() {

    let row1 = [];
    let row2 = [];
    let row3 = [];
    let row4 = [];

    let vetTemp1 = [];
    let vetTemp2 = [];
    let vetTemp3 = [];
    let vetTemp4 = [];

    let vetTemp1_1 = [];
    let vetTemp2_2 = [];
    let vetTemp3_3 = [];
    let vetTemp4_4 = [];

    let temp;

    for (let i = 0; i < 4; i++) { // Column1
      if (this.table[i][0] !== 0) {
        vetTemp1.push(this.table[i][0]);
      }
    }

    for (let i = 0; i < 4; i++) { // Column2
      if (this.table[i][1] !== 0) {
        vetTemp2.push(this.table[i][1]);
      }
    }

    for (let i = 0; i < 4; i++) { // Column3
      if (this.table[i][2] !== 0) {
        vetTemp3.push(this.table[i][2]);
      }
    }

    for (let i = 0; i < 4; i++) { // Column4
      if (this.table[i][3] !== 0) {
        vetTemp4.push(this.table[i][3]);
      }
    }

    //

    temp  = vetTemp1.length;

    for (let i = 0; i < 4 - temp; i++) { // Fix Column1
      vetTemp1.unshift(0);
    }

    temp  = vetTemp2.length;

    for (let i = 0; i < 4 - temp; i++) { // Fix Column2
      vetTemp2.unshift(0);
    }

    temp  = vetTemp3.length;

    for (let i = 0; i < 4 - temp; i++) { // Fix Column3
      vetTemp3.unshift(0);
    }

    temp  = vetTemp4.length;

    for (let i = 0; i < 4 - temp; i++) { // Fix Column4
      vetTemp4.unshift(0);
    }

    //

    for (let i = 0; i < 3; i++) { // Evaluate column1
      if (vetTemp1[i] === vetTemp1[i + 1]) {
        vetTemp1[i] += vetTemp1[i + 1];
        this.score += vetTemp1[i];
        changeScore(this.score);
        vetTemp1[i + 1] = 0;
        i++;
      }
    }

    for (let i = 0; i < 4; i++) { // Enumerating column1
      if (vetTemp1[i] !== 0) {
        vetTemp1_1.push(vetTemp1[i]);
      }
    }

    let temp1_1 = vetTemp1_1.length;

    for (let i = 1; i <= 4 - temp1_1; i++) { // Adjusting column1
      vetTemp1_1.unshift(0);
    }

    //

    for (let i = 0; i < 3; i++) { // Evaluate column2
      if (vetTemp2[i] === vetTemp2[i + 1]) {
        vetTemp2[i] += vetTemp2[i + 1];
        this.score += vetTemp2[i];
        changeScore(this.score);
        vetTemp2[i + 1] = 0;
        i++;
      }
    }

    for (let i = 0; i < 4; i++) { // Enumerating column2
      if (vetTemp2[i] !== 0) {
        vetTemp2_2.push(vetTemp2[i]);
      }
    }

    let temp2_2 = vetTemp2_2.length;

    for (let i = 1; i <= 4 - temp2_2; i++) { // Adjusting column2
      vetTemp2_2.unshift(0);
    }

    //

    for (let i = 0; i < 3; i++) { // Evaluate column3
      if (vetTemp3[i] === vetTemp3[i + 1]) {
        vetTemp3[i] += vetTemp3[i + 1];
        this.score += vetTemp3[i];
        changeScore(this.score);
        vetTemp3[i + 1] = 0;
        i++;
      }
    }

    for (let i = 0; i < 4; i++) { // Enumerating column3
      if (vetTemp3[i] !== 0) {
        vetTemp3_3.push(vetTemp3[i]);
      }
    }

    let temp3_3 = vetTemp3_3.length;

    for (let i = 1; i <= 4 - temp3_3; i++) { // Adjusting column3
      vetTemp3_3.unshift(0);
    }

    //

    for (let i = 0; i < 3; i++) { // Evaluate column4
      if (vetTemp4[i] === vetTemp4[i + 1]) {
        vetTemp4[i] += vetTemp4[i + 1];
        this.score += vetTemp4[i]
        changeScore(this.score);
        vetTemp4[i + 1] = 0;
        i++;
      }
    }

    for (let i = 0; i < 4; i++) { // Enumerating column4
      if (vetTemp4[i] !== 0) {
        vetTemp4_4.push(vetTemp4[i]);
      }
    }

    let temp4_4 = vetTemp4_4.length;

    for (let i = 1; i <= 4 - temp4_4; i++) { // Adjusting column4
      vetTemp4_4.unshift(0);
    }

    //

    for (let i = 0; i < 4; i++) { // Fill table column1
      this.table[i][0] = vetTemp1_1[i];
    }

    for (let i = 0; i < 4; i++) { // Fill table column2
      this.table[i][1] = vetTemp2_2[i];
    }

    for (let i = 0; i < 4; i++) { // Fill table column3
      this.table[i][2] = vetTemp3_3[i];
    }

    for (let i = 0; i < 4; i++) { // Fill table column4
      this.table[i][3] = vetTemp4_4[i];
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

    let vetTemp1 = [];
    let vetTemp2 = [];
    let vetTemp3 = [];
    let vetTemp4 = [];

    let vetTemp1_1 = [];
    let vetTemp2_2 = [];
    let vetTemp3_3 = [];
    let vetTemp4_4 = [];

    for (let i = 0; i < 4; i++) { // Row1
      if (row1[i] !== 0) {
        vetTemp1.push(row1[i]);
      }
    }

    let temp = vetTemp1.length;

    for (let i = 1; i <= 4 - temp; i++) {
      vetTemp1.unshift(0);
    }

    //

    for (let i = 0; i < 4; i++) { // Row2
      if (row2[i] !== 0) {
        vetTemp2.push(row2[i]);
      }
    }

    let temp2 = vetTemp2.length;

    for (let i = 0; i < 4 - temp2; i++) {
      vetTemp2.unshift(0);
    }

    //

    for (let i = 0; i < 4; i++) { // Row3
      if (row3[i] !== 0) {
        vetTemp3.push(row3[i]);
      }
    }

    let temp3 = vetTemp3.length;

    for (let i = 0; i < 4 - temp3; i++) {
      vetTemp3.unshift(0);
    }

    //

    for (let i = 0; i < 4; i++) { // Row4
      if (row4[i] !== 0) {
        vetTemp4.push(row4[i]);
      }
    }

    let temp4 = vetTemp4.length;

    for (let i = 0; i < 4 - temp4; i++) {
      vetTemp4.unshift(0);
    }

    //

    for (let i = 0; i < 3; i++) { // Evaluate row1
      if (vetTemp1[i] !== 0 && vetTemp1[i] === vetTemp1[i + 1]) {
       return true;
      }
    }

    for (let i = 0; i < 3; i++) { // Evaluate row2
      if (vetTemp2[i] !== 0 && vetTemp2[i] === vetTemp2[i + 1]) {
        return true;
      }
    }

    for (let i = 0; i < 3; i++) { // Evaluate row3
      if (vetTemp3[i] !== 0 && vetTemp3[i] === vetTemp3[i + 1]) {
        return true;
      }
    }

    for (let i = 0; i < 3; i++) { // Evaluate row4
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

    let vetTemp1 = [];
    let vetTemp2 = [];
    let vetTemp3 = [];
    let vetTemp4 = [];

    let vetTemp1_1 = [];
    let vetTemp2_2 = [];
    let vetTemp3_3 = [];
    let vetTemp4_4 = [];

    for (let i = 0; i < 4; i++) { // Row1
      if (row1[i] !== 0) {
        vetTemp1.push(row1[i]);
      }
    }

    let temp1 = vetTemp1.length;

    for (let i = 1; i <= 4 - temp1; i++) {
      vetTemp1.push(0);
    }

    //

    for (let i = 0; i < 4; i++) { // Row2
      if (row2[i] !== 0) {
        vetTemp2.push(row2[i]);
      }
    }

    let temp2 = vetTemp2.length;

    for (let i = 0; i < 4 - temp2; i++) {
      vetTemp2.push(0);
    }

    //

    for (let i = 0; i < 4; i++) { // Row3
      if (row3[i] !== 0) {
        vetTemp3.push(row3[i]);
      }
    }

    let temp3 = vetTemp3.length;

    for (let i = 0; i < 4 - temp3; i++) {
      vetTemp3.push(0);
    }

    //

    for (let i = 0; i < 4; i++) { // Row4
      if (row4[i] !== 0) {
        vetTemp4.push(row4[i]);
      }
    }

    let temp4 = vetTemp4.length;

    for (let i = 0; i < 4 - temp4; i++) {
      vetTemp4.push(0);
    }

    //

    for (let i = 0; i < 3; i++) { // Evaluate row1
      if (vetTemp1[i] !== 0 && vetTemp1[i] === vetTemp1[i + 1]) {
        return true;
      }
    }

    for (let i = 0; i < 3; i++) { // Evaluate row2
      if (vetTemp2[i] !== 0 && vetTemp2[i] === vetTemp2[i + 1]) {
        return true;
      }
    }

    for (let i = 0; i < 3; i++) { // Evaluate row3
      if (vetTemp3[i] !== 0 && vetTemp3[i] === vetTemp3[i + 1]) {
        return true;
      }
    }

    for (let i = 0; i < 3; i++) { // Evaluate row4
      if (vetTemp4[i] !== 0 && vetTemp4[i] === vetTemp4[i + 1]) {
        return true;
      }
    }

    return false;
  }

  moveUpCheck() {

    let row1 = [];
    let row2 = [];
    let row3 = [];
    let row4 = [];

    let vetTemp1 = [];
    let vetTemp2 = [];
    let vetTemp3 = [];
    let vetTemp4 = [];

    let vetTemp1_1 = [];
    let vetTemp2_2 = [];
    let vetTemp3_3 = [];
    let vetTemp4_4 = [];

    let temp;

    for (let i = 0; i < 4; i++) { // Column1
      if (this.table[i][0] !== 0) {
        vetTemp1.push(this.table[i][0]);
      }
    }

    for (let i = 0; i < 4; i++) { // Column2
      if (this.table[i][1] !== 0) {
        vetTemp2.push(this.table[i][1]);
      }
    }

    for (let i = 0; i < 4; i++) { // Column3
      if (this.table[i][2] !== 0) {
        vetTemp3.push(this.table[i][2]);
      }
    }

    for (let i = 0; i < 4; i++) { // Column4
      if (this.table[i][3] !== 0) {
        vetTemp4.push(this.table[i][3]);
      }
    }

    //

    temp  = vetTemp1.length;

    for (let i = 0; i < 4 - temp; i++) { // Fix Column1
      vetTemp1.push(0);
    }

    temp  = vetTemp2.length;

    for (let i = 0; i < 4 - temp; i++) { // Fix Column2
      vetTemp2.push(0);
    }

    temp  = vetTemp3.length;

    for (let i = 0; i < 4 - temp; i++) { // Fix Column3
      vetTemp3.push(0);
    }

    temp  = vetTemp4.length;

    for (let i = 0; i < 4 - temp; i++) { // Fix Column4
      vetTemp4.push(0);
    }

    //

    for (let i = 0; i < 3; i++) { // Evaluate column1
      if (vetTemp1[i] !== 0 && vetTemp1[i] === vetTemp1[i + 1]) {
        return true;
      }
    }

    for (let i = 0; i < 3; i++) { // Evaluate column2
      if (vetTemp2[i] !== 0 && vetTemp2[i] === vetTemp2[i + 1]) {
        return true;
      }
    }

    for (let i = 0; i < 3; i++) { // Evaluate column3
      if (vetTemp3[i] !== 0 && vetTemp3[i] === vetTemp3[i + 1]) {
        return true;
      }
    }

    for (let i = 0; i < 3; i++) { // Evaluate column4
      if (vetTemp4[i] !== 0 && vetTemp4[i] === vetTemp4[i + 1]) {
        return true;
      }
    }

    return false;
  }

  moveDownCheck() {

    let row1 = [];
    let row2 = [];
    let row3 = [];
    let row4 = [];

    let vetTemp1 = [];
    let vetTemp2 = [];
    let vetTemp3 = [];
    let vetTemp4 = [];

    let vetTemp1_1 = [];
    let vetTemp2_2 = [];
    let vetTemp3_3 = [];
    let vetTemp4_4 = [];

    let temp;

    for (let i = 0; i < 4; i++) { // Column1
      if (this.table[i][0] !== 0) {
        vetTemp1.push(this.table[i][0]);
      }
    }

    for (let i = 0; i < 4; i++) { // Column2
      if (this.table[i][1] !== 0) {
        vetTemp2.push(this.table[i][1]);
      }
    }

    for (let i = 0; i < 4; i++) { // Column3
      if (this.table[i][2] !== 0) {
        vetTemp3.push(this.table[i][2]);
      }
    }

    for (let i = 0; i < 4; i++) { // Column4
      if (this.table[i][3] !== 0) {
        vetTemp4.push(this.table[i][3]);
      }
    }

    //

    temp  = vetTemp1.length;

    for (let i = 0; i < 4 - temp; i++) { // Fix Column1
      vetTemp1.unshift(0);
    }

    temp  = vetTemp2.length;

    for (let i = 0; i < 4 - temp; i++) { // Fix Column2
      vetTemp2.unshift(0);
    }

    temp  = vetTemp3.length;

    for (let i = 0; i < 4 - temp; i++) { // Fix Column3
      vetTemp3.unshift(0);
    }

    temp  = vetTemp4.length;

    for (let i = 0; i < 4 - temp; i++) { // Fix Column4
      vetTemp4.unshift(0);
    }

    //

    for (let i = 0; i < 3; i++) { // Evaluate column1
      if (vetTemp1[i] !== 0 && vetTemp1[i] === vetTemp1[i + 1]) {
        return true;
      }
    }

    for (let i = 0; i < 3; i++) { // Evaluate column2
      if (vetTemp2[i] !== 0 && vetTemp2[i] === vetTemp2[i + 1]) {
        return true;
      }
    }

    for (let i = 0; i < 3; i++) { // Evaluate column3
      if (vetTemp3[i] !== 0 && vetTemp3[i] === vetTemp3[i + 1]) {
        return true;
      }
    }

    for (let i = 0; i < 3; i++) { // Evaluate column4
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
    return this.state;
  }

  start() {
    this.state = 'playing';
  }

  restart() {
    this.table = [[0, 0, 0, 0],
                  [0, 0, 0, 0],
                  [0, 0, 0, 0],
                  [0, 0, 0, 0]];
    this.score = 0;
    this.state = 'playing';
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
    const obj1 = randomPosition(this.table);
    let obj2;

    do {
      obj2 = randomPosition(this.table);
    } while(obj1.row === obj2.row && obj1.column === obj2.column);

    let n1 = randomNumber();
    let n2 = randomNumber();

    this.table[obj1.row][obj1.column] = n1;
    this.table[obj2.row][obj2.column] = n2;
  }

  insert1RandomNumber() {
    const obj1 = randomPosition(this.table);

    let n1 = randomNumber();

    this.table[obj1.row][obj1.column] = n1;
  }
}

module.exports = Game;
