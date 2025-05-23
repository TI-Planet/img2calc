// UI utilities for img2calc

import { str2charCodeArray } from './binary.js';

/**
 * Add a file download link to the UI
 * @param {Array|string} data - File data as array or string
 * @param {string} name - File name
 * @param {HTMLElement} parent - Parent element to append the link to
 */
function addBlobFileLink(data, name, parent) {
    let readable_data = "";
    if(typeof(data)=="string") {
        readable_data = data;
        data = str2charCodeArray(data);
    }
    let uint8_data = new Uint8Array(data);
    const li = document.createElement("li");
    const p = document.createElement("span");
    const a = document.createElement("a");
    a.href = window.URL.createObjectURL((new Blob([uint8_data], {type: 'application/octet-stream'})));
    a.download = name;
    a.innerText = name;
    p.appendChild(a);
    const s = document.createElement("small");
    const i = document.createElement("i");
    i.innerText = " " + (Math.round(data.length / 100) / 10) + " KB";
    s.appendChild(i);
    p.appendChild(s);
    if (readable_data.length > 0) {
        $('#srcFrame').show();
        var el = $('#source8xpcontainer code');
        el.text(readable_data);
        el.html(el.html().replace(/\n/g,'<br/>'));
        el.css('font-size', '11px');
        hljs.highlightBlock(el[0]);
        var lines = el.html().split('<br>');
        lines.forEach(function(a,b) { lines[b] = '<span class="hljs-comment line-number" data-line="'+(b+1)+'"></span>' + a });
        el.html(lines.join('<br>'));
    }
    li.appendChild(p);
    parent.appendChild(li);
}

// Export the UI functions
export { addBlobFileLink };