function Mouse() {
	this.x = 0;
	this.y = 0;
	this.hover;
	this.held = 0;
	this.ctrl = false;
	this.type = Properties.Stone;
	this.selected = null;
	this.placed = 0;
}

Mouse.prototype.setType = function(type) {
	this.type = Properties[type];
}

Mouse.prototype.place = function() {
	this.selected = grid.select();
	if (this.selected != null) {
		if (this.held == 1)
			grid.set(this.selected.x, this.selected.y, this.selected.z, this.type);
		else
			grid.set(this.selected.x, this.selected.y, this.selected.z, Properties.Air());
	}
}

Mouse.prototype.move = function(e) {
	//e = window.event || e;
	
	var rect = canvas.getBoundingClientRect();
	this.x = Math.round((e.clientX - rect.left));
	this.y = Math.round((e.clientY - rect.top));
	
	if (this.hover && this.held > 0) {
		this.place();
	}
}

Mouse.prototype.down = function(e) {
	if(this.hover) {
		e.preventDefault();
		++this.placed;
		if (this.ctrl)
			this.held = 3;
		else
			this.held = e.which;
		this.place();
	}
}

Mouse.prototype.up = function(e) {
	if (this.hover) {
		e.preventDefault();
	}
	this.held = 0;
}

document.onmousemove = (e) => {mouse.move(e)};
document.onmousedown = (e) => {mouse.down(e)};
document.onmouseup = (e) => {mouse.up(e)};
document.onkeydown = (e) => {if(e.keyCode == 17) mouse.ctrl = true;};
document.onkeyup = (e) => {if(e.keyCode == 17) mouse.ctrl = false;};