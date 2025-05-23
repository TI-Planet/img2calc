// Image manipulation utilities for img2calc

/**
 * Convert a color to an integer representation
 * @param {Array} col - Color array [r, g, b, a]
 * @param {number} r - Red bit depth
 * @param {number} g - Green bit depth
 * @param {number} b - Blue bit depth
 * @param {number} a - Alpha bit depth
 * @returns {number} - Integer representation of the color
 */
function color2int(col, r, g, b, a) {
    return col[2] >> (8 - r) | col[1] >> (8 - g) << r | col[0] >> (8 - b) << (r + g) | col[3] >> (8 - a) << (r + g + b);
}

/**
 * Get raw pixel data from an image array
 * @param {Uint8Array} img - Image data array
 * @param {number} i - Pixel index
 * @returns {Array} - Array [r, g, b, a]
 */
function getPixel_raw(img, i) {
    i *= 4;
    return [img[i], img[i + 1], img[i + 2], img[i + 3]];
}

/**
 * Get pixel as RGBA integer from an image array
 * @param {Uint8Array} img - Image data array
 * @param {number} i - Pixel index
 * @param {number} r - Red bit depth
 * @param {number} g - Green bit depth
 * @param {number} b - Blue bit depth
 * @param {number} a - Alpha bit depth
 * @returns {number} - Integer representation of the pixel
 */
function getPixel_RGBA_int(img, i, r, g, b, a) {
    i *= 4;
    return img[i + 2] >> (8 - r) | img[i + 1] >> (8 - g) << r | img[i] >> (8 - b) << (r + g) | img[i + 3] >> (8 - a) << (r + g + b);
}

/**
 * Simplify a byte value to the specified bit depth
 * @param {number} val - Byte value
 * @param {number} bits - Bit depth
 * @returns {number} - Simplified byte value
 */
function simpl_byte(val, bits) {
    return (val >> (8 - bits)) << (8 - bits);
}

/**
 * Simplify an RGBA color to the specified bit depths
 * @param {Array} col - Color array [r, g, b, a]
 * @param {number} r - Red bit depth
 * @param {number} g - Green bit depth
 * @param {number} b - Blue bit depth
 * @param {number} a - Alpha bit depth
 * @returns {Array} - Simplified color array
 */
function simplPixel_RGBA(col, r, g, b, a) {
    return [simpl_byte(col[0], r), simpl_byte(col[1], g), simpl_byte(col[2], b), simpl_byte(col[3], a)];
}

/**
 * Get pixel as RGBA array from an image array with specified bit depths
 * @param {Uint8Array} img - Image data array
 * @param {number} i - Pixel index
 * @param {number} r - Red bit depth
 * @param {number} g - Green bit depth
 * @param {number} b - Blue bit depth
 * @param {number} a - Alpha bit depth
 * @returns {Array} - Simplified color array
 */
function getPixel_RGBA_array(img, i, r, g, b, a) {
    i *= 4;
    return [simpl_byte(img[i + 0], r), simpl_byte(img[i+1], g), simpl_byte(img[i+2], b), simpl_byte(img[i+3], a)];
}

/**
 * Find the index of an array in an array of arrays
 * @param {Array} item - Array to find
 * @param {Array} array - Array of arrays to search in
 * @returns {number} - Index of the array or -1 if not found
 */
function indexOfArrayInArray(item, array) {
    for (var i = 0; i < array.length; i++) {
        if(array[i].length==item.length) {
            let test = true;
            for(var k=0; k<item.length && test; k++)
                if(array[i][k] != item[k])
                    test = false;
            if(test) return i;
        }
    }
    return -1;
}

/**
 * Find the nearest color in a palette
 * @param {Array} color - Color array [r, g, b, a]
 * @param {Array} palette - Array of color arrays
 * @returns {number} - Index of the nearest color in the palette
 */
function nearestiRGB(color, palette) {
    let min = 4 * 255 + 1;
    let imin = -1;
    for (let i = 0; i < palette.length; i++) {
        const v = Math.abs(palette[i][0] - color[0]) + Math.abs(palette[i][1] - color[1]) + Math.abs(palette[i][2] - color[2]) + Math.abs(palette[i][3] - color[3]);
        if (v < min) {
            imin = i;
            min = v;
        }
    }
    return imin;
}

/**
 * Convert a string to Python bytes representation
 * @param {string} s - String to convert
 * @param {number} lmax - Maximum line length (0 for no limit)
 * @returns {string} - Python bytes representation
 */
function stringToPythonBytes(s, lmax) {
    let n = s.length;
    let st = "";
    let ng1 = 0;
    let ng2 = 0;
    let sout = "";
    let lout = "";
    for(let i=0; i<n; i++) {
        let v = s.charCodeAt(i);
        if(v == 34) ng2++; // count " chars
        else if(v == 39) ng1++; // count ' chars
    }
    for(let i=0; i<n; i++) {
        let v = s.charCodeAt(i);
        let nextv = -1;
        if(i < n - 1) nextv = s.charCodeAt(i + 1);
        let cout = "";
        if(target !== '8xonline' && v == 7) cout = "\\a";
        else if(v == 8) cout = "\\b";
        else if(v == 9) cout = "\\t";
        else if(v == 10) cout = "\\n";
        else if(v == 11) cout = "\\v";
        else if(v == 12) cout = "\\f";
        else if(v == 13) cout = "\\r";
        else if(v == 92) cout = "\\\\";
        else if(v == 34 && ng2 <= ng1) cout = '\\"'; // escape ' chars
        else if(v == 39 && ng2 > ng1) cout = "\\'"; // escape " chars
        else if(v >= 32 && v <= 0x7E) cout = String.fromCharCode(v); // printable chars
        else if(target !== '8xonline' && v <= 0o77 && (nextv < 48 || nextv > 55)) cout = "\\" + v.toString(8); // octal notation if next char is not in 0-7 // not supported on maclasseti.fr
        else { // hexadecimal notation
            let hex = v.toString(16);
            if(v < 0x10) hex = "0" + hex;
            cout = "\\x" + hex;
        }
        if(lmax >= 7 && lout.length + cout.length + 3 >= lmax) {
            if(ng2 > ng1) lout = "b'" + lout + "'";
            else lout = 'b"' + lout + '"';
            sout += lout + "\n";
            lout = "";
        }
        lout += cout;
    }
    if(ng2 > ng1) lout = "b'" + lout + "'";
    else lout = 'b"' + lout + '"';
    sout += lout + "\n";
    return sout;
}

// Export the utility functions
export {
    color2int,
    getPixel_raw,
    getPixel_RGBA_int,
    simpl_byte,
    simplPixel_RGBA,
    getPixel_RGBA_array,
    indexOfArrayInArray,
    nearestiRGB,
    stringToPythonBytes
};