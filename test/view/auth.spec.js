const request = require('supertest')
const app = require('../../app')

describe('Endpoint for view regist and login', () => {
  it('should open login pith port /', async () => {
    const res = await request(app)
      .get('/')
    expect(res.statusCode).toEqual(200)
  })
  it('should open login', async () => {
    const res = await request(app)
      .get('/login')
    expect(res.statusCode).toEqual(200)
  })
  it('should open resgiter', async () => {
    const res = await request(app)
      .get('/register')
    expect(res.statusCode).toEqual(200)
  })
  it('should create a new account', async () => {
    const res = await request(app)
      .post('/registers')
      .send({
        username: 'testing1011',
        email:'testing1011@gmail.com',
        password: '1',
      })
    //expect(res.statusCode).toEqual(400)
    expect(res.statusCode).toEqual(302) //harusnya kalo sekali jalan berhasil tapi karena bakal di running terus jadi statusnya ganti
  })
  it('should NOT create a new account', async () => {
    const res = await request(app)
      .post('/registers')
      .send({
        username: 'testing1011',
        email:'testing101100@gmail.com',
        password: '1',
      })
    expect(res.statusCode).toEqual(400)
  })
   it('should NOT create a new account', async () => {
    const res = await request(app)
      .post('/registers')
      .send({
        username: 'testingke245',
        email:'testing1011@gmail.com',
        password: '1',
      })
    expect(res.statusCode).toEqual(400)
  })
  it('should TRUE LOGIN account', async () => {
    const res = await request(app)
      .post('/logins')
      .send({
        username: 'testing1011',
        password: '1',
      })
    expect(res.statusCode).toEqual(302)
  })
  it('should FALSE LOGIN account : password is wrong', async () => {
    const res = await request(app)
      .post('/logins')
      .send({
        username: 'testing1011',
        password: '1234567',
      })
    expect(res.statusCode).toEqual(401)
  })
  it('should FALSE LOGIN account', async () => {
    const res = await request(app)
      .post('/logins')
      .send({
        username: 'testbukanakun',
        password: '1',
      })
    expect(res.statusCode).toEqual(401)
  })
  it('should TRUE LOGIN account', async () => {
    const res = await request(app)
      .get('/logout')
    expect(res.statusCode).toEqual(302)
  })

  //view user-games
  it('should not view usergames', async () => {
    const res = await request(app)
      .get('/user-games')
    expect(res.statusCode).toEqual(302)
  })
  it('should not view usergames', async () => {
    const res = await request(app)
      .get('/user-games-biodata')
    expect(res.statusCode).toEqual(302)
  })
  it('should not view usergames', async () => {
    const res = await request(app)
      .get('/user-games-history')
    expect(res.statusCode).toEqual(302)
  })
  it('should view usergames', async () => {
    const response = await request(app)
      .post('/logins')
      .send({
        username: 'testing1011',
        password: '1',
      })
    expect(response.statusCode).toEqual(302)

    const res = await request(app)
      .get('/user-games')
    expect(res.statusCode).toEqual(302)
  })
  //ID
  it('GET user-games :should not view update usergames', async () => {
    const res = await request(app)
      .get('/user-games/update/4')
    expect(res.statusCode).toEqual(302)
  })
  it('GET user-games : should view update usergames', async () => {
    const res = await request(app)
    .get('/user-games/update/4')
    expect(res.statusCode).toEqual(302)
  })
  it('POST user-games : should insert usergames', async () => {
    const res = await request(app)
    .post('/user-games/add')
    .send({
      username: 'isMailbinMail',
      password: 'pwMail',
      email: 'iniemail@gmail.com'
    })
    expect(res.statusCode).toEqual(302)
  })
  it('POST user-games : should not insert usergames', async () => {
    const res = await request(app)
    .post('/user-games/add')
    .send({
      username: 'isMailbinMail',
      password: 'pwMail',
      email: 'iniemail@gmail.com'
    })
    expect(res.statusCode).toEqual(302)
  })
  it('POST user-games : should insert usergames', async () => {
    const res = await request(app)
    .post('/user-games/add')
    expect(res.statusCode).toEqual(302)
  })
  //PUT
  it('PUT user-games : should update usergames', async () => {
    const res = await request(app)
    .put('/user-games/update/4')
    .send({
      username: 'isMailbinMail',
      password: 'pwMail',
      email: 'iniemail@gmail.com'
    })
    expect(res.statusCode).toEqual(302)
  })

  it('PUT user-games : should update usergames', async () => {
    const res = await request(app)
    .put('/user-games/update/400000')
    .send({
      username: 'isMailbinMail',
      password: 'pwMail',
      email: 'iniemail@gmail.com'
    })
    expect(res.statusCode).toEqual(302)
  })
})
