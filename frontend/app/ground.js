
var ground = {};

ground.load = function() {
    ground.x = -360;
    ground.y = 0;
    ground.w = 460;
    ground.h = 260;

    ground.resetting = false;
    ground.resetT = 0;
    ground.newX = 0;
}

ground.reset = function(playerX) {
    ground.resetting = true;
    ground.resetT = 0;
    ground.newX = playerX - 360;
}

ground.update = function(dt) {
    if (ground.resetting) {
        ground.resetT += dt * 5;
        if (ground.resetT < 1) {
            ground.y = ease.inCubic(ground.resetT) * 250;
        } else {
            let t = min(ground.resetT - 1, 1);
            ground.x = ground.newX;
            ground.y = 250 * (1 - ease.outCubic(t));
            if (ground.resetT > 2) {
                ground.resetting = false;
            }
        }
    }
}

ground.draw = function() {
    push();
    image(gfx.dirt, ground.x, ground.y, ground.w, ground.h);
    fill(0, 0);
    stroke(53, 137, 11);
    strokeWeight(8);
    rect(ground.x, ground.y, ground.w, ground.h);
    pop();
}