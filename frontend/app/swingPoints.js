
var swingPoints = {};

swingPoints.preload = function() {
    swingPoints.tints = {
        default: color(160),
        target: color(255, 233, 124),
        held: color(85, 203, 22)
    };
}

swingPoints.load = function() {
    swingPoints.container = {};
    swingPoints.target = 0;
}

swingPoints.update = function(dt) {
    let x1 = cam.x - scaledWidth / 2;
    let x2 = cam.x + scaledWidth / 2;
    let frequency = 400;
    let visible = new Set();
    let foundTarget = false;
    for (let i = max(floor(x1 / frequency) - 1, 0); i <= floor(x2 / frequency) + 1; i++) {
        visible.add(i);
        if (swingPoints.container[i] === undefined) {
            swingPoints.container[i] = { x: (i + 0.1 + random(0.9)) * frequency, y: -600 + random() * 200 };
        }
        let p = swingPoints.container[i];
        if (p.x > player.x) {
            if (!foundTarget) {
                p.type = 'target';
                swingPoints.target = i;
            } else {
                p.type = 'front';
            }
            foundTarget = true;
        } else {
            p.type = 'back';
        }
    }
    for (let i in swingPoints.container) {
        if (!visible.has(int(i))) {
            delete swingPoints.container[i];
            if (player.heldTarget === int(i)) {
                player.heldTarget = undefined;
            }
        }
    }
}

swingPoints.draw = function() {
    push();
    for (let [i, p] of Object.entries(swingPoints.container)) {
        fill(255);
        rect(p.x - 30, p.y - 30, 60, 60, 10);
        if (player.heldTarget === int(i)) {
            tint(swingPoints.tints.held);
        } else if (p.type === 'target') {
            tint(swingPoints.tints.target);
        } else {
            tint(swingPoints.tints.default);
        }
        image(gfx.box, p.x - 25, p.y - 25, 50, 50);
    }
    pop();
}