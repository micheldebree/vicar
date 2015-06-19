/*exported KoalaExporter*/
/*global KoalaPicture, PixelImage, ColorMap */
/*jslint bitwise: true*/
function KoalaExporter() {
    
    // http://cbmfiles.com/genie/HiResGraphicsListing.php
    
    // backgr: 00 - map 0
    // Screen ram upper nibble: 01 - map 1
    // Screen ram lower nibble: 10 - map 2 
    // color ram: 11 - map 3
    
    
    
    //Filesize: 10003
    //Load address: $6000
    
    // Load address: 00 60 = 2
    //Bitmap: $0000-$1F3F = 8000 bytes = 1000 chars (40x25)
//Videoram: $1F40-$2327 = 1000 bytes = 1000 chars (40x25)
//colourram: $2328-$270F = 1000 byes 
//Background: $2710 = 1 byte
    
// Totaal: 2 + 80000 + 1000 + 1000 + 1 = 10003 = $2713 
    
    //http://codebase64.org/doku.php?id=base:c64_grafix_files_specs_list_v0.03
    
    //http://dustlayer.com/vic-ii/2013/4/26/vic-ii-for-beginners-screen-modes-cheaper-by-the-dozen
    
    /*
    Hires bitmap mode
(You'd generally set this up with: $d011=$3b, $d016=8)

In this mode (as in all bitmap modes), the VIC reads the graphics data from a 320×200 bitmap in which every bit corresponds to one pixel on the screen. The data from the screen memory is used for color information. As the screen memory is still only a 40×25 matrix, you can only specify the colors for blocks of 8×8 pixels individually (sort of a YC 8:1 format). As the designers of the VIC wanted to realize the bitmap mode with as little additional circuitry as possible (the VIC-I didn't have a bitmap mode), the arrangement of the bitmap in memory is somewhat weird: In contrast to modern video chips that read the bitmap in a linear fashion from memory, the VIC forms an 8×8 pixel block on the screen from 8 successive bytes of the bitmap. The video matrix and the bitmap can be moved in memory with the bits VM10-VM13 and CB13 of register $d018.

In standard bitmap mode, every bit in the bitmap directly corresponds to one pixel on the screen. Foreground and background color can be arbitrarily set for every 8×8 block.

 +---------------------------------------+
 |         8 pixels (1 bit/pixel)        |
 |                                       |
 | "0": Color from bits 0-3 of screen mem|
 | "1": Color from bits 4-7 of screen mem|
 +---------------------------------------+
Multicolor bitmap mode
(You'd generally set this up with: $d011=$3b, $d016=$18)

Similar to the multicolor text mode, this mode also forms (twice as wide) pixels by combining two adjacent bits. So the resolution is reduced to 160×200 pixels.

The bit combination “01” is also treated as “background” for the sprite priority and collision detection, as in multicolor text mode.

 +----------------------------------------+
 |         (2 bits/pixel)                 |
 |                                        |
 | "00": Background color 0 ($d021)       |
 | "01": Color from bits 4-7 of screen mem|
 | "10": Color from bits 0-3 of screen mem|
 | "11": Color from bits 8-11 of color mem|
 +----------------------------------------+
    */
    
    
    'use strict';
    
    /**
     * Convert a pixelImage to a KoalaPic
     * PixelImage must have the following specs:
     * - 320 x 160 pixels
     * - colormap 0 has one color
     * - colormap 1 is  
     */
    function convert(pixelImage) {
    
        var colorMaps = pixelImage.colorMaps,
            koalaPic = new KoalaPicture(),
            charY,
            charX,
            bitmapY,
            colorX,
            colorY,
            imageW = pixelImage.width,
            imageH = pixelImage.height,
            color01,
            color10,
            color11,
            bits01,
            bits23,
            bits45,
            bits67,
            bitmapIndex = 0,
            colorIndex = 0;

            
        for (charY = 0; charY < imageH; charY += 8) {
            for (charX = 0; charX < imageW; charX += 4) {
                for (bitmapY = 0; bitmapY < 8; bitmapY += 1) {
                    
                    // pack 4 pixels into one byte
                    bits67 = pixelImage.getPixelIndex(charX, charY + bitmapY) << 6;
                    bits45 = pixelImage.getPixelIndex(charX + 1, charY + bitmapY) << 4;
                    bits23 = pixelImage.getPixelIndex(charX  + 2, charY + bitmapY) << 2;
                    bits01 = pixelImage.getPixelIndex(charX  + 3, charY + bitmapY);
                    
                    koalaPic.bitmap[bitmapIndex] = bits67 | bits45 | bits23 | bits01;
                    bitmapIndex += 1;
                }
                
                
            }
        }
        
        for (colorY = 0; colorY < imageH; colorY += 8) {
            for (colorX = 0; colorX < imageW; colorX += 4) {
             
                color01 = colorMaps[1].getColor(colorX, colorY);
                color10 = colorMaps[2].getColor(colorX, colorY);
                color11 = colorMaps[3].getColor(colorX, colorY);
                 
                koalaPic.screenRam[colorIndex] = ((color01 << 4) & 0xf0) | (color10 & 0x0f);
                koalaPic.colorRam[colorIndex] = color11 & 0x0f;
                colorIndex += 1;
                 
            }
        }
        
        koalaPic.background[0] = colorMaps[0].getColor(0, 0);
        
        return koalaPic;
            
    }
    
    
    function toPixelImage(koalaPic, palette) {
        
        var pixelImage = new PixelImage(),
            charX,
            charY,
            bitmapY,
            pixel0,
            pixel1,
            pixel2,
            pixel3,
            bitmapIndex = 0,
            colorX,
            colorY,
            color01,
            color10,
            color11,
            imageW = 160,
            imageH = 200,
            colorIndex = 0,
            pixelsPerCellHor = 4,
            pixelsPerCellVer = 8,
            pixelX,
            pixelY;
            
        pixelImage.init(imageW, imageH);
        pixelImage.palette = palette;
        pixelImage.addColorMap(new ColorMap(imageW, imageH, imageW, imageH));
        pixelImage.addColorMap(new ColorMap(imageW, imageH, pixelsPerCellHor, pixelsPerCellVer));
        pixelImage.addColorMap(new ColorMap(imageW, imageH, pixelsPerCellHor, pixelsPerCellVer));
        pixelImage.addColorMap(new ColorMap(imageW, imageH, pixelsPerCellHor, pixelsPerCellVer));
        
        for (charY = 0; charY < imageH; charY += pixelsPerCellVer) {
            for (charX = 0; charX < imageW; charX += pixelsPerCellHor) {
                for (bitmapY = 0; bitmapY < pixelsPerCellVer; bitmapY += 1) {
                    
                    // get 4 pixels from one koala byte
                    pixel0 = (koalaPic.bitmap[bitmapIndex] >> 6) & 0x03;
                    pixel1 = (koalaPic.bitmap[bitmapIndex] >> 4) & 0x03;
                    pixel2 = (koalaPic.bitmap[bitmapIndex] >> 2) & 0x03;
                    pixel3 = koalaPic.bitmap[bitmapIndex] & 0x03;
                    
                    pixelX = charX;
                    pixelY = charY + bitmapY;
                    
                    pixelImage.setPixelIndex(pixelX, pixelY, pixel0);
                    pixelImage.setPixelIndex(pixelX + 1, pixelY, pixel1);
                    pixelImage.setPixelIndex(pixelX + 2, pixelY, pixel2);
                    pixelImage.setPixelIndex(pixelX + 3, pixelY, pixel3);
                    
                    bitmapIndex += 1;
                }
                
            }
        }
        
        for (colorY = 0; colorY < imageH; colorY += pixelsPerCellVer) {
            for (colorX = 0; colorX < imageW; colorX += pixelsPerCellHor) {
             
                color01 = (koalaPic.screenRam[colorIndex] >> 4) & 0x0f;
                color10 = koalaPic.screenRam[colorIndex] & 0x0f;
                color11 = koalaPic.colorRam[colorIndex] & 0x0f;
                
                color01 = pixelImage.colorMaps[1].add(colorX, colorY, color01);
                color01 = pixelImage.colorMaps[2].add(colorX, colorY, color10);
                color01 = pixelImage.colorMaps[3].add(colorX, colorY, color11);
                 
                colorIndex += 1;
                 
            }
        }
        pixelImage.colorMaps[0].add(0, 0, koalaPic.background[0]);
        
        pixelImage.pWidth = 2;
        pixelImage.pHeight = 1;
        return pixelImage;
    }
    
    return {
        convert: convert,
        toPixelImage: toPixelImage
    };
}