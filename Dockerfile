FROM ubuntu:14.10
MAINTAINER antonio@pykiss.com
VOLUME ["/data"]
WORKDIR /data
ADD root /root
ADD data /data
CMD /root/start.sh
RUN chmod -R a+rwx /root

EXPOSE 80
EXPOSE 443
EXPOSE 35729

ENV LASTUPDATE 2014.11.14
RUN apt-get update -yqq
RUN apt-get install -yqq nodejs npm git mongodb-clients ruby-sass
RUN ln /usr/bin/nodejs /usr/bin/node
RUN npm install -g jshint
RUN npm install -g yo
RUN npm install -g generator-angular-fullstack
RUN npm install -g grunt-cli
RUN npm install -g bower

