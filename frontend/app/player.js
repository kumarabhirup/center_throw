
var player = {};

player.load = function() {
    player.x = 0;
    player.y = -650;
    player.w = 60;
    player.h = 100;
    player.xv = 0;
    player.yv = 0;
    player.angle = 0;
    player.heldTarget = undefined;
    player.lives = 3;
    player.distance = 0;
    player.stars = 0;
    player.score = 0;
    player.highscore = 0;
    player.resetting = false;
    player.resetT = 0;
    player.grappleDisabled = false;
}

player.reset = function() {
    player.resetting = true;
    player.resetT = 0;
    player.y = -650;
    player.xv = 0;
    player.yv = 0;
}

player.update = function(dt) {
    if (player.resetting) {
        player.resetT += dt * 5;
        if (player.resetT > 1) {
            player.resetting = false;
            player.grappleDisabled = false;
        }
    } else {
        player.yv += 9.8 * pixelsPerMeter * dt;
        
        player.x += player.xv * dt;
        player.y += player.yv * dt;
        
        // constrain to rope
        if (player.heldTarget !== undefined) {
            let target = swingPoints.container[player.heldTarget];
            let d = dist(player.x, player.y - player.h / 2, target.x, target.y);
            let newX = target.x + (player.x - target.x) / d * player.heldDistance;
            let newY = target.y + (player.y - player.h / 2 - target.y) / d * player.heldDistance + player.h / 2;
            player.xv += (newX - player.x) / dt;
            player.yv += (newY - player.y) / dt;
            // increase velocity when low, decrease when low
            player.xv *= exp(log(1 + constrain((player.y - (-200)) / 900, -0.5, 0.5)) * dt);
            player.yv *= exp(log(1 + constrain((player.y - (-200)) / 900, -0.5, 0.5)) * dt);
            player.x = newX;
            player.y = newY;
        }
    
        // collide with ground and jump
        if (player.x + player.w / 2 > ground.x && player.x - player.w / 2 < ground.x + ground.w
        && player.y > ground.y && player.y - player.h < ground.y + ground.h) {
            let x1 = ground.x - player.w / 2;
            let x2 = ground.x + ground.w + player.w / 2;
            let y1 = ground.y;
            let y2 = ground.y + ground.h + player.h;
            // xv check to fix tp to side
            if (min(player.x - x1, x2 - player.x) < min(player.y - y1, y2 - player.y) && player.xv !== 0) {
                if (player.x - x1 < x2 - player.x) {
                    player.x = x1;
                } else {
                    player.x = x2;
                }
                player.xv = -player.xv;
            } else {
                if (player.y - y1 < y2 - player.y) {
                    // resolve collision to top of ground
                    player.y = y1;
                    player.yv = -6 * pixelsPerMeter;
                    player.heldTarget = undefined;
                    sfx.jump.play();
                } else {
                    player.y = y2;
                    player.yv = -player.yv;
                }
            }
        }
    
        // check if fallen
        if (player.y - player.h > cam.y + 900 / 2) {
            player.lives -= 1;
            if (player.lives === 0) {
                gameState = 'gameOver'
            } else {
                player.reset();
                ground.reset(player.x);
                obstacles.enableAll();
            }
            player.heldTarget = undefined;
        }
    
        // update angle
        let targetAngle = atan2(player.yv, player.xv);
        if (targetAngle <= -PI / 2) {
            targetAngle += PI;
        } else if (targetAngle > PI / 2) {
            targetAngle -= PI;
        }
        player.angle = lerp(player.angle, targetAngle, dt*8);

        player.updateScore();

        cam.x = player.x + scaledWidth / 4;
        cam.y = -200;
    }
}

player.mousePressed = function() {
    if (!player.resetting && !player.grappleDisabled) {
        player.heldTarget = swingPoints.target;
        let target = swingPoints.container[player.heldTarget];
        player.heldDistance = dist(player.x, player.y - player.h / 2, target.x, target.y);
        sfx.grapple.play();
    }
}

player.mouseReleased = function() {
    if (player.heldTarget !== undefined) {
        sfx.grapple.play();
    }
    player.heldTarget = undefined;
}

player.updateScore = function () {
    player.distance = max(floor(player.x / pixelsPerMeter), 0);
    player.score = player.distance + player.stars * 100;
    player.highscore = max(player.highscore, player.score);
}

player.draw = function() {
    push();
    fill(0);
    let angle = player.angle;
    if (player.xv < 0) {
        angle = -angle;
    } else if (player.xv === 0) {
        angle = 0;
    }
    push();
    translate(player.x, player.y - player.h / 2);
    if (player.xv < 0) {
        scale(-1, 1);
    }
    rotate(angle);
    image(gfx.player, -player.w / 2, -player.h / 2, player.w, player.h);
    pop();
    stroke(0);
    strokeWeight(4);
    if (player.heldTarget !== undefined) {
        let target = swingPoints.container[player.heldTarget];
        let tailOffsetX = cos(angle * (player.xv < 0 ? -1 : 1) - PI / 2) * 46;
        let tailOffsetY = sin(angle * (player.xv < 0 ? -1 : 1) - PI / 2) * 46;
        line(player.x + tailOffsetX, player.y - player.h / 2 + tailOffsetY, target.x, target.y);
    }
    pop();
}