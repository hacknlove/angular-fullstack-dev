FROM ubuntu:14.10
MAINTAINER antonio@pykiss.com
VOLUME ["/data"]
WORKDIR /data
ADD root /root
ADD root /user
ADD data /data
CMD /user/start.sh
RUN chmod -R a+rwx /user

EXPOSE 8080
EXPOSE 443
EXPOSE 35729

ENV LASTUPDATE 2014.11.14
RUN apt-get update -yqq
RUN apt-get install -yqq nodejs npm git mongodb-clients ruby-sass nano
RUN ln /usr/bin/nodejs /usr/bin/node
RUN npm install -g jshint
RUN npm install -g yo
RUN npm install -g generator-angular-fullstack
RUN npm install -g grunt-cli
RUN npm install -g bower

