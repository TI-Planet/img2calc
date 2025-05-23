// Binary manipulation utilities for img2calc

/**
 * Calculate CRC for TI-8x files
 * @param {Array} data - Array of bytes
 * @returns {number} - CRC value
 */
function crcti8x(data) {
    return data.reduce((a, b) => a + b, 0) & 0xFFFF;
}

/**
 * Pad a string to a specified length with a character
 * @param {string} str - String to pad
 * @param {number} n - Target length
 * @param {string} char - Character to pad with
 * @returns {string} - Padded string
 */
function padStr(str, n, char) {
    str = str.substring(0, n);
    while (str.length < n)
        str += char;
    return str;
}

/**
 * Convert an integer to a big-endian byte array
 * @param {number} v - Integer value
 * @param {number} n - Number of bytes
 * @returns {Array} - Byte array
 */
function int2BigEndianArray(v, n) {
    return int2LittleEndianArray(v, n).reverse();
}

/**
 * Convert an integer to a little-endian byte array
 * @param {number} v - Integer value
 * @param {number} n - Number of bytes
 * @returns {Array} - Byte array
 */
function int2LittleEndianArray(v, n) {
    const array = [];
    for (let i = 0; i < n; i++) {
        array.push(v & 0xff);
        v >>= 8;
    }
    return array;
}

/**
 * Convert a string to an array of character codes
 * @param {string} str - String to convert
 * @param {number} n - Target length (0 for no padding)
 * @returns {Array} - Array of character codes
 */
function str2charCodeArray(str, n=0) {
    let array = [];
    let l = str.length; 
    if (n <= 0) n = l;
    for (let i = 0; i < l; i++)
        array.push(str.charCodeAt(i));
    for (let i = 0; i < n - l; i++)
        array.push(0);
    return array;
}

/**
 * Invert all bits in an array
 * @param {Array} arr - Array to invert
 * @returns {Array} - Inverted array
 */
function binaryInvertArray(arr) {
    arr = new Uint8Array(arr);
    for(let i = 0; i < arr.length; i++)
        arr[i] = ~arr[i];
    return Array.from(arr);
}

/**
 * Swap bits in an array
 * @param {Array} arr - Array to modify
 * @param {number} n1 - First bit count
 * @param {number} n2 - Second bit count
 * @returns {Array} - Modified array
 */
function binarySwapArray(arr, n1, n2) {
    let mask1 = (1 << n1) - 1;
    let mask2 = ((1 << n2) - 1) << n1;
    for(let i = 0; i < arr.length; i++)
        arr[i] = ((arr[i]&mask1)<<n2)|((arr[i]&mask2)>>n1);
    return arr;
}

// Export the utility functions
export {
    crcti8x,
    padStr,
    int2BigEndianArray,
    int2LittleEndianArray,
    str2charCodeArray,
    binaryInvertArray,
    binarySwapArray
};