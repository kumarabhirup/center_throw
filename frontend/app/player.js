
class Player {
    constructor() {
        this.x = targetWidth / 2;
        this.y = targetHeight / 2;
        this.img = gfx.duck;
        this.w = this.img.width;
        this.h = this.img.height;

        this.clickToShoot = false;
        this.aimGrabRadius = 70;
        this.aimHeld = false;
        // joy will move distance pulled / second * multiplier
        // (travels to center in (1/multiplier) seconds)
        this.shootSpeedMultiplier = 6;

        this.body = world.createBody({
            position: Vec2(this.x / meterScale, this.y / meterScale),
            type: 'static'
        });
        let fixDef = { density: 1, friction: 0, restitution: 0 };
        this.fixture = this.body.createFixture(planck.Circle(Vec2(0, 0), this.w * 0.4 / meterScale), fixDef);
        this.fixture.setSensor(true);
    }

    mousePressed() {
        if (this.clickToShoot || dist(this.x, this.y, scaledMouseX, scaledMouseY) < this.aimGrabRadius) {
            this.aimHeld = true;
        }
    }

    mouseReleased() {
        if (this.aimHeld) {
            this.aimHeld = false;
            let x = scaledMouseX;
            let y = scaledMouseY;
            if (this.clickToShoot || dist(this.x, this.y, x, y) > this.aimGrabRadius) {
                let dx = this.x - x;
                let dy = this.y - y;
                projectiles.spawn(x, y, dx * this.shootSpeedMultiplier, dy * this.shootSpeedMultiplier);
                sfx.shoot.play();
            }
        }
    }

    draw() {
        push();
        if (this.aimHeld && gameState === 'playing') {
            stroke('#CF4EAF');
            strokeWeight(6);
            line(this.x, this.y, scaledMouseX, scaledMouseY);
        }
        image(this.img, this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
        if (this.aimHeld && gameState === 'playing') {
            image(gfx.joy, scaledMouseX - gfx.joy.width / 2, scaledMouseY - gfx.joy.height / 2);
        }
        pop();
    }
}
