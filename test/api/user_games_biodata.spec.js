const request = require('supertest')
const app = require("../../app")
const { UserGames }= require('./../../models')
require("../../controllers/api/usergamesbiodataController")

describe('Endpoint for API user games biodata ', () => {
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
        await request(app).post('/register').send({ username: 'luthfiyahsakinah1907', email: 'luthfiyahsakinah1907@mail.com', password: 'luthfiyahsakinah1907' });
        const login = await request(app).post('/login').send({ username: 'luthfiyahsakinah1907', password: 'luthfiyahsakinah1907' });
        token = login.body.data.token;
    });

    afterAll(async () => {
        try { 
            await sequelize.query("TRUNCATE user_games, user_games_biodata, user_games_history RESTART IDENTITY;", { type: QueryTypes.RAW }); 
          } catch (error) { 
            console.log(error) 
          }
    });

    //api user-games-biodata
  it('should not view user games biodata', async () => {
    const res = await request(app)
      .get('/api/v1/user-games-biodata')
    expect(res.statusCode).toEqual(401)
    expect(res.body).toHaveProperty('message')  
  })
  it('should view user games biodata', async () => {
    const res = await request(app)
      .get('/api/v1/user-games-biodata')
      .set('Authorization',`Bearer ${token}`)
    expect(res.statusCode).toEqual(200)
  })

  it('/api/v1/user-games-biodata/id : should not view user games biodata by id', async () => {
    const res = await request(app)
      .get('/api/v1/user-games-biodata/4')
    expect(res.statusCode).toEqual(401)
    expect(res.body).toHaveProperty('message')  
  })
  it('/api/v1/user-games-biodata/id : should view user games biodata by id', async () => {
    const res = await request(app)
      .get('/api/v1/user-games-biodata/1')
      .set('Authorization',`Bearer ${token}`)
    expect(res.statusCode).toEqual(500)
  })
  it('/api/v1/user-games-biodata/id : should not view user games biodata by id', async () => {
    const res = await request(app)
      .get('/api/v1/user-games-biodata/100000')
      .set('Authorization',`Bearer ${token}`)
    expect(res.statusCode).toEqual(500)
  })

  it('POST /api/v1/user-games-biodata/ : Should not insert user games biodata because unauthorized', async () => {
    const res = await request(app)
      .post('/api/v1/user-games-biodata')
      .send({
        username: 'testiscoolyeah',
        password: '1',
      })
    expect(res.statusCode).toEqual(401)
    expect(res.body).toHaveProperty('message')  
  })
  it('POST /api/v1/user-games-biodata/ : Should insert user games biodata', async () => {
    const res = await request(app)
      .post('/api/v1/user-games-biodata')
      .set('Authorization',`Bearer ${token}`)
      .send({
        user_id: 3,
        fullname: "Luthfiyah Sakinah",
        gender: "Female",
        date_of_birth: "2002-07-19",
        place_of_birth: "Purwakarta",
        address: "Sindangkasih"
      })
    expect(res.statusCode).toEqual(201)
  })
  it('POST /api/v1/user-games-biodata/ : Should not insert user games biodata', async () => {
    const res = await request(app)
      .post('/api/v1/user-games-biodata')
      .set('Authorization',`Bearer ${token}`)
      .send({
        user_id: 4,
        fullname: "Luthfiyah Sakinah",
        gender: "Female",
        date_of_birth: "202-07-99",
        place_of_birth: "Purwakarta",
        address: "Sindangkasih"
      })
    expect(res.statusCode).toEqual(500)
  })
  it('POST /api/v1/user-games-biodata/ : Should not insert user games biodata', async () => {
    const res = await request(app)
      .post('/api/v1/user-games-biodata')
      .set('Authorization',`Bearer ${token}`)
    expect(res.statusCode).toEqual(400)
  })
  it('POST /api/v1/user-games-biodata/ : Should not insert user games biodata', async () => {
    const res = await request(app)
      .post('/api/v1/user-games-biodata')
      .set('Authorization',`Bearer ${token}`)
      .send({
        user_id: 1000,
        fullname: "Luthfiyah Sakinah",
        gender: "Female",
        date_of_birth: "2002-07-19",
        place_of_birth: "Purwakarta",
        address: "Sindangkasih"
      })
    expect(res.statusCode).toEqual(404)
  })

  //PUT
  it('PUT /api/v1/user-games-biodata/id : Should not update user games biodata beecause unauthoreized', async () => {
    const res = await request(app)
      .put('/api/v1/user-games-biodata/4')
      .send({
        user_id: 3,
        fullname: "Luthfiyah Sakinah",
        gender: "Female",
        date_of_birth: "2002-07-19",
        place_of_birth: "Purwakarta",
        address: "Sindangkasih"
      })
    expect(res.statusCode).toEqual(401)
    expect(res.body).toHaveProperty('message')  
  })

  it('PUT /api/v1/user-games-biodata/id : Should update user games biodata', async () => {
    const res = await request(app)
      .put('/api/v1/user-games-biodata/1')
      .set('Authorization',`Bearer ${token}`)
      .send({
        user_id: 5,
        fullname: "Luthfiyah",
        gender: "Female",
        date_of_birth: "2002-07-19",
        place_of_birth: "Purwakarta",
        address: "Sindangkasih"
      })
    expect(res.statusCode).toEqual(200)
  })

  it('PUT /api/v1/user-games-biodata/id : Should not update user games biodata because not set body', async () => {
    const res = await request(app)
      .put('/api/v1/user-games-biodata/5')
      .set('Authorization',`Bearer ${token}`)
    expect(res.statusCode).toEqual(400)
  })

  it('PUT /api/v1/user-games-biodata/id : Should not update user games biodata besause id user is not found', async () => {
    const res = await request(app)
      .put('/api/v1/user-games-biodata/2')
      .set('Authorization',`Bearer ${token}`)
      .send({
        user_id: 4000,
        fullname: "Luthfiyah",
        gender: "Female",
        date_of_birth: "2002-07-19",
        place_of_birth: "Purwakarta",
        address: "Sindangkasih"
      })
    expect(res.statusCode).toEqual(404)
  })

  it('PUT /api/v1/user-games-biodata/id : Should not update user games biodata because format is wrong', async () => {
    const res = await request(app)
      .put('/api/v1/user-games-biodata/1')
      .set('Authorization',`Bearer ${token}`)
      .send({
        user_id: 4,
        fullname: "Luthfiyah",
        gender: "Female",
        date_of_birth: "2002-07-99",
        place_of_birth: "Purwakarta",
        address: "Sindangkasih"
      })
    expect(res.statusCode).toEqual(500)
  })

  it('PUT /api/v1/user-games-biodata/id : Should not update user games biodata because id not find', async () => {
    const res = await request(app)
      .put('/api/v1/user-games-biodata/4000000')
      .set('Authorization',`Bearer ${token}`)
      .send({
        user_id: 4000,
        fullname: "Luthfiyah",
        gender: "Female",
        date_of_birth: "2002-07-19",
        place_of_birth: "Purwakarta",
        address: "Sindangkasih"
      })
    expect(res.statusCode).toEqual(404)
  })
  


  //DELETE
  it('DELETE /api/v1/user-games-biodata/id : Should not delete user games biodata', async () => {
    const res = await request(app)
      .delete('/api/v1/user-games-biodata/90')
    expect(res.statusCode).toEqual(401)
    expect(res.body).toHaveProperty('message')  
  })

  it('DELETE /api/v1/user-games-biodata/id : Should delete user games biodata', async () => {
    const res = await request(app)
      .delete('/api/v1/user-games-biodata/1')
      .set('Authorization',`Bearer ${token}`)
    //expect(res.statusCode).toEqual(404)
    expect(res.statusCode).toEqual(200) //harusnya kalo sekali jalan berhasil tapi karena bakal di running terus jadi statusnya ganti
  })

  it('DELETE /api/v1/user-games-biodata/id : Should not delete user games biodata because id not find', async () => {
    const res = await request(app)
      .delete('/api/v1/user-games-biodata/1000')
      .set('Authorization',`Bearer ${token}`)
    expect(res.statusCode).toEqual(404)
  })

})

