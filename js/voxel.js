function Voxel(template, x, y ,z) {
	for (var property in template)
		this[property] = template[property];
	this.x = x;
	this.y = y;
	this.z = z;
	this.updated = false;
	
	this.canvas = null;
	this.variance = {};
	if(Math.random() > 0.5)
		this.variance.color = "black";
	else
		this.variance.color = "white";
	this.variance.a = Math.random() / 16;
	
	this.special = null;
	this.history = 0;
}

Voxel.prototype.setCanvas = function() {
	this.canvas = {
		x: grid.origin.x + this.x * grid.width / 2 - this.y * grid.width / 2,
		y: grid.origin.y - (this.x + this.y) * grid.depth / 2 - (this.z) * grid.height,
		color: "#"+this.r+this.g+this.b
	};
}

Voxel.prototype.draw = function() {
	this.setCanvas();
	
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
		ctx.fillStyle = this.variance.color;
		ctx.globalAlpha = this.a * this.variance.a;
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
		ctx.fillStyle = this.variance.color;
		ctx.globalAlpha = this.a * this.variance.a;
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
		ctx.fillStyle = this.variance.color;
		ctx.globalAlpha = this.a * this.variance.a;
		ctx.fill();
	}
	
	ctx.globalAlpha = 1;
}

Voxel.prototype.hover = function() {
	if (this.state == "Gas" || this.type == "Ghost") return null;
	if (this.state == "Liquid" && mouse.held == 1) return null;

	if	(mouse.x > this.canvas.x - grid.width / 2) {
		if (mouse.x < this.canvas.x) {
			if (mouse.y > this.canvas.y - grid.depth / 2 - grid.height - (mouse.x - this.canvas.x + grid.width / 2) * grid.depth / grid.width) {
				if (mouse.y < this.canvas.y - grid.depth / 2 - grid.height + (mouse.x - this.canvas.x + grid.width / 2) * grid.depth / grid.width) {
					if (this.history == mouse.placed) return "N/A";
					else return {x: this.x, y: this.y, z: this.z + 1}; //Top (Left)
				} else if (mouse.y < this.canvas.y - grid.depth / 2 + (mouse.x - this.canvas.x + grid.width / 2) * grid.depth / grid.width) {
					if (this.history == mouse.placed) return "N/A";
					else return {x: this.x - 1, y: this.y, z: this.z}; //Left
				}
			}
		} else if (mouse.x < this.canvas.x + grid.width / 2) {
			if (mouse.y > this.canvas.y - grid.depth - grid.height + (mouse.x - this.canvas.x) * grid.depth / grid.width) {
				if (mouse.y < this.canvas.y - grid.height - (mouse.x - this.canvas.x) * grid.depth / grid.width) {
					if (this.history == mouse.placed) return "N/A";
					else return {x: this.x, y: this.y, z: this.z + 1}; //Top(Right)
				} else if (mouse.y < this.canvas.y - (mouse.x - this.canvas.x) * grid.depth / grid.width) {
					if (this.history == mouse.placed) return "N/A";
					else return {x: this.x, y: this.y - 1, z: this.z}; //Right
				}
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
					if (this.state != "Solid")
						grid.swap(this.x, this.y, this.z, this.x + direction, this.y, this.z);
					else if (grid.gravity < 0 && this.z > 0 || grid.gravity > 0 && this.z < grid.scale - 1) {
						if (grid.array[this.x + direction][this.y][this.z + grid.gravity].density < this.density)
							grid.swap(this.x, this.y, this.z, this.x + direction, this.y, this.z);
					}
			}
		} else {
			if (this.y + direction >= 0 && this.y + direction < grid.scale) {
				if (grid.array[this.x][this.y + direction][this.z].density <= this.density)
					if (this.state != "Solid")
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
	O2: {r: "00", g: "00", b: "00", a: 0, density: 0, viscosity: 0, state: "Gas", type: "O2"},
	H2: {r: "00", g: "00", b: "00", a: 0, density: 0, viscosity: 0, state: "Gas", type: "H2"},
	N2: {r: "00", g: "00", b: "00", a: 0, density: 0, viscosity: 0, state: "Gas", type: "N2"},
	CO2: {r: "00", g: "00", b: "00", a: 0, density: 0, viscosity: 0, state: "Gas", type: "C02"},
	Sand: {r: "aa", g: "88", b: "55", a: 1, density: 0.9, viscosity: 0.95, state: "Solid", type: "Sand"},
	Stone: {r: "55", g: "55", b: "55", a: 1, density: 1, viscosity: 1, state: "Solid", type: "Stone"},
	Water: {r: "33", g: "55", b: "88", a: 0.75, density: 0.75, viscosity: 0.3, state: "Liquid", salt: 0, type: "Water"},
	Glass: {r: "33", g: "aa", b: "aa", a: 0.5, density: 1, viscosity: 1, state: "Solid", type: "Glass"},
	Sponge: {r: "ff", g: "ff", b: "55", a: 1, density: 1, viscosity: 1, state: "Solid", saturation: 0, type: "Sponge"}
};

Properties.Air = function() {
	var type = Math.random();
	return this.N2;
}