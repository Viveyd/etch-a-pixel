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
        if(colorizers[0].classList.contains("selected")){ // If solid is selected
            e.target.style.backgroundColor = document.querySelector(".brush-settings input[type='color']").value;
        } else if(colorizers[1].classList.contains("selected")){ // If changing is selected
            e.target.style.backgroundColor = `rgb(${randomRange()}, ${randomRange()}, ${randomRange()})`;
        } else if(colorizers[2].classList.contains("selected")){ // If changing is selected
            const ROYGBIV = ["red", "orange", "yellow", "green", "blue", "indigo", "violet"];
            let dataIndex = Number(colorizers[2].getAttribute("data-index"));
            if(dataIndex > 6 || dataIndex < 0) dataIndex = 0;
            e.target.style.backgroundColor = ROYGBIV[dataIndex];
            colorizers[2].setAttribute("data-index", dataIndex+1);
        } 
    }

    // 1.) if solid take value from color input directly (no global value)
    // 2.) if random, no input needed just generate
    // 3.) for ROYGBIV array color cycling (arr)
    // .shift (delete and return color[0]) 
    // .push (add back deleted to end of queue )
    // 4.) Darkener and Lightener problem can be solved by using hsl
}

function randomRange(min = 0, max = 255){
    return Math.floor((Math.random() * max) + min);
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