# VICar

Applies graphics limitations of the [Commodore 64](https://en.wikipedia.org/wiki/Commodore_64) to an image. Images can be exported to Commodore 64 file formats for use in other software or straight to a runnable picture.

Cross-platform, cross-device HTML5 application for use on desktop, online web browser and mobile devices.

## License

This code is open source under the MIT license. See [LICENSE.txt](LICENSE.txt).

# Development

First, checkout the project (or download source zip)
git clone https://github.com/micheldebree/vicar.git

## Setup development:

- Install [Node.js](http://nodejs.org/) for your OS
- Install Bower
    - npm install -g bower
- Install grunt command line tools:
    - `npm install -g grunt-cli`
- Install dependencies by running, from the root of the project source:
    - `npm install`
    - `bower install`

### Start app

From the project root:

- `grunt serve`
- surf to http://localhost:9000
- code away and refresh browser to see changes

### Make a build for distribution

From the project root:

- `grunt build`
- Distribution is in the `dist` folder


## Changelog

### 0.1.2

- Added psychedelia setting for more color variation
- Internal optimizations
- Issue #21 (needed for psychedelia setting)

### 0.1.1

- Fixed ugly typography bug on buttons (Issue #32)
- Removed 2 color hires mode. It was ugly.

### 0.1.0

Initial version
