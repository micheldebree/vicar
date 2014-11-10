/*global Image, Pixel, PixelImage, document, window, alert*/
window.onload = function () {

    var img = new Image();
    img.src = 'images/hqdefault.jpg';
    
    img.onload=function() {
        grabIt(img);
    };
      

};

function grabIt(img) {
  
    var pg = new PixelImage(img);

    for (var y = 0; y < pg.getHeight(); y++) {
        for (var x = 0; x < pg.getWidth(); x++) {
            pg.poke(x,y, pg.peek(x,y).invert());
        }
    }
    
    var canvas = document.getElementById("Canvas0");
    canvas.width = pg.getWidth();
    canvas.height = pg.getHeight();
    var context = canvas.getContext('2d');
    context.putImageData(pg.imageData, 0, 0);
}
