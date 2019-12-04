
var popupText = {};

popupText.load = function() {
    popupText.container = [];
}

popupText.spawn = function(x, y, text, textSize, dist) {
    popupText.container.push({ x: x, y: y, text: text, textSize: textSize, dist: dist, t: 0 });
}

popupText.update = function(dt) {
    for (let [i, v] of Object.entries(popupText.container)) {
        v.t += 1 / 2 * dt;
        if (v.t > 1) {
            delete popupText.container[i];
        }
    }
}

popupText.draw = function() {
    push();
    textAlign(CENTER, CENTER);
    for (let [i, v] of Object.entries(popupText.container)) {
        let y = v.y - ease.outCubic(min(v.t, 1)) * v.dist;
        let alpha = lerp(255, 0, ease.inCubic(min(v.t, 1)));
        textSize(v.textSize);
        fill(255, 0.3 * 255);
        let w = textWidth(v.text);
        let h = textSize();
        rect(v.x - w / 2 - 2, y - h / 2 - 2, w + 4, h, 4);
        fill(0, alpha);
        text(v.text, v.x, y);
    }
    pop();
}
