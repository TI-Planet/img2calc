// Configuration and UI setup for img2calc
// Contains the configForFormat object and UI-related functions

// default canvas w+h, editable canvas w+h?, max canvas w+h, depth, list
const configForFormat = {
   'c2p':             [320,528,true ,528,528,Math.pow(2,16),[["full" ,320,528],["graph",310,401],["1/2 graph",310,185],["graph rotated",518,193],["1/2 graph rotated",518,81]]],
   'i.c2p':           [320,528,true ,528,528,Math.pow(2,3) ,[["full" ,320,528],["graph",310,401],["1/2 graph",310,185],["graph rotated",518,193],["1/2 graph rotated",518,81]]],
   'cp.g3p':          [384,192,true ,384,192,Math.pow(2,16),[["reset" ,384,192]]],
   'cp_i.g3p':        [384,192,true ,384,192,Math.pow(2,3) ,[["reset" ,384,192]]],
   'cp01.g3p':        [384,192,true ,384,192,Math.pow(2,16),[["reset" ,384,192]]],
   'cp01_i.g3p':      [384,192,true ,384,192,Math.pow(2,3) ,[["reset" ,384,192]]],
   'cp01.g4p':        [384,192,true ,384,192,Math.pow(2,16),[["reset" ,384,192]]],
   'cp01_i.g4p':      [384,192,true ,384,192,Math.pow(2,3) ,[["reset" ,384,192]]],
   'im8c.8xv':        [320,210,true ,320,210,Math.pow(2,8) ,[["full" ,320,210],["menu" ,320,191]]],
   '8ca':             [134,83 ,false,134,83 ,Math.pow(2,16),[["reset",134,83 ]]],
   '8ci':             [266,165,false,266,165,Math.pow(2,4) ,[["reset",266,165]]],
   '8xi':             [96 ,63 ,false,96 ,63 ,Math.pow(2,1) ,[["reset",96 ,63]]],
   '83i':             [96 ,63 ,false,96 ,63 ,Math.pow(2,1) ,[["reset",96 ,63]]],
   '82i':             [96 ,63 ,false,96 ,63 ,Math.pow(2,1) ,[["reset",96 ,63]]],
   '73i':             [96 ,63 ,false,96 ,63 ,Math.pow(2,1) ,[["reset",96 ,63]]],
   '85i':             [128,63 ,false,128,63 ,Math.pow(2,1) ,[["reset",128,63]]],
   '86i':             [128,63 ,false,128,63 ,Math.pow(2,1) ,[["reset",128,63]]],
   'zpic':            [320,195,false,320,195,Math.pow(2,16),[["reset",320,195]]],
   'casioplot_g3.py': [128,64 ,true ,128,64 ,3             ,[["reset" ,128,64]]],
   'graphic_g3.py':   [128,64 ,true ,128,64 ,3             ,[["reset" ,128,64]]],
   'gint_g3.py':      [128,64 ,true ,128,64 ,3             ,[["reset" ,128,64]]],
   'casioplot_cg.py': [384,192,true ,384,192,Math.pow(2,8) ,[["reset" ,384,192]]],
   'ti_graphics.py':  [320,210,true ,320,210,Math.pow(2,8) ,[["full" ,320,210],["menu" ,320,191]]],
   'ti_draw_ce.py':   [320,210,true ,320,210,Math.pow(2,8) ,[["full" ,320,210],["menu" ,320,191]]],
   'ti_draw_cx.py':   [318,212,true ,318,212,Math.pow(2,8) ,[["reset" ,318,212]]],
   'kandinsky.py':    [320,222,true ,320,222,Math.pow(2,8) ,[["reset" ,320,222]]],
   'kandinsky_cg.py': [396,206,true ,396,206,Math.pow(2,8) ,[["reset" ,396,206]]],
   'graphic.py':      [320,222,true ,320,222,Math.pow(2,8) ,[["full" ,320,222],["menu", 320,205]]],
   'graphic_ns.py':   [320,222,true ,320,222,3 ,            [["full" ,320,222],["menu", 320,205]]],
   'graphic_cg.py':   [384,192,true ,384,192,Math.pow(2,8) ,[["full" ,384,192],["menu", 384,174]]],
   'gint_cg.py':      [396,224,true ,396,224,Math.pow(2,8) ,[["full" ,396,224],["menu", 384,206]]],
   'nsp_cx.py':       [320,240,true ,320,240,Math.pow(2,8) ,[["reset" ,320,240]]],
   'nsp_ns.py':       [320,240,true ,320,240,3             ,[["reset" ,320,240]]],
   'hpprime.py':      [320,240,true ,320,240,Math.pow(2,8) ,[["full" ,320,240],["menu" ,320,220]]],
   'microbit.py':     [5,  5,  false,5  ,  5,10            ,[["reset",5,5]]],
   'ti_hub_mb.py':    [5,  5,  false,5  ,  5,10            ,[["reset",5,5]]],
   'ti_hub_rgbarr.py':[8,  2,  false,8  ,  2,Math.pow(2,24),[["reset",8,2]]],
};

// UI form functions
function getFit() {
    return document.getElementById("fitInput").checked;
}

function getRatio() {
    return document.getElementById("ratioInput").checked;
}

function getColors() {
    return document.getElementById("colorInput").value;
}

function getWidth() {
    return document.getElementById("widthInput").value;
}

function getHeight() {
    return document.getElementById("heightInput").value;
}

function setWidth(w) {
    document.getElementById("widthInput").value = w;
}

function setHeight(h) {
    document.getElementById("heightInput").value = h;
}

// Export the configuration
export { configForFormat, getFit, getRatio, getColors, getWidth, getHeight, setWidth, setHeight };