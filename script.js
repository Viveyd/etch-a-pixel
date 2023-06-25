function fillCanvas(canvas, size){
    canvas.innerHTML = "";
    while(canvas.children.length !== size){
        canvas.appendChild(createRow(size));
    }
}

function createRow(size){
    const row = document.createElement("div");
    while(row.children.length !== size){
        let cell = document.createElement("div");
        row.appendChild(cell);
    }
    return row;
}

function paintCell(e){
    if(e.target.classList.contains("cell")){
        e.target.style.backgroundColor = document.querySelector();
    }

    // 1.) if solid take value from color input directly (no global value)
    // 2.) if random, no input needed just generate
    // 3.) for ROYGBIV array color cycling (arr)
    // .shift (delete and return color[0]) 
    // .push (add back deleted to end of queue )
    // 4.) Darkener and Lightener problem can be solved by using hsl
}
