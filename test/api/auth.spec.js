const request = require('supertest')
const app = require("../../app")
require("../../controllers/api/authController")
const bcrypt = require("bcryptjs")

describe('Endpoint API ', () => {
  it('/register : Should create a new account', async () => {
    const res = await request(app)
      .post('/register')
      .send({
        username: 'testing',
        password: '1',
        email: 'iniemailnya@gmail.com'
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('message')
    expect(res.body).toHaveProperty('data')
  })

  it('/register : Should NOT register because username and password doesn`t match', async () => {
    const res = await request(app)
      .post('/register')
      .send({
        username: 'testingsc',
        password: '1',
        email: 'iniemailnya@gmail.com'
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('message')
  })
  
  it('Should compare hashing password', async () => {
    let pwd = "its is password"
    let hash = bcrypt.hashSync(pwd, 8)
    expect(true).toEqual(bcrypt.compareSync(pwd,hash))
  })
  
  it('/login : Should success login', async () => {
    const res = await request(app)
      .post('/login')
      .send({
        username: 'testing',
        password: '1',
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('message')
  })
  
  it('/login : Should NOT login because username and password doesn`t match', async () => {
    const res = await request(app)
      .post('/login')
      .send({
        username: 'abcdefg',
        password: '1',
      })
    expect(res.statusCode).toEqual(200)
    expect(res.body).toHaveProperty('message')
  })

  it('/login : Should NOT login because password is wrong', async () => {
    const res = await request(app)
      .post('/login')
      .send({
        username: 'testing',
        password: '1239482739874293',
      })
    expect(res.statusCode).toEqual(401)
    expect(res.body).toHaveProperty('message')
  })

  it('/login : Should NOT login because URL is not found', async () => {
    const res = await request(app)
      .post('/loginkajshdkj')
      .send({
        username: 'abcdefg',
        password: '1',
      })
    expect(res.statusCode).toEqual(404)
  })
})
