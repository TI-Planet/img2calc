// Python RLE code generator for img2calc

import { getPixel_RGBA_array, color2int, indexOfArrayInArray, simplPixel_RGBA, stringToPythonBytes } from '../utils/image.js';

/**
 * Generate Python RLE code for image
 * @param {HTMLImageElement} img - Image element
 * @param {Uint8Array} img_a - Image data array
 * @returns {Array} - Array containing [python code, calcName]
 */
function handleOutImgPythonRLE(img, img_a) {
    const paletteRGBA_a = [];
    let ialpha = -1;
    let r = 5, g = 6, b = 5, a = 1;
    if(format === "hpprime.py") {
        r = 8; g = 8; b = 8;
    }
    for (let i = 0; i < img.height * img.width; i++) {
        const color_rgba = getPixel_RGBA_array(img_a, i, r, g, b, a);
        if (indexOfArrayInArray(color_rgba, paletteRGBA_a) < 0) {
            const icolor = paletteRGBA_a.length;
            paletteRGBA_a.push(color_rgba);
            if (ialpha < 0 && !color_rgba[3]) {
                ialpha = icolor;
            }
        }
    }
    let im = "";
    let c = 0;
    let ic = 0;
    let prec = 0;
    let cour = 0;
    let npal = paletteRGBA_a.length;
    let nbits = 0;
    let tpal = npal - 1;
    while(tpal) {
      tpal >>= 1;
      nbits += 1;
    }
    let maskcol = (1 << nbits) - 1;
    let maskcnt = 0xFF >> nbits >> 1;
    for(let y=0; y<img.height; y++) {
      for(let x=0; x<img.width; x++) {
        cour = indexOfArrayInArray(getPixel_RGBA_array(img_a, y*img.width+x, r, g, b, a), paletteRGBA_a);
        if(x==0 && y==0) {
          prec=cour;
          c=0;
        }
        if(prec == cour) c += 1;
        if(prec != cour || y+1==img.height && x+1==img.width) {
          while(c > 0)
          {
            let tc = c;
            let vim = prec;
            let scnt = '';
            if(tc <= maskcnt) {
              ic = tc;
              c -= ic;
              ic -= 1;
              vim |= ic << nbits;
            }
            else {
              ic = Math.min(tc, (1<<(15-nbits+(nbits==8)))-1);
              c -= ic;
              ic -= 1;
              vim |= (((ic & maskcnt) << nbits) | (1<<(7+(nbits==8)))) & 0xFF;
              scnt = String.fromCharCode(ic >> (7-nbits+(nbits==8)));
            }
            im += String.fromCharCode(vim);
            im += scnt;
          }
          if(prec != cour) {
            c = 1;
            prec = cour;
            if(y+1==img.height && x+1==img.width) {
              im += String.fromCharCode(cour);
              if (nbits==8) im += String.fromCharCode(0);
            }
          }
        }
      }
    }
    let python = "";
    python += "#image converted on TI-Planet\n#tiplanet.org/img2calc\n\n";
    switch(format) {
        case "ti_graphics.py":
            python += "from ti_graphics import fillRect, setColor\n";
            break;
        case "ti_draw_cx.py":
        case "ti_draw_ce.py":
            python += "from ti_draw import fill_rect, set_color\n";
            break;
        case "casioplot_cg.py":
        case "casioplot_g3.py":
            python += "from casioplot import set_pixel\n\n";
            break;
        case "hpprime.py":
            python += "from hpprime import fillrect\n";
            break;
        case "graphic.py":
        case "graphic_ns.py":
        case "graphic_g3.py":
        case "graphic_cg.py":
            python += "from graphic import fill_rect\n";
            break;
        case "gint_g3.py":
        case "gint_cg.py":
            python += "from gint import drect\n";
            break;
        case "kandinsky.py":
        case "kandinsky_cg.py":
            python += "from kandinsky import fill_rect\n";
            break;
    }
    python +=        '\n#the image drawing function\n';
    if (format === 'hpprime.py' || format === 'nsp_cx.py' || format === 'nsp_ns.py')
      python +=      '#- layer to draw on\n';
    python +=        '#- rle : image RLE-compressed data\n';
    python +=        '#- w : width of image\n';
    python +=        '#- pal : palette of colors to use with image\n';
    python +=        '#- zoomx : horizontal zoom\n';
    python +=        '#- zoomy : vertical zoom\n';
    python +=        '#- itransp : index of 1 transparent color in palette or -1 if none\n';
    if (format === 'hpprime.py' || format === 'nsp_cx.py' || format === 'nsp_ns.py')
      python +=      'def draw_image(layer, rle, x0, y0, w, pal, zoomx=1, zoomy=1, itransp=-1):\n';
    else
      python +=      'def draw_image(rle, x0, y0, w, pal, zoomx=1, zoomy=1, itransp=-1):\n';
    python +=        '  i, x = 0, 0\n';
    python +=        '  x0, y0 = int(x0), int(y0)\n';
    python +=        '  nvals = len(pal)\n';
    python +=        '  nbits = 0\n';
    python +=        '  nvals -= 1\n';
    python +=        '  while(nvals):\n';
    python +=        '    nvals >>= 1\n';
    python +=        '    nbits += 1\n';
    python +=        '  maskval = (1 << nbits) - 1\n';
    python +=        '  maskcnt = (0xFF >> nbits >> 1) << nbits\n';
    python +=        '  while i<len(rle):\n';
    python +=        '    v = rle[i]\n';
    python +=        '    mv = v & maskval\n';
    python +=        '    c = (v & maskcnt) >> nbits\n';
    python +=        '    if (v & 0b10000000 or nbits == 8):\n';
    python +=        '      i += 1\n';
    python +=        '      c |= rle[i] << (7 - nbits + (nbits == 8))\n';
    python +=        '    c = c + 1\n';
    python +=        '    while c:\n';
    python +=        '      cw = min(c, w - x)\n';
    python +=        '      if mv != itransp:\n';
    if (format === 'ti_draw_cx.py') {
      python +=      '        set_color(pal[mv])\n';
      python +=      '        fill_rect(x0 + x*zoomx, y0, cw*zoomx, zoomy)\n';
    }
    if (format === 'ti_draw_ce.py') {
      python +=      '        set_color(*pal[mv])\n';
      if (target === '8xonline')
        python +=    '        fill_rect(x0 + x*zoomx, y0, cw*zoomx, zoomy)\n';
      else
        python +=    '        fill_rect(x0 + x*zoomx - 1, y0 - 1, cw*zoomx + 1, zoomy + 1)\n';
    }
    else if (format === 'ti_graphics.py') {
      python +=      '        setColor(pal[mv])\n';
      python +=      '        fillRect(x0 + x*zoomx, y0, cw*zoomx, zoomy)\n';
    }
    else if (format === 'casioplot_cg.py' || format === 'casioplot_g3.py') {
      python +=      '        col = pal[mv]\n';
      python +=      '        for l in range(0, zoomy, zoomy < 0 and -1 or 1):\n';
      python +=      '          for k in range(cw):\n';
      python +=      '            for p in range(0, zoomx, zoomx < 0 and -1 or 1):\n';
      python +=      '              set_pixel(x0 + (x + k)*zoomx + p - (zoomx < 0), y0 + l - (zoomy < 0), col)\n';
    }
    else if (format === 'hpprime.py')
      python +=      '        fillrect(layer, x0 + x*zoomx, y0, cw*zoomx, zoomy, pal[mv], pal[mv])\n';
    else if (format === 'nsp_cx.py' || format === 'nsp_ns.py') {
      python +=      '        col = pal[mv]\n';
      python +=      '        for l in range(0, zoomy, zoomy < 0 and -1 or 1):\n';
      python +=      '          for k in range(cw):\n';
      python +=      '            for p in range(0, zoomx, zoomx < 0 and -1 or 1):\n';
      python +=      '              layer.setPx(x0 + (x + k)*zoomx + p - (zoomx < 0), y0 + l - (zoomy < 0), col)\n';
    }
    else if (format === 'gint_cg.py' || format === 'gint_g3.py')
      python +=      '        drect(x0 + x*zoomx, y0, cw*zoomx, zoomy, pal[mv])\n';
    else
      python +=      '        fill_rect(x0 + x*zoomx, y0, cw*zoomx, zoomy, pal[mv])\n';
    python +=        '      c -= cw\n';
    python +=        '      x = (x + cw) % w\n';
    python +=        '      y0 += x == 0 and zoomy\n';
    python +=        '    i += 1\n\n\n';
    python +=         "#palette for your image\n"
    python +=         "#" + paletteRGBA_a.length+ " " + ((format === 'nsp_cx.py' || format === 'nsp_ns.py') ? "RGB-565" : "RGB-888")+" colors\n";
    python +=         'palette = (\n';
    let python_line = '';
    let color_names = [];
    let color_vals = [];
    if(format === 'kandinsky.py' || format === 'kandinsky_cg.py') {
      color_names = ["w", "k", "gray", "r", "g", "b", "y", "brown", "pink", "orange", "purple", "cyan", "magenta"];
      color_vals = [[255,255,255,255], // white + w
        [0,0,0,255], // black + k
        [0xa7,0xa7,0xa7,255], // gray + grey
        [255,0,0,255], // red + r
        [0x50,0xc1,0x02,255], // green + g
        [0,0,255,255], // blue + b
        [255,255,0,255], // yellow + y
        [0x8d,0x73,0x50,255], // brown
        [0xff,0xab,0xb6,255], // pink
        [0xfe,0x87,0x1f,255], // orange
        [0x6e,0x2d,0x79,255], // purple
        [0,255,255,255,255], // cyan
        [255,5,136], // magenta
      ];
    }
    else if(format === 'graphic.py' || format === 'graphic_ns.py' || format === 'graphic_cg.py' || format === 'graphic_g3.py') {
      color_names = ["", "black", "red", "green", "blue", "yellow", "cyan", "magenta"];
      color_vals = [[255,255,255,255], // white + w + ""
        [0,0,0,255], // black
        [255,0,0,255], // red
        [0x50,0xc1,0x02,255], // green
        [0,0,255,255], // blue
        [255,255,0,255], // yellow
        [0,255,255,255,255], // cyan
        [255,5,136], // magenta
      ];
    }
    for(let k = 0; k < color_vals.length; k++) {
      color_vals[k] = simplPixel_RGBA(color_vals[k], r, g, b, a);
    }
    for(let k = 0; k < paletteRGBA_a.length; k++) {
      let python_val =  ''
      if (format === 'nsp_cx.py' || format === 'nsp_ns.py' || format === 'gint_cg.py' || format === 'gint_g3.py') {
        let col = color2int(paletteRGBA_a[k], 5, 6, 5, 0);
        python_val = col + ',';
      }
      else if (format === 'hpprime.py') {
        let col = color2int(paletteRGBA_a[k], 8, 8, 8, 0);
        python_val = col + ',';
      }
      else {
        python_val = '(' + paletteRGBA_a[k][0] + ',' + paletteRGBA_a[k][1] + ',' + paletteRGBA_a[k][2] + '),';
        let i_color_name = indexOfArrayInArray(paletteRGBA_a[k], color_vals);
        if(i_color_name >= 0) {
          let python_val_alt = '"' + color_names[i_color_name] + '",';
          if(python_val_alt.length <= python_val.length) python_val = python_val_alt;
        }
        if (format === 'graphic.py' || format === 'graphic_ns.py' || format === 'graphic_cg.py' || format === 'graphic_g3.py') {
          let python_val_alt = color2int(paletteRGBA_a[k], 5, 6, 5, 0) + ',';
          if(python_val_alt.length <= python_val.length) python_val = python_val_alt;
        }
        else if (format === 'kandinsky.py' || format === 'kandinsky_cg.py') {
          let hex_l = [];
          for(let i=0; i<3; i++) {
            let v = paletteRGBA_a[k][i];
            let hex = v.toString(16);
            if(v < 0x10) hex = "0" + hex;
            hex_l[i] = hex;
          }
          let python_val_alt = '"#' + hex_l[0].toString(16) + hex_l[1].toString(16) + hex_l[2].toString(16) + '",';
          if(python_val_alt.length <= python_val.length) python_val = python_val_alt;
        }
      }
      // lines up to 256 chars for compatibility with Casio oncalc editor
      if (((format === 'casioplot_cg.py' || format === 'casioplot_g3.py') && (python_line + python_val).length > 256) || ((format === 'graphic_cg.py' || format === 'graphic_g3.py' || format === 'graphic.py' || format === 'graphic_ns.py') && (python_line + python_val).length > 128)) {
        python += python_line + '\n';
        python_line = '';
      }
      python_line += python_val;
    }
    python += python_line + '\n';
    python +=      ')\n\n';
    python +=        '#your image data\n';
    python +=        '#' + img.width + 'x' + img.height + ' RLE-' + nbits + ' pixels\n';
    python +=        'image = (\n';
    if(format === 'casioplot_cg.py' || format === 'casioplot_g3.py')
      python +=      stringToPythonBytes(im, 256);
    else if(format === 'graphic_cg.py' || format === 'graphic_g3.py' || format === 'graphic.py' || format === 'graphic_ns.py')
      python +=      stringToPythonBytes(im, 128);
    else
      python +=      stringToPythonBytes(im, 0);
    python +=        ')\n\n';
    python +=        '#image drawing code sample\n';
    if (format === 'hpprime.py') {
      python +=      'from hpprime import eval\n';
      python +=      'draw_image(0, image, 0, 0, '+img.width+', palette, zoomx=1, zoomy=1, itransp='+ialpha+')\n';
      python +=      'eval("wait()")\n';
    }
    else if (format === 'nsp_cx.py' || format === 'nsp_ns.py') {
      python +=      'from nsp import Texture, waitKeypress\n';
      python +=      'layer = Texture(320, 240, 0)\n';
      python +=      'layer.fill(0)\n';
      python +=      'draw_image(layer, image, 0, 0, '+img.width+', palette, zoomx=1, zoomy=1, itransp='+ialpha+')\n';
      python +=      'layer.display()\n';
      python +=      'waitKeypress()\n';            
    }
    else if(format === 'ti_graphics.py') {
      python +=      'from ti_system import disp_wait\n';
      python +=      'draw_image(image, 0, 30, '+img.width+', palette, zoomx=1, zoomy=1, itransp='+ialpha+')\n';
      python +=      'disp_wait()\n';
    }
    else if(format === 'ti_draw_ce.py') {
      python +=      'from ti_draw import show_draw\n';
      python +=      'draw_image(image, 0, 30, '+img.width+', palette, zoomx=1, zoomy=1, itransp='+ialpha+')\n';
      python +=      'show_draw()\n';
    }
    else if(format === 'ti_draw_cx.py') {
      python +=      'from ti_draw import use_buffer, paint_buffer\n';
      python +=      'use_buffer()\n';
      python +=      'draw_image(image, 0, 0, '+img.width+', palette, zoomx=1, zoomy=1, itransp='+ialpha+')\n';
      python +=      'paint_buffer()\n';
    }
    else if(format === 'casioplot_cg.py' || format === 'casioplot_g3.py') {
      python +=      'from casioplot import show_screen\n';
      python +=      'draw_image(image, 0, 0, '+img.width+', palette, zoomx=1, zoomy=1, itransp='+ialpha+')\n';
      python +=      'show_screen()\n';
    }
    else
      python +=      'draw_image(image, 0, 0, '+img.width+', palette, zoomx=1, zoomy=1, itransp='+ialpha+')\n';

    let calcName = global_inFileName;
    const iname = calcName.indexOf('.');
    if (iname >= 0) calcName = calcName.substring(0, iname);
    return [python, calcName];
}

// Export the Python RLE code generator
export { handleOutImgPythonRLE };