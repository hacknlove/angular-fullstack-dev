FROM ubuntu:14.10
MAINTAINER antonio@pykiss.com
VOLUME ["/data"]
WORKDIR /data
ADD .bashrc /root/.bashrc
ADD git-prompt.sh /root/
CMD /bin/bash

EXPOSE 9000
EXPOSE 9443

ENV LASTUPDATE 2014.11.14
RUN apt-get update -yqq
RUN apt-get install -yqq nodejs npm git mongodb-clients ruby-sass
RUN ln /usr/bin/nodejs /usr/bin/node
RUN npm install -g jshint
RUN npm install -g yo
RUN npm install -g generator-angular-fullstack
RUN npm install -g grunt-cli
RUN npm install -g bower


