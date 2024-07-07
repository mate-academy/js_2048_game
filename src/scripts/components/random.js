const random = {
  num() {
    const probability = Math.random();

    if (probability <= 0.9) {
      return 2;
    } else {
      return 4;
    }
  },

  position(arr) {
    let firstNum = Math.floor(Math.random() * 4);

    while (!arr[firstNum].includes(0)) {
      firstNum = Math.floor(Math.random() * 4);
    }

    let secondNum = Math.floor(Math.random() * 4);

    while (arr[firstNum][secondNum] !== 0) {
      secondNum = Math.floor(Math.random() * 4);
    }

    return [firstNum, secondNum];
  },
};

export default random;
