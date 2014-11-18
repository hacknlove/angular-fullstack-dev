FROM ubuntu:14.10
MAINTAINER antonio@pykiss.com
VOLUME /angular-fullstack
WORKDIR /angular-fullstack
ADD root /root
ADD root /user
ADD angular-fullstack /angular-fullstack
CMD /user/start.sh
RUN chmod -R a+rwx /user

EXPOSE 8080
EXPOSE 443
EXPOSE 35729

ENV LASTUPDATE 2014.11.14
RUN apt-get update -yqq
RUN apt-get install -yqq nodejs npm git mongodb-clients ruby-compass nano
RUN ln /usr/bin/nodejs /usr/bin/node
RUN npm install -g jshint grunt-cli bower

