
var info = {};

info.load = function () {
    info.t = 0;
}

info.update = function (dt) {
    info.t += dt;
}

info.draw = function () {
    let y1 = 910;
    let y2 = 750;
    let y = y1;
    if (info.t < 4) {
        y = lerp(y1, y2, ease.outCubic(min(info.t, 1)));
    } else if (info.t < 5) {
        y = lerp(y2, y1, ease.inCubic(info.t - 4));
    }
    image(gfx.info, scaledWidth / 2 - gfx.info.width / 2, y);
}
