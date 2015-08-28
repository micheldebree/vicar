#!/bin/bash

# Provision a new Vagrant image for Node.js development.
sudo locale-gen UTF-8
sudo apt-get update 

# install Git
sudo apt-get install -y git

# install Node.js
sudo apt-get install -y npm
sudo ln -s /usr/bin/nodejs /usr/bin/node

# install bower and grunt
sudo npm install -g bower
sudo npm install -g grunt-cli

# install project dependencies
# cd /vagrant
# sudo npm install
# sudo bower install -s --allow-root --config.analytics=false
