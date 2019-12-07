
var game = {}

game.load = function() {
    game.x = -1;
    game.y = -1;
    game.choosingX = false;
    game.choosingY = false;
    game.xTime = 0;
    game.yTime = 0;
    game.lastScore = 0;
    game.score = 0;
    game.stage = 0;
    game.numBalls = 5;
    game.kickAnimationTimer = 0;
    game.spawnedReactionText = false;
    game.spawnedPointText = false;

    game.stages = [
        {
            background: gfx.stadium1,
            goalCenterX: targetWidth / 2,
            goalCenterY: targetHeight / 2,
            aimWidth: 500,
            aimHeight: 375,
            shift: 0,
            poleColor: color('#C2D72E'),
            redColor: color('#C3796990'),
            yellowColor: color('#FCECA490'),
            greenColor: color('#5D974D90')
        }
    ];
    // define goal sizes as percentages of aim area
    let s = game.stages[0];
    s.redWidth = s.aimWidth * 0.5;
    s.redHeight = s.aimHeight;
    s.yellowWidth = s.redWidth * 0.6;
    s.yellowHeight = s.redHeight * 0.6;
    s.greenWidth = s.yellowWidth * 0.3;
    s.greenHeight = s.yellowHeight * 0.3;

    // copy properties from first stage
    game.stages[1] = Object.assign({}, game.stages[0]);
    s = game.stages[1];
    s.background = gfx.stadium2;
    s.shift = 0.001;

    game.stages[2] = Object.assign({}, game.stages[0]);
    s = game.stages[2];
    s.background = gfx.stadium3;
    s.shift = -0.001;
}

game.start = function() {
    game.choosingX = true;
    game.xTime = gameTime;
}

game.update = function(dt) {
    if (game.choosingX) {
        let xt = (gameTime - game.xTime) / 2;
        game.x = ease.inOutCubic(utils.pingPong(xt)) * 2 - 1;
    } else if (game.choosingY) {
        let yt = (gameTime - game.yTime) / 2;
        game.y = ease.inOutCubic(utils.pingPong(yt)) * 2 - 1;
    } else {
        let sv = game.stages[game.stage]; // stage values
        game.kickAnimationTimer += dt;

        // animate camera
        let t = utils.pingPong(min(game.kickAnimationTimer, 2));
        let hitX = sv.goalCenterX + game.x * sv.aimWidth / 2;
        let hitY = sv.goalCenterY + game.y * sv.aimHeight / 2 + game.x * sv.shift;
        cam.x = lerp(targetWidth / 2, hitX, ease.outQuad(t));
        cam.y = lerp(targetHeight / 2, hitY, ease.outQuad(t));
        cam.scale = lerp(1, 1.2, ease.outQuad(t));

        // spawn text / sound
        if (game.kickAnimationTimer > 1 && !game.spawnedReactionText) {
            let p = game.projectPoint(game.x * sv.aimWidth / 2, game.y * sv.aimHeight / 2);
            p.x += sv.goalCenterX;
            p.y += sv.goalCenterY;
            popupText.spawn(p.x, p.y, game.getMessageFromPosition(), 24, 60);
            game.spawnedReactionText = true;

            if (game.isPoleHit()) {
                sfx.impact.play();
            }
            if (game.getScoreFromPosition() === 0) {
                sfx.boo.play();
            } else {
                sfx.clap.play();
            }

        }
        if (game.kickAnimationTimer > 1.25 && !game.spawnedPointText) {
            let p = game.projectPoint(game.x * sv.aimWidth / 2, game.y * sv.aimHeight / 2);
            p.x += sv.goalCenterX;
            p.y += sv.goalCenterY;
            let score = game.getScoreFromPosition();
            if (score !== 0) {
                popupText.spawn(p.x, p.y, '+' + score, 24, 40);
            }
            game.spawnedPointText = true;
        }

        // load next stage or ball if animation finished
        if (game.kickAnimationTimer > 2) {
            if (game.numBalls <= 0) {
                if (game.stage >= game.stages.length - 1) {
                    gameState = 'gameOver';
                } else {
                    let score = game.score;
                    let stage = game.stage + 1;
                    game.load();
                    game.lastScore = score;
                    game.score = score;
                    game.stage = stage;
                    game.start();
                }
            } else {
                let score = game.score;
                let stage = game.stage;
                let numBalls = game.numBalls;
                game.load();
                game.lastScore = score;
                game.score = score;
                game.stage = stage;
                game.numBalls = numBalls;
                game.start();
            }
        }
    }
}

game.isPoleHit = function() {
    let sv = game.stages[game.stage];
    let x = game.x * sv.aimWidth / 2;
    let y = game.y * sv.aimHeight / 2;
    let ballRadius = 75 / 4 / 2;
    // bottom pole
    if (x + ballRadius > -sv.redWidth / 2 && x - ballRadius / 2 < sv.redWidth / 2 && y + ballRadius > sv.redHeight / 2) {
        return true;
    }
    // sides
    if (x + ballRadius > -sv.redWidth / 2 && x - ballRadius < -sv.redWidth / 2
    || x + ballRadius > sv.redWidth / 2 && x - ballRadius < sv.redWidth / 2) {
        return true;
    }
    return false;
}

game.getScoreFromPosition = function() {
    let sv = game.stages[game.stage];
    if (game.isPoleHit()) {
        return 0;
    }
    if (game.x > -sv.greenWidth / sv.aimWidth && game.x < sv.greenWidth / sv.aimWidth
    && game.y > -sv.greenHeight / sv.aimHeight && game.y < sv.greenHeight / sv.aimHeight) {
        return 300;
    } else if (game.x > -sv.yellowWidth / sv.aimWidth && game.x < sv.yellowWidth / sv.aimWidth
    && game.y > -sv.yellowHeight / sv.aimHeight && game.y < sv.yellowHeight / sv.aimHeight) {
        return 200;
    } else if (game.x > -sv.redWidth / sv.aimWidth && game.x < sv.redWidth / sv.aimWidth) {
        return 100;
    } else {
        return 0;
    }
}

game.getMessageFromPosition = function() {
    let sv = game.stages[game.stage];
    if (game.isPoleHit()) {
        return Koji.config.strings.poleHitText;
    } else if (game.x < -sv.redWidth / sv.aimWidth) {
        return Koji.config.strings.wideLeftText;
    } else if (game.x > sv.redWidth / sv.aimWidth) {
        return Koji.config.strings.wideRightText;
    } else {
        switch (game.getScoreFromPosition()) {
            case 100:
                return Koji.config.strings.score100Text;
            case 200:
                return Koji.config.strings.score200Text;
            case 300:
                return Koji.config.strings.score300Text;
            default:
                return '';
        }
    }
}

game.projectPoint = function(x, y) {
    let p = {};
    p.x = x;
    p.y = y + game.stages[game.stage].shift * x * y;
    return p;
}

game.action = function() {
    if (game.choosingX) {
        game.choosingX = false;
        game.choosingY = true;
        game.yTime = gameTime;
    } else if (game.choosingY) {
        game.choosingY = false;
        game.numBalls -= 1
        game.lastScore = game.score;
        game.score += game.getScoreFromPosition();
        sfx.whoosh.play();
    }
}

game.mousePressed = function() {
    game.action();
}

game.keyPressed = function() {
    if (keyCode === 32) { // space
        game.action();
    }
}

game.draw = function() {
    let sv = game.stages[game.stage];
    push();
    translate(sv.goalCenterX, sv.goalCenterY);

    // goal regions
    fill(sv.redColor);
    let p1 = game.projectPoint(-sv.redWidth / 2, -sv.redHeight / 2);
    let p2 = game.projectPoint(sv.redWidth / 2, -sv.redHeight / 2)
    let p3 = game.projectPoint(sv.redWidth / 2, sv.redHeight / 2);
    let p4 = game.projectPoint(-sv.redWidth / 2, sv.redHeight / 2);
    quad(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y);
    fill(sv.yellowColor);
    p1 = game.projectPoint(-sv.yellowWidth / 2, -sv.yellowHeight / 2);
    p2 = game.projectPoint(sv.yellowWidth / 2, -sv.yellowHeight / 2)
    p3 = game.projectPoint(sv.yellowWidth / 2, sv.yellowHeight / 2);
    p4 = game.projectPoint(-sv.yellowWidth / 2, sv.yellowHeight / 2);
    quad(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y);
    fill(sv.greenColor);
    p1 = game.projectPoint(-sv.greenWidth / 2, -sv.greenHeight / 2);
    p2 = game.projectPoint(sv.greenWidth / 2, -sv.greenHeight / 2)
    p3 = game.projectPoint(sv.greenWidth / 2, sv.greenHeight / 2);
    p4 = game.projectPoint(-sv.greenWidth / 2, sv.greenHeight / 2);
    quad(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y, p4.x, p4.y);

    // poles
    stroke(sv.poleColor);
    strokeWeight(4);
    p1 = game.projectPoint(-sv.redWidth / 2, sv.redHeight / 2);
    p2 = game.projectPoint(sv.redWidth / 2, sv.redHeight / 2);
    line(p1.x, p1.y, p2.x, p2.y);
    p1 = game.projectPoint(0, sv.redHeight / 2);
    p2 = game.projectPoint(0, sv.redHeight / 2 + 40);
    line(p1.x, p1.y, p2.x, p2.y);
    p1 = game.projectPoint(-sv.redWidth / 2, -sv.redHeight / 2);
    p2 = game.projectPoint(-sv.redWidth / 2, sv.redHeight / 2);
    line(p1.x, p1.y, p2.x, p2.y);
    p1 = game.projectPoint(sv.redWidth / 2, -sv.redHeight / 2);
    p2 = game.projectPoint(sv.redWidth / 2, sv.redHeight / 2);
    line(p1.x, p1.y, p2.x, p2.y);
    noStroke();

    // aim bars
    push();
    translate(0, -sv.redHeight / 2 - 50);
    image(gfx.powerLine, -350 / 2, -28 / 2, 350, 28);
    fill(sv.greenColor);
    rect(-sv.greenWidth / sv.aimWidth / 2 * 350 - 2, -4, 4, 9);
    rect(sv.greenWidth / sv.aimWidth / 2 * 350 - 2, -4, 4, 9);
    translate(game.x * 350 / 2, 0);
    rotate(game.x * 0.3);
    image(gfx.arrow, -20, -50, 40, 50);
    pop();

    push();
    translate(sv.redWidth / 2 + 50, 0);
    rotate(PI / 2);
    image(gfx.powerLine, -350 / 2, -28 / 2, 350, 28);
    fill(sv.greenColor);
    rect(-sv.greenHeight / sv.aimHeight / 2 * 350 - 2, -4, 4, 9);
    rect(sv.greenHeight / sv.aimHeight / 2 * 350 - 2, -4, 4, 9);
    translate(game.y * 350 / 2, 0);
    rotate(game.y * 0.3);
    image(gfx.arrow, -20, -50, 40, 50);
    pop();

    let t = game.kickAnimationTimer;
    // ball / hit point
    {
        let p = game.projectPoint(game.x * sv.aimWidth / 2, game.y * sv.aimHeight / 2);
        let x = lerp(0, p.x, t);
        let y = lerp(350, p.y, ease.outQuad(utils.pingPong(t)));
        let w = 75 / (t * 3 + 1);
        let h = lerp(0.1, w * 5 / 3, cos(t * PI * 4) * 0.5 + 0.5);
        // bounce back if pole hit
        if (t > 1 && game.isPoleHit()) {
            w = 75 / ((2 - t) * 3 + 1);
        }
        let endAngle = lerp(0, PI / 8, game.x);
        let angle = lerp(0, endAngle, min(t, 1));
        let alpha = lerp(255, 0, constrain((t - 1) * 1.5, 0, 1));
        push();
        translate(x, y);
        rotate(angle);
        if (t > 1) {
            tint(255, alpha);
        }
        image(gfx.ball, -w / 2, -h / 2, w, h);
        pop();
    }

    pop();
}
