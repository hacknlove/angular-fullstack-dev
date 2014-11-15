'use strict';

var _ = require('lodash'),
Q = require('q');

exports.response = function(req, res, next){

  res.response = {};

  res.addToResponse = function(object, error){
    if(object === null){
      error = error || {
        status:500,
        error:'unexpected null'
      };
      return Q.reject(error)
    }
    return Q(_.assign(res.response, object));
  };

  res.responseDone = function(object, options){
    var defer = Q.defer();
    options = options || this || {};

    options.status = options.status || 200;

    if(options.filter){
      var newObject = {};
      options.filter.forEach(function(filter){
        newObject[filter] = object[filter];
      });
      object = newObject;
    }
    res.addToResponse(object, options.error)
    .then(function(){
      res.json(options.status, res.response);
      defer.resolve(res.response);
    })
    .catch(function(error){
      res.catchError(error);
      defer.reject(error);
    })
    
    return defer.promise;
  };

  res.catchError = function(error){
    error = error || {
      status:500,
      error:'undefined error'
    };

    if(error.redirect){
      return res.redirect(error.redirect);
    }

    console.log('error:');
    console.log(error);
    console.log(error.message);
    console.log(error.stack);
    return res.responseDone(
      {
        error:error.error || error.toString(),
      }, {status:error.status || 500}
    ).then(function(){
      return Q.reject(error);
    });
  };

  next();
}
