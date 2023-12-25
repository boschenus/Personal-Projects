import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { dummy, save, load, resetDataForTesting, listNames } from './routes';


describe('routes', function() {

  // After you know what to do, feel free to delete this Dummy test
  it('dummy', function() {
    // Feel free to copy this test structure to start your own tests, but look at these
    // comments first to understand what's going on.

    // httpMocks lets us create mock Request and Response params to pass into our route functions
    const req1 = httpMocks.createRequest(
        // query: is how we add query params. body: {} can be used to test a POST request
        {method: 'GET', url: '/api/dummy', query: {name: 'Kevin'}}); 
    const res1 = httpMocks.createResponse();

    // call our function to execute the request and fill in the response
    dummy(req1, res1);

    // check that the request was successful
    assert.strictEqual(res1._getStatusCode(), 200);
    // and the response data is as expected
    assert.deepEqual(res1._getData(), {greeting: 'Hi, Kevin'});
  });


  // TODO: add tests for your routes
  it('save', function() {
    // First branch, straight line code, error case (only one possible input)
    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {value: "some stuff"}});
    const res1 = httpMocks.createResponse();
    save(req1, res1);

    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(),
        'required argument "name" was missing');

    // Second branch, straight line code, error case (only one possible input)
    const req2 = httpMocks.createRequest(
        {method: 'POST', url: '/save', body: {name: "A"}});
    const res2 = httpMocks.createResponse();
    save(req2, res2);

    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(),
        'required argument "value" was missing');

    // Third branch, straight line code

    const req3 = httpMocks.createRequest({method: 'POST', url: '/save',
        body: {name: "A", value: "some stuff"}});
    const res3 = httpMocks.createResponse();
    save(req3, res3);

    assert.strictEqual(res3._getStatusCode(), 200);

    const req4 = httpMocks.createRequest({method: 'POST', url: '/save',
        body: {name: "A", value: "different stuff"}});
    const res4 = httpMocks.createResponse();
    save(req4, res4);

    assert.strictEqual(res4._getStatusCode(), 200);

    resetDataForTesting();
  });
  it('load', function() {

    const req_s1 = httpMocks.createRequest({method: 'POST', url: '/save',
        body: {name: "A", value: "different stuff"}});
    const res_s1 = httpMocks.createResponse();
    save(req_s1, res_s1);

    const req_s2 = httpMocks.createRequest({method: 'POST', url: '/save',
        body: {name: "B", value: "some stuff"}});
    const res_s2 = httpMocks.createResponse();
    save(req_s2, res_s2)
    // First branch, straight line code, error case (only one possible input)
    const req1 = httpMocks.createRequest({method: 'GET', url: '/',
    query: {}});
    const res1 = httpMocks.createResponse();
    load(req1, res1);
  
    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(),
    'required argument "name" was missing');


    // Second branch, straight line code, error case 
    const req2 = httpMocks.createRequest({method: 'GET', url: '/',
        query: {name: "C", value: "another stuff"}});
    const res2 = httpMocks.createResponse();
    load(req2, res2);

    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(),
        'no previously saved with the name');

    const req3 = httpMocks.createRequest({method: 'GET', url: '/',
        query: {name: "D", value: "stuff"}});
    const res3 = httpMocks.createResponse();
    load(req3, res3);

    assert.strictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(),
        'no previously saved with the name');
    // Third branch, straight line code
    const req4 = httpMocks.createRequest({method: 'GET', url: '/',
    query: {name: "A"}});
    const res4 = httpMocks.createResponse();
    load(req4, res4);

    assert.strictEqual(res4._getStatusCode(), 200);
    assert.deepStrictEqual(res4._getData(),
        {value: "different stuff"});

    const req5 = httpMocks.createRequest({method: 'GET', url: '/',
    query: {name: "B"}});
    const res5 = httpMocks.createResponse();
    load(req5, res5);

    assert.strictEqual(res5._getStatusCode(), 200);
    assert.deepStrictEqual(res5._getData(),
        {value: "some stuff"});
    
    resetDataForTesting();
  });
  it('listNames', function() {
    const req_s1 = httpMocks.createRequest({method: 'POST', url: '/save',
        body: {name: "A", value: "1"}});
    const res_s1 = httpMocks.createResponse();
    save(req_s1, res_s1);

    const req_s2 = httpMocks.createRequest({method: 'POST', url: '/save',
        body: {name: "B", value: "2"}});
    const res_s2 = httpMocks.createResponse();
    save(req_s2, res_s2);


    // httpMocks lets us create mock Request and Response params to pass into our route functions
    const req1 = httpMocks.createRequest(
        {method: 'GET', url: '/api/listName'}); 
    const res1 = httpMocks.createResponse();
    listNames(req1, res1);
    // First branch, straight line code, error case (two possible inputs)
    // check that the request was successful
    assert.strictEqual(res1._getStatusCode(), 200);
    // and the response data is as expected
    assert.deepEqual(res1._getData(), {list: ["A", "B"]});
    
    const req2 = httpMocks.createRequest(
      {method: 'GET', url: '/api/listName'}); 
    const res2 = httpMocks.createResponse();
    listNames(req2, res2);
    // check that the request was successful
    assert.strictEqual(res2._getStatusCode(), 200);
    // and the response data is as expected
    assert.deepEqual(res2._getData(), {list: ["A", "B"]});
    

    
    resetDataForTesting();
  });
});
