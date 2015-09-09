# -*- mode: ruby -*-
# vi: set ft=ruby :

$provision = <<SCRIPT
#!/bin/bash

sudo locale-gen UTF-8
#sudo apt-get update 
#sudo apt-get upgrade

# install Git
sudo apt-get install -y git

# install Node.js
sudo apt-get install -y npm
sudo ln -s /usr/bin/nodejs /usr/bin/node

# install bower and grunt
sudo npm install -g bower
sudo npm install -g grunt-cli

# install project dependencies
cd /vagrant
npm install
sudo bower install --allow-root --config.interactive=false
SCRIPT

$serve = <<SCRIPT
#!/bin/bash

# serve application
cd /vagrant
grunt serve --force
SCRIPT

Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"
  config.vm.network "forwarded_port", guest: 9000, host: 9000
  config.vm.network "forwarded_port", guest: 35730, host: 35730
  config.vm.provision "shell", inline: $provision
  config.vm.provision "shell", inline: $serve, run: "always"
end
