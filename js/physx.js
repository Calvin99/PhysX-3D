var canvas = document.getElementById("physx");
var ctx = canvas.getContext("2d");

console.clear();

const Width = canvas.width;
const Height = canvas.height;

var grid = new Grid(10);
var mouse = new Mouse();

grid.set(0, 0, 0, Properties.Water);
grid.set(1, 0, 0, Properties.Water);
grid.set(0, 1, 0, Properties.Water);
grid.set(1, 1, 0, Properties.Water);
grid.set(2, 0, 0, Properties.Glass);
grid.set(2, 1, 0, Properties.Glass);
grid.set(2, 2, 0, Properties.Glass);
grid.set(1, 2, 0, Properties.Glass);
grid.set(0, 2, 0, Properties.Glass);
grid.set(9, 9, 9, Properties.Sand);
grid.set(9, 9, 8, Properties.Sand);
grid.set(9, 9, 7, Properties.Sand);
grid.set(9, 9, 6, Properties.Sand);
grid.set(9, 9, 5, Properties.Sand);
grid.set(9, 9, 4, Properties.Sand);

/*for (i = 0; i < grid.scale; ++i)
	grid.set(grid.scale - 1, grid.scale - 1, i, Properties.Glass);*/

setInterval(draw, 40);
function draw() {
	ctx.fillStyle = "#333";
	ctx.fillRect(0, 0, Width, Height);
	
	grid.update();
	
	/*console.log(grid);
	mouse.selected = grid.select();
	var temp;
	if(mouse.selected != null) {
		temp = new Voxel(-1, -1, -1, Properties.N2);
		var ghost = {};
		for (var property in mouse.type)
			ghost[property] = mouse.type[property];
		ghost.a = ghost.a / 2;
		ghost.type = "Ghost";
		for (var property in grid.array[mouse.selected.x][mouse.selected.y][mouse.selected.z])
			temp[property] = grid.array[mouse.selected.x][mouse.selected.y][mouse.selected.z][property];
		grid.set(mouse.selected.x, mouse.selected.y, mouse.selected.z, ghost);
	}*/
	grid.draw();
	/*if(mouse.selected != null) {
		for (var property in temp)
			grid.array[mouse.selected.x][mouse.selected.y][mouse.selected.z][property] = temp[property];
	}*/
}

//draw();