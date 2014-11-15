'use strict';

var Q = require('q');
var should = require('should');
var mock = require('../../components/database/mock');
var ObjectID = require('mongodb').ObjectID;
var helper = require('../../components/should.helper');

var response = require('./index.js').response;

describe('sistema de respuestas json:', function(){
  describe('addToResponse', function(){
    var res = {};
    before(function(done){
      response(null, res, done);
    });

    it('si se pasa null devuelve un error', function(done){
      res.addToResponse(null)
      .then(function(){
	done(Error('no debería llegar aquí'));
      })
      .catch(function(error){
	try{
	  error.should.have.property('status', 500)
	  error.should.have.property('error', 'unexpected null')
	  done()
	}catch(e){
	  done(e);
	}
      });
    });

    it('si se pasa null y un error custom devuelve el error custom', function(done){
      res.addToResponse(null, {status:123, error:'pepito'})
      .then(function(){
	done(Error('no debería llegar aquí'));
      })
      .catch(function(error){
	try{
	  error.should.have.property('status', 123)
	  error.should.have.property('error', 'pepito')
	  done();
	}catch(e){
	  done(e);
	}
      });
    });

    it('si se pasa no null lo añade a res.response', function(done){
      res.response = {foo:'bar'};
      
      res.addToResponse({pepe:'loco'})
      .then(function(){
	res.response.should.have.property('foo','bar');
	res.response.should.have.property('pepe','loco');
	done();
      },function(){
	done(Error('no debería llegar aquí'));
      })
      .catch(done);
    });		
  });
  describe('catchError', function(){
    var res = {};
    before(function(done){
      response(null, res, function(){
		    res.responseDone = function(object, options){
			    res.responseDone.object = object;
			    res.responseDone.options = options;
			    return Q();
		    }
		    done();
	    });
    });
    beforeEach(function(){
      delete res.responseDone.object;
      delete res.responseDone.options;
    });
    it('si se pasa null llama a responseDone un error indefinido', function(done){
      try{
	res.catchError(null)
	.then(function(response){
	  done(Error({error:'no debería llegar hasta aquí', response:response}));
	})
	.catch(function(error){
	  try{
	    res.responseDone.should.have.property('object');
	    res.responseDone.should.have.property('options');
	    res.responseDone.object.should.have.property('error','undefined error');
	    res.responseDone.options.should.have.property('status',500);
	    
	    error.should.have.property('error', 'undefined error');
	    error.should.have.property('status', 500);
	    done();
	  }catch(e){
	    done(e);
	  }
	});
      }catch(e){
	done(e)
      }
    });
    
    it('si se le pasa un error llama a responseDone con ese error', function(done){
      try{
	res.catchError({error:'cucudrulu', status:'42'})
	.then(function(response){
	  done(Error({error:'no debería llegar hasta aquí', response:response}));
	})
	.catch(function(error){
	  try{
	    res.responseDone.should.have.property('object');
	    res.responseDone.should.have.property('options');
	    res.responseDone.object.should.have.property('error','cucudrulu');
	    res.responseDone.options.should.have.property('status',42);
	    
	    error.should.have.property('error', 'cucudrulu');
	    error.should.have.property('status', 42);
	    done()
	  }catch(e){
	    done(e)
	  }
	});
      }catch(e){
	done(e)
      }
    });
  });

  describe('responseDone', function(){
    var res = {};
    beforeEach(function(done){
      response(null, res, function(){
	res.catchError = function(error){ 
	  res.catchError.error = error;
	  return Q.reject(error)
	};
	res.json = function(status, object){ 
	  res.json.object = object; 
	  res.json.status = status; 
	};
	done();
      });
    });
    it('si llama con null llama a catchError con un error por defecto', function(done){
      res.responseDone(null)
      .then(function(response){
	done(Error('no debería llegar hasta aquí'));
      })
      .catch(function(error){
	try{
	  res.catchError.error.should.have.property('error', 'unexpected null');
	  res.catchError.error.should.have.property('status', 500);
	  error.should.have.property('error', 'unexpected null');
	  error.should.have.property('status', 500);
	  done()
	}catch(e){
	  done(e);
	}
      });
    });

    it('si llama con null y un error llama a catchError con ese error', function(done){
      res.responseDone(null, {error:{status:911,error:'la bar ba coa'}})
      .then(function(response){
	done(Error('no debería llegar hasta aquí'));
      })
      .catch(function(error){
	try{
	  res.catchError.error.should.have.property('error', 'la bar ba coa');
	  res.catchError.error.should.have.property('status', 911);
	  error.should.have.property('error', 'la bar ba coa');
	  error.should.have.property('status', 911);
	  done()
	}catch(e){
	  done(e);
	}
      });
    });

    it('si llama con object llama a res.json con status 200 y ese object añadido a res.response', function(done){
      res.response = {foo:'bar'};
      res.responseDone({pro:'bando'})
      .then(function(response){
	res.json.object.should.have.property('foo', 'bar');
	res.json.object.should.have.property('pro', 'bando');
	res.json.status.should.be.equal(200);

	response.should.have.property('foo', 'bar');
	response.should.have.property('pro', 'bando');
	done()
      })
      .catch(function(error){
	done(error);
      })
    });

    it('si llama con object y status llama a res.json con dicho status y ese object añadido a res.response', function(done){

      res.response = {bar:'foo'};
      res.responseDone({bando:'proo'}, {status:56})
      .then(function(response){

	res.json.object.should.have.property('bar', 'foo');
	res.json.object.should.have.property('bando', 'proo');
	res.json.status.should.be.equal(56);

	response.should.have.property('bar', 'foo');
	response.should.have.property('bando', 'proo');
	done()
      })
      .catch(function(error){
	done(error);
      })
    });
  });
});

