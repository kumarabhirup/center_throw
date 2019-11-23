var player = {};

player.load = function() {
    player.x = 0;
    player.y = 0;

    // player size
    player.w = Koji.config.strings.playerSize; // 75
    player.h = Koji.config.strings.playerSize;

    // player speed
    player.baseMovementSpeed = Koji.config.strings.playerMoveSpeed;
    player.gravitySpeed = Koji.config.strings.gravitySpeed;

    player.xv = player.baseMovementSpeed;
    player.yv = player.gravitySpeed;

    player.distance = 0;
    player.addedDistance = 0;
    player.stars = 0;
    player.score = 0;
    player.lives = 3;
    player.canJump = true;
    player.lastX = -1;

    player.damageBlinkTime = 2;
    player.damageTime = gameTime;

    player.shieldMaxTime = Koji.config.strings.shieldDuration;
    player.shieldTime = -player.shieldMaxTime - 1;

    player.speedMaxTime = Koji.config.strings.speedDuration;
    player.speedTime = -player.speedMaxTime - 1;
    player.speedMultiplier = Koji.config.strings.speedMultiplication;

    player.startMaxTime = Koji.config.strings.gameCountdown;
    player.startTime = gameTime;
}

player.update = function(dt) {
    if (gameTime - player.startTime > player.startMaxTime) {
        player.lastX = player.x;
        player.x += player.xv * dt;
        player.y += player.yv * dt;
    
        if (player.lives > 0) {
            if (gameTime - player.speedTime < player.speedMaxTime) {
                player.xv = player.baseMovementSpeed * player.speedMultiplier;
            } else {
                player.xv = player.baseMovementSpeed;
            }
    
            // check if fallen off screen
            if (player.y < cam.y - scaledHeight / 2 || player.y > cam.y + scaledHeight / 2 + player.h
            || player.x + player.w / 2 < cam.x - scaledWidth / 2) {
                player.damage();
                sfx.fall.play();
                if (player.lives > 0) {
                    let stars = player.stars;
                    let lives = player.lives;
                    let addedDistance = player.x;
                    player.load();
                    player.stars = stars;
                    player.lives = lives;
                    player.addedDistance = addedDistance;
                    cam.x = 0;
                }
            }
        
            player.updateScore();

            cam.x = max(cam.x + player.xv * 0.8 * dt, player.x);
        } else {
            // acceleration based gravity for death animation
            player.yv += 900 * dt;
        }
    }
}

player.damage = function() {
    player.lives -= 1;
    player.damageTime = gameTime;
    player.shieldTime = -player.shieldMaxTime - 1;
    player.speedTime = -player.speedMaxTime - 1;
    if (player.lives === 0) {
        gameState = 'gameOver';
        player.yv = -900;
        player.xv = -200;
    }
}

player.updateScore = function() {
    player.distance = max(floor((player.x + player.addedDistance) / 100), 0);
    player.score = player.distance * 10 + player.stars * 100;
}

player.tryJump = function() {
    // canJump true if on ground
    if (player.canJump) {
        player.yv = -player.yv;
        sfx.jump.play();
    }
}

player.isVulnerable = function() {
    return (gameTime - player.damageTime > player.damageBlinkTime
        && gameTime - player.shieldTime > player.shieldMaxTime);
}

player.mousePressed = function() {
    if (gameTime - player.startTime > player.startMaxTime) {
        player.tryJump();
    }
}

player.keyPressed = function() {
    if (gameTime - player.startTime > player.startMaxTime) {
        if (keyCode === 87 || keyCode == 38 || keyCode == 32) { // w, up, space
            player.tryJump();
        }
    }
}

player.draw = function() {
    push();

    if (player.lives > 0) {
        translate(player.x, player.y - player.h / 2);
        if (player.yv < 0) {
            scale(1, -1);
        }
    
        if (gameTime - player.damageTime > player.damageBlinkTime || (gameTime - player.damageTime) % (1 / 4) < 1 / 8) {
            let img = player.x === player.lastX ? gfx.player : gfx.playerMoving;
            image(img, -player.w / 2, -player.h / 2, player.w, player.h);
        }
    
        // shield
        if (gameTime - player.shieldTime < player.shieldMaxTime) {
            stroke(0, 156);
            strokeWeight(4);
            fill(128, 156);
            ellipse(0, 0, player.w * 1.5, player.h * 1.5);
        }
    } else {
        translate(player.x, player.y - player.h / 2);
        rotate(gameTime * TWO_PI * 2);
        image(gfx.player, -player.w / 2, -player.h / 2, player.w, player.h);
    }

    pop();
}

