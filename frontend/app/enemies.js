
var enemies = {};

enemies.load = function () {
    enemies.container = [];
    enemies.spawnTimer = 1;
    enemies.spawnSpeed = 1.25;
    enemies.speed = map(Koji.config.strings.enemies.speed, 1, 10, 20, 200) // 100;
}

enemies.spawn = function (x, y, xv, yv) {
    enemies.container.push(new Enemy(x, y, xv, yv));
    let id = enemies.container.length - 1;
    enemies.container[id].fixture.id = id;
}

enemies.update = function (dt) {
    enemies.spawnTimer += enemies.spawnSpeed * dt;
    if (enemies.spawnTimer > 1) {
        enemies.spawnTimer -= 1;
        let s = max(gfx.cheese.width, gfx.cheese.height) / 2;
        let x1 = -s;
        let y1 = -s;
        let x2 = targetWidth + s;
        let y2 = targetHeight + s;
        // sample perimeter
        let p = random();
        let x, y;
        if (p < 1 / 4) {
            x = lerp(x1, x2, p * 4);
            y = y1;
        } else if (p < 1 / 2) {
            x = x2;
            y = lerp(y1, y2, p * 4 - 1);
        } else if (p < 3 / 4) {
            x = lerp(x2, x1, p * 4 - 2);
            y = y2;
        } else {
            x = x1;
            y = lerp(y2, y1, p * 4 - 3);
        }
        let dx = player.x - x;
        let dy = player.y - y;
        let xv = cos(atan2(-dy, dx)) * enemies.speed;
        let yv = -sin(atan2(-dy, dx)) * enemies.speed;
        enemies.spawn(x, y, xv, yv);
    }
}

enemies.draw = function () {
    for (let [i, v] of Object.entries(enemies.container)) {
        if (gameState === 'gameOver' && gameOver.enemyId === int(i)) {
            continue;
        }
        v.draw();
    }
}


class Enemy {
    constructor(x, y, xv, yv) {
        this.img = gfx.cheese;
        this.w = this.img.width;
        this.h = this.img.height;

        this.body = world.createBody({
            position: Vec2(x / meterScale, y / meterScale),
            type: 'dynamic',
            fixedRotation: true,
            allowSleep: false
        });
        let fixDef = { density: 1, friction: 0, restitution: 0.75 };
        this.fixture = this.body.createFixture(planck.Circle(Vec2(0, 0), this.w * 0.4 / meterScale), fixDef);
        this.fixture.type = 'enemy';
        this.body.setLinearVelocity(Vec2(xv / meterScale, yv / meterScale));
    }

    draw() {
        let p = this.body.getPosition();
        let x = p.x * meterScale, y = p.y * meterScale;
        image(this.img, x - this.w / 2, y - this.h / 2, this.w, this.h);
    }
}
