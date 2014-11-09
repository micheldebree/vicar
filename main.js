/*global Image, Pixel, PixelImage, document, window, alert*/
window.onload = function () {

    var img = new Image();
    img.src = 'images/test.png';
    
    img.onload=function() {
        grabIt(img);
    };
      

};

function grabIt(img) {
    alert(img.width);
    var pg = new PixelImage(img);

    for (var y = 0; y < pg.height; y++) {
        for (var x = 0; x < pg.widht; x++) {
            pg.poke(x,y, new Pixel(255, 0, 0, 255));
        }
    }
    
    var canvas = document.getElementById("Canvas0");
    canvas.width = img.width;
    canvas.height = img.height;
    var context = canvas.getContext('2d');
    context.putImageData(pg.imageData, 0, 0);
}
