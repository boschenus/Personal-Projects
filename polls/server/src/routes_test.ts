import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { addPoll, dummy, getPoll, listPolls, resetForTesting, votePoll, advanceTimeForTesting, delete_poll } from './routes';


describe('routes', function() {


  it('addPoll', function() {
    const req_test0 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add', body: {name: "test0", minutes: 5, options: ['a', 'b', 'c']} });
    const res_test0 = httpMocks.createResponse();

    addPoll(req_test0, res_test0);

    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add', body: {name: 1} });
    const res1 = httpMocks.createResponse();

    addPoll(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(),
        "missing or invalid 'name' parameter");

    const req2 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add', body: {name: "a", minutes: '4'} });
    const res2 = httpMocks.createResponse();

    addPoll(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(),
      `'minutes' is not a number: ${req2.body.minutes}`);

    
    const req3 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add', body: {name: "a", minutes: 0.5} });
    const res3 = httpMocks.createResponse();

    addPoll(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(),
    `'minutes' is not a positive integer: ${0.5}`);

    const req4 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add', body: {name: "a", minutes: 2, options: 4} });
    const res4 = httpMocks.createResponse();

    addPoll(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 400);
    assert.deepStrictEqual(res4._getData(),
      "missing or invalid 'options' parameter");

    const req5 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add', body: {name: "a", minutes: 2, options: [1]} });
    const res5 = httpMocks.createResponse();

    addPoll(req5, res5);
    assert.strictEqual(res5._getStatusCode(), 400);
    assert.deepStrictEqual(res5._getData(),
      "missing or invalid 'options' parameter");

    const req6 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add', body: {name: "test0", minutes: 2, options: ['a', 'b']} });
    const res6 = httpMocks.createResponse();

    addPoll(req6, res6);
    assert.strictEqual(res6._getStatusCode(), 400);
    assert.deepStrictEqual(res6._getData(),
      `poll for '${req6.body.name}' already exists`);
    
    const req7 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add', body: {name: "test1", minutes: 2, options: ['a', 'b']} });
    const res7 = httpMocks.createResponse();
    addPoll(req7, res7);
    assert.strictEqual(res7._getStatusCode(), 200);
    assert.deepStrictEqual(res7._getData().poll.name, "test1");
    assert.deepStrictEqual(res7._getData().poll.votes, []);
    assert.deepStrictEqual(res7._getData().poll.options, ['a', 'b']);
    assert.deepStrictEqual(res7._getData().poll.results, []);
    const endTime7 = res7._getData().poll.endTime;
    assert.ok(Math.abs(endTime7 - Date.now() - 2 * 60 * 1000) < 50);

    const req8 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add', body: {name: "test2", minutes: 4, options: ['a', 'b', 'c']} });
    const res8 = httpMocks.createResponse();
    addPoll(req8, res8);
    assert.strictEqual(res8._getStatusCode(), 200);
    assert.deepStrictEqual(res8._getData().poll.name, "test2");
    assert.deepStrictEqual(res8._getData().poll.votes, []);
    assert.deepStrictEqual(res8._getData().poll.options, ['a', 'b', 'c']);
    assert.deepStrictEqual(res8._getData().poll.results, []);
    const endTime8 = res8._getData().poll.endTime;
    assert.ok(Math.abs(endTime8 - Date.now() - 4 * 60 * 1000) < 50);

    const req9 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add', body: {name: "a", minutes: 0} });
    const res9 = httpMocks.createResponse();

    addPoll(req9, res9);
    assert.strictEqual(res9._getStatusCode(), 400);
    assert.deepStrictEqual(res9._getData(),
    `'minutes' is not a positive integer: ${0}`);
    
    resetForTesting()
  });

  it('getPoll', function() {
    const req_test0 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add', body: {name: "test0", minutes: 5, options: ['a', 'b', 'c']} });
    const res_test0 = httpMocks.createResponse();

    addPoll(req_test0, res_test0);
    const req_test1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add', body: {name: "test1", minutes: 2, options: ['a', 'b']} });
    const res_test1 = httpMocks.createResponse();

    addPoll(req_test1, res_test1);
    //Error for name is not string
    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/api/get', body: {} });
    const res1 = httpMocks.createResponse();

    getPoll(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(),
        "missing or invalid 'name' parameter");

    const req2 = httpMocks.createRequest(
        {method: 'POST', url: '/api/get', body: {name: "a"} });
    const res2 = httpMocks.createResponse();
    
    getPoll(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(),
        `no poll with name '${"a"}'`);


    const req3 = httpMocks.createRequest(
        {method: 'POST', url: '/api/get', body: {name: "test0"} });
    const res3 = httpMocks.createResponse();

    getPoll(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 200);
    assert.deepStrictEqual(res3._getData().poll.name, "test0");
    assert.deepStrictEqual(res3._getData().poll.votes, []);
    assert.deepStrictEqual(res3._getData().poll.options, ['a', 'b', 'c']);
    assert.deepStrictEqual(res3._getData().poll.results, []);
    const endTime3 = res3._getData().poll.endTime;
    assert.ok(Math.abs(endTime3 - Date.now() - 5 * 60 * 1000) < 50);

    const req4 = httpMocks.createRequest(
        {method: 'POST', url: '/api/get', body: {name: "test1"} });
    const res4 = httpMocks.createResponse();
    
    getPoll(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 200);
    assert.deepStrictEqual(res4._getData().poll.name, "test1");
    assert.deepStrictEqual(res4._getData().poll.votes, []);
    assert.deepStrictEqual(res4._getData().poll.options, ['a', 'b']);
    assert.deepStrictEqual(res4._getData().poll.results, []);
    const endTime4 = res4._getData().poll.endTime;
    assert.ok(Math.abs(endTime4 - Date.now() - 2 * 60 * 1000) < 50);

    resetForTesting()
  });

  it('votePoll', function() {
    const req_test0 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add', body: {name: "test0", minutes: 5, options: ['a', 'b', 'c']} });
    const res_test0 = httpMocks.createResponse();

    addPoll(req_test0, res_test0);
    const req_test1 = httpMocks.createRequest(
      {method: 'POST', url: '/api/add', body: {name: "test1", minutes: 2, options: ['a', 'b']} });
    const res_test1 = httpMocks.createResponse();

    addPoll(req_test1, res_test1);
    //Error for name is not string
    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/api/vote', body: {} });
    const res1 = httpMocks.createResponse();
    votePoll(req1, res1);
    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(),
        "missing or invalid 'name' parameter");

    const req2 = httpMocks.createRequest(
        {method: 'POST', url: '/api/vote', body: {name:"test0"} });
    const res2 = httpMocks.createResponse();
    votePoll(req2, res2);
    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(),
      "missing or invalid 'option' parameter ");

    const req3 = httpMocks.createRequest(
        {method: 'POST', url: '/api/vote', body: {name:"test0", option: "a"} });
    const res3 = httpMocks.createResponse();
    votePoll(req3, res3);
    assert.strictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(),
      "missing or invalid 'voter' parameter ");
    
    const req4 = httpMocks.createRequest(
        {method: 'POST', url: '/api/vote', body: {name: "test0", option: "a", voter: "person1"} });
    const res4 = httpMocks.createResponse();
    
    votePoll(req4, res4);
    assert.strictEqual(res4._getStatusCode(), 200);
    assert.deepStrictEqual(res4._getData().poll.name, "test0");
    assert.deepStrictEqual(res4._getData().poll.votes, [{voter: "person1", option: "a"}]);
    assert.deepStrictEqual(res4._getData().poll.options, ['a', 'b', 'c']);
    assert.deepStrictEqual(res4._getData().poll.results, [`${(1 * 10000)/100.00 + '%'} -- ${'a'}`,
                `${(0 * 10000)/100.00 + '%'} -- ${'b'}`, `${(0 * 10000)/100.00 + '%'} -- ${'c'}`]);
    const endTime4 = res4._getData().poll.endTime;
    assert.ok(Math.abs(endTime4 - Date.now() - 5 * 60 * 1000) < 50);

    const req5 = httpMocks.createRequest(
        {method: 'POST', url: '/api/vote', body: {name: "test1", option: "a", voter: "person1"} });
    const res5 = httpMocks.createResponse();
    
    votePoll(req5, res5);
    assert.strictEqual(res5._getStatusCode(), 200);
    assert.deepStrictEqual(res5._getData().poll.name, "test1");
    assert.deepStrictEqual(res5._getData().poll.votes, [{voter: "person1", option: "a"}]);
    assert.deepStrictEqual(res5._getData().poll.options, ['a', 'b']);
    assert.deepStrictEqual(res5._getData().poll.results, [`${(1 * 10000)/100.00 + '%'} -- ${'a'}`,
                `${(0 * 10000)/100.00 + '%'} -- ${'b'}`]);
    const endTime5 = res5._getData().poll.endTime;
    assert.ok(Math.abs(endTime5 - Date.now() - 2 * 60 * 1000) < 50);
    
    const req6 = httpMocks.createRequest(
        {method: 'POST', url: '/api/vote', body: {name:"test3", option: "a", voter: "b"} });
    const res6 = httpMocks.createResponse();
    votePoll(req6, res6);
    assert.strictEqual(res6._getStatusCode(), 400);
    assert.deepStrictEqual(res6._getData(),
      " Impossible! data was lost! ");

    advanceTimeForTesting(5 * 60 * 1000 + 50);

    const req7 = httpMocks.createRequest(
      {method: 'POST', url: '/api/vote', body: {name:"test1", option: "a", voter: "b"} });
     const res7 = httpMocks.createResponse();
    votePoll(req7, res7);
    assert.strictEqual(res7._getStatusCode(), 400);
    assert.deepStrictEqual(res7._getData(),
      " this poll is over! ");

    resetForTesting()
    });

    it('listPolls', function() {
      const req1 = httpMocks.createRequest(
          {method: 'GET', url: '/api/list', query: {}});
      const res1 = httpMocks.createResponse();
      listPolls(req1, res1);
      assert.strictEqual(res1._getStatusCode(), 200);
      assert.deepStrictEqual(res1._getData(), {openPolls: [], closedPolls: []});
  
      const req2 = httpMocks.createRequest(
          {method: 'POST', url: '/api/add',
           body: {name: "test0", minutes: 10, options: ['a', 'b', 'c']}});
      const res2 = httpMocks.createResponse();
      addPoll(req2, res2);
      assert.strictEqual(res2._getStatusCode(), 200);
      assert.deepStrictEqual(res2._getData().poll.name, "test0");
      assert.deepStrictEqual(res2._getData().poll.options, ['a', 'b', 'c']);
      
      const req3 = httpMocks.createRequest(
          {method: 'POST', url: '/api/add',
           body: {name: "test1", minutes: 8, options: ['a', 'b']}});
      const res3 = httpMocks.createResponse();
      addPoll(req3, res3);
      assert.strictEqual(res3._getStatusCode(), 200);
      assert.deepStrictEqual(res3._getData().poll.name, "test1");
      assert.deepStrictEqual(res3._getData().poll.options, ['a', 'b']);
  
      const req4 = httpMocks.createRequest(
          {method: 'POST', url: '/api/add',
           body: {name: "test2", minutes: 4, options: [ 'b', 'c']}});
      const res4 = httpMocks.createResponse();
      addPoll(req4, res4);
      assert.strictEqual(res4._getStatusCode(), 200);
      assert.deepStrictEqual(res4._getData().poll.name, "test2");
      assert.deepStrictEqual(res4._getData().poll.options, [ 'b', 'c']);
      
      const req4_2 = httpMocks.createRequest(
        {method: 'POST', url: '/api/add',
         body: {name: "test3", minutes: 2, options: [ 'b', 'c']}});
      const res4_2 = httpMocks.createResponse();
      addPoll(req4_2, res4_2);
      assert.strictEqual(res4_2._getStatusCode(), 200);
      assert.deepStrictEqual(res4_2._getData().poll.name, "test3");
      assert.deepStrictEqual(res4_2._getData().poll.options, [ 'b', 'c']);
      // NOTE: test3 goes first because it finishes sooner
      const req5 = httpMocks.createRequest(
          {method: 'GET', url: '/api/list', query: {}});
      const res5 = httpMocks.createResponse();
      listPolls(req5, res5);
      assert.strictEqual(res5._getStatusCode(), 200);
      assert.deepStrictEqual(res5._getData().openPolls.length, 4);
      assert.deepStrictEqual(res5._getData().closedPolls.length, 0);
      assert.deepStrictEqual(res5._getData().openPolls[0].name, "test3");
      assert.deepStrictEqual(res5._getData().openPolls[1].name, "test2");
      assert.deepStrictEqual(res5._getData().openPolls[2].name, "test1");
      assert.deepStrictEqual(res5._getData().openPolls[3].name, "test0");
  
      // Push time forward by over 5 minutes
      advanceTimeForTesting(5 * 60 * 1000 + 50); 
            
      
      const req6 = httpMocks.createRequest(
          {method: 'GET', url: '/api/list', query: {}});
      const res6 = httpMocks.createResponse();
      listPolls(req6, res6);
      assert.strictEqual(res6._getStatusCode(), 200);
      assert.deepStrictEqual(res6._getData().openPolls.length, 2);
      assert.deepStrictEqual(res6._getData().closedPolls.length, 2);
      assert.deepStrictEqual(res6._getData().openPolls[0].name, "test1");
      assert.deepStrictEqual(res6._getData().openPolls[1].name, "test0");
      assert.deepStrictEqual(res6._getData().closedPolls[0].name, "test2");
      assert.deepStrictEqual(res6._getData().closedPolls[1].name, "test3");
          
      // Push time forward by another 5 minutes
      advanceTimeForTesting(5 * 60 * 1000);
      
      // NOTE: all complete
      const req7 = httpMocks.createRequest(
          {method: 'GET', url: '/api/list', query: {}});
      const res7 = httpMocks.createResponse();
      listPolls(req7, res7);
      assert.strictEqual(res7._getStatusCode(), 200);
      assert.deepStrictEqual(res7._getData().openPolls.length, 0);
      assert.deepStrictEqual(res7._getData().closedPolls.length, 4);
      assert.deepStrictEqual(res7._getData().closedPolls[0].name, "test0");
      assert.deepStrictEqual(res7._getData().closedPolls[1].name, "test1");
      assert.deepStrictEqual(res7._getData().closedPolls[2].name, "test2");
      assert.deepStrictEqual(res7._getData().closedPolls[3].name, "test3");
    
    
      resetForTesting();
    });

    it('delete_poll', function() {
      const req1 = httpMocks.createRequest(
          {method: 'GET', url: '/api/list', query: {}});
      const res1 = httpMocks.createResponse();
      listPolls(req1, res1);
      assert.strictEqual(res1._getStatusCode(), 200);
      assert.deepStrictEqual(res1._getData(), {openPolls: [], closedPolls: []});

      const req2 = httpMocks.createRequest(
          {method: 'POST', url: '/api/add',
          body: {name: "test0", minutes: 10, options: ['a', 'b', 'c']}});
      const res2 = httpMocks.createResponse();
      addPoll(req2, res2);
      assert.strictEqual(res2._getStatusCode(), 200);
      assert.deepStrictEqual(res2._getData().poll.name, "test0");
      assert.deepStrictEqual(res2._getData().poll.options, ['a', 'b', 'c']);
      
      const req3 = httpMocks.createRequest(
          {method: 'POST', url: '/api/add',
          body: {name: "test1", minutes: 8, options: ['a', 'b']}});
      const res3 = httpMocks.createResponse();
      addPoll(req3, res3);
      assert.strictEqual(res3._getStatusCode(), 200);
      assert.deepStrictEqual(res3._getData().poll.name, "test1");
      assert.deepStrictEqual(res3._getData().poll.options, ['a', 'b']);

      const req4 = httpMocks.createRequest(
          {method: 'POST', url: '/api/add',
          body: {name: "test2", minutes: 4, options: [ 'b', 'c']}});
      const res4 = httpMocks.createResponse();
      addPoll(req4, res4);
      assert.strictEqual(res4._getStatusCode(), 200);
      assert.deepStrictEqual(res4._getData().poll.name, "test2");
      assert.deepStrictEqual(res4._getData().poll.options, [ 'b', 'c']);
      
      const req5 = httpMocks.createRequest(
        {method: 'POST', url: '/api/delete', body: {name: 1} });
      const res5 = httpMocks.createResponse();

      delete_poll(req5, res5);
      assert.strictEqual(res5._getStatusCode(), 400);
      assert.deepStrictEqual(res5._getData(),
        'required argument "name" was missing or invaild');

      const req6 = httpMocks.createRequest(
        {method: 'POST', url: '/api/delete', body: {} });
      const res6 = httpMocks.createResponse();

      delete_poll(req6, res6);
      assert.strictEqual(res6._getStatusCode(), 400);
      assert.deepStrictEqual(res6._getData(),
        'required argument "name" was missing or invaild');

      const req7 = httpMocks.createRequest(
        {method: 'POST', url: '/api/delete', body: {name: 'test0'} });
      const res7 = httpMocks.createResponse();

      delete_poll(req7, res7);
      assert.strictEqual(res7._getStatusCode(), 200);
      assert.deepStrictEqual(res7._getData().delete, true);

      const req8 = httpMocks.createRequest(
        {method: 'GET', url: '/api/list', query: {}});
      const res8 = httpMocks.createResponse();
      listPolls(req8, res8);
      assert.strictEqual(res8._getStatusCode(), 200);
      assert.deepStrictEqual(res8._getData().openPolls.length, 2);
      assert.deepStrictEqual(res8._getData().closedPolls.length, 0);
      assert.deepStrictEqual(res8._getData().openPolls[0].name, 'test2');
      assert.deepStrictEqual(res8._getData().openPolls[1].name, 'test1');
      
      // Push time forward by 10 minutes
      advanceTimeForTesting(10 * 60 * 1000);
      
      
      const req9 = httpMocks.createRequest(
        {method: 'POST', url: '/api/delete', body: {name: 'test1'} });
      const res9 = httpMocks.createResponse();

      delete_poll(req9, res9);
      assert.strictEqual(res9._getStatusCode(), 200);
      assert.deepStrictEqual(res9._getData().delete, true);

      const req10 = httpMocks.createRequest(
        {method: 'GET', url: '/api/list', query: {}});
      const res10 = httpMocks.createResponse();
      listPolls(req10, res10);
      assert.strictEqual(res10._getStatusCode(), 200);
      assert.deepStrictEqual(res10._getData().openPolls.length, 0);
      assert.deepStrictEqual(res10._getData().closedPolls.length, 1);
      assert.deepStrictEqual(res10._getData().closedPolls[0].name, 'test2');

      resetForTesting();
    });
});
