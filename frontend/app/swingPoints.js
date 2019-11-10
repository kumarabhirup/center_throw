
var swingPoints = {};

swingPoints.preload = function() {
    swingPoints.colors = {
        default1: color(160),
        default2: color(130),
        target1: color(255, 233, 124),
        target2: color(225, 203, 94),
        held1: color(85, 203, 22),
        held2: color(55, 173, 0)
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
    let w1 = 60;
    let w2 = 50;
    let w3 = 28;
    let w4 = 22;
    let r = 10;
    for (let [i, p] of Object.entries(swingPoints.container)) {
        fill(255);
        rect(p.x - w1 / 2, p.y - w1 / 2, w1, w1, r);
        let c1, c2;
        if (player.heldTarget === int(i)) {
            c1 = swingPoints.colors.held1;
            c2 = swingPoints.colors.held2;
        } else if (p.type === 'target') {
            c1 = swingPoints.colors.target1;
            c2 = swingPoints.colors.target2;
        } else {
            c1 = swingPoints.colors.default1;
            c2 = swingPoints.colors.default2;
        }
        fill(c2);
        rect(p.x - w2 / 2, p.y - w2 / 2, w2, w2, r * w2 / w1);
        fill(c1);
        rect(p.x - w3 / 2, p.y - w3 / 2, w3, w3, r * w3 / w1);
        fill(0);
        ellipse(p.x, p.y, w4 / 2, w4 / 2);
    }
    pop();
}