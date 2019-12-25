
var physics = {};

var Vec2 = planck.Vec2;
var meterScale = 64;
var world;

physics.load = function() {
    world = planck.World({
        gravity: Vec2(0, 0)
    });

    world.on('begin-contact', function (contact) {
        let fixtures = [contact.getFixtureA(), contact.getFixtureB()];
        for (let i = 0; i < 2; i++) {
            let fixA = fixtures[i];
            let fixB = fixtures[1 - i];
            if (fixA === player.fixture && fixB.type === 'enemy') {
                gameState = 'gameOver';
                gameOver.enemyId = fixB.id;
                let p = fixB.getBody().getPosition();
                let x = p.x * meterScale, y = p.y * meterScale;
                gameOver.enemyHitPosition = { x: x, y: y };
                sfx.music.stop();
                sfx.gameOver.play();
            } else if (fixA.type === 'enemy' && fixB.type === 'projectile') {
                sfx.hit.play();
            }
        }
    });
}

physics.update = function(dt) {
    world.step(dt);
}
