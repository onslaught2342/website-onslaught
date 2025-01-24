import convertToTitleCase from "./convertToTitleCase.js";

function punctuateArray(array) {
  let itemsString = ``;
  array = array.map(item => item.replace('-', ' '));
  for (let item of array) {
    if (array.length > 1 && item !== array[array.length - 1]) {
      itemsString += `${convertToTitleCase(item)}, `
    }
    else {
      itemsString += convertToTitleCase(item);
    }
  }

  return itemsString;
}

export default punctuateArray;
