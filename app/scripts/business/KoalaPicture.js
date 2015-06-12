/*global Uint8Array, Blob, URL*/
function KoalaPicture() {

    'use strict';
    
    var self = this;
    
    // 2 bytes load address (default $6000)
    self.loadAddress = new Uint8Array(2);
    self.loadAddress[0] = 0;
    self.loadAddress[1] = 0x60;
    
    // 8000 bytes bitmap data
    self.bitmap = new Uint8Array(8000);
    // 1000 bytes of screenram ($0400)
    self.screenRam = new Uint8Array(1000);
    // 1000 bytes of colorram ($d800)
    self.colorRam = new Uint8Array(1000);
    
    // 1 byte background color
    self.background = new Uint8Array(1);
    
}

KoalaPicture.prototype.read = function (arrayBuffer) {
    
    'use strict';
    
    this.loadAddress = new Uint8Array(arrayBuffer, 0, 2);
    this.bitmap = new Uint8Array(arrayBuffer, 2, 8000);
    this.screenRam = new Uint8Array(arrayBuffer, 8002, 1000);
    this.colorRam = new Uint8Array(arrayBuffer, 9002, 1000);
    this.background = new Uint8Array(arrayBuffer, 10002, 1);
};

KoalaPicture.prototype.toUrl = function () {
    
    'use strict';
    
    var koalaStream = this.loadAddress.concat(this.bitmap).concat(this.screenRam).concat(this.colorRam).concat(this.background),
        blob = new Blob(koalaStream, {type: 'application/octet-binary'});
    
    return URL.createObjectURL(blob);

};