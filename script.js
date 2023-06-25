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
