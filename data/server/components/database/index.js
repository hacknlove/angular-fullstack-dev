'use strict';

var 
MongoClient   = require('mongodb').MongoClient,
_             = require('lodash'),
Q             = require('q'     ),
connections   = {},

defaultOptions= {
  db:{
    w:1,
  },
  server:{
    poolSize:5,
    auto_reconnect:true
  },
},
connect = function(config){
  console.log('conecting with mongo:');

  var promises = [];

  Object.keys(config).forEach(function(connection){
    var defer = Q.defer(),
    options = _.assign({},connection.options, defaultOptions);

    promises.push(defer.promise);

    MongoClient.connect( config[connection].url, options, function (err, db){
      if(err){
        throw err;
      }
      console.log('conected to: '+connection);
      connections[connection] = db;
      defer.resolve(true);
    });
  });
  
  return Q.all(promises);
},

qfiky = function(conn, coll){
  var 
  collection = connections[conn].collection(coll),
  response = {
    collection:collection,
    toArray : function(selector,fields,options){
      return Q.ninvoke(collection.find(selector, fields, options), 'toArray');
    }
  };
  

  ['findOne','update','insert','remove','distinct','count','findAndModify','findAndRemove','geoNear','geoHaystackSearch']
  .forEach(function(key){
    response[key] = Q.nbind(collection[key], collection);
  });

  return response;
}

exports.qfiky = qfiky;
exports.connect = connect;
exports.connections = connections;

