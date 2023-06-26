function fillCanvas(canvas, size){
    canvas.innerHTML = "";
    canvas.classList.add("canvas")
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
    if(e.target.classList.contains("cell")){
        e.target.style.backgroundColor = document.querySelector(".brush-settings input[type='color']").value;
    }

    // 1.) if solid take value from color input directly (no global value)
    // 2.) if random, no input needed just generate
    // 3.) for ROYGBIV array color cycling (arr)
    // .shift (delete and return color[0]) 
    // .push (add back deleted to end of queue )
    // 4.) Darkener and Lightener problem can be solved by using hsl
}
