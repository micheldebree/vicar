/*global Palette*/
function ViceRGBPALPalette() {
    'use strict';
    this.pixels = [
        
        [0, 0, 0], // black
        [0xff, 0xff, 0xff], // white
        [0xab, 0x31, 0x26], //red
        [0x66, 0xda, 0xff], //cyan
        [0xbb, 0x3f, 0xb8], //purple
        [0x55, 0xce, 0x58], //green
        [0x1d, 0x0e, 0x97], //blue
        [0xea, 0xf5, 0x7c], //yellow
        [0xb9, 0x74, 0x18], //orange
        [0x78, 0x53, 0x00], //brown
        [0xdd, 0x93, 0x87], //light red
        [0x5b, 0x5b, 0x5b], //dark gray
        [0x8b, 0x8b, 0x8b], //medium gray
        [0xb0, 0xf4, 0xac], //light green
        [0xaa, 0x9d, 0xef], //light blue
        [0xb8, 0xb8, 0xb8]  //light gray
    ];
}

ViceRGBPALPalette.prototype = new Palette();
ViceRGBPALPalette.prototype.constructor = ViceRGBPALPalette;