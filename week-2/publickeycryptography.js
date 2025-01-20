let bytes = new Uint8Array([0, 255, 127, 128]);
console.log(bytes);
let uint8Arr = new Uint8Array([0, 255, 127, 128]);
uint8Arr[1] = 300; //it becomes 300-255 = 45(exlcude 0 as well) = 44
console.log(uint8Arr);
