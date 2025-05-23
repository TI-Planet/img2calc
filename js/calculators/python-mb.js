// Python micro:bit code generator for img2calc

import { getPixel_RGBA_array } from '../utils/image.js';

/**
 * Generate Python micro:bit code for image
 * @param {HTMLImageElement} img - Image element
 * @param {Uint8Array} img_a - Image data array
 * @returns {Array} - Array containing [python code, calcName]
 */
function handleOutImgPythonMB(img, img_a) {
    let python = "";
    python += "#image converted on TI-Planet\n#tiplanet.org/img2calc\n\n";

    if (format === 'microbit.py') {
      if (target === '8xpython') {
        python += "from microbit import *\n";
        python += "from mb_disp import display, Image\n";
      }
      else
        python += "from microbit import display, Image\n";
    }
    else if (target === 'cx2') 
      python += "from ti_innovator import send\n";
    else if (target === '8xpython') 
      python += "from ti_hub import send\n";
    python += '\n';

    if(format==="ti_hub_mb.py") {
      python += "#function to send the micro:bit Python code to run\n";
      python += "def send_microbit(cmd):\n";
      python += '  send("\\x04")\n';
      python += '  send(cmd)\n';
      python += '  send("\\x05")\n';
      python += "\n";
    }

    python += 'def draw_mb_image(img):\n';
    if (format === 'microbit.py') {
      python += '  display.show(Image(img))\n';
    }
    else if(format==="ti_hub_mb.py") {
      python += `  send_microbit('display.show(Image("'+img+'"))')\n`;
    }
    python += '\n';

    python += '#your image data\n';
    python += '#' + img.width + 'x' + img.height + ' 10-shades of gray pixels\n';
    python += 'image = "';
    for(let y=0; y<img.height; y++) {
      for(let x=0; x<img.width; x++) {
        let gray = getPixel_RGBA_array(img_a, y*img.width+x, 8, 8, 8, 1)[1];
        gray = 9 - Math.round(gray * 9 / 255);
        python += gray;
      }
      if (y<img.height-1)
        python += ":";
    }
    python += '"\n\n';
    python += '#image drawing code sample\n';
    python += "draw_mb_image(image)\n";

    let calcName = global_inFileName;
    const iname = calcName.indexOf('.');
    if (iname >= 0) calcName = calcName.substring(0, iname);
    return [python, calcName];
}

// Export the Python micro:bit code generator
export { handleOutImgPythonMB };