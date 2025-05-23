// Main entry point for img2calc

import { configForFormat, getFit, getRatio, getColors, getWidth, getHeight, setWidth, setHeight } from './config.js';
import { handleInFile, handleOutImg } from './image-processor.js';

// Make the necessary functions and variables available globally
window.configForFormat = configForFormat;
window.getFit = getFit;
window.getRatio = getRatio;
window.getColors = getColors;
window.getWidth = getWidth;
window.getHeight = getHeight;
window.setWidth = setWidth;
window.setHeight = setHeight;
window.handleInFile = handleInFile;
window.handleOutImg = handleOutImg;

document.addEventListener('DOMContentLoaded', function() {
    window.config = configForFormat[window.format];

    // Initialize form values
    document.getElementById("colorInput").value = config[5];
    document.getElementById("widthInput").value = config[0];
    document.getElementById("heightInput").value = config[1];

    // Disable width/height inputs if not editable
    if (!config[2]) {
        document.getElementById("widthInput").disabled = true;
        document.getElementById("heightInput").disabled = true;
    }

    // Add size buttons if available
    let configs_array = config[6];
    if (config[2] && configs_array.length > 0) {
        let sizeButtons = document.getElementById("sizeButtons");
        if (sizeButtons) {
            for(let i=0; i<configs_array.length; i++) {
                let button = document.createElement("a");
                button.className = "btn btn-success";
                button.title = configs_array[i][1] + "×" + configs_array[i][2];
                button.href = "javascript:setWidth(" + configs_array[i][1] + ");setHeight(" + configs_array[i][2] + ");";
                button.innerText = configs_array[i][0];
                sizeButtons.appendChild(button);
            }
        }
    }

    // Highlight code blocks
    if (typeof hljs !== 'undefined' && typeof $ !== 'undefined') {
        hljs.configure({"useBR":true});
        function do_highlight_codes() {
            $(document).ready(function(){
                $(".codebox dd code, code.inline").each(function(i, e){ hljs.highlightBlock(e); });
                $("code.hljs:not(.inline)").each(function(){
                    var n=$(this);
                    if("true"!==n.attr("data-lines-done")){
                        var e=n.attr("class").replace("hljs","").trim().split(/\s+/),
                            t=""===e[0]?e[1]:e.length>1&&""!==e[e.length-1]?"<span title='("+e[1]+" ?)'>"+e[0]+"</span>":e[0],
                            a=n.parent().siblings().eq(0)[0];
                        a&&a.innerHTML&&(a.innerHTML=a.innerHTML.replace("Code: ","Code "+(t?t:'')+" :  "));
                        var l=n.html().split("<br>");
                        l.forEach(function(n,e){l[e]='<span class="hljs-comment line-number" data-line="'+(e+1)+'"></span>'+n}),
                        n.html(l.join("<br>")),
                        n.attr("data-lines-done","true")
                    }
                });
            });
        }
        do_highlight_codes();
    }
});
