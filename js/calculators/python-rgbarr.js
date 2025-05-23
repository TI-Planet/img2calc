// Python RGB Array code generator for img2calc

import { getPixel_RGBA_array } from '../utils/image.js';
import { stringToPythonBytes } from '../utils/image.js';

/**
 * Generate Python RGB Array code for image
 * @param {HTMLImageElement} img - Image element
 * @param {Uint8Array} img_a - Image data array
 * @returns {Array} - Array containing [python code, calcName]
 */
function handleOutImgPythonRGBARR(img, img_a) {
    let im = "";
    for(let y=0; y<img.height; y++)
      for(let x=0; x<img.width; x++) {
        let j = y*img.width + x;
        let color = getPixel_RGBA_array(img_a, j, 8, 8, 8, 1);
        if(color[3]>0)
          im += String.fromCharCode(j^7) + String.fromCharCode(color[0]) + String.fromCharCode(color[1]) + String.fromCharCode(color[2]);
      }
    let python = "";
    python += "#image converted on TI-Planet\n#tiplanet.org/img2calc\n\n";
    if (target === '8xpython')
      python += "from rgb_arr import rgb_array\n\n";
    else
      python += "from ti_hub import rgb_array\n\n";

    python += 'def draw_rgbarr_image(rgbarr, img):\n';
    python += '  for i in range(len(img) // 4):\n';
    python += '    rgbarr.set(img[i * 4], img[i*4 + 1], img[i*4 + 2], img[i*4 + 3])\n';
    python += '\n';

    python += '#your image data\n';
    python += '#' + img.width + 'x' + img.height + ' RGB-888 pixels\n';
    python += 'image = ' + stringToPythonBytes(im, 0) + '\n\n';
    python += '#image drawing code sample\n';
    python += 'rgbarr = rgb_array()\n';
    python += 'draw_rgbarr_image(rgbarr, image)\n';

    let calcName = global_inFileName;
    const iname = calcName.indexOf('.');
    if (iname >= 0) calcName = calcName.substring(0, iname);
    return [python, calcName];
}

// Export the Python RGB Array code generator
export { handleOutImgPythonRGBARR };