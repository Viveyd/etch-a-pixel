fillCanvas(document.querySelector(".workspace .canvas"), 50);
[...document.querySelectorAll(".brush-settings input")].forEach(btn => btn.addEventListener("click", soleSelect));
document.querySelector(".size.display").te

function fillCanvas(canvas, size){
    canvas.innerHTML = "";
    canvas.classList.add("canvas");
    while(canvas.children.length !== size){
        canvas.appendChild(createRow(size));
    }
}

function createRow(size){
    const row = document.createElement("div");
    row.classList.add("canvas-row")
    while(row.children.length !== size){
        let cell = document.createElement("div");
        cell.classList.add("canvas-cell")
        row.appendChild(cell);
    }
    return row;
}

function paintCell(e){
    if(e.target.classList.contains("canvas-cell") ){
        const colorizers = document.querySelectorAll(".brush-settings input[type='button']");
        if(colorizers[0].classList.contains("selected")){ // Solid
            e.target.style.backgroundColor = document.querySelector(".brush-settings input[type='color']").value;
        } else if(colorizers[1].classList.contains("selected")){ // Changing
            e.target.style.backgroundColor = getRandomRGB();
        } else if(colorizers[2].classList.contains("selected")){ // ROYGBIV
            let dataIndex = Number(colorizers[2].getAttribute("data-index"));
            if(dataIndex > 6 || dataIndex < 0) dataIndex = 0;
            e.target.style.backgroundColor = getROYGBIV(dataIndex);
            colorizers[2].setAttribute("data-index", dataIndex+1);
        } else if(colorizers[3].classList.contains("selected")){ // Darkener
            const oldColor = e.target.style.backgroundColor;
            const [h, s, l] = oldColor === "" ? "" : rgb2hsl(...oldColor.slice(4, -1).split(", ").map(val => Number(val)));
            e.target.style.backgroundColor = `hsl(${h}, ${s}%, ${l >= 10 ? l-10: 0}%)`;
        } else if(colorizers[4].classList.contains("selected")){ // Lightener
            const oldColor = e.target.style.backgroundColor;
            const [h, s, l] = oldColor === "" ? "" : rgb2hsl(...oldColor.slice(4, -1).split(", ").map(val => Number(val)));
            e.target.style.backgroundColor = `hsl(${h}, ${s}%, ${l <= 90 ? l+10: 100}%)`;
        } 
    }
}

function getROYGBIV(index){
    const ref = [
        "rgb(255, 0 , 0)", 
        "rgb(255, 127, 0)", 
        "rgb(255, 255, 0)", 
        "rgb(0, 255, 0)", 
        "rgb(0, 0, 255)", 
        "rgb(75, 0, 130)", 
        "rgb(148, 0, 211)"];
    return ref[index];
}

function getRandomRGB(){
    const randomNumGen = () => Math.floor((Math.random() * 255) + 0);
    return `rgb(${randomNumGen()},${randomNumGen()},${randomNumGen()})`;
}

function rgbToHSL(rgb){
    let trimmedRGB = rgb.slice(4, -1).split(",").map(num => Number(num)/255);
    const max = trimmedRGB.indexOf(Math.max(trimmedRGB));
    const min = trimmedRGB.indexOf(Math.min(trimmedRGB));
    const chroma = trimmedRGB[max] - trimmedRGB[min];
}

function rgb2hsl(r, g, b) {
    // see https://en.wikipedia.org/wiki/HSL_and_HSV#Formal_derivation
    // convert r,g,b [0,255] range to [0,1]
    r = r / 255,
    g = g / 255,
    b = b / 255;
    // get the min and max of r,g,b
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    // lightness is the average of the largest and smallest color components
    var lum = (max + min) / 2;
    var hue;
    var sat;
    if (max == min) { // no saturation
        hue = 0;
        sat = 0;
    } else {
        var c = max - min; // chroma
        // saturation is simply the chroma scaled to fill
        // the interval [0, 1] for every combination of hue and lightness
        sat = c / (1 - Math.abs(2 * lum - 1));
        switch(max) {
            case r:
                // hue = (g - b) / c;
                // hue = ((g - b) / c) % 6;
                hue = (g - b) / c + (g < b ? 6 : 0);
                break;
            case g:
                hue = (b - r) / c + 2;
                break;
            case b:
                hue = (r - g) / c + 4;
                break;
        }
    }
    hue = Math.round(hue * 60); // °
    sat = Math.round(sat * 100); // %
    lum = Math.round(lum * 100); // %
    return [hue, sat, lum];
}

function hexToRGB(hex){
    const HEXTABLE = [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'];
    let hexArr = [...hex.slice(1)];
    hexArr = hexArr.map(hexChar => HEXTABLE.indexOf(isNaN(hexChar) ? hexChar.toLowerCase(): Number(hexChar)));
    console.log(hexArr);
    const [r,g,b] = [hexArr[0]*16 + hexArr[1], hexArr[2]*16 + hexArr[3], hexArr[4]*16 + hexArr[5]];
    return `rgb(${r}, ${g}, ${b})`;
}

function soleSelect(e){
    if(e.target.classList.contains("selected")){
        e.target.classList.remove("selected");
        allowPainting(false);
    } else{
        allowPainting(true);
        e.target.classList.add("selected");
        const toUnselect = [...document.querySelectorAll(".brush-settings input")].filter(el => el !== e.target);
        toUnselect.forEach(el => el.classList.remove("selected"));
    }
}

function allowPainting(bool = true){
    const canvas = document.querySelector(".workspace .canvas");
    if(bool === true) canvas.addEventListener("mouseover", paintCell);
    else canvas.removeEventListener("mouseover", paintCell);
}