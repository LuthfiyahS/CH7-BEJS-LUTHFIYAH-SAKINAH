const request = require('supertest')
const app = require("../../app")
const { sequelize }= require('./../../models')
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
        await request(app).post('/register').send({ username: 'luthfiyahsakinah19', email: 'luthfiyahsakinah19@mail.com', password: 'luthfiyahsakinah19' });
        const login = await request(app).post('/login').send({ username: 'luthfiyahsakinah19', password: 'luthfiyahsakinah19' });
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

    //api user-games
    it('GET ALL : should not view usergames because unauthorized', async () => {
        const res = await request(app)
            .get('/api/v1/user-games')
        expect(res.statusCode).toEqual(401)
        expect(res.body).toHaveProperty('message')
    })
    it('GET ALL : should view usergames because authorized', async () => {
        const res = await request(app)
            .get('/api/v1/user-games')
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toEqual(200)
    })

    it('/api/v1/user-games/id : should not view usergames by id because unauthorized', async () => {
        const res = await request(app)
            .get('/api/v1/user-games/1')
        expect(res.statusCode).toEqual(401)
        expect(res.body).toHaveProperty('message')
    })
    it('/api/v1/user-games/id : should view usergames by id', async () => {
        const res = await request(app)
            .get('/api/v1/user-games/9')
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toEqual(200)
        console.log(token)
    })
    it('/api/v1/user-games/id : should not view usergames by id', async () => {
        const res = await request(app)
            .get('/api/v1/user-games/100000')
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toEqual(500)
    })

    it('POST /api/v1/user-games/insert: Should not insert usergames', async () => {
        const res = await request(app)
            .post('/api/v1/user-games/insert?username=piaws&email=piaws@gmail.com&password=pia')
        expect(res.statusCode).toEqual(401)
        expect(res.body).toHaveProperty('message')
    })
    it('POST /api/v1/user-games/insert: Should insert usergames', async () => {
        const res = await request(app)
            .post('/api/v1/user-games/insert?username=testing2&email=testing2@gmail.com&password=pia')
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toEqual(201) //harusnya kalo sekali jalan berhasil tapi karena bakal di running terus jadi statusnya ganti
        //expect(res.statusCode).toEqual(400)
    })

    it('POST /api/v1/user-games/insert: Should insert usergames', async () => {
        const res = await request(app)
            .post('/api/v1/user-games/insert?username=testing002&email=testing002@gmail.com&password=pia')
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toEqual(201) //harusnya kalo sekali jalan berhasil tapi karena bakal di running terus jadi statusnya ganti
        //expect(res.statusCode).toEqual(400)
    })


    it('POST /api/v1/user-games/insert: Should not insert usergames because username already exist', async () => {
        const res = await request(app)
            .post('/api/v1/user-games/insert?username=luthfiyahsakinah19&email=testing002@gmail.com&password=pia')
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toEqual(400)
    })
    it('POST /api/v1/user-games/insert: Should not insert usergames because username already exist', async () => {
        const res = await request(app)
            .post('/api/v1/user-games/insert?username=testing00200&email=testing002@gmail.com&password=pia')
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toEqual(400)
    })


    it('POST /api/v1/user-games/ : Should not insert usergames', async () => {
        const res = await request(app)
            .post('/api/v1/user-games')
            .send({
                username: 'testiscoolyeah',
                password: '1',
            })
        expect(res.statusCode).toEqual(401)
        expect(res.body).toHaveProperty('message')
    })
    it('POST /api/v1/user-games/ : Should insert usergames', async () => {
        const res = await request(app)
            .post('/api/v1/user-games')
            .set('Authorization', `Bearer ${token}`)
            .send({
                username: 'testiscoolyeah',
                password: '1',
            })
        expect(res.statusCode).toEqual(201)
    })
    it('POST /api/v1/user-games/ : Should insert usergames', async () => {
        const res = await request(app)
            .post('/api/v1/user-games')
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toEqual(500)
    })

    //PUT
    it('PUT /api/v1/user-games/id : Should not update usergames', async () => {
        const res = await request(app)
            .put('/api/v1/user-games/9')
            .send({
                username: 'testiscoolyeah',
                password: '1',
            })
        expect(res.statusCode).toEqual(401)
        expect(res.body).toHaveProperty('message')
    })

    it('PUT /api/v1/user-games/id : Should update usergames', async () => {
        const res = await request(app)
            .put('/api/v1/user-games/1')
            .set('Authorization', `Bearer ${token}`)
            .send({
                username: 'isMailbinMailmail',
                password: 'pwMail',
                email: 'iniemailmail@gmail.com'
            })
        expect(res.statusCode).toEqual(200)
    })

    it('PUT /api/v1/user-games/id : Should not update usergames because id not find', async () => {
        const res = await request(app)
            .put('/api/v1/user-games/30000')
            .set('Authorization', `Bearer ${token}`)
            .send({
                username: 'isMailbinMail',
                password: 'pwMail',
                email: 'iniemail@gmail.com'
            })
        expect(res.statusCode).toEqual(404)
    })

    it('PUT /api/v1/user-games/id : Should update usergames', async () => {
        const res = await request(app)
            .put('/api/v1/user-games/1000')
            .set('Authorization', `Bearer ${token}`)
            .send({
                username: 'isMailbinMail',
                password: 'pwMail',
                email: 'iniemail@gmail.com'
            })
        expect(res.statusCode).toEqual(404)
    })

    //DELETE
    it('DELETE /api/v1/user-games/id : Should not delete usergames', async () => {
        const res = await request(app)
            .delete('/api/v1/user-games/9')
        expect(res.statusCode).toEqual(401)
        expect(res.body).toHaveProperty('message')
    })

    it('DELETE /api/v1/user-games/id : Should delete usergames', async () => {
        let id = Math.floor(Math.random() * 10)
        const res = await request(app)
            .delete(`/api/v1/user-games/${id}`)
            .set('Authorization', `Bearer ${token}`)
        //expect(res.statusCode).toEqual(404)
        expect(res.statusCode).toEqual(200)// harusnya kalo sekali jalan berhasil tapi karena bakal di running terus jadi statusnya ganti
    })

    it('DELETE /api/v1/user-games/id : Should not delete usergames because id not find', async () => {
        const res = await request(app)
            .delete('/api/v1/user-games/1000')
            .set('Authorization', `Bearer ${token}`)
        expect(res.statusCode).toEqual(404)
    })

})

