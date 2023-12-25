"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var assert = __importStar(require("assert"));
var httpMocks = __importStar(require("node-mocks-http"));
var routes_1 = require("./routes");
describe('routes', function () {
    // After you know what to do, feel free to delete this Dummy test
    it('dummy', function () {
        // Feel free to copy this test structure to start your own tests, but look at these
        // comments first to understand what's going on.
        // httpMocks lets us create mock Request and Response params to pass into our route functions
        var req1 = httpMocks.createRequest(
        // query: is how we add query params. body: {} can be used to test a POST request
        { method: 'GET', url: '/api/dummy', query: { name: 'Kevin' } });
        var res1 = httpMocks.createResponse();
        // call our function to execute the request and fill in the response
        (0, routes_1.dummy)(req1, res1);
        // check that the request was successful
        assert.strictEqual(res1._getStatusCode(), 200);
        // and the response data is as expected
        assert.deepEqual(res1._getData(), { greeting: 'Hi, Kevin' });
    });
    // TODO: add tests for your routes
    it('save', function () {
        // First branch, straight line code, error case (only one possible input)
        var req1 = httpMocks.createRequest({ method: 'POST', url: '/save', body: { value: "some stuff" } });
        var res1 = httpMocks.createResponse();
        (0, routes_1.save)(req1, res1);
        assert.strictEqual(res1._getStatusCode(), 400);
        assert.deepStrictEqual(res1._getData(), 'required argument "name" was missing');
        // Second branch, straight line code, error case (only one possible input)
        var req2 = httpMocks.createRequest({ method: 'POST', url: '/save', body: { name: "A" } });
        var res2 = httpMocks.createResponse();
        (0, routes_1.save)(req2, res2);
        assert.strictEqual(res2._getStatusCode(), 400);
        assert.deepStrictEqual(res2._getData(), 'required argument "value" was missing');
        // Third branch, straight line code
        var req3 = httpMocks.createRequest({ method: 'POST', url: '/save',
            body: { name: "A", value: "some stuff" } });
        var res3 = httpMocks.createResponse();
        (0, routes_1.save)(req3, res3);
        assert.strictEqual(res3._getStatusCode(), 200);
        var req4 = httpMocks.createRequest({ method: 'POST', url: '/save',
            body: { name: "A", value: "different stuff" } });
        var res4 = httpMocks.createResponse();
        (0, routes_1.save)(req4, res4);
        assert.strictEqual(res4._getStatusCode(), 200);
        (0, routes_1.resetDataForTesting)();
    });
    it('load', function () {
        var req_s1 = httpMocks.createRequest({ method: 'POST', url: '/save',
            body: { name: "A", value: "different stuff" } });
        var res_s1 = httpMocks.createResponse();
        (0, routes_1.save)(req_s1, res_s1);
        var req_s2 = httpMocks.createRequest({ method: 'POST', url: '/save',
            body: { name: "B", value: "some stuff" } });
        var res_s2 = httpMocks.createResponse();
        (0, routes_1.save)(req_s2, res_s2);
        // First branch, straight line code, error case (only one possible input)
        var req1 = httpMocks.createRequest({ method: 'GET', url: '/',
            query: {} });
        var res1 = httpMocks.createResponse();
        (0, routes_1.load)(req1, res1);
        assert.strictEqual(res1._getStatusCode(), 400);
        assert.deepStrictEqual(res1._getData(), 'required argument "name" was missing');
        // Second branch, straight line code, error case 
        var req2 = httpMocks.createRequest({ method: 'GET', url: '/',
            query: { name: "C", value: "another stuff" } });
        var res2 = httpMocks.createResponse();
        (0, routes_1.load)(req2, res2);
        assert.strictEqual(res2._getStatusCode(), 400);
        assert.deepStrictEqual(res2._getData(), 'no previously saved with the name');
        var req3 = httpMocks.createRequest({ method: 'GET', url: '/',
            query: { name: "D", value: "stuff" } });
        var res3 = httpMocks.createResponse();
        (0, routes_1.load)(req3, res3);
        assert.strictEqual(res3._getStatusCode(), 400);
        assert.deepStrictEqual(res3._getData(), 'no previously saved with the name');
        // Third branch, straight line code
        var req4 = httpMocks.createRequest({ method: 'GET', url: '/',
            query: { name: "A" } });
        var res4 = httpMocks.createResponse();
        (0, routes_1.load)(req4, res4);
        assert.strictEqual(res4._getStatusCode(), 200);
        assert.deepStrictEqual(res4._getData(), { value: "different stuff" });
        var req5 = httpMocks.createRequest({ method: 'GET', url: '/',
            query: { name: "B" } });
        var res5 = httpMocks.createResponse();
        (0, routes_1.load)(req5, res5);
        assert.strictEqual(res5._getStatusCode(), 200);
        assert.deepStrictEqual(res5._getData(), { value: "some stuff" });
        (0, routes_1.resetDataForTesting)();
    });
    it('listNames', function () {
        var req_s1 = httpMocks.createRequest({ method: 'POST', url: '/save',
            body: { name: "A", value: "1" } });
        var res_s1 = httpMocks.createResponse();
        (0, routes_1.save)(req_s1, res_s1);
        var req_s2 = httpMocks.createRequest({ method: 'POST', url: '/save',
            body: { name: "B", value: "2" } });
        var res_s2 = httpMocks.createResponse();
        (0, routes_1.save)(req_s2, res_s2);
        // httpMocks lets us create mock Request and Response params to pass into our route functions
        var req1 = httpMocks.createRequest({ method: 'GET', url: '/api/listName' });
        var res1 = httpMocks.createResponse();
        (0, routes_1.listNames)(req1, res1);
        // First branch, straight line code, error case (two possible inputs)
        // check that the request was successful
        assert.strictEqual(res1._getStatusCode(), 200);
        // and the response data is as expected
        assert.deepEqual(res1._getData(), { list: ["A", "B"] });
        var req2 = httpMocks.createRequest({ method: 'GET', url: '/api/listName' });
        var res2 = httpMocks.createResponse();
        (0, routes_1.listNames)(req2, res2);
        // check that the request was successful
        assert.strictEqual(res2._getStatusCode(), 200);
        // and the response data is as expected
        assert.deepEqual(res2._getData(), { list: ["A", "B"] });
        (0, routes_1.resetDataForTesting)();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVzX3Rlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcm91dGVzX3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLDZDQUFpQztBQUNqQyx5REFBNkM7QUFDN0MsbUNBQTZFO0FBRzdFLFFBQVEsQ0FBQyxRQUFRLEVBQUU7SUFFakIsaUVBQWlFO0lBQ2pFLEVBQUUsQ0FBQyxPQUFPLEVBQUU7UUFDVixtRkFBbUY7UUFDbkYsZ0RBQWdEO1FBRWhELDZGQUE2RjtRQUM3RixJQUFNLElBQUksR0FBRyxTQUFTLENBQUMsYUFBYTtRQUNoQyxpRkFBaUY7UUFDakYsRUFBQyxNQUFNLEVBQUUsS0FBSyxFQUFFLEdBQUcsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFFLEVBQUMsSUFBSSxFQUFFLE9BQU8sRUFBQyxFQUFDLENBQUMsQ0FBQztRQUNoRSxJQUFNLElBQUksR0FBRyxTQUFTLENBQUMsY0FBYyxFQUFFLENBQUM7UUFFeEMsb0VBQW9FO1FBQ3BFLElBQUEsY0FBSyxFQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztRQUVsQix3Q0FBd0M7UUFDeEMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsY0FBYyxFQUFFLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFDL0MsdUNBQXVDO1FBQ3ZDLE1BQU0sQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUFFLEVBQUMsUUFBUSxFQUFFLFdBQVcsRUFBQyxDQUFDLENBQUM7SUFDN0QsQ0FBQyxDQUFDLENBQUM7SUFHSCxrQ0FBa0M7SUFDbEMsRUFBRSxDQUFDLE1BQU0sRUFBRTtRQUNULHlFQUF5RTtRQUN6RSxJQUFNLElBQUksR0FBRyxTQUFTLENBQUMsYUFBYSxDQUNoQyxFQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLE9BQU8sRUFBRSxJQUFJLEVBQUUsRUFBQyxLQUFLLEVBQUUsWUFBWSxF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