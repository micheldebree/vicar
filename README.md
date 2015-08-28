# VICar

Applies graphics limitations of the [Commodore 64](https://en.wikipedia.org/wiki/Commodore_64) to an image. Images can be exported to Commodore 64 file formats for use in other software or straight to a runnable picture.

Cross-platform, cross-device HTML5 application for use on desktop, online web browser and mobile devices.

## License

This code is open source under the MIT license. See [LICENSE.txt](LICENSE.txt).

## Prerequisites for development:
- Git
- [Node.js](http://nodejs.org/)
- [KickAssembler](http://www.theweb.dk/KickAssembler/Main.php) (optional, for altering c64 code)

## Setup development with Vagrant

This is the easiest way to start developing using a virtual machine, and keeps your host machine
clean.

- Install [Vagrant](https://www.vagrantup.com)
- Checkout the code
    - `git clone https://github.com/micheldebree/vicar.git`
- From the project root (`vicar`):
    - `vagrant up` and wait for the machine to finish provisioning
    - `vagrant ssh`
    - `cd /vagrant`
    - `grunt serve`
- The application is now available on [http://localhost:9000](http://localhost:9000)
- Check out the Vagrant docs on how to stop and start Vagrant machines.

## Setup development (locally):

- Install [Node.js](http://nodejs.org/) for your OS
- Install Bower 
    - npm install -g bower
- Install grunt command line tools:
    - `npm install -g grunt-cli`
- Checkout the code (or download source zip)
    - `git clone https://github.com/micheldebree/vicar.git`
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
