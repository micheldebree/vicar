/*global angular, URL, ColorMap, Remapper, PixelImage, ImageGrabber, PixelCalculator, Palette, KoalaExporter, KoalaPicture, FileReader, peptoPalette */
/**
 * @ngdoc function
 * @name workspaceApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the workspaceApp
 */
angular.module('vicarApp')
    .controller('MainCtrl', ['$scope', 'c64izerService', function ($scope, c64izerService) {
        'use strict';
        
        var img = new Image();
        img.src = 'images/girl-face.jpg';

        $scope.dithers = c64izerService.getSupportedDithers();
        $scope.selectedDither = $scope.dithers[3];
        $scope.$watch('selectedDither', function () {
            $scope.convert();
        });
        
        $scope.profiles = c64izerService.getSupportedProfiles();
        $scope.selectedProfile = $scope.profiles[0];
        $scope.$watch('selectedProfile', function () {
            $scope.convert();
        });
        
        $scope.selectDither = function (dither) {
            $scope.selectedDither = dither;
        };
        
        $scope.selectProfile = function (profile) {
            $scope.selectedProfile = profile;
        };
        
        $scope.imageChanged = function () {
            $scope.convert();
        };
        
        function toPixelImage(colorMap, palette) {
            var result = new PixelImage();
           
            result.palette = palette;
            result.dither = [[0]];
            result.init(colorMap.width, colorMap.height);
            result.addColorMap(new ColorMap(colorMap.width, colorMap.height, 1, 1));
            result.drawImageData(colorMap.toImageData(palette));
           
            return result;
        }
    
        function createEmptyMultiColorImage(imageData) {
            var pixelImage = new PixelImage();
            pixelImage.pWidth = 2;
            pixelImage.pHeight = 1;
            pixelImage.init(160, 200);
            pixelImage.palette = peptoPalette;
            pixelImage.colorMaps.push(new ColorMap(160, 200));
            pixelImage.colorMaps.push(new ColorMap(160, 200, 4, 8));
            pixelImage.colorMaps.push(new ColorMap(160, 200, 4, 8));
            pixelImage.colorMaps.push(new ColorMap(160, 200, 4, 8));
            return pixelImage;
        }
        
        function createEmptyFLIImage() {
            var pixelImage = new PixelImage();
            pixelImage.pWidth = 2;
            pixelImage.pHeight = 1;
            pixelImage.init(160, 200);
            pixelImage.palette = peptoPalette;
            pixelImage.colorMaps.push(new ColorMap(160, 200));
            pixelImage.colorMaps.push(new ColorMap(160, 200, 4, 8));
            pixelImage.colorMaps.push(new ColorMap(160, 200, 4, 1));
            pixelImage.colorMaps.push(new ColorMap(160, 200, 4, 1));
            return pixelImage;
        }
        
        function createEmptyHiresImage(imageData) {
            var pixelImage = new PixelImage();
            pixelImage.pWidth = 1;
            pixelImage.pHeight = 1;
            pixelImage.init(320, 200);
            pixelImage.palette = peptoPalette;
            pixelImage.colorMaps.push(new ColorMap(320, 200, 8, 8));
            pixelImage.colorMaps.push(new ColorMap(320, 200, 8, 8));
            return pixelImage;
        }
        
        function createEmpty2ColorHiresImage(imageData) {
            var pixelImage = new PixelImage();
            pixelImage.pWidth = 1;
            pixelImage.pHeight = 1;
            pixelImage.init(320, 200);
            pixelImage.palette = peptoPalette;
            pixelImage.colorMaps.push(new ColorMap(320, 200));
            pixelImage.colorMaps.push(new ColorMap(320, 200));
            return pixelImage;
        }
        
        
        $scope.convert = function () {
            $scope.mainImage = undefined;
            // generate main image
            
            var grabber = new ImageGrabber(),
                palette = new Palette($scope.selectedProfile.value.palette),
                i,
                converter = new KoalaExporter(),
                koalaPic,
                resultImage = createEmptyMultiColorImage();
            
            function convertToPixelImage(imageData, restrictedImage) {
                var w = imageData.width,
                    h = imageData.height,
                    unrestrictedImage = new PixelImage(),
                    ci,
                    cm;
                   
                // create an unrestricted image (one colormap of 1 x 1 resolution).
                unrestrictedImage.palette = palette;
                unrestrictedImage.pWidth = restrictedImage.pWidth;
                unrestrictedImage.pHeight = restrictedImage.pHeight;
                unrestrictedImage.init(w, h, new ColorMap(w, h, 1, 1));
                unrestrictedImage.drawImageData(imageData);
                
                $scope.colorMap = [];
                for (ci = 0; ci < restrictedImage.colorMaps.length; ci += 1) {
                    cm = unrestrictedImage.extractColorMap(restrictedImage.colorMaps[ci]);
                    $scope.colorMap[ci] = toPixelImage(cm, palette);
                    $scope.colorMap[ci].pWidth = restrictedImage.pWidth;
                    $scope.colorMap[ci].pHeight = restrictedImage.pHeight;
                }
      
                // draw the image again in the restricted image
                restrictedImage.drawImageData(imageData);
                
                $scope.mainImage = restrictedImage;
                $scope.testImage = unrestrictedImage;
                
                //koalaPic = converter.convert($scope.testImage);
                //$scope.mainImage = converter.toPixelImage(koalaPic, palette);
                //$scope.koalaDownloadLink = koalaPic.toUrl();
                
                $scope.$apply();
            }
            
           
            
          
            
            function convertToAFLI(imageData) {
                var  colorMaps = [],
                    w = imageData.width,
                    h = imageData.height;
            
                colorMaps.push(new ColorMap(w, h, 8, 8));
                colorMaps.push(new ColorMap(w, h, 8, 1));
                convertToPixelImage(imageData, 1, 1, colorMaps);
            }
            
            function convertToFLI(imageData) {
                var pixelImage = new PixelImage(),
                    w = imageData.width,
                    h = imageData.height;
                
                pixelImage.pWidth = 2;
                pixelImage.pHeight = 1;
                pixelImage.init(w, h);
                       // create an image with the extracted color maps
                pixelImage.palette = peptoPalette;
                pixelImage.colorMaps.push(new ColorMap(w, h));
                pixelImage.colorMaps.push(new ColorMap(w, h, 4, 8));
                pixelImage.colorMaps.push(new ColorMap(w, h, 4, 1));
                pixelImage.colorMaps.push(new ColorMap(w, h, 4, 1));
                convertToPixelImage(imageData, pixelImage);
            }
            
            grabber.grab(img, function (imageData) {
                convertToPixelImage(imageData, resultImage);
            }, resultImage.width, resultImage.height);
          
            
        };

        $scope.upload = function () {
            if (typeof $scope.files !== 'undefined' && $scope.files.length === 1) {
                img.src = URL.createObjectURL($scope.files[0]);
                img.onload = function () {
                    $scope.imageChanged();
                };
            }
        };

        $scope.$watch('files', function () {
            $scope.upload();
        });
        
      
        $scope.imageChanged();

    }]);