
var cam = { x: 0, y: 0 };

cam.set = function() {
    push();
    translate(scaledWidth / 2 - cam.x, scaledHeight / 2 - cam.y);
}

cam.reset = function() {
    pop();
}
