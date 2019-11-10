
var stars = {};

stars.w = 50;
stars.h = 50;

stars.load = function() {
    stars.container = {};
    stars.removed = new Set();
}

stars.update = function(dt) {
    let x1 = cam.x - scaledWidth / 2;
    let x2 = cam.x + scaledWidth / 2;
    let frequency = 600;
    let visible = new Set();
    for (let i = max(floor(x1 / frequency) - 1, 0); i <= floor(x2 / frequency) + 1; i++) {
        visible.add(i);
        if (stars.container[i] === undefined && !stars.removed.has(i)) {
            stars.container[i] = {
                x: (i + 0.1 + random(0.9)) * frequency,
                y: -200 + random() * 300
            };
        }
    }
    for (let i in stars.container) {
        if (!visible.has(int(i))) {
            delete stars.container[i];
        }
    }
    for (let [i, v] of Object.entries(stars.container)) {
        // collide with player
        if (player.x + player.w / 2 > v.x - stars.w / 2 && player.x - player.w / 2 < v.x + stars.w / 2
        && player.y > v.y - stars.h / 2 && player.y - player.h < v.y + stars.h / 2) {
            player.stars += 1;
            player.updateScore();
            sfx.star.play();
            delete stars.container[i];
            stars.removed.add(int(i));
        }
        // remove if touching ground
        if (ground.x + ground.w > v.x - stars.w / 2 && ground.x < v.x + stars.w / 2
        && ground.y + ground.h > v.y - stars.h / 2 && ground.y < v.y + stars.h / 2) {
            delete stars.container[i];
            stars.removed.add(int(i));
        }
    }
}

stars.draw = function() {
    for (let [_, v] of Object.entries(stars.container)) {
        image(gfx.star, v.x - stars.w / 2, v.y - stars.h / 2, stars.w, stars.h);
    }
}
