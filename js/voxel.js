function Voxel(template, x, y ,z) {
	for (var property in template)
		this[property] = template[property];
	this.x = x;
	this.y = y;
	this.z = z;
	this.updated = false;
	this.canvas = null;
	this.special = null;
	this.history = 0;
}

//TODO: Draw this face by face for transparency and "shading"
Voxel.prototype.draw = function() {
	this.canvas = {
		x: grid.origin.x + this.x * grid.width / 2 - this.y * grid.width / 2,
		y: grid.origin.y - (this.x + this.y) * grid.depth / 2 - (this.z) * grid.height,
		color: "#"+this.r+this.g+this.b
	};
	
	//LEFT
	if(this.a == 1 || this.x == 0 || grid.array[this.x - 1][this.y][this.z].type != this.type) {
		ctx.beginPath();
		ctx.moveTo(this.canvas.x, this.canvas.y);
		ctx.lineTo(this.canvas.x - grid.width / 2, this.canvas.y - grid.depth / 2);
		ctx.lineTo(this.canvas.x - grid.width / 2, this.canvas.y - grid.depth / 2 - grid.height);
		ctx.lineTo(this.canvas.x, this.canvas.y - grid.height);
		ctx.fillStyle = this.canvas.color;
		ctx.globalAlpha = this.a;
		ctx.fill();
		ctx.fillStyle = "black";
		ctx.globalAlpha = this.a * 0.1;
		ctx.fill();
	}
	
	//TOP
	if(this.a == 1 || this.z == grid.scale - 1 || grid.array[this.x][this.y][this.z+1].type != this.type) {
		ctx.beginPath();
		ctx.moveTo(this.canvas.x - grid.width / 2, this.canvas.y - grid.depth / 2 - grid.height);
		ctx.lineTo(this.canvas.x, this.canvas.y - grid.depth - grid.height);
		ctx.lineTo(this.canvas.x + grid.width / 2, this.canvas.y - grid.depth / 2 - grid.height);
		ctx.lineTo(this.canvas.x, this.canvas.y - grid.height);
		ctx.fillStyle = this.canvas.color;
		ctx.globalAlpha = this.a;
		ctx.fill();
	}
	
	//RIGHT
	if(this.a == 1 || this.y == 0 || grid.array[this.x][this.y - 1][this.z].type != this.type) {
		ctx.beginPath();
		ctx.moveTo(this.canvas.x, this.canvas.y);
		ctx.lineTo(this.canvas.x + grid.width / 2, this.canvas.y - grid.depth / 2);
		ctx.lineTo(this.canvas.x + grid.width / 2, this.canvas.y - grid.depth / 2 - grid.height);
		ctx.lineTo(this.canvas.x, this.canvas.y - grid.height);
		ctx.fillStyle = this.canvas.color;
		ctx.globalAlpha = this.a;
		ctx.fill();
		ctx.fillStyle = "white";
		ctx.globalAlpha = this.a * 0.1;
		ctx.fill();
	}
	
	ctx.globalAlpha = 1;
}

Voxel.prototype.hover = function() {
	if (this.a < 0.25 || this.type == "Ghost" || this.history == mouse.placed) return null;

	if	(mouse.x > this.canvas.x - grid.width / 2) {
		if (mouse.x < this.canvas.x) {
			if (mouse.y > this.canvas.y - grid.depth / 2 - grid.height - (mouse.x - this.canvas.x + grid.width / 2) * grid.depth / grid.width) {
				if (mouse.y < this.canvas.y - grid.depth / 2 - grid.height + (mouse.x - this.canvas.x + grid.width / 2) * grid.depth / grid.width)
					return {x: this.x, y: this.y, z: this.z + 1}; //Top (Left)
				else if (mouse.y < this.canvas.y - grid.depth / 2 + (mouse.x - this.canvas.x + grid.width / 2) * grid.depth / grid.width)
					return {x: this.x - 1, y: this.y, z: this.z}; //Left
			}
		} else if (mouse.x < this.canvas.x + grid.width / 2) {
			if (mouse.y > this.canvas.y - grid.depth - grid.height + (mouse.x - this.canvas.x) * grid.depth / grid.width) {
				if (mouse.y < this.canvas.y - grid.height - (mouse.x - this.canvas.x) * grid.depth / grid.width)
					return {x: this.x, y: this.y, z: this.z + 1}; //Top(Right)
				else if (mouse.y < this.canvas.y - (mouse.x - this.canvas.x) * grid.depth / grid.width)
					return {x: this.x, y: this.y - 1, z: this.z}; //Right
			}
			
		}
	}
	
	return null;
}

Voxel.prototype.fall = function() {
	if (grid.gravity < 0 && this.z > 0 || grid.gravity > 0 && this.z < grid.scale - 1) {
		if(this.viscosity < 1 && grid.array[this.x][this.y][this.z + grid.gravity].density < this.density) {
			grid.swap(this.x, this.y, this.z, this.x, this.y, this.z  + grid.gravity);
			return true;
		}
	}
	return false;
}

Voxel.prototype.slide = function() {
	if (Math.random() > this.viscosity) {
		var axis = Math.round(Math.random()*2) - 1; //1: X, -1: Y
		var direction = Math.round(Math.random()*2) - 1;
		
		if (axis > 0) {
			if (this.x + direction >= 0 && this.x + direction < grid.scale) {
				if (grid.array[this.x + direction][this.y][this.z].density <= this.density)
					if (this.viscosity < 0.9)
						grid.swap(this.x, this.y, this.z, this.x + direction, this.y, this.z);
					else if (grid.gravity < 0 && this.z > 0 || grid.gravity > 0 && this.z < grid.scale - 1) {
						if (grid.array[this.x + direction][this.y][this.z + grid.gravity].density < this.density)
							grid.swap(this.x, this.y, this.z, this.x + direction, this.y, this.z);
					}
			}
		} else {
			if (this.y + direction >= 0 && this.y + direction < grid.scale) {
				if (grid.array[this.x][this.y + direction][this.z].density <= this.density)
					if (this.viscosity < 0.9)
						grid.swap(this.x, this.y, this.z, this.x, this.y + direction, this.z);
					else if (grid.gravity < 0 && this.z > 0 || grid.gravity > 0 && this.z < grid.scale - 1) {
						if (grid.array[this.x][this.y + direction][this.z + grid.gravity].density < this.density)
							grid.swap(this.x, this.y, this.z, this.x, this.y + direction, this.z);
					}
			}
		}
	}
}

const Properties = {
	//Air: {r: "00", g: "00", b: "00", a: 0, density: 0, viscosity: 0, type: "Air"},
	O2: {r: "00", g: "00", b: "00", a: 0, density: 0, viscosity: 0, type: "O2"},
	H2: {r: "00", g: "00", b: "00", a: 0, density: 0, viscosity: 0, type: "H2"},
	N2: {r: "00", g: "00", b: "00", a: 0, density: 0, viscosity: 0, type: "N2"},
	CO2: {r: "00", g: "00", b: "00", a: 0, density: 0, viscosity: 0, type: "C02"},
	Sand: {r: "aa", g: "aa", b: "55", a: 1, density: 0.9, viscosity: 0.95, type: "Sand"},
	Stone: {r: "55", g: "55", b: "55", a: 1, density: 1, viscosity: 1, type: "Stone"},
	Water: {r: "33", g: "33", b: "88", a: 0.75, density: 0.75, viscosity: 0.3, salt: 0, type: "Water"},
	Glass: {r: "33", g: "aa", b: "aa", a: 0.5, density: 1, viscosity: 1, type: "Glass"}
};

Properties.Air = function() {
	var type = Math.random();
	return this.N2;
}