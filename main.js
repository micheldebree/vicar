/*global Image, Pixel, PixelImage, document, window, alert, NearestNeighbour, Palette */
window.onload = function() {

    var img = new Image();
    img.src = 'images/hqdefault.jpg';

    img.onload = function() {
        grabIt(img);
    };


};

function grabIt(img) {

    var pg = new PixelImage();

    pg.grab(img);

    var canvas = document.getElementById("Canvas0");
    canvas.width = pg.getWidth();
    canvas.height = pg.getHeight();
    var context = canvas.getContext('2d');
    context.putImageData(pg.imageData, 0, 0);

    var scaler = new NearestNeighbour();

    var scaled = scaler.resize(pg, 160, 200);
    
    scaled = c64palette.remap(scaled);
    scaled = scaler.resize(scaled, 320, 200);

    canvas.width = scaled.getWidth();
    canvas.height = scaled.getHeight();
    context.putImageData(scaled.imageData, 0, 0);



}

var c64palette = new Palette([
    new Pixel(0, 0, 0, 0xff), // black
    new Pixel(0xff, 0xff, 0xff, 0xff), // white
    new Pixel(0xab, 0x31, 0x26, 0xff), //red
    new Pixel(0x66, 0xda, 0xff, 0xff), //cyan
    new Pixel(0xbb, 0x3f, 0xb8, 0xff), //purple
    new Pixel(0x55, 0xce, 0x58, 0xff), //green
    new Pixel(0x1d, 0x0e, 0x97, 0xff), //blue
    new Pixel(0xea, 0xf5, 0x7c, 0xff), //yellow
    new Pixel(0xb9, 0x74, 0x18, 0xff), //orange
    new Pixel(0x78, 0x53, 0x00, 0xff), //brown
    new Pixel(0xdd, 0x93, 0x87, 0xff), //light red
    new Pixel(0x5b, 0x5b, 0x5b, 0xff), //dark gray
    new Pixel(0x8b, 0x8b, 0x8b, 0xff), //medium gray
    new Pixel(0xb0, 0xf4, 0xac, 0xff), //light green
    new Pixel(0xaa, 0x9d, 0xef, 0xff), //light blue
    new Pixel(0xb8, 0xb8, 0xb8, 0xff) //green
]);
