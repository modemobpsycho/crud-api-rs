import request from 'supertest';
import { server } from '../index';
import { userDto1Fixture, userDto2Fixture } from '../model/inMemory';

describe('Users endpoints scenarios: ', function () {
  afterAll(() => {
    server.close();
  });

  it('1. with successful GET api/users 200 -> POST api/users 201 -> GET api/user/{userId} 200 -> PUT api/users/{userId} 200 -> DELETE api/users/{userId} 204 -> GET api/users/{userId} 404 ', async () => {
    // i. Get all records with a GET api/users request (an empty array is expected)
    const responseGetAll = await request(server)
      .get('/api/users')
      .set('Accept', 'application/json');

    expect(responseGetAll.type).toEqual('application/json');
    expect(responseGetAll.body).toEqual([]);
    expect(responseGetAll.status).toEqual(200);

    // ii. A new object is created by a POST api/users request (a response containing newly created record is expected)
    const responsePost = await request(server)
      .post('/api/users')
      .set('Accept', 'application/json')
      .send(userDto1Fixture);

    expect(responsePost.type).toEqual('application/json');
    expect(responsePost.status).toEqual(201);
    expect(responsePost.body).toMatchObject(userDto1Fixture);
    expect(typeof responsePost.body.id).toBe('string');

    const userId = responsePost.body.id;

    // iii. With a GET api/user/{userId} request, we try to get the created record by its id
    const responseGetId = await request(server)
      .get(`/api/users/${userId}`)
      .set('Accept', 'application/json');

    expect(responseGetId.type).toEqual('application/json');
    expect(responseGetId.body).toMatchObject({
      ...userDto1Fixture,
      id: userId,
    });

    expect(responseGetId.status).toEqual(200);

    // iv. We try to update the created record with a PUT api/users/{userId} request (a response is expected containing an updated object with the same id)
    const responsePut = await request(server)
      .put(`/api/users/${userId}`)
      .set('Accept', 'application/json')
      .send(userDto2Fixture);

    expect(responsePut.type).toEqual('application/json');
    expect(responsePut.body).toMatchObject({
      ...userDto2Fixture,
      id: userId,
    });

    expect(responsePut.status).toEqual(200);

    // v. With a DELETE api/users/{userId} request, we delete the created object by id
    const responseDelete = await request(server).delete(`/api/users/${userId}`);
    expect(responseDelete.status).toEqual(204);

    // vi. With a GET api/users/{userId} request, we are trying to get a deleted object by id (expected answer is that there is no such object)

    const responseGetIdAfterDelete = await request(server)
      .get(`/api/users/${userId}`)
      .set('Accept', 'application/json');

    expect(responseGetIdAfterDelete.type).toEqual('application/json');
    expect(responseGetIdAfterDelete.body).toMatchObject({
      message: `User with usedId=${userId} not found.`,
    });

    expect(responseGetIdAfterDelete.status).toEqual(404);
  });

  it("2. get 404 errors with id === userId doesn't exist on GET api/users/{userId}, PUT api/users/{userId}, DELETE api/users/{userId}", async () => {
    // i. A new object is created by a POST api/users request (a response containing newly created record is expected)
    const responsePost = await request(server)
      .post('/api/users')
      .set('Accept', 'application/json')
      .send(userDto1Fixture);

    expect(responsePost.type).toEqual('application/json');
    expect(responsePost.status).toEqual(201);
    expect(responsePost.body).toMatchObject(userDto1Fixture);
    expect(typeof responsePost.body.id).toBe('string');

    const userId = responsePost.body.id;

    // ii. With a GET api/user/{userId} request, we try to get the record with another id
    const userId2 = 'a1' + userId.slice(2);
    const responseGetId = await request(server)
      .get(`/api/users/${userId2}`)
      .set('Accept', 'application/json');

    expect(responseGetId.type).toEqual('application/json');
    expect(responseGetId.status).toEqual(404);
    expect(responseGetId.body).toEqual({
      message: `User with usedId=${userId2} not found.`,
    });

    // iii. We try to update the record that do not exist with a PUT api/users/{userId} request
    const responsePut = await request(server)
      .put(`/api/users/${userId2}`)
      .set('Accept', 'application/json')
      .send(userDto2Fixture);

    expect(responsePut.type).toEqual('application/json');
    expect(responsePut.status).toEqual(404);
    expect(responsePut.body).toEqual({
      message: `User with usedId=${userId2} not found.`,
    });

    // iv. We try to update the record that do not exist with a PUT api/users/{userId} request
    const responseDelete = await request(server)
      .delete(`/api/users/${userId2}`)
      .set('Accept', 'application/json')
      .send(userDto2Fixture);

    expect(responseDelete.type).toEqual('application/json');
    expect(responseDelete.status).toEqual(404);
    expect(responseDelete.body).toEqual({
      message: `User with usedId=${userId2} not found.`,
    });
  });

  it('3. get 400 errors if userId is invalid on GET api/users/{userId}, PUT api/users/{userId}, DELETE api/users/{userId}', async () => {
    // ii. With a GET api/user/{userId} request, we try to get the record with another id
    const id = 'id' + Math.random().toString(36).slice(2);
    const responseGetId = await request(server)
      .get(`/api/users/${id}`)
      .set('Accept', 'application/json');

    expect(responseGetId.type).toEqual('application/json');
    expect(responseGetId.status).toEqual(400);
    expect(responseGetId.body).toEqual({
      message: `Invalid userId.`,
    });

    // iii. We try to update the record that do not exist with a PUT api/users/{userId} request
    const responsePut = await request(server)
      .put(`/api/users/${id}`)
      .set('Accept', 'application/json')
      .send(userDto2Fixture);

    expect(responsePut.type).toEqual('application/json');
    expect(responsePut.status).toEqual(400);
    expect(responsePut.body).toEqual({
      message: `Invalid userId.`,
    });

    // iv. We try to update the record that do not exist with a PUT api/users/{userId} request
    const responseDelete = await request(server)
      .delete(`/api/users/${id}`)
      .set('Accept', 'application/json')
      .send(userDto2Fixture);

    expect(responseDelete.type).toEqual('application/json');
    expect(responseDelete.status).toEqual(400);
    expect(responseDelete.body).toEqual({
      message: `Invalid userId.`,
    });
  });

  it('4. get 400 errors if there are missing fields on PUT api/users/{userId}, POST api/users', async () => {
    // i. A new object is created by a POST api/users request (a response containing newly created record is expected)
    const responsePost = await request(server)
      .post('/api/users')
      .set('Accept', 'application/json')
      .send(userDto1Fixture);

    expect(responsePost.type).toEqual('application/json');
    expect(responsePost.status).toEqual(201);
    expect(responsePost.body).toMatchObject(userDto1Fixture);
    expect(typeof responsePost.body.id).toBe('string');

    const userId = responsePost.body.id;

    // ii. We try to update the created record with a PUT api/users/{userId} request without username
    const responsePutWithoutUsername = await request(server)
      .put(`/api/users/${userId}`)
      .set('Accept', 'application/json')
      .send({ age: userDto2Fixture.age, hobbies: userDto2Fixture.hobbies });

    expect(responsePutWithoutUsername.type).toEqual('application/json');
    expect(responsePutWithoutUsername.status).toEqual(400);
    expect(responsePutWithoutUsername.body).toEqual({
      message: `Invalid or missing fields.`,
    });

    // iii. We try to update the created record with a PUT api/users/{userId} request without age
    const responsePutWithoutAge = await request(server)
      .put(`/api/users/${userId}`)
      .set('Accept', 'application/json')
      .send({
        username: userDto2Fixture.username,
        hobbies: userDto2Fixture.hobbies,
      });

    expect(responsePutWithoutAge.type).toEqual('application/json');
    expect(responsePutWithoutAge.status).toEqual(400);
    expect(responsePutWithoutAge.body).toEqual({
      message: 'Invalid or missing fields.',
    });

    // iv. We try to add a new record with a POST api/users request with wrong username
    const responsePostWrongUsername = await request(server)
      .post('/api/users')
      .set('Accept', 'application/json')
      .send({ username: [], age: 40, hobbies: [] });

    expect(responsePostWrongUsername.type).toEqual('application/json');
    expect(responsePostWrongUsername.status).toEqual(400);
    expect(responsePostWrongUsername.body).toEqual({
      message: 'Invalid or missing fields.',
    });

    // iv. We try to add a new record with a POST api/users request with wrong hobbies
    const responsePostWrongHobbies = await request(server)
      .post('/api/users')
      .set('Accept', 'application/json')
      .send({ username: 'Alex', age: 30, hobbies: 'basketball' });

    expect(responsePostWrongHobbies.type).toEqual('application/json');
    expect(responsePostWrongHobbies.status).toEqual(400);
    expect(responsePostWrongHobbies.body).toEqual({
      message: 'Invalid or missing fields.',
    });
  });
});
