let interval, timeout;

fillCanvas(document.querySelector(".workspace .canvas"), 50);
[...document.querySelectorAll(".brush-settings input")].forEach(btn => btn.addEventListener("click", soleSelect));

document.querySelector(".size-con .controls .increase").addEventListener("mousedown", increaseCanvasSize);
document.querySelector(".size-con .controls .increase").addEventListener("mousedown", holdIncrease);
document.querySelector(".size-con .controls .increase").addEventListener("mouseup", stopResize);
document.querySelector(".size-con .controls .increase").addEventListener("mouseout", stopResize);

document.querySelector(".size-con .controls .decrease").addEventListener("mousedown", decreaseCanvasSize);
document.querySelector(".size-con .controls .decrease").addEventListener("mousedown", holdDecrease);
document.querySelector(".size-con .controls .decrease").addEventListener("mouseup", stopResize);
document.querySelector(".size-con .controls .decrease").addEventListener("mouseout", stopResize);

document.querySelector(".canvas-settings .color-con input").addEventListener("change", changeCanvasBG);
document.querySelector(".canvas-settings .line-toggle").addEventListener("click", toggleLines);
document.querySelector(".canvas-settings .reset-canvas").addEventListener("click", resetCanvas);

function resetCanvas(){
    fillCanvas(document.querySelector(".workspace .canvas"), 50);
    document.querySelector(".size-con .display").textContent = 50;
}

function toggleLines(e){
    const cells = document.querySelector(".workspace .canvas").querySelectorAll(".canvas-cell");
    if(e.target.getAttribute("data-state") === "lined"){
        [...cells].forEach(cell => cell.classList.remove("bordered"));
        e.target.setAttribute("data-state", "unlined");
    } else {
        [...cells].forEach(cell => cell.classList.add("bordered"));
        e.target.setAttribute("data-state", "lined");
    }
}

function changeCanvasBG(e){
    document.querySelector(".workspace .canvas").style.backgroundColor = e.target.value;
}

function increaseCanvasSize(){
    let currentSize = document.querySelector(".canvas-row").childElementCount;
    if(currentSize <= 99){
        [... document.querySelectorAll(".canvas-row")].forEach((row) => {
            let cell = document.createElement("div");
            cell.classList.add("canvas-cell")
            if(document.querySelector(".canvas-settings .line-toggle").getAttribute("data-state") === "lined") cell.classList.add("bordered");
            row.appendChild(cell);        
        })
        document.querySelector(".workspace .canvas").appendChild(createRow(currentSize+1));
        document.querySelector(".size-con .display").textContent = currentSize+1;
    }
}

function decreaseCanvasSize(){
    let currentSize = document.querySelector(".canvas-row").childElementCount;
    if(currentSize >= 2){
        [... document.querySelectorAll(".canvas-row")].forEach((row) => {
            row.removeChild(row.lastElementChild);        
        })
        document.querySelector(".workspace .canvas").removeChild(document.querySelector(".workspace .canvas").lastElementChild);
        document.querySelector(".size-con .display").textContent = currentSize-1;
    }
}

function holdIncrease(){
    timeout = setTimeout(() => {
        if(interval === null || interval === undefined){
            interval = setInterval(increaseCanvasSize, 100)
        }
    }, 150)
}

function holdDecrease(){
    timeout = setTimeout(() => {
        if(interval === undefined || interval === null){
            interval = setInterval(decreaseCanvasSize, 100)
        }
    }, 150)
}

function stopResize(){
    clearInterval(interval);
    clearTimeout(timeout);
    interval = null;
}

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
        if(document.querySelector(".canvas-settings .line-toggle").getAttribute("data-state") === "lined") cell.classList.add("bordered");

        row.appendChild(cell);
    }
    return row;
}

function paintCell(e){
    if(e.target.classList.contains("canvas-cell") ){
        const colorizers = document.querySelectorAll(".brush-settings input[type='button']");
        if(colorizers[0].classList.contains("selected")){
            colorSolidly(e.target)
        } else if(colorizers[1].classList.contains("selected")){
            colorRandomly(e.target);
        } else if(colorizers[2].classList.contains("selected")){
            colorRainbowly(e.target);
        } else if(colorizers[3].classList.contains("selected")){
            darken(e.target);
        } else if(colorizers[4].classList.contains("selected")){
            lighten(e.target);
        } 
    }
}
function colorSolidly(targetCell){
    targetCell.style.backgroundColor = document.querySelector(".brush-settings input[type='color']").value;
    targetCell.setAttribute("data-lightness", rgbStrToLightness(targetCell.style.backgroundColor)); 
}

function colorRandomly(targetCell){
    targetCell.style.backgroundColor = getRandomRGB();
    targetCell.setAttribute("data-lightness", rgbStrToLightness(targetCell.style.backgroundColor)); 
}

function colorRainbowly(targetCell){
    let rainbowBtn = document.querySelector(".brush-settings > ul > li:nth-child(3) > input[type=button]");
    let dataIndex = Number(rainbowBtn.getAttribute("data-index"));
    if(dataIndex > 6 || dataIndex < 0) dataIndex = 0;
    targetCell.style.backgroundColor = getROYGBIV(dataIndex);
    rainbowBtn.setAttribute("data-index", dataIndex+1);
    targetCell.setAttribute("data-lightness", rgbStrToLightness(targetCell.style.backgroundColor)); 
}

function darken(targetCell){
    const oldColor = targetCell.style.backgroundColor;
    const [h, s, l] = oldColor === "" ? "" : rgb2hsl(...oldColor.slice(4, -1).split(", ").map(val => Number(val)));
    const baseL = Math.floor(Number(targetCell.getAttribute("data-lightness"))/10);
    targetCell.style.backgroundColor = `hsl(${h}, ${s}%, ${l >= baseL ? l - baseL: 0}%)`;
}

function lighten(targetCell){
    const oldColor = targetCell.style.backgroundColor;
    const [h, s, l] = oldColor === "" ? "" : rgb2hsl(...oldColor.slice(4, -1).split(", ").map(val => Number(val)));
    const baseL = Math.floor(Number(targetCell.getAttribute("data-lightness"))/10);
    targetCell.style.backgroundColor = `hsl(${h}, ${s}%, ${l <= (100-baseL) ? l+baseL: 100}%)`;
}

function rgbStrToLightness(rgbStr){
    let [r,g,b] = rgbStr.slice(4, -1).split(", ");
    r = Number(r) / 255,
    g = Number(g) / 255,
    b = Number(b) / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    return Math.round(((max + min) / 2) * 100)
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
    r = r / 255,
    g = g / 255,
    b = b / 255;
    var max = Math.max(r, g, b);
    var min = Math.min(r, g, b);
    var lum = (max + min) / 2;
    var hue;
    var sat;
    if (max == min) { 
        hue = 0;
        sat = 0;
    } else {
        var c = max - min;
        sat = c / (1 - Math.abs(2 * lum - 1));
        switch(max) {
            case r:
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