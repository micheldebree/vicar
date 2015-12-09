FROM centos
MAINTAINER Michel de Bree <michel@micheldebree.nl>
RUN yum install -y epel-release
RUN yum install -y nodejs npm
RUN npm install -g bower grunt-cli
