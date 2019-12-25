
var projectiles = {};

projectiles.load = function() {
    projectiles.container = [];
}

projectiles.spawn = function(x, y, xv, yv) {
    projectiles.container.push(new Projectile(x, y, xv, yv));
    let id = projectiles.container.length - 1;
    projectiles.container[id].fixture.id = id;
}

projectiles.draw = function() {
    for (let [i, v] of Object.entries(projectiles.container)) {
        v.draw();
    }
}


class Projectile {
    constructor(x, y, xv, yv) {
        this.img = gfx.joy;
        this.w = this.img.width;
        this.h = this.img.height;

        this.body = world.createBody({
            position: Vec2(x / meterScale, y / meterScale),
            type: 'dynamic',
            fixedRotation: true,
            allowSleep: false,
            bullet: true
        });
        let fixDef = { density: 1, friction: 0, restitution: 0.75 };
        this.fixture = this.body.createFixture(planck.Circle(Vec2(0, 0), this.w / 2 / meterScale), fixDef);
        this.fixture.type = 'projectile';
        this.body.setLinearVelocity(Vec2(xv / meterScale, yv / meterScale));
    }

    draw() {
        let p = this.body.getPosition();
        let x = p.x * meterScale, y = p.y * meterScale;
        image(this.img, x - this.w / 2, y - this.h / 2, this.w, this.h);
    }
}
