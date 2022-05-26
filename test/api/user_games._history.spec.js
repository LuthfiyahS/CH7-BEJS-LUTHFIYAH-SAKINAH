const request = require('supertest')
const app = require("../../app")
const { sequelize }= require('../../models')
const { QueryTypes } = require('sequelize') 
require("../../controllers/api/usergamesController")

describe('Endpoint for API user games ', () => {
    beforeAll(async () => {
        await request(app).post('/register').send({ username: 'man1', email: 'man1@mail.com', password: 'luthfiyahsakinah19' });
        await request(app).post('/register').send({ username: 'woman2', email: 'woman2@mail.com', password: 'luthfiyahsakinah19' });
        await request(app).post('/register').send({ username: 'man3', email: 'man3@mail.com', password: 'luthfiyahsakinah19' });
        await request(app).post('/register').send({ username: 'woman4', email: 'woman4@mail.com', password: 'luthfiyahsakinah19' });
        await request(app).post('/register').send({ username: 'man5', email: 'man5@mail.com', password: 'luthfiyahsakinah19' });
        await request(app).post('/register').send({ username: 'woman6', email: 'woman6@mail.com', password: 'luthfiyahsakinah19' });
        await request(app).post('/register').send({ username: 'man7', email: 'man7@mail.com', password: 'luthfiyahsakinah19' });
        await request(app).post('/register').send({ username: 'woman8', email: 'woman8@mail.com', password: 'luthfiyahsakinah19' })
        await request(app).post('/register').send({ username: 'man9', email: 'man9@mail.com', password: 'luthfiyahsakinah19' });
        await request(app).post('/register').send({ username: 'woman10', email: 'woman10@mail.com', password: 'luthfiyahsakinah19' });
        await request(app).post('/register').send({ username: 'luthfiyahsakinah190702', email: 'luthfiyahsakinah190702@mail.com', password: 'luthfiyahsakinah190702' });
        const login = await request(app).post('/login').send({ username: 'luthfiyahsakinah190702', password: 'luthfiyahsakinah190702' });
        token = login.body.data.token;
        //const token = login.body.data
    });

    afterAll(async () => {
        try { 
            await sequelize.query("TRUNCATE user_games, user_games_biodata, user_games_history RESTART IDENTITY;", { type: QueryTypes.RAW }); 
          } catch (error) { 
            console.log(error) 
          }
    });

    //api user-games-history
  it('should not view user games history', async () => {
    const res = await request(app)
      .get('/api/v1/user-games-history')
    expect(res.statusCode).toEqual(401)
    expect(res.body).toHaveProperty('message')  
  })
  it('should view user games history', async () => {
    const res = await request(app)
      .get('/api/v1/user-games-history')
      .set('Authorization',`Bearer ${token}`)
    expect(res.statusCode).toEqual(200)
  })

  it('/api/v1/user-games-history/insert: Should not insert user games history', async () => {
    const res = await request(app)
      .post('/api/v1/user-games-history/insert?username=piaws&email=piaws@gmail.com&password=pia')
    expect(res.statusCode).toEqual(401)
    expect(res.body).toHaveProperty('message')  
  })

  it('POST /api/v1/user-games-history/ : Should not insert user games history not authorized', async () => {
    const res = await request(app)
      .post('/api/v1/user-games-history')
      .send({
        user_id: 7,
        score: 10,
        session_start: "2022-04-09 10:10:00",
        session_end: "2022-04-09 12:40:00"
      })
    expect(res.statusCode).toEqual(401)
    expect(res.body).toHaveProperty('message')  
  })


  it('POST /api/v1/user-games-history/ : Should insert user games history', async () => {
    const res = await request(app)
      .post('/api/v1/user-games-history')
      .set('Authorization',`Bearer ${token}`)
      .send({
        user_id: 7,
        score: 10,
        session_start: "2022-04-09 10:10:00",
        session_end: "2022-04-09 12:40:00"
      })
    expect(res.statusCode).toEqual(201)
  })

  it('POST /api/v1/user-games-history/ : Should insert user games history', async () => {
    const res = await request(app)
      .post('/api/v1/user-games-history')
      .set('Authorization',`Bearer ${token}`)
      .send({
        user_id: 1,
        score: 100,
        session_start: "2022-04-09 10:10:00",
        session_end: "2022-04-09 12:40:00"
      })
    expect(res.statusCode).toEqual(201)
  })

  it('POST /api/v1/user-games-history/ : Should not insert user games history because uid not found', async () => {
    const res = await request(app)
      .post('/api/v1/user-games-history')
      .set('Authorization',`Bearer ${token}`)
      .send({
        user_id: 4,
        score: 10,
        session_start: "2022-04-09 25:10:00",
        session_end: "2022-04-09 179:40:00"
      })
    expect(res.statusCode).toEqual(500)
  })
  it('POST /api/v1/user-games-history/ : Should not insert user games history', async () => {
    const res = await request(app)
      .post('/api/v1/user-games-history')
      .set('Authorization',`Bearer ${token}`)
    expect(res.statusCode).toEqual(400)
  })
  it('POST /api/v1/user-games-history/ : Should not insert user games history because user id not found', async () => {
    const res = await request(app)
      .post('/api/v1/user-games-history')
      .set('Authorization',`Bearer ${token}`)
      .send({
        user_id: 1234,
        score: 10,
        session_start: "2022-04-09 10:10:00",
        session_end: "2022-04-09 12:40:00"
      })
    expect(res.statusCode).toEqual(404)
  })

  //GET BY ID 
  it('/api/v1/user-games-history/id : should not view user games history by id', async () => {
    const res = await request(app)
      .get('/api/v1/user-games-history/4')
    expect(res.statusCode).toEqual(401)
    expect(res.body).toHaveProperty('message')  
  })
  it('/api/v1/user-games-history/id : should view user games history by id', async () => {
    const res = await request(app)
      .get('/api/v1/user-games-history/1')
      .set('Authorization',`Bearer ${token}`)
    expect(res.statusCode).toEqual(200)
  })
  it('/api/v1/user-games-history/id : should not view user games history by id', async () => {
    const res = await request(app)
      .get('/api/v1/user-games-history/100000')
      .set('Authorization',`Bearer ${token}`)
    expect(res.statusCode).toEqual(500)
  })

  //PUT
  it('PUT /api/v1/user-games-history/id : Should not update user games history', async () => {
    const res = await request(app)
      .put('/api/v1/user-games-history/4')
      .send({
        user_id: 7,
        score: 10,
        session_start: "2022-04-09 10:10:00",
        session_end: "2022-04-09 12:40:00"
      })
    expect(res.statusCode).toEqual(401)
    expect(res.body).toHaveProperty('message')  
  })

  it('PUT /api/v1/user-games-history/id : Should update user games history', async () => {
    const res = await request(app)
      .put('/api/v1/user-games-history/1')
      .set('Authorization',`Bearer ${token}`)
      .send({
        user_id: 7,
        score: 10,
        session_start: "2022-04-09 10:10:00",
        session_end: "2022-04-09 12:40:00"
      })
    expect(res.statusCode).toEqual(200)
  })

  it('PUT /api/v1/user-games-history/id : Should not update user games history', async () => {
    const res = await request(app)
      .put('/api/v1/user-games-history/4')
      .set('Authorization',`Bearer ${token}`)
    expect(res.statusCode).toEqual(400)
  })

  it('PUT /api/v1/user-games-history/id : Should not update user games history', async () => {
    const res = await request(app)
      .put('/api/v1/user-games-history/4')
      .set('Authorization',`Bearer ${token}`)
      .send({
        user_id: 70000,
        score: 10,
        session_start: "2022-04-09 10:10:00",
        session_end: "2022-04-09 12:40:00"
      })
    expect(res.statusCode).toEqual(404)
  })

  it('PUT /api/v1/user-games-history/id : Should not update user games history', async () => {
    const res = await request(app)
      .put('/api/v1/user-games-history/400')
      .set('Authorization',`Bearer ${token}`)
      .send({
        user_id: 7000,
        score: 10,
        session_start: "2022-04-09 10:10:00",
        session_end: "2022-04-09 12:40:00"
      })
    expect(res.statusCode).toEqual(404)
  })

  it('PUT /api/v1/user-games-history/id : Should not update user games history because id not find', async () => {
    const res = await request(app)
      .put('/api/v1/user-games-history/40000')
      .set('Authorization',`Bearer ${token}`)
      .send({
        user_id: 7000,
        score: 10,
        session_start: "2022-04-09 10:10:00",
        session_end: "2022-04-09 12:40:00"
      })
    expect(res.statusCode).toEqual(404)
  })
  
  //DELETE
  it('DELETE /api/v1/user-games-history/id : Should not delete user games history', async () => {
    const res = await request(app)
      .delete('/api/v1/user-games-history/9')
    expect(res.statusCode).toEqual(401)
    expect(res.body).toHaveProperty('message')  
  })

  it('DELETE /api/v1/user-games-history/id : Should delete user games history', async () => {
    const res = await request(app)
      .delete('/api/v1/user-games-history/1')
      .set('Authorization',`Bearer ${token}`)
    //expect(res.statusCode).toEqual(404)
    expect(res.statusCode).toEqual(200) //harusnya kalo sekali jalan berhasil tapi karena bakal di running terus jadi statusnya ganti
  })

  it('DELETE /api/v1/user-games-history/id : Should not delete user games history because id not find', async () => {
    const res = await request(app)
      .delete('/api/v1/user-games-history/1000')
      .set('Authorization',`Bearer ${token}`)
    expect(res.statusCode).toEqual(404)
  })

})

