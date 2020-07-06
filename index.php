<!doctype html>
<html lang="en-us">

<head>
    <meta charset="utf-8">
    <title>ConvertImg</title>
    <style type="text/css">
        body {
            font-family:-apple-system,BlinkMacSystemFont,"Lucida Grande","Trebuchet MS",Verdana,Helvetica,Arial,sans-serif;
            text-align:center;
            margin:0
        }

        #mainContent {
            max-width:80%;
            margin:auto
        }

        .file {
            border:2px dashed #777;
            border-radius:20px;
            max-width:70%;
            margin:30px auto;
            padding:20px
        }

        p {
            margin-top:0
        }

        .my-form {
            margin-bottom:10px
        }

        .button {
            display:inline-block;
            padding:10px;
            background:#ccc;
            cursor:pointer;
            border-radius:5px;
            border:1px solid #ccc
        }

        .button:hover {
            background:#ddd
        }

        #fileElem {
            display:none
        }

        .img {
            width:49%;
            min-height:320px;
            border:1px dotted #bbb;
            border-radius:10px
        }

        #inFrame {
            float:left;
            left:0;
            background:repeating-linear-gradient(45deg,#ddd,#fff 10px,#ddd 20px)
        }

        #outFrame {
            float:right;
            right:0;
            background:repeating-linear-gradient(-45deg,#ddd,#fff 10px,#ddd 20px)
        }

        .btn-group a { text-decoration: none }
    </style>
    <link rel="stylesheet" href="https://tiplanet.org/forum/css/bootstrap.min.css" type="text/css" />

    <script>
        const params = new URLSearchParams(window.location.search);
        window.target = params.get('target') || '8xpython';
        window.format = params.get('format') || 'im8c';
        if (target !== '8xpython' && target !== '8xcolor' && target !== '8xp' && target !== '83' && target !== '73' && target !== '82' && target !== '85' && target !== '86') target = '8xpython';
        if (target === '8xpython') { if (format !== 'im8c' && format !== '8ca' && format !== '8ci') format = 'im8c'; }
        else if (target === '8xcolor') { if (format !== '8ca' && format !== '8ci') format = '8ca'; }
        else if (target === '8xp') { format = '8xi'; }
        else if (target === '83') { if (format !== '8xi' && format !== '83i') format = '8xi'; }
        else if (target === '73') { if (format !== '8xi' && format !== '73i') format = '8xi'; }
        else if (target === '82') { format = '82i'; }
        else if (target === '86') { format = '86i'; }
        else if (target === '85') { format = '85i'; }
    </script>
</head>

<body>
<br>
<div class="bootstrap"><div style="text-align: center; margin: auto">
    <div class="btn-group" id="targetButtons">
        <a class="btn disabled" style="font-weight: bold;padding-left: 4px;padding-right: 4px;" href="#">TI</a>
        <script>
        document.write(`<a class="btn btn-info" data-target="8xpython" href="?target=8xpython&amp;format=${format}">83PCE / 84+CE Python</a>`);
        document.write(`<a class="btn btn-info" data-target="8xcolor" href="?target=8xcolor&amp;format=${format}">83PCE / 84+CE / 84+CSE</a>`);
        document.write(`<a class="btn btn-info" data-target="8xp" href="?target=8xp&amp;format=${format}">82+ / 82A / 83+ / 84+ / 84Pocket</a>`);
        document.write(`<a class="btn btn-info" data-target="83" href="?target=83&amp;format=${format}">76 / 82Stats / 83</a>`);
        document.write(`<a class="btn btn-info" data-target="73" href="?target=73&amp;format=${format}">73</a>`);
        document.write(`<a class="btn btn-info" data-target="82" href="?target=82&amp;format=${format}">82</a>`);
        document.write(`<a class="btn btn-info" data-target="86" href="?target=86&amp;format=${format}">86</a>`);
        document.write(`<a class="btn btn-info" data-target="85" href="?target=85&amp;format=${format}">85</a>`);
        document.querySelector(`a.btn[data-target='${target}']`).classList.add('active');
        </script>
    </div>
</div></div>
<br>
<div class="bootstrap"><div style="text-align: center; margin: auto">
    <div class="btn-group" id="formatButtons">
        <a class="btn disabled" style="font-weight: bold;padding-left: 4px;padding-right: 4px;" href="#">Format</a>
        <script>
        if (target === '8xpython') document.write(`<a class="btn btn-info ${format === 'im8c' ? 'active' : ''}" href="?target=${target}amp;&format=im8c">Python-IM8C.8xv</a>`);
        if (target === '8xpython' || target === '8xcolor') document.write(`<a class="btn btn-info ${format === '8ca' ? 'active' : ''}" href="?target=${target}&amp;format=8ca">ImageX.8ca</a>`);
        if (target === '8xpython' || target === '8xcolor') document.write(`<a class="btn btn-info ${format === '8ci' ? 'active' : ''}" href="?target=${target}&amp;format=8ci">PicX.8ci</a>`);
        if (target === '8xp' || target === '83' || target === '73') document.write(`<a class="btn btn-info ${format === '8xi' ? 'active' : ''}" href="?target=${target}&amp;format=8xi">PicX.8xi</a>`);
        if (target === '83') document.write(`<a class="btn btn-info ${format === '83i' ? 'active' : ''}" href="?target=${target}&amp;format=83i">PicX.83i</a>`);
        if (target === '73') document.write(`<a class="btn btn-info ${format === '73i' ? 'active' : ''}" href="?target=${target}&amp;format=73i">PicX.73i</a>`);
        if (target === '82') document.write(`<a class="btn btn-info ${format === '82i' ? 'active' : ''}" href="?target=${target}&amp;format=82i">PicX.82i</a>`);
        if (target === '86') document.write(`<a class="btn btn-info ${format === '86i' ? 'active' : ''}" href="?target=${target}&amp;format=86i">PicX.86i</a>`);
        if (target === '85') document.write(`<a class="btn btn-info ${format === '85i' ? 'active' : ''}" href="?target=${target}&amp;format=85i">PicX.85i</a>`);
        </script>
    </div>
</div></div>

<br>

<script type="module">
    //import * as Magick from './magick/magickApi.js';
    import * as Magick from 'https://knicknic.github.io/wasm-imagemagick/magickApi.js';

    let outWidth = 0;
    let outHeight = 0;
    let inFileName = "";
    let paletteFile = [];
    let palette_a = [];

    function handlePaletteURL(file) {
        paletteFile = [];
        const paletteImg = new Image();
        paletteImg.src = file;
        paletteImg.onload = function () {
            handlePaletteImg(paletteImg);
        };
    }

    function handlePaletteImg(img) {
        const canvas = document.getElementById('paletteCanvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);
        const imgData = context.getImageData(0, 0, img.width, img.height);
        const imgBuffer = imgData.data.buffer;
        palette_a = new Uint8Array(imgBuffer);
        canvas.toBlob(handlePaletteCanvas);
    }

    async function handlePaletteCanvas(blob) {
        const sourceBytes = await blob.arrayBuffer();
        const localName = "palette.png";
        paletteFile = [{'name': localName, 'content': sourceBytes}];
    }

    function handleInFile(file) {
        if(format === "8ci") handlePaletteURL("./pal8ci.png");
        const fileReader = new FileReader();
        fileReader.onload = handleInFileData;
        fileReader.readAsDataURL(file);
        inFileName = file['name'];
    }

    function handleInFileData(file) {
        const inImg = new Image();
        inImg.src = file.target.result;
        inImg.onload = function () {
            handleInImg(inImg);
        };
    }

    function handleInImg(img) {
        const canvas = document.getElementById('inImgCanvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);
        canvas.toBlob(handleInCanvas);
    }

    async function handleInCanvas(blob) {
        if(format === "8ci" && paletteFile.length === 0) {
            setTimeout(handleInCanvas, 100, blob);
            return;
        }
        const sourceBytes = await blob.arrayBuffer();
        const localName = "input.png";
        let files = [{'name': localName, 'content': sourceBytes}];
        let command;
        if (format === "im8c") {
            [outWidth, outHeight] = [320, 210];
            command = ["convert", localName, "-channel", "red", "-depth", "5", "-channel", "green", "-depth", "6", "-channel", "blue", "-depth", "5", "-channel", "alpha", "-depth", "1", "-resize", `${outWidth}x${outHeight}>`, "-colors", "256", "out.png"];
        } else if (format === "8ca") {
            [outWidth, outHeight] = [134, 83];
            command = ["convert", localName, "-background", "white", "-flatten", "-resize", `${outWidth-1}x${outHeight}!`, "-gravity", "northeast", "-splice", "1x0", "out.png"];
        } else if (format === "8ci") {
            [outWidth, outHeight] = [266, 165];
            files = files.concat(paletteFile);
            command = ["convert", localName, "-resize", `${outWidth-1}x${outHeight}!`, "-remap", "palette.png", "-gravity", "northeast", "-splice", "1x0", "out.png"];
        } else if (format === "8xi" || format === "83i" || format === "73i" || format === "82i") {
            [outWidth, outHeight] = [96, 63];
            command = ["convert", localName, "-background", "white", "-flatten", "-resize", `${outWidth-1}x${outHeight}!`, "-colorspace", "Gray", "-auto-level", "-posterize", "2", "-gravity", "northeast", "-splice", "1x0", "-transparent", "white", "out.png"];
        } else if (format === "85i" || format === "86i") {
            [outWidth, outHeight] = [128, 63];
            command = ["convert", localName, "-background", "white", "-flatten", "-resize", `${outWidth-1}x${outHeight}!`, "-colorspace", "Gray", "-auto-level", "-posterize", "2", "-gravity", "northeast", "-splice", "1x0", "-transparent", "white", "out.png"];
        }
        const processedFiles = await Magick.Call(files, command);
        const firstOutputImg = processedFiles[0];

        const inImg = document.getElementById("inImg");
        inImg.src = URL.createObjectURL(blob);
        inImg.style.maxWidth = `${outWidth}px`;
        inImg.style.maxHeight = `${outHeight}px`;
        const outImg = document.getElementById("outImg");
        outImg.onload = function () {
            handleOutImg(outImg);
        };
        outImg.src = URL.createObjectURL(firstOutputImg['blob']);
    }

    function getRawPixel(img, i) {
        i *= 4;
        return [img[i], img[i + 1], img[i + 2], img[i + 3]];
    }

    function getPixel(img, i, r, g, b, a) {
        i *= 4;
        return img[i + 2] >> (8 - r) | img[i + 1] >> (8 - g) << r | img[i] >> (8 - b) << (r + g) | img[i + 3] >> (8 - a) << (r + g + b);
    }

    function handleOutImg(img) {
        const canvas = document.getElementById('outImgCanvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const context = canvas.getContext('2d');
        context.drawImage(img, 0, 0);
        const imgData = context.getImageData(0, 0, img.width, img.height);
        const imgBuffer = imgData.data.buffer;  // ArrayBuffer
        const img_a = new Uint8Array(imgBuffer);
        let data = [];

        switch (format)
        {
            case "im8c": {
                const paletteRGBA_a = [];
                let ialpha = -1;
                const r = 5, g = 6, b = 5, a = 1;
                for (let i = 0; i < img.height * img.width; i++) {
                    const color = getPixel(img_a, i, r, g, b, a);
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
                    const curcolor = getPixel(img_a, i, r, g, b, a);
                    const icolor = paletteRGBA_a.indexOf(curcolor);
                    let ncurcolor = 1;
                    while (ncurcolor < 128 && i < img.height * img.width - 1 && curcolor === getPixel(img_a, i + 1, r, g, b, a)) {
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
                    const color = getPixel(img_a, outWidth * (outHeight - Math.floor(i / outWidth) - 1) + (i % outWidth), r, g, b, a);
                    data.push(color & 0xFF, color >> 8);
                }
                break;
            }

            case "8ci": {
                const paletteRGBA_a = [];
                for (let i = 0; i < palette_a.length / 4; i++) {
                    const color = getRawPixel(palette_a, i);
                    paletteRGBA_a.push(color);
                }

                // workaround - although the colors are correct if checked on the ouput <img> screen capture
                // RGBA colors in the output canvas Uint8Array(canvas.data.buffer) can slightly differ
                const nearestiRGB = function(color, palette) {
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

                for (let i = 0; i < img.height * img.width; i += 2) {
                    let icolor = 0;
                    for (let j = 0; j < 2; j++) {
                        const color = getRawPixel(img_a, i + j);
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
                        const color = getPixel(img_a, i + j, 0, 0, 0, 1);
                        icolor = (icolor << 1) | color;
                    }
                    data.push(icolor);
                }
                break;
            }

            default:
                const err = "Unsupported conversion type";
                alert(err);
                throw err;
        }

        data = [].concat(
            int2LittleEndianArray(data.length, 2),
            data
        );

        let name = "";
        let calcname = "";
        if (format === "im8c" || format === "86i" || format === "85i") {
            name = inFileName;
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
            calcname = name;
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
            calcname = `${(format === "8ca") ? "Image" : "Pic"}${num}`;
            if (num === 0) num = 10;
            name = String.fromCharCode((format === "8ca") ? 0x3C : 0x60, num - ((format === "73i") ? 0 : 1));
        }
        const nameArray = str2charCodeArray(padStr(name, 8, String.fromCharCode((format === "85i" || format === "86i") ? 0x20 : 0x00)));
        const size2 = data.length;
        data = [].concat(
            int2LittleEndianArray(size2, 2),
            data,
        );
        if (format === "8xv" || format === "8ca" || format === "8ci" || format === "8xi")
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
                calcname.length,
                data,
            );
        }
        data = [].concat(
            int2LittleEndianArray(size2, 2),
            [(format === "im8c") ? 0x15 : (format === "8ca") ? 0x1A : (format === "86i" || format === "85i") ? 0x11 : 0x07],
            data,
        );
        data = [].concat(
            int2LittleEndianArray(data.length - size2 - 2, 2),
            data,
        );
        data = [].concat(
            str2charCodeArray((format === "82i") ? "**TI82**" : (format === "85i") ? "**TI85**" : (format === "86i") ? "**TI86**" : (format === "73i") ? "**TI73**" : (format === "83i") ? "**TI83**" : "**TI83F*"),
            [0x1A, (format === "85i") ? 0x0C : 0x0A, (format === "im8c") ? 0x0A : (format === "8ci") ? 0x0F : (format === "8xi") ? 0x0B : 0x00],
            str2charCodeArray(padStr("Created on TI-Planet.org by img2calc", 42, String.fromCharCode(0))),
            int2LittleEndianArray(data.length, 2),
            data,
            int2LittleEndianArray(crcti8x(data), 2),
        );

        addBlobFileLink(new Uint8Array(data), `${calcname}${(format === "im8c") ? ".8xv" : `.${format}`}`, document.getElementById("fileList"));
    }

    function crcti8x(data) {
        return data.reduce((a, b) => a + b, 0) & 0xFFFF;
    }

    function padStr(str, n, char) {
        str = str.substring(0, n);
        while (str.length < n)
            str += char;
        return str;
    }

    function int2LittleEndianArray(v, n) {
        const array = [];
        for (let i = 0; i < n; i++) {
            array.push(v & 0xff);
            v >>= 8;
        }
        return array;
    }

    function str2charCodeArray(str) {
        const array = [];
        for (let i = 0; i < str.length; i++)
            array.push(str.charCodeAt(i));
        return array;
    }

    function addBlobFileLink(file, name, parent) {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = window.URL.createObjectURL((new Blob([file], {type: 'application/octet-stream'})));
        a.download = name;
        a.innerText = name;
        li.appendChild(a);
        parent.appendChild(li);
    }

    if (!(window.File && window.FileReader && window.FileList && window.Blob)) {
        alert("Reading files not supported by this browser");
    } else {
        window.handleInFile = handleInFile;
    }
</script>

<div id="mainContent">
    <div id="inFrame" class="img">
        <br>
        <p><b>Source image:</b></p>
        <img id="inImg" alt="" src=""/>
        <div id="inFile" class="file">
            <form class="my-form">
                <p>Choose your image file</p>
                <input type="file" id="fileElem" accept="image/*" onchange="handleInFile(this.files[0])">
                <label class="button" for="fileElem">Select the image</label>
            </form>
        </div>
    </div>
    <div id="outFrame" class="img">
        <br>
        <p><b>Converted image:</b></p>
        <img id="outImg" alt="" src=""/>
        <div id="outFile" class="file">
            <ul id="fileList"></ul>
        </div>
    </div>
    <canvas id="inImgCanvas" style="display:none"></canvas>
    <canvas id="outImgCanvas" style="display:none"></canvas>
    <canvas id="paletteCanvas" style="display:none"></canvas>
</div>

</body>
</html>