# -*- mode: ruby -*-
# vi: set ft=ruby :

# For Virtualbox 5
provision = <<SCRIPT
#!/bin/bash

# add docker repo
sudo tee /etc/yum.repos.d/docker.repo <<-'EOF'
[dockerrepo]
name=Docker Repository
baseurl=https://yum.dockerproject.org/repo/main/centos/$releasever/
enabled=1
gpgcheck=1
gpgkey=https://yum.dockerproject.org/gpg
EOF

# install
sudo yum install -y docker-engine

# to be able to use docker without sudo
sudo usermod -aG docker vagrant

# start docker service
sudo systemctl start docker

# build vicar docker image
cd /vagrant
docker build -t micheldebree/vicar-dev .

# create and run a new instance of the image
docker run --name vicar-dev -d -p 9000:9000 -p 35730:35730 -v $PWD:$PWD micheldebree/vicar-dev /bin/bash -c "cd $PWD; grunt serve"
docker logs -f vicar-dev
SCRIPT

start = <<SCRIPT
  sudo systemctl start docker
  docker start vicar-dev 
  docker logs -f vicar-dev
SCRIPT

Vagrant.configure(2) do |config|
  config.vm.provider 'virtualbox' do |v|
    v.name = 'VICar Development'
    v.memory = 2048
  end
  config.vm.box = 'bento/centos-7.1'
  config.vm.hostname = 'vicar-dev'

  config.vm.network 'forwarded_port', guest: 9000, host: 9000
  config.vm.network 'forwarded_port', guest: 35_730, host: 35_730

  config.vm.provision 'shell', inline: provision
end
