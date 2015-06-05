/*exported KoalaExporter*/
function KoalaExporter() {
    
    // backgr: 00 - map 1
    // Screen ram upper nibble: 01 - map 2
    // Screen ram lower nibble: 10 - map 3 
    // color ram: 11 - map 4
    
    
    
    //Filesize: 10003
    //Load address: $6000
    
    //Bitmap: $0000-$1F3F
//Videoram: $1F40-$2327
//colourram: $2328-$270F
//Background: $2710
    
    //http://codebase64.org/doku.php?id=base:c64_grafix_files_specs_list_v0.03
    
    //http://dustlayer.com/vic-ii/2013/4/26/vic-ii-for-beginners-screen-modes-cheaper-by-the-dozen
    
    'use strict';
    
    function convert(pixelImage) {
    
        var colorMaps = pixelImage.getColorMaps(),
            colorMap2Pixel = {
                0 : 0,
                1 : 1,
                2 : 2,
                3 : 3
            };
            
    }
    
    return {
        convert: convert
    };
}