const insertionSort = (array, position, arraySteps, colorSteps) => {
  let colorKey = new Array(array.length).fill(0);

  for (let i = 1; i < array.length; i++) {
    let key = array[i];
    let j = i - 1;

    colorKey[i] = 1; // comparing blue
    arraySteps.push(array.slice());
    colorSteps.push(colorKey.slice());

    while (j >= 0 && array[j] > key) {
      colorKey[j] = 1;     // prev element blue
      colorKey[j + 1] = 1; // the elem next to it blue

      array[j + 1] = array[j];
      arraySteps.push(array.slice());
      colorSteps.push(colorKey.slice());

      // Reset colors after push
      colorKey[j] = 0;
      colorKey[j + 1] = 0;
      j--;
    }

    array[j + 1] = key;

    colorKey[j + 1] = 2; // Inserting key magenta
    arraySteps.push(array.slice());
    colorSteps.push(colorKey.slice());

    // Reset color after insertion
    colorKey[j + 1] = 0;
  }

  // Final step: mark everything as sorted
  colorSteps.push(new Array(array.length).fill(2));
  arraySteps.push(array.slice());
};

export default insertionSort;
