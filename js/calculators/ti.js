// TI calculator handlers for img2calc

import { crcti8x, padStr, int2LittleEndianArray, str2charCodeArray } from '../utils/binary.js';
import { getPixel_raw, getPixel_RGBA_int, getPixel_RGBA_array, nearestiRGB } from '../utils/image.js';

/**
 * Handle image conversion for TI Z80 calculators
 * @param {HTMLImageElement} img - Image element
 * @param {Uint8Array} img_a - Image data array
 * @returns {Array} - Array containing [data, calcName]
 */
function handleOutImgForTIZ80(img, img_a) {
    let data = [];
    switch (format)
    {
        case "im8c.8xv": {
            const paletteRGBA_a = [];
            let ialpha = -1;
            const r = 5, g = 6, b = 5, a = 1;
            for (let i = 0; i < img.height * img.width; i++) {
                const color = getPixel_RGBA_int(img_a, i, r, g, b, a);
                if (paletteRGBA_a.indexOf(color) < 0) {
                    const icolor = paletteRGBA_a.length;
                    paletteRGBA_a.push(color);
                    if (ialpha < 0 && !(color >> (r + g + b))) {
                        ialpha = icolor;
                    }
                }
            }
            const paletteHeader_a = [];
            if (ialpha < 0) {
                paletteHeader_a.push(1, 0, 0);
            } else {
                paletteHeader_a.push(1, 1, ialpha & 0xFF);
            }
            paletteHeader_a.push(paletteRGBA_a.length & 0xFF);

            const paletteRGB_a = [];
            for (let i = 0; i < paletteRGBA_a.length; i++) {
                const color = paletteRGBA_a[i] & 0xFFFF;
                paletteRGB_a.push(color & 0xFF, color >> 8);
            }
            const dataRLE_a = [];
            let pixBuffer_a = [];
            for (let i = 0; i < img.height * img.width; i++) {
                const curcolor = getPixel_RGBA_int(img_a, i, r, g, b, a);
                const icolor = paletteRGBA_a.indexOf(curcolor);
                let ncurcolor = 1;
                while (ncurcolor < 128 && i < img.height * img.width - 1 && curcolor === getPixel_RGBA_int(img_a, i + 1, r, g, b, a)) {
                    ncurcolor++;
                    i++;
                }
                if (ncurcolor > 1) {
                    while (pixBuffer_a.length) {
                        const n = Math.min(pixBuffer_a.length, 128);
                        dataRLE_a.push(n - 1);
                        for (let j = 0; j < n; j++) {
                            dataRLE_a.push(pixBuffer_a[j]);
                        }
                        pixBuffer_a = pixBuffer_a.slice(n);
                    }
                    dataRLE_a.push(0x80 + ncurcolor - 2, icolor);
                } else {
                    pixBuffer_a.push(icolor);
                }
            }
            data = [].concat(
                str2charCodeArray("IM8C"),
                int2LittleEndianArray(img.width, 3),
                int2LittleEndianArray(img.height, 3),
                paletteHeader_a,
                paletteRGB_a,
                dataRLE_a,
            );
            break;
        }

        case "8ca": {
            const r = 5, g = 6, b = 5, a = 0;
            data.push(0x81);
            for (let i = 0; i < img.height * img.width; i++) {
                const color = getPixel_RGBA_int(img_a, getWidth() * (getHeight() - Math.floor(i / getWidth()) - 1) + (i % getWidth()), r, g, b, a);
                data.push(color & 0xFF, color >> 8);
            }
            break;
        }

        case "8ci": {
            const paletteRGBA_a = [];
            for (let i = 0; i < global_paletteArray.length / 4; i++) {
                const color = getPixel_raw(global_paletteArray, i);
                paletteRGBA_a.push(color);
            }
            for (let i = 0; i < img.height * img.width; i += 2) {
                let icolor = 0;
                for (let j = 0; j < 2; j++) {
                    const color = getPixel_raw(img_a, i + j);
                    icolor = (icolor << 4) | nearestiRGB(color, paletteRGBA_a);
                }
                data.push(icolor);
            }
            break;
        }

        case "8xi":
        case "83i":
        case "86i":
        case "85i":
        case "82i":
        case "73i": {
            for (let i = 0; i < img.height * img.width; i += 8) {
                let icolor = 0;
                for (let j = 0; j < 8; j++) {
                    const color = getPixel_RGBA_int(img_a, i + j, 0, 0, 0, 1);
                    icolor = (icolor << 1) | color;
                }
                data.push(icolor);
            }
            break;
        }

        default: {
            const err = "Unsupported conversion type";
            alert(err);
            throw err;
        }
    }
    
    data = [].concat(
        int2LittleEndianArray(data.length, 2),
        data
    );

    let name = "";
    let calcName = "";
    if (format === "im8c.8xv" || format === "86i" || format === "85i") {
        name = global_inFileName;
        const iname = name.indexOf('.');
        if (iname >= 0) name = name.substring(0, iname);
        name = name.substring(0, 1).toUpperCase() + name.substring(1, 8);
        let cond = '(8 alphanumerical characters max, 1st must be uppercase letter)';
        do {
            name = prompt(`Enter oncalc variable name - ${cond}`, name);
            if (name === null) {
                return;
            } // early exit if the dialog was cancelled
            if (!name || (!/^[A-Z][a-zA-Z0-9_]{0,7}$/.test(name))) alert(cond);
        } while (!name || !/^[A-Z][a-zA-Z0-9_]{0,7}$/.test(name));
        calcName = name;
    } else if (format === "8ca" || format === "8ci" || format === "8xi" || format === "83i" || format === "73i" || format === "82i" || format === "85i" || format === "86i") {
        const min = (target === "73") ? 1 : 0;
        const max = (target === "73") ? 3 : (target === "82") ? 6 : 9;
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
        calcName = `${(format === "8ca") ? "Image" : "Pic"}${num}`;
        if (num === 0) num = 10;
        name = String.fromCharCode((format === "8ca") ? 0x3C : 0x60, num - ((format === "73i") ? 0 : 1));
    }
    const nameArray = str2charCodeArray(padStr(name, 8, String.fromCharCode((format === "85i" || format === "86i") ? 0x20 : 0x00)));
    const size2 = data.length;
    data = [].concat(
        int2LittleEndianArray(size2, 2),
        data,
    );
    if (format === "im8c.8xv" || format === "8ca" || format === "8ci" || format === "8xi")
        data = [].concat(
            [(format === "8ca" || format === "8ci") ? 0x0A : 0x00, (format === "8xi") ? 0x00 : 0x80],
            data,
        );
    data = [].concat(
        nameArray,
        data,
    );
    if (format === "85i" || format === "86i") {
        data = [].concat(
            calcName.length,
            data,
        );
    }
    data = [].concat(
        int2LittleEndianArray(size2, 2),
        [(format === "im8c.8xv") ? 0x15 : (format === "8ca") ? 0x1A : (format === "86i" || format === "85i") ? 0x11 : 0x07],
        data,
    );
    data = [].concat(
        int2LittleEndianArray(data.length - size2 - 2, 2),
        data,
    );
    data = [].concat(
        str2charCodeArray((format === "82i") ? "**TI82**" : (format === "85i") ? "**TI85**" : (format === "86i") ? "**TI86**" : (format === "73i") ? "**TI73**" : (format === "83i") ? "**TI83**" : "**TI83F*"),
        [0x1A, (format === "85i") ? 0x0C : 0x0A, (format === "im8c.8xv") ? 0x0A : (format === "8ci") ? 0x0F : (format === "8xi") ? 0x0B : 0x00],
        str2charCodeArray(padStr("Created on TI-Planet.org by img2calc", 42, String.fromCharCode(0))),
        int2LittleEndianArray(data.length, 2),
        data,
        int2LittleEndianArray(crcti8x(data), 2),
    );

    return [data, calcName];
}

// Export the TI calculator handlers
export { handleOutImgForTIZ80 };