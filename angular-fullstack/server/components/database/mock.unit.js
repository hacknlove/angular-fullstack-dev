'use strict';

var should = require('should');
var collections = require('./index').collections;
var ready = require('./index').ready;
var mock = require('./mock');

it('mock.ready tiene que ser testeado en spec');

describe('mocks para la base de datos', function(){

  beforeEach(function(){
    collections.test = {
      test:function(){throw 'Not mocked'}
    }
  });
  afterEach(function(){
    delete collections.test;
  });
  
  it('mock', function(done){
    mock.mock('test', 'test', true, false);
    collections.test.test('uno',2,'11', function(err, res){
      try{
        err.should.be.false;
        res.should.be.true;
        collections.test.test.lastArguments['0'].should.be.equal('uno');
        collections.test.test.lastArguments['1'].should.be.equal(2);
        collections.test.test.lastArguments['2'].should.be.equal('11');
        done();
      }catch(e){
        done(e);
      }
      
    })
  });

  it('unmock', function(done){
    mock.unmock('test');
    try{
      collections.test.test();
      done(Error('ERROR'));
    }catch(e){
      if(e==='Not mocked'){
        return done();
      }
      done(e)
    }
  })

})
