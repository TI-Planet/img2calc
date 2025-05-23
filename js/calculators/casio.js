// Casio calculator handlers for img2calc

import { int2BigEndianArray, int2LittleEndianArray, str2charCodeArray, binaryInvertArray, binarySwapArray } from '../utils/binary.js';
import { getPixel_raw, getPixel_RGBA_int, nearestiRGB } from '../utils/image.js';

/**
 * Handle image conversion for Casio calculators
 * @param {HTMLImageElement} img - Image element
 * @param {Uint8Array} img_a - Image data array
 * @returns {Array} - Array containing [data, calcName]
 */
function handleOutImgCP(img, img_a) {
    let data = [];
    switch (format) {
        case "c2p":
        case "cp.g3p":
        case "cp01.g3p":
        case "cp01.g4p":
            const r = 5, g = 6, b = 5, a = 0;
            for (let i = 0; i < img.height * img.width; i++) {
                const color = getPixel_RGBA_int(img_a, i, r, g, b, a);
                data.push(color >> 8, color & 0xFF);
            }
            break;
        case "i.c2p":
        case "cp_i.g3p":
        case "cp01_i.g3p":
        case "cp01_i.g4p":
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
        default:
            const err = "Unsupported conversion type";
            alert(err);
            throw err;
    }

    data = Array.from(deflate_f(new Uint8Array(data),{}));

    let footer = [];

    if (format === "cp01.g3p" || format === "cp01_i.g3p" || format === "cp01.g4p" || format === "cp01_i.g4p")
        footer = [].concat(
            str2charCodeArray("0100", 7),
            int2LittleEndianArray(0x30066084, 13),
            int2LittleEndianArray(0x300610, 12),
            int2LittleEndianArray(0x0110, 12),
            int2LittleEndianArray(0x33338309, 12),
            int2LittleEndianArray(0x100360, 12),
            int2LittleEndianArray(0x100310, 12),
            int2LittleEndianArray(0x0110, 24),
            int2LittleEndianArray(0x31280610, 4),
            int2LittleEndianArray(0x85, 8),
            int2LittleEndianArray(0x32288609, 12),
            int2LittleEndianArray(0x42778609, 12)
        );
    else if (format === "c2p" || format === "i.c2p") {
        let footer2 = [].concat(
            int2LittleEndianArray(3, 10),
            int2LittleEndianArray(0x60, 2),
            int2LittleEndianArray(3, 10),
            int2LittleEndianArray(0x10, 2),
            int2LittleEndianArray(1, 10),
            int2LittleEndianArray(0x10, 2),
            int2LittleEndianArray(0x5002, 10),
            int2LittleEndianArray(0x110, 2)
        );

        footer2 = [].concat(
            footer2,
            footer2,
            footer2
        );
        footer2 = [].concat(
            str2charCodeArray("0100"),
            int2BigEndianArray(footer2.length, 4),
            footer2
        );
        let footer1 = [].concat(
            int2LittleEndianArray(0, 8),
            int2LittleEndianArray(0x10, 2),
            int2LittleEndianArray(1, 10),
            int2LittleEndianArray(0x10, 2),
            int2LittleEndianArray(5, 10),
            int2LittleEndianArray(0x9809, 2)
        );

        footer1 = [].concat(
            str2charCodeArray("0100"),
            int2LittleEndianArray(0, 3),
            int2LittleEndianArray(0x70078C, 11),
            int2LittleEndianArray(0x60, 2),
            int2LittleEndianArray(0x7007, 2),
            footer1,
            int2LittleEndianArray(0x6004, 10),
            int2LittleEndianArray(0x60, 2),
            int2LittleEndianArray(0x6004, 2),
            footer1,
            int2LittleEndianArray(0, 12),
            int2LittleEndianArray(0x85312806, 10),
            int2LittleEndianArray(0x10, 2),
            int2LittleEndianArray(0x322806, 10),
            int2LittleEndianArray(0x9809, 4),
            new Array(6).fill(0xFF),
        );
        let pi = 0x93151403;

        footer = [].concat(
            footer1,
            footer2,
            int2LittleEndianArray(2, 10),
            int2LittleEndianArray(0x070110, 12),
            int2LittleEndianArray(0x0110, 2),
            int2LittleEndianArray(pi, 4),
            int2LittleEndianArray(0, 6),
            int2LittleEndianArray(0x60, 2),
            int2LittleEndianArray(pi,10),
            int2LittleEndianArray(0x10, 2),
            int2LittleEndianArray(pi, 10),
            int2LittleEndianArray(0x60, 2),
            int2LittleEndianArray(pi, 10),
            int2LittleEndianArray(0x10, 2),
            new Array(3).fill(1),
            new Array(5).fill(0xFF)
        );

    }

    if (format === "cp.g3p" || format === "cp01.g3p" || format === "cp01.g4p" || format === "cp_i.g3p" || format === "cp01_i.g3p" || format === "cp01_i.g4p")
        data = [].concat(
            data,
            Array.from(adler32(1,new Uint8Array(data),data.length,0))
        );

    if (format === "cp.g3p" || format === "cp_i.g3p") {
        data = binaryInvertArray(data);
        data = binarySwapArray(data,5,3);
    }

    data = [].concat(
        int2BigEndianArray(data.length, 4),
        data
    );

    data = [].concat(
        format === "cp.g3p" || format === "cp_i.g3p" ? int2LittleEndianArray(0x100, 4) : str2charCodeArray("0100"),
        int2BigEndianArray(data.length, 4),
        int2BigEndianArray(img.width, 4),
        int2BigEndianArray(img.height, 2),
        int2BigEndianArray((format === "c2p" || format === "cp.g3p" || format === "cp01.g3p" || format === "cp01.g4p") ? 0x10 : 0x03, 2),
        format === "cp.g3p" || format === "cp01.g3p" || format === "cp01.g4p" || format === "cp_i.g3p" || format === "cp01_i.g3p" || format === "cp01_i.g4p" ? int2LittleEndianArray(1, 4) : str2charCodeArray("\0\xFF\0\xFF\0\xFF\0\xFF\0\x01\0\xFF\xFF\xFF\xFF\xFF"),
        data
    );

    data = [].concat(
        int2BigEndianArray(format === "cp.g3p" || format === "cp_i.g3p" ? 1 : 9, 4),
        int2BigEndianArray(data.length, 4),
        new Array(0x8).fill(0),
        int2BigEndianArray(footer.length, 4),
        new Array(0x70).fill(0),
        data
    );

    let header2 = str2charCodeArray(format === "cp.g3p" || format === "cp_i.g3p" ? "CP\0\x01" : format === "cp01.g4p" || format === "cp01_i.g4p" ? "CP0100Cy875" : format === "cp01.g3p" || format === "cp01_i.g3p" ? "CP0100Ly755" : "CC0100ColorCP",16);

    data = [].concat(
        new Array(format === "c2p" || format === "i.c2p" ? 4 : 2).fill(0),
        header2,
        int2BigEndianArray(header2.length + data.length + footer.length + 4, 4),
        data
    );

    let header1 = format === "c2p" || format === "i.c2p" ? str2charCodeArray("CASIO\0\0\0c2p\0\0\0\0\0\0\x01\0\x10\0\x01\0") : str2charCodeArray("USBPower\x7D\0\x10\0\x10\0");

    header2 = new Array(format === "c2p" || format === "i.c2p" ? 1 : 7).fill(0);

    let size = header1.length + header2.length + data.length + footer.length + 4 + (format === "cp.g3p" || format === "cp01.g3p" || format === "cp01.g4p" || format === "cp_i.g3p" || format === "cp01_i.g3p" || format === "cp01_i.g4p" ? 5 : 0);
    let sizebytes = int2BigEndianArray(size, 4);

    if (format === "c2p" || format === "i.c2p")
        header1 = [].concat(
            header1,
            int2BigEndianArray(size, 3),
            [(0x1D1 - (size & 0xFF)) & 0xFF],
        );
    else
        header1 = [].concat(
            header1,
            (sizebytes[3]+0x41)%0x100,
            1,
            sizebytes,
            (sizebytes[3]+0xB8)%0x100,
        );
    header1 = binaryInvertArray(header1);
    let header = [].concat(
        header1,
        header2
    );
    if (format === "cp.g3p" || format === "cp01.g3p" || format === "cp01.g4p" || format === "cp_i.g3p" || format === "cp01_i.g3p" || format === "cp01_i.g4p")
        header = [].concat(
            header,
            (format === "cp.g3p" || format === "cp_i.g3p" ? sizebytes[2] + sizebytes[3] + 0xAB : -sizebytes[2] - sizebytes[3] + 7)%0x100,
            (format === "cp.g3p" || format === "cp_i.g3p" ? sizebytes[3] + 0x98 : -sizebytes[3] + 0x16)%0x100,
        );
    data = [].concat(
        header,
        data,
        footer
    );

    let name = "";
    let calcName = "";
    name = global_inFileName;
    const iname = name.indexOf('.');
    if (iname >= 0) name = name.substring(0, iname);
    name = name.substring(0, 8);
    let cond = '(8 characters max)';
    do {
        name = prompt(`Enter oncalc file name - ${cond}`, name);
        if (name === null) {
            return;
        } // early exit if the dialog was cancelled
        if (!name || name.length > 8) alert(cond);
    } while (!name || name.length > 8);
    calcName = name;

    return [data, calcName];
}

// Export the Casio calculator handlers
export { handleOutImgCP };