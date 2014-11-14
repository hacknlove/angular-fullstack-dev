#angular-fullstack-dev
        
## Description
  This image that I made to use in the new development workflow of [Crowdference](https://crowdference.org).
  
  It is in a very early stage.

## Usage
  It is intended to allow working simultaneously on different branches (and projects) without conflicts between dependences and database schemas. 

### Start a new container

    docker run -P -t -i --name your-project -v /local/path:/data pykiss/angular-fullstack-dev:latest

  If `/local/path` does not exist, docker will create it and populate with a [angular-fullstack](https://www.npmjs.org/package/generator-angular-fullstack) skeleton slightly modified to be more dockerable.

### The container's shell

  The idea is executing `grunt server` in the container, and work in the host, but if you we have included git, npm, bower, jshint, nano and a mongo client, in case you need them.
  The UID of the container shell will be the package.json owner's UID, so you can do `npm install` for instance, without screwing your files ownership.

### TODO

[x] Improve the skeleton to connect with mongo containers

[x] Change automatically the livereload browser listening port 

[] The livereload server should response 
 
[] Include a Dockerfile in the skeleton to build a ready to use image
