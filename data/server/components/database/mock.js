var collections = require('./index').collections;
var ready = require('./index').ready;

var mocked = {
}

var lastArguments = {
}

exports.mock = function(collection, method, response, fail){

  lastArguments[collection] = lastArguments[collection] || {};

  if(!mocked[collection]){
    mocked[collection] = collections[collection];
    collections[collection] = {};
    
  }

  collections[collection][method] = function(){
    var data = arguments,
    callbackKey = Object.keys(data).pop(),
    
    callback = data[callbackKey];

    if(typeof callback === 'function'){
      delete data[callbackKey];
    }

    /*deprecated->*/
    collections[collection][method].lastArguments = data;
    /*<-deprecated*/

    lastArguments[collection][method] = data;

    if(typeof callback === 'function'){
      return callback(fail, response);
    }else{
      return response    
    }
  }

}

exports.mockFindToArray = function(collection, response, fail){
  lastArguments[collection] = lastArguments[collection] || {};

  if(!mocked[collection]){
    mocked[collection] = collections[collection];
    collections[collection] = {}
  }

  collections[collection].find = function(){
    var data = arguments;

    /*deprecated->*/
    collections[collection].find.lastArguments = data;
    /*<-deprecated*/

    lastArguments[collection].find = data;
    
    return {
      toArray:function(){
        var callback = arguments[Object.keys(arguments).pop()];
        callback(fail, response);
      }
    }
    
  }

}

exports.unmock = function(collection){
  delete mocked[collection];
  delete lastArguments[collection];
}

exports.lastArguments = lastArguments;

exports.ready = function(done){
  ready.then(function(){done()},done);
}
