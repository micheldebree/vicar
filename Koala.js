/* global Palette */
function Koala() {

}

Koala.prototype.countPixels = function (imageData, x, y, w, h) {

    var palette = new Palette([]),
        counts = [];

    for (var yi = 0; yi < h; yi++) {
        for (var xi = 0; xi < w; xi++) {
            var pixel = imageData.peek(x + xi, y + yi);
            var idx = palette.indexOf(pixel);
            if (idx === undefined) {
                palette.pixels.push(pixel);
                counts.push(1);
            }
            else {
                counts[idx] ++;
            }

        }
    }


};
