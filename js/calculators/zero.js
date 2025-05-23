// Zero calculator handlers for img2calc

import { getPixel_raw, getPixel_RGBA_int } from '../utils/image.js';

/**
 * Handle image conversion for Zero calculators
 * @param {HTMLImageElement} img - Image element
 * @param {Uint8Array} img_a - Image data array
 * @returns {Array} - Array containing [data, calcName]
 */
function handleOutImgForZero(img, img_a) {
    let data = [];
    switch (format)
    {
        case "zpic": {
            const r = 5, g = 6, b = 5, a = 0;
            data.push(0x32, 0, 0, 0, 0, 0, 0, 0);
            let x = 0;
            let y = 22;
            let n = 0;
            for (let i = 0; i < img.height * img.width; i++) {
                if (getPixel_raw(img_a, i)[3] >= 255) {
                    n++;
                    const color = getPixel_RGBA_int(img_a, i, r, g, b, a);
                    data.push(0x0E, 0, 0, 0, x & 0xFF, x >> 8, y & 0xFF, y >> 8, color & 0xFF, color >> 8);
                }
                x = (x + 1) % getWidth();
                if (x==0) y++;
            }
            data[4] = n & 0xFF;
            data[5] = (n >> 8) & 0xFF;
            data[6] = (n >> 16) & 0xFF;
            data[7] = (n >> 24) & 0xFF;
            break;
        }

        default: {
            const err = "Unsupported conversion type";
            alert(err);
            throw err;
        }
    }
    
    const min = 0;
    const max = 9;
    const cond = `(${min}-${max})`;
    let num = -1;
    do {
        name = prompt(`Enter oncalc image number - ${cond}`, name);
        if (name === null) {
            return;
        } // early exit if the dialog was cancelled
        num = parseInt(name, 10);
        if (num < min || num > max) alert(cond);
    } while (num < min || num > max);
    let calcName = `pic${num}`;
    return [data, calcName];
}

// Export the Zero calculator handlers
export { handleOutImgForZero };