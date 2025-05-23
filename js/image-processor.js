// Image processor for img2calc

import { getWidth, getHeight } from './config.js';
import { addBlobFileLink } from './utils/ui.js';
import { handleOutImgForTIZ80 } from './calculators/ti.js';
import { handleOutImgCP } from './calculators/casio.js';
import { handleOutImgForZero } from './calculators/zero.js';
import { handleOutImgPythonRLE } from './calculators/python-rle.js';
import { handleOutImgPythonMB } from './calculators/python-mb.js';
import { handleOutImgPythonRGBARR } from './calculators/python-rgbarr.js';
import { Call as MagickCall } from "./wasm-imagemagick/magickApi.js";

// Global variables
window.global_inFileName = "";
window.global_paletteFile = [];
window.global_paletteArray = [];

/**
 * Handle palette URL
 * @param {string} file - URL of the palette file
 */
function handlePaletteURL(file) {
    global_paletteFile = [];
    const paletteImg = new Image();
    paletteImg.src = file;
    paletteImg.onload = function () {
        handlePaletteImg(paletteImg);
    };
}

/**
 * Handle palette image
 * @param {HTMLImageElement} img - Palette image
 */
function handlePaletteImg(img) {
    const canvas = document.getElementById('paletteCanvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const context = canvas.getContext('2d');
    context.drawImage(img, 0, 0);
    const imgData = context.getImageData(0, 0, img.width, img.height);
    const imgBuffer = imgData.data.buffer;
    global_paletteArray = new Uint8Array(imgBuffer);
    canvas.toBlob(handlePaletteCanvas);
}

/**
 * Handle palette canvas
 * @param {Blob} blob - Canvas blob
 */
async function handlePaletteCanvas(blob) {
    const sourceBytes = await blob.arrayBuffer();
    const localName = "palette.png";
    global_paletteFile = [{'name': localName, 'content': sourceBytes}];
}

/**
 * Handle input file
 * @param {File} file - Input file
 */
function handleInFile(file) {
    if(format === "8ci") handlePaletteURL("./pal8ci.png");
    else if(format === "cp_i.g3p" || format === "cp01_i.g3p" || format === "cp01_i.g4p" || format === "i.c2p") handlePaletteURL("./palcp.png");
    const fileReader = new FileReader();
    fileReader.onload = handleInFileData;
    fileReader.readAsDataURL(file);
    global_inFileName = file['name'];
}

/**
 * Handle input file data
 * @param {Event} file - File reader event
 */
function handleInFileData(file) {
    const inImg = new Image();
    inImg.src = file.target.result;
    inImg.onload = function () {
        handleInImg(inImg);
    };
}

/**
 * Handle input image
 * @param {HTMLImageElement} img - Input image
 */
function handleInImg(img) {
    const canvas = document.getElementById('inImgCanvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const context = canvas.getContext('2d');
    context.drawImage(img, 0, 0);

    const imgData = context.getImageData(0, 0, img.width, img.height);
    const imgBuffer = imgData.data.buffer;  // ArrayBuffer
    const img_a = new Uint8Array(imgBuffer);
    window.transparent = false;
    for(let i=3; i<img_a.length; i+=4) {
       if(img_a[i]<255) {
           window.transparent = true;
           break;
       }
    }
    canvas.toBlob(handleInCanvas);
}

/**
 * Handle input canvas
 * @param {Blob} blob - Canvas blob
 */
async function handleInCanvas(blob) {
    if((format === "8ci" || format === "cp_i.g3p" || format === "cp01_i.g3p" || format === "cp01_i.g4p") && global_paletteFile.length === 0) {
        setTimeout(handleInCanvas, 100, blob);
        return;
    }
    const sourceBytes = await blob.arrayBuffer();
    const localName = "input.png";
    let files = [{'name': localName, 'content': sourceBytes}];
    let command = ["convert", localName];
    let sizeparam;
    if(format === "8ca" || format === "8ci" || format === "8xi" || format === "83i" || format === "73i" || format === "82i" || format === "85i" || format === "86i")
        sizeparam = `${getWidth()-1}x${getHeight()}`;
    else
        sizeparam = `${getWidth()}x${getHeight()}`;
    let sizeparam0 = sizeparam;
    if (!getRatio())
        sizeparam += '!';
    if (!getFit())
        sizeparam += '>';
    let sizeparams = [].concat(
        "-resize",
        sizeparam
    );
    if (!config[2]) {
    sizeparams = [].concat(
        sizeparams,
        "-extent",
        sizeparam0
    );
    }
    let colorparams = [].concat(
        "-colors",
        getColors()
    );
    if (format === "im8c.8xv") {
        command = [].concat(command, sizeparams, ["+dither", "-channel", "red", "-depth", "5", "-channel", "green", "-depth", "6", "-channel", "blue", "-depth", "5", "-channel", "alpha", "-depth", "1"], colorparams);
    } else if (format === "8ca") {
        command = [].concat(command, ["-background", "white", "-flatten"], sizeparams, colorparams, ["-gravity", "northeast", "-splice", "1x0"]);
    } else if (format === "8ci") {
        files = files.concat(global_paletteFile);
        command = [].concat(command, ["-background", "none"], sizeparams, ["-remap", "palette.png",], colorparams, ["-gravity", "northeast", "-splice", "1x0"]);
    } else if (format === "8xi" || format === "83i" || format === "73i" || format === "82i" || format === "85i" || format === "86i") {
        command = [].concat(command, ["-background", "white", "-flatten"], sizeparams, ["-colorspace", "Gray", "-auto-level", "-posterize", "2"], colorparams, ["-gravity", "northeast", "-splice", "1x0", "-transparent", "white"]);
    } else if (format === "zpic") {
        command = [].concat(command, ["-background", "none"], sizeparams, colorparams);
    } else if (format === "c2p" || format === "cp.g3p" || format === "cp01.g3p" || format === "cp01.g4p") {
        command = [].concat(command, ["-background", "white", "-flatten"], sizeparams, colorparams);
    } else if (format === "i.c2p" || format === "cp_i.g3p" || format === "cp01_i.g3p"  || format === "cp01_i.g4p") {
        files = files.concat(global_paletteFile);
        command = [].concat(command, sizeparams, ["-remap", "palette.png"], colorparams);
    } else if (format === "casioplot_g3.py" || format === "gint_g3.py" || format === "nsp_ns.py" || format === "graphic_ns.py" || format === "graphic_g3.py") {
      if(window.transparent) {
        command = [].concat(command, sizeparams, ["+dither", "-colorspace", "Gray", "-posterize", "2", "-auto-level"], colorparams);
      }
      else {
        command = [].concat(command, sizeparams, ["+dither", "-colorspace", "Gray", "-auto-level", "-posterize", "2"], colorparams);
      }
    } else if (format === "ti_graphics.py" || format === "ti_draw_ce.py" || format === "ti_draw_cx.py" || format === "graphic.py" || format === "graphic_cg.py" || format === "gint_cg.py" || format === "nsp_cx.py" || format === "casioplot_cg.py" || format === "kandinsky.py" || format === "kandinsky_cg.py") {
        command = [].concat(command, ["+dither", "-channel", "red", "-depth", "5", "-channel", "green", "-depth", "6", "-channel", "blue", "-depth", "5", "-channel", "alpha", "-depth", "1"], sizeparams, colorparams);
    } else if (format === "hpprime.py") {
        command = [].concat(command, sizeparams, ["+dither", "-channel", "alpha", "-depth", "1"], colorparams);
    } else if (format === "microbit.py" || format === "ti_hub_mb.py") {
        command = [].concat(command, sizeparams, ["-colorspace", "Gray", "-auto-level", "-posterize", "10"], colorparams, ["-colorspace", "RGB", "-channel", "R", "-evaluate", "set", "0%", "-channel", "R", "-evaluate", "set", "0%", "-negate"]);
    } else {
        command = [].concat(command, sizeparams, ["+dither", "-channel", "alpha", "-depth", "1"], colorparams);
    }
    command.push("out.png");
    console.log(command);
    const processedFiles = await MagickCall(files, command);
    const firstOutputImg = processedFiles[0];
    const inImg = document.getElementById("inImg");
    inImg.src = URL.createObjectURL(blob);
    inImg.style.maxWidth = `${getWidth()}px`;
    inImg.style.maxHeight = `${getHeight()}px`;
    const outImg = document.getElementById("outImg");
    outImg.onload = function () {
        handleOutImg(outImg);
    };
    outImg.src = URL.createObjectURL(firstOutputImg['blob']);
}

/**
 * Handle output image
 * @param {HTMLImageElement} img - Output image
 */
function handleOutImg(img) {
    const canvas = document.getElementById('outImgCanvas');
    canvas.width = img.width;
    canvas.height = img.height;
    const context = canvas.getContext('2d');
    context.drawImage(img, 0, 0);
    const imgData = context.getImageData(0, 0, img.width, img.height);
    const imgBuffer = imgData.data.buffer;  // ArrayBuffer
    const img_a = new Uint8Array(imgBuffer);

    let r_array = [[], ""];
    // TI-z80 format
    if (format === 'im8c.8xv' || format === '8ca' || format === '8ci' || format === '8xi' || format === '83i' || format === '73i' || format === '82i' || format === '85i' || format === '86i') {
      r_array = handleOutImgForTIZ80(img, img_a);
    }
    else if (format === 'cp.g3p' || format === 'cp01.g3p' || format === 'cp01.g4p' || format === 'c2p' || format === 'cp_i.g3p' || format === 'cp01_i.g3p' || format === 'cp01_i.g4p' || format === 'i.c2p') {
      r_array = handleOutImgCP(img, img_a);
    }
    else if (format === 'zpic') {
      r_array = handleOutImgForZero(img, img_a);
    }
    else if (format === 'ti_graphics.py' || format === 'ti_draw_ce.py' || format === 'ti_draw_cx.py' || format === 'graphic.py' || format === 'graphic_cg.py' || format === 'graphic_g3.py' || format==='gint_cg.py' || format==='gint_g3.py' || format === 'graphic_ns.py' || format === 'nsp_cx.py' || format === 'nsp_ns.py' || format === 'casioplot_cg.py' || format === 'casioplot_g3.py' || format === 'kandinsky.py' || format === 'kandinsky_cg.py' || format === 'hpprime.py') {
      r_array = handleOutImgPythonRLE(img, img_a);
    }
    else if (format === 'microbit.py' || format === 'ti_hub_mb.py') {
      r_array = handleOutImgPythonMB(img, img_a);
    }
    else if (format === 'ti_hub_rgbarr.py') {
      r_array = handleOutImgPythonRGBARR(img, img_a);
    }
    else {
        const err = "Unsupported conversion type";
        alert(err);
        throw err;
    }

    let data = r_array[0];
    let calcName = r_array[1];

    if (target === '8xpython' && data.length > 0xFFFF) {
        const err = "Sorry, converted file is too big, over 64 KiB, and won't fully send to your calculator. Please retry with a smaller canvas, a canvas with less colors, or a simpler version of your image.";
        alert(err);
    }
    else if ((format === 'ti_graphics.py' || format === 'ti_draw_ce.py') && data.length > 51200) {
        const err = "Sorry, converted file is too big, over 51.2 KB, and won't load in your calculator Python app. Please retry with a smaller canvas, a canvas with less colors, or a simpler version of your image.";
        alert(err);
    }
    else if ((target === 'nw100' || target === 'nw110') && data.length > 0xEA5E) {
        let err = "Warning, converted script is over 58.6 KiB, and won't fit in your calculator";
        if(target === 'nw110')
          err += " if running the Omega, Upsilon or Epsilon firmwares. Use the Khi firmware. Or retry";
        else
          err += ". Retry";
        err += " with a smaller canvas, a canvas with less colors, or a simpler version of your image."
        alert(err);
    }
    else if ((target === 'nw120' || target === 'nw110' || target === 'nw100') && data.length > 0xA7FE) {
        let err = "Warning, converted script is over 42 KiB, and won't fit in your calculator";
        if(target === 'nw110')
          err += " if running the Omega or Epsilon firmwares. Use the Khi or Upsilon firmwares. Or retry";
        else if(target === 'nw100')
          err += " if running the Omega or Epsilon firmwares. Use the Upsilon firmware. Or retry";
        else
          err += ". Retry";
        err += " with a smaller canvas, a canvas with less colors, or a simpler version of your image."
        alert(err);
    }
    else if ((target === 'nw100' || target === 'nw110') && data.length > 0x7FFE) {
        let err = "Warning, converted script is over 32 KiB, and won't fit in your calculator if running the Omega firmware. Use the ";
        if(target === 'nw110')
          err += "Khi, Upsilon or Epsilon firmwares.";
        else
          err += "Upsilon or Epsilon firmwares.";
        err += " Or retry with a smaller canvas, a canvas with less colors, or a simpler version of your image."
        alert(err);
    }

    let extension = format === "zpic" ? "" : format;
    let i = extension.indexOf(".");
    if(i>=0) {
      extension = extension.slice(i + 1, extension.length);
    }
    if ((target === 'ns' || target === 'cx' || target === 'cx2') && (format === 'nsp_cx.py' || format === 'nsp_ns.py' || format === 'graphic.py' || format === 'graphic_ns.py'))
      extension += '.tns';
    let fileName = calcName
    if (extension.length > 0) fileName += "." + extension;
    addBlobFileLink(data, `${fileName}`, document.getElementById("fileList"));

    if (format === "im8c.8xv") { // code d'exemple
      addBlobFileLink(`from ti_graphics import drawImage\nfrom ti_system import disp_wait\n\ndrawImage("${calcName}", 0, 30)\ndisp_wait()`, `${calcName}.py`, document.getElementById("fileList"));
    }
}

// Export the image processor functions
export {
    handlePaletteURL,
    handlePaletteImg,
    handlePaletteCanvas,
    handleInFile,
    handleInFileData,
    handleInImg,
    handleInCanvas,
    handleOutImg
};