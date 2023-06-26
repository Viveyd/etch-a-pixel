fillCanvas(document.querySelector(".workspace .canvas"), 50);
[...document.querySelectorAll(".brush-settings input")].forEach(btn => btn.addEventListener("click", soleSelect));

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
            e.target.style.backgroundColor = getRandomHSL();
        } else if(colorizers[2].classList.contains("selected")){ // ROYGBIV
            const ROYGBIV = [
                "hsl(0, 100%, 50%)", 
                "hsl(38.8, 100%, 50%)", 
                "hsl(60, 100%, 50%)", 
                "hsl(120, 100%, 50%)", 
                "hsl(240, 100%, 50%)", 
                "hsl(274.6, 100%, 25.5%)", 
                "hsl(273.6, 100%, 50%)"];
            let dataIndex = Number(colorizers[2].getAttribute("data-index"));
            if(dataIndex > 6 || dataIndex < 0) dataIndex = 0;
            e.target.style.backgroundColor = ROYGBIV[dataIndex];
            colorizers[2].setAttribute("data-index", dataIndex+1);
        } 
    }
    // 4.) Darkener and Lightener problem can be solved by using hsl
}

function getRandomRGB(){
    const randomNumGen = () => Math.floor((Math.random() * 255) + 0);
    return `rgb(${randomNumGen()},${randomNumGen()},${randomNumGen()})`;
}

function getRandomHSL(){
    const randomNumGen = (min,max) => Math.floor((Math.random() * max) + min);
    return `hsl(${randomNumGen(0, 360)}.${randomNumGen(0, 9)}, ${randomNumGen(0,100)}%, ${randomNumGen(0,100)}%)`;
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