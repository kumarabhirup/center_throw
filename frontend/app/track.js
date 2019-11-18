
var track = {};

track.load = function() {
    track.tileSize = 50;
    track.container = {};
}

track.update = function(dt) {
    let x1 = cam.x - scaledWidth / 2;
    let x2 = cam.x + scaledWidth / 2;
    let y1 = cam.y - scaledHeight / 2;
    let y2 = cam.y + scaledHeight / 2;
    visible = {};
    // generate visible tiles if they don't exist
    for (let i = floor(x1 / track.tileSize) - 1; i <= floor(x2 / track.tileSize) + 1; i++) {
        visible[i] = {};
        for (let j = floor(y1 / track.tileSize) - 1; j <= floor(y2 / track.tileSize) + 1; j++) {
            visible[i][j] = true;
            if (track.container[i] === undefined) {
                track.container[i] = {};
            }
            if (track.container[i][j] === undefined) {
                track.container[i][j] = {
                    type: 'air',
                    x: i * track.tileSize,
                    y: j * track.tileSize,
                    w: track.tileSize,
                    h: track.tileSize
                }
                let v = track.container[i][j];

                // should switch to reading from tilemap if this gets more complex
                let iMod = abs(i) % 96;
                if (iMod < 48) { // wider section
                    if (j === 0 || j === -8) {
                        v.type = 'tile';
                        // holes
                        if (j === 0 && abs(i + 12) % 48 < 4 || j === -8 && abs(i + 24) % 48 < 4) {
                            v.type = 'air';
                        }
                    }
                    // guard tiles
                    if (j === 4 && abs(i + 12) % 48 < 12 || j === -12 && abs(i + 24) % 48 < 12) {
                        v.type = 'tile';
                    }
                    // stars on guard tiles
                    if (j === 3 && abs(i + 12) % 48 < 12 || j === -11 && abs(i + 24) % 48 < 12) {
                        if (random() < 1 / 15) {
                            v.type = 'star';
                        }
                    }
                } else { // thinner section (by 2 tiles)
                    if (j === 1 || j === -9) {
                        v.type = 'tile';
                        // holes
                        if (j === 1 && abs(i + 24) % 48 < 4 || j === -9 && abs(i + 12) % 48 < 4) {
                            v.type = 'air';
                        }
                    }
                    // guard tiles
                    if (j === 5 && abs(i + 24) % 48 < 12 || j === -13 && abs(i + 12) % 48 < 12) {
                        v.type = 'tile';
                    }
                    // stars on guard tiles
                    if (j === 4 && abs(i + 24) % 48 < 12 || j === -12 && abs(i + 12) % 48 < 12) {
                        if (random() < 1 / 15) {
                            v.type = 'star';
                        }
                    }
                }
                // place pickups and tnt
                if (iMod < 48 && (j === -1 || j === -7) || iMod >= 48 && (j === 0 || j === -8)) {
                    if (random() < 1 / 30) {
                        v.type = 'star';
                    } else if (random() < 1 / 60) {
                        v.type = 'tnt';
                    } else if (random() < 1 / 60) {
                        v.type = 'tile';
                    } else if (random() < 1 / 500) {
                        v.type = 'shield';
                    } else if (random() < 1 / 300) {
                        v.type = 'speed';
                    }
                }
                if (iMod >= 48 - 3 && iMod < 48) {
                    v.type = 'air';
                }
                if (iMod >= 48 - 3 && iMod < 48 + 9) {
                    if (j === 4 || j === -12) {
                        v.type = 'tile';
                    } else if ((j === 3 || j === -11) && random() < 1 / 15) {
                        v.type = 'star';
                    }
                }
                if (iMod < 48 && (j === -1 && abs(i + 12) % 48 < 4 || j === -7 && abs(i + 24) % 48 < 4)
                || iMod >= 48 && (j === 0 && abs(i + 24) % 48 < 4 || j === -8 && abs(i + 12) % 48 < 4)) {
                    v.type = 'air';
                }
            }
        }
    }
    // remove if not visible
    for (let i in track.container) {
        for (let j in track.container[i]) {
            if (visible[i] === undefined || visible[i][j] === undefined) {
                delete track.container[i][j];
            }
        }
        if (Object.keys(track.container[i]).length === 0) {
            delete track.container[i];
        }
    }
    // collide with player
    let px1 = player.x - player.w / 2;
    let px2 = player.x + player.w / 2;
    let py1 = player.y - player.h;
    let py2 = player.y;
    player.canJump = false;
    for (let i = floor(px1 / track.tileSize) - 1; i <= floor(px2 / track.tileSize) + 1; i++) {
        for (let j = floor(py1 / track.tileSize) - 1; j <= floor(py2 / track.tileSize) + 1; j++) {
            if (track.container[i] !== undefined && track.container[i][j] !== undefined) {
                let v = track.container[i][j];
                if (px2 > v.x && px1 < v.x + v.w
                && py2 > v.y && py1 < v.y + v.h) {
                    switch (v.type) {
                        case 'tile':
                            let resx1 = v.x - player.w / 2;
                            let resx2 = v.x + v.w + player.w / 2;
                            let resy1 = v.y;
                            let resy2 = v.y + v.h + player.h;
                            let validResolutions = [];
                            if (track.container[i - 1] === undefined || track.container[i - 1][j] === undefined
                            || track.container[i - 1][j].type !== 'tile') {
                                let d = player.x - resx1;
                                if (d <= player.w / 2) {
                                    validResolutions.push({ x: resx1, y: player.y, d: d });
                                }
                            }
                            if (track.container[i + 1] === undefined || track.container[i + 1][j] === undefined
                            || track.container[i + 1][j].type !== 'tile') {
                                let d = resx2 - player.x;
                                if (d <= player.w / 2) {
                                    validResolutions.push({ x: resx2, y: player.y, d: d });
                                }
                            }
                            if (track.container[i][j - 1] === undefined || track.container[i][j - 1].type !== 'tile') {
                                let d = player.y - resy1;
                                if (d <= player.h / 2) {
                                    validResolutions.push({ x: player.x, y: resy1, d: d });
                                }
                            }
                            if (track.container[i][j + 1] === undefined || track.container[i][j + 1].type !== 'tile') {
                                let d = resy2 - player.y;
                                if (d <= player.h / 2) {
                                    validResolutions.push({ x: player.x, y: resy2, d: d });
                                }
                            }
                            if (validResolutions.length > 0) {
                                validResolutions.sort(function (a, b) {
                                    return a.d - b.d;
                                });

                                // collision will resolve to top or bottom of tile
                                if (validResolutions[0].x === player.x) {
                                    player.canJump = true;
                                }

                                player.x = validResolutions[0].x;
                                player.y = validResolutions[0].y;
                            }
                            break;
                        case 'star':
                            if (!v.pickedUp) {
                                player.stars += 1;
                                player.updateScore();
                                sfx.star.play();
                                v.pickedUp = true;
                            }
                            break;
                        case 'tnt':
                            if (!v.pickedUp && player.isVulnerable()) {
                                player.damage();
                                sfx.explosion.play();
                                v.pickedUp = true;
                                v.pickedUpTime = gameTime;
                            }
                            break;
                        case 'shield':
                            if (!v.pickedUp) {
                                player.shieldTime = gameTime;
                                sfx.star.play();
                                v.pickedUp = true;
                            }
                            break;
                        case 'speed':
                            if (!v.pickedUp) {
                                player.xv *= 1.5;
                                sfx.star.play();
                                v.pickedUp = true;
                            }
                            break;
                    }
                }
            }
        }
    }
}

track.draw = function() {
    push();
    for (let [i, column] of Object.entries(track.container)) {
        for (let [j, v] of Object.entries(column)) {
            switch (v.type) {
                case 'tile':
                    image(gfx.tile, v.x, v.y, v.w, v.h);
                    break;
                case 'star':
                case 'shield':
                case 'speed':
                    if (!v.pickedUp) {
                        image(gfx[v.type], v.x, v.y, v.w, v.h);
                    }
                    break;
                case 'tnt':
                    if (v.pickedUp) {
                        let t = gameTime - v.pickedUpTime;
                        if (t < 1) {
                            push();
                            translate(v.x + v.w / 2, v.y + v.w / 2);
                            let s = t < 0.5 ? lerp(1, 1.5, ease.inOutCubic(t * 2)) : lerp(1.5, 0, ease.inOutCubic(t * 2 - 1));
                            scale(s, s);
                            image(gfx.tntExplosion, -v.w / 2, -v.h / 2, v.w, v.h);
                            pop();
                        }
                    } else {
                        image(gfx.tnt, v.x, v.y, v.w, v.h);
                    }
                    break;
            }
        }
    }
    pop();
}
