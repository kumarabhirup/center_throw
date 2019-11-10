
var obstacles = {};

obstacles.load = function() {
    obstacles.container = {};
    obstacles.removed = new Set();
}

obstacles.update = function(dt) {
    let x1 = cam.x - scaledWidth / 2;
    let x2 = cam.x + scaledWidth / 2;
    let frequency = 1600;
    let visible = new Set();
    for (let i = max(floor(x1 / frequency) - 1, 0); i <= floor(x2 / frequency) + 1; i++) {
        visible.add(i);
        if (obstacles.container[i] === undefined && !obstacles.removed.has(i)) {
            obstacles.container[i] = {
                x: (i + 0.1 + random(0.9)) * frequency,
                y: 10 + random() * 90,
                w: 16,
                h: 263
            };
        }
    }
    for (let i in obstacles.container) {
        if (!visible.has(int(i))) {
            delete obstacles.container[i];
        }
    }
    for (let [i, v] of Object.entries(obstacles.container)) {
        // collide with player
        if (!v.disabled && player.x + player.w / 2 > v.x && player.x - player.w / 2 < v.x + v.w
        && player.y > v.y && player.y - player.h < v.y + v.h) {
            player.grappleDisabled = true;
            player.heldTarget = undefined;
            player.xv = -player.xv;
            v.disabled = true;
            sfx.obstacleHit.play();
        }
        // remove if touching ground
        if (ground.x + ground.w > v.x && ground.x < v.x + v.w
        && ground.y + ground.h > v.y && ground.y < v.y + v.h) {
            delete obstacles.container[i];
            obstacles.removed.add(int(i));
        }
    }
}

obstacles.enableAll = function() {
    for (let [_, v] of Object.entries(obstacles.container)) {
        v.disabled = false;
    }
}

obstacles.draw = function() {
    push();
    fill(0);
    for (let [_, v] of Object.entries(obstacles.container)) {
        image(gfx.obstacle, v.x, v.y, v.w, v.h);
    }
    pop();
}
