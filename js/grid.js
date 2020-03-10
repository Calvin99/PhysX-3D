function Grid(scale) {
	this.scale = scale;
	this.width = Width / scale;
	
	this.depth = (Height * 2 / 5) / scale;
	this.height = (Height * 3 / 5) / scale;
	
	this.origin = {
		x: this.width / 2 * this.scale,
		y: (this.height + this.depth) * this.scale
	};
	
	this.array = [];
	for (x = 0; x < this.scale; ++x) {
		this.array[x] = [];
		for (y = 0; y < this.scale; ++y) {
			this.array[x][y] = [];
			for (z = 0; z < this.scale; ++z)
				this.array[x][y][z] = new Voxel(Properties.Air(), x, y, z);
		}
	}
	
	this.gravity = -1;
}

Grid.prototype.draw = function() {
	ctx.strokeStyle = "#555";
	ctx.lineWidth = 1;
	
	//LEFT
	ctx.beginPath();
	ctx.moveTo(this.origin.x - this.width / 2 * this.scale, this.origin.y - (this.depth / 2) * this.scale);
	ctx.lineTo(this.origin.x - this.width / 2 * this.scale, this.origin.y - (this.depth / 2 + this.height) * this.scale);
	ctx.lineTo(this.origin.x, this.origin.y - (this.depth + this.height) * this.scale);
	ctx.lineTo(this.origin.x, this.origin.y - this.depth * this.scale);
	ctx.fillStyle = "#888";
	ctx.globalAlpha = 1;
	ctx.fill();
	ctx.fillStyle = "white";
	ctx.globalAlpha = 0.1;
	ctx.fill();
	ctx.globalAlpha = 1;
	
	//RIGHT
	ctx.beginPath();
	ctx.moveTo(this.origin.x + this.width / 2 * this.scale, this.origin.y - (this.depth / 2) * this.scale);
	ctx.lineTo(this.origin.x + this.width / 2 * this.scale, this.origin.y - (this.depth / 2 + this.height) * this.scale);
	ctx.lineTo(this.origin.x, this.origin.y - (this.depth + this.height) * this.scale);
	ctx.lineTo(this.origin.x, this.origin.y - this.depth * this.scale);
	ctx.fillStyle = "#888";
	ctx.globalAlpha = 1;
	ctx.fill();
	ctx.fillStyle = "black";
	ctx.globalAlpha = 0.1;
	ctx.fill();
	ctx.globalAlpha = 1;
	
	//BOTTOM
	ctx.beginPath();
	ctx.moveTo(this.origin.x, this.origin.y);
	ctx.lineTo(this.origin.x - this.width / 2 * this.scale, this.origin.y - (this.depth / 2) * this.scale);
	ctx.lineTo(this.origin.x, this.origin.y - this.depth * this.scale);
	ctx.lineTo(this.origin.x + this.width / 2 * this.scale, this.origin.y - (this.depth / 2) * this.scale);
	ctx.fillStyle = "#888";
	ctx.globalAlpha = 1;
	ctx.fill();
	
	for (i = 0; i <= this.scale; ++i) {
		//LEFT
		ctx.beginPath();
		ctx.moveTo(this.origin.x - this.width / 2 * this.scale, this.origin.y - this.depth / 2 * this.scale - this.height * i);
		ctx.lineTo(this.origin.x, this.origin.y - this.depth * this.scale - this.height * i);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(this.origin.x - this.width / 2 * i, this.origin.y - this.depth * this.scale + this.depth / 2 * i);
		ctx.lineTo(this.origin.x - this.width / 2 * i, this.origin.y - (this.depth + this.height) * this.scale + this.depth / 2 * i);
		ctx.stroke();
		
		//RIGHT
		ctx.beginPath();
		ctx.moveTo(this.origin.x, this.origin.y - this.depth * this.scale - this.height * i);
		ctx.lineTo(this.origin.x + this.width / 2 * this.scale, this.origin.y - this.depth / 2 * this.scale - this.height * i);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(this.origin.x + this.width / 2 * i, this.origin.y - this.depth * this.scale + this.depth / 2 * i);
		ctx.lineTo(this.origin.x + this.width / 2 * i, this.origin.y - (this.depth + this.height) * this.scale + this.depth / 2 * i);
		ctx.stroke();
		
		//BOTTOM
		ctx.beginPath();
		ctx.moveTo(this.origin.x - this.width / 2 * i, this.origin.y - this.depth * this.scale + this.depth / 2 * i);
		ctx.lineTo(this.origin.x + this.width / 2 * this.scale - this.width / 2 * i, this.origin.y - this.depth / 2 * this.scale + this.depth / 2 * i);
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(this.origin.x + this.width / 2 * i, this.origin.y - this.depth * this.scale + this.depth / 2 * i);
		ctx.lineTo(this.origin.x - this.width / 2 * this.scale + this.width / 2 * i, this.origin.y - this.depth / 2 * this.scale + this.depth / 2 * i);
		ctx.stroke();
	}

	for (x = this.scale - 1; x >= 0; --x) {
		for (y = this.scale - 1; y >= 0; --y) {
			for (z = 0; z < this.scale; ++z) {
				if(this.array[x][y][z].a > 0)
					this.array[x][y][z].draw();
			}
		}
	}
}

Grid.prototype.update = function() {
	for (x = 0; x < this.scale; ++x) {
		for (y = 0; y < this.scale; ++y) {
			for (z = 0; z < this.scale; ++z) {
				this.array[x][y][z].updated = false;
			}
		}
	}
	
	for (x = 0; x < this.scale; ++x) {
		for (y = 0; y < this.scale; ++y) {
			for (z = this.scale - 1; z >= 0; --z) {
				if (!this.array[x][y][z].updated)
					if (!this.array[x][y][z].fall()) {
						this.array[x][y][z].slide();
					}
			}
		}
	}
}

Grid.prototype.set = function (x, y, z, template) {
	this.array[x][y][z] = new Voxel(template, x, y, z);
	this.array[x][y][z].setCanvas();
	this.array[x][y][z].history = mouse.placed;
}

Grid.prototype.swap = function (x1, y1, z1, x2, y2, z2) {
	var temp1 = new Voxel(-1, -1, -1, Properties.Air);
	for (var property in this.array[x1][y1][z1])
		temp1[property] = this.array[x1][y1][z1][property];
	temp1.x = x2;
	temp1.y = y2;
	temp1.z = z2;
	temp1.updated = true;
	
	var temp2 = new Voxel(-1, -1, -1, Properties.Air);
	for (var property in this.array[x2][y2][z2])
		temp2[property] = this.array[x2][y2][z2][property];
	temp2.x = x1;
	temp2.y = y1;
	temp2.z = z1;
	temp2.updated = true;
	
	this.array[x1][y1][z1] = temp2;
	this.array[x2][y2][z2] = temp1;
}

Grid.prototype.select = function() {
	var selected;
	
	for (x = 0; x < this.scale; ++x) {
		for (y = 0; y < this.scale; ++y) {
			for (z = this.scale - 1; z >= 0; --z) {
				selected = this.array[x][y][z].hover();
				if (selected != null) {
					if (mouse.held == 3) selected = {x: x, y: y, z: z};
					break;
				}
			}
			if (selected != null) break;
		}
		if (selected != null) break;
	}
	
	if (selected != null) {
		if (selected == "N/A") selected = null;
		else if (selected.x < 0 || selected.y < 0 || selected.z > this.scale - 1) selected = null;
		return selected;
	}
	
	if (mouse.x > this.origin.x - this.width / 2 * this.scale && mouse.x < this.origin.x) {
		if (mouse.y > this.origin.y - (this.depth / 2 + this.height) * this.scale - (mouse.x - this.origin.x + this.width / 2 * this.scale) * this.depth / this.width) {
			if (mouse.y < this.origin.y - this.depth / 2 * this.scale - (mouse.x - this.origin.x + this.width / 2 * this.scale) * this.depth / this.width)
				selected = {
					x: Math.floor((mouse.x - this.origin.x + this.width / 2 * this.scale) / this.width * 2),
					y: this.scale - 1,
					z: Math.floor(((this.origin.y - this.depth / 2 * this.scale - (mouse.x - this.origin.x + this.width / 2 * this.scale) * this.depth / this.width) - mouse.y) / this.height)
				}//Left
			else if (mouse.y < this.origin.y - this.depth / 2 * this.scale + (mouse.x - this.origin.x + this.width / 2 * this.scale) * this.depth / this.width)
				selected = {
					x: Math.floor(((this.origin.y - this.depth / 2 * this.scale + (mouse.x - this.origin.x + this.width / 2 * this.scale) * this.depth / this.width) - mouse.y) / this.depth),
					y: Math.floor(((this.origin.y + this.depth / 2 * this.scale - (mouse.x - this.origin.x + this.width / 2 * this.scale) * this.depth / this.width) - mouse.y) / this.depth),
					z: 0
				}//Bottom (Left)
		}
	} else if (mouse.x > this.origin.x && mouse.x < this.origin.x + this.width / 2 * this.scale) {
		if (mouse.y > this.origin.y - (this.depth + this.height) * this.scale + (mouse.x - this.origin.x) * this.depth / this.width) {
			if (mouse.y < this.origin.y - this.depth * this.scale + (mouse.x - this.origin.x) * this.depth / this.width)
				selected = {
					x: this.scale - 1,
					y: Math.floor((this.origin.x + this.width / 2 * this.scale - mouse.x) / this.width * 2),
					z: Math.floor(((this.origin.y - this.depth * this.scale + (mouse.x - this.origin.x) * this.depth / this.width) - mouse.y) / this.height)
				}//Right
			else if (mouse.y < this.origin.y - (mouse.x - this.origin.x) * this.depth / this.width)
				selected = {
					x: Math.floor(((this.origin.y - this.depth / 2 * this.scale + (mouse.x - this.origin.x + this.width / 2 * this.scale) * this.depth / this.width) - mouse.y) / this.depth),
					y: Math.floor(((this.origin.y + this.depth / 2 * this.scale - (mouse.x - this.origin.x + this.width / 2 * this.scale) * this.depth / this.width) - mouse.y) / this.depth),
					z: 0
				}//Bottom (Right)
		}
	}
		
	return selected;
}