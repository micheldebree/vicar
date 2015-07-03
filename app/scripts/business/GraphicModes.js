/*exported GraphicModes */
/*global PixelImage, ColorMap */
var GraphicModes = {
    'Multicolor' : function () {
        'use strict';
        var pixelImage = new PixelImage();
        pixelImage.pWidth = 2;
        pixelImage.pHeight = 1;
        pixelImage.init(160, 200);
        pixelImage.colorMaps.push(new ColorMap(160, 200));
        pixelImage.colorMaps.push(new ColorMap(160, 200, 4, 8));
        pixelImage.colorMaps.push(new ColorMap(160, 200, 4, 8));
        pixelImage.colorMaps.push(new ColorMap(160, 200, 4, 8));
        return pixelImage;
    },
    'FLI' : function () {
        'use strict';
        var pixelImage = new PixelImage();
        pixelImage.pWidth = 2;
        pixelImage.pHeight = 1;
        pixelImage.init(160, 200);
        pixelImage.colorMaps.push(new ColorMap(160, 200));
        pixelImage.colorMaps.push(new ColorMap(160, 200, 4, 8));
        pixelImage.colorMaps.push(new ColorMap(160, 200, 4, 1));
        pixelImage.colorMaps.push(new ColorMap(160, 200, 4, 1));
        return pixelImage;
    },
    'AFLI': function () {
        'use strict';
        var pixelImage = new PixelImage();
        pixelImage.pWidth = 1;
        pixelImage.pHeight = 1;
        pixelImage.init(320, 200);
        pixelImage.colorMaps.push(new ColorMap(320, 200, 8, 8));
        pixelImage.colorMaps.push(new ColorMap(320, 200, 8, 1));
        return pixelImage;
    },
    'Hires': function () {
        'use strict';
        var pixelImage = new PixelImage();
        pixelImage.pWidth = 1;
        pixelImage.pHeight = 1;
        pixelImage.init(320, 200);
        pixelImage.colorMaps.push(new ColorMap(320, 200, 8, 8));
        pixelImage.colorMaps.push(new ColorMap(320, 200, 8, 8));
        return pixelImage;
    },
    'Hires2' : function () {
        'use strict';
        var pixelImage = new PixelImage();
        pixelImage.pWidth = 1;
        pixelImage.pHeight = 1;
        pixelImage.init(320, 200);
        pixelImage.colorMaps.push(new ColorMap(320, 200));
        pixelImage.colorMaps.push(new ColorMap(320, 200));
        return pixelImage;
    },
    'Hires3' : function () {
        'use strict';
        var pixelImage = new PixelImage(),
            black = new ColorMap(320, 200),
            white = new ColorMap(320, 200);
        black.add(0, 0, 0);
        white.add(0, 0, 1);
        pixelImage.pWidth = 1;
        pixelImage.pHeight = 1;
        pixelImage.init(320, 200);
        pixelImage.colorMaps.push(black);
        pixelImage.colorMaps.push(white);
        return pixelImage;
    }
        
};