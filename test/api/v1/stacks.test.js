const { expect } = require('chai');
const request = require('supertest');
const stacks = require('../../../src/model/stack.model');
const stacksRoutes = require('../../../src/api/v1/stacks.routes');
const bodyParser = require('body-parser');
const express = require('express');
const sinon = require('sinon');
const httpStatus = require('http-status');

// Mute the console logs for the test
const logger = require('winstonson')(module);
logger.mute();

// Create a temporary express app to test the routes
let api = express();
api.use(bodyParser.json());
api.use(stacksRoutes);

// Define a regex to find content type
let contentType = /json/;

// Define the response structure
let keysResponse = ['api', 'success', 'status', 'message', 'content'];
let keysResponseContent = ['id', 'name', 'deadline', 'priority', '_links'];
let keysResponseContentLinks = ['self'];

// In memory model to avoid making database calls
let model = {};

// Stack object to use in request
let stack = {
    name: 'Test Stack',
    deadline: Date.now(),
    priority: 5
};

// Define our stubs for the database interactions
let stubMerge = sinon.stub(stacks, 'merge');
stubMerge.callsFake(s => {
    return new Promise(resolve => {
        model[s.id] = s;
        resolve(s);
    });
});

let stubFind = sinon.stub(stacks, 'find');
stubFind.callsFake(q => {
    return new Promise(resolve => {
        resolve(model[q.id]);
    });
});

let stubRemove = sinon.stub(stacks, 'remove');
stubRemove.callsFake(id => {
    return new Promise(resolve => {
        let tmp = { ...model[id] };
        delete model[id];
        resolve(tmp);
    });
});

describe('GapTask Stacks API', () => {
    it('should add a new stack', done => {
        request(api)
            .post('/stacks')
            .send(stack)
            .expect(httpStatus.CREATED)
            .expect('Content-Type', contentType)
            .end((err, res) => {
                if (err) return done(err);
                expect(stubMerge.called).to.be.true;
                expect(res.body).to.have.keys(keysResponse);
                expect(res.body.content).to.have.keys(keysResponseContent);
                expect(res.body.content._links).to.have.keys(keysResponseContentLinks);
                expect(res.body.success).to.be.true;
                expect(res.body.status).to.be.equal(httpStatus['201_NAME']);
                expect(res.body.content.name).to.be.equal(stack.name);
                stack.id = res.body.content.id;
                done();
            });
    });

    it('should retrieve the stack previously added by id', done => {
        request(api)
            .get(`/stacks/${stack.id}`)
            .expect(httpStatus.OK)
            .expect('Content-Type', contentType)
            .end((err, res) => {
                if (err) return done(err);
                expect(stubFind.called).to.be.true;
                expect(res.body).to.have.keys(keysResponse);
                expect(res.body.content).to.have.keys(keysResponseContent);
                expect(res.body.content._links).to.have.keys(keysResponseContentLinks);
                expect(res.body.success).to.be.true;
                expect(res.body.status).to.be.equal(httpStatus['200_NAME']);
                expect(res.body.content.name).to.be.equal(stack.name);
                done();
            });
    });

    it('should delete the stack previously added by id', done => {
        let id = stack.id;
        request(api)
            .delete(`/stacks/${stack.id}`)
            .expect(httpStatus.OK)
            .expect('Content-Type', contentType)
            .end((err, res) => {
                if (err) return done(err);
                expect(stubRemove.called).to.be.true;
                expect(res.body).to.have.keys(keysResponse);
                expect(res.body.success).to.be.true;
                expect(res.body.status).to.be.equal(httpStatus['200_NAME']);
                expect(res.body.content).to.not.have.keys(keysResponseContent)
                expect(model[id]).to.be.undefined;
                done();
            });
    });
});
