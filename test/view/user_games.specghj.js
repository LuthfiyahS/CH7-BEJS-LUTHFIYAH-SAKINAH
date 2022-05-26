const request = require('supertest')
const app = require("../../app")
const { sequelize }= require('../../models')
const { QueryTypes } = require('sequelize') 
require("../../controllers/api/usergamesController")

describe('Endpoint for API user games ', () => {
    beforeAll(async () => {
        await request(app).post('/register').send({ username: 'sakinah19', email: 'sakinah19@mail.com', password: 'sakinah19' });
        const login = await request(app).post('/login').send({ username: 'sakinah19', password: 'sakinah19' });
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
    it('GET ALL : should view usergames because authorized', async () => {
        const res = await request(app)
            .get('/user-games')
        expect(res.statusCode).toEqual(302)
    })

    it('/user-games/id : should view usergames by id', async () => {
        const res = await request(app)
            .get('/user-games/9')
        expect(res.statusCode).toEqual(302)
        console.log(token)
    })
    it('/user-games/id : should not view usergames by id', async () => {
        const res = await request(app)
            .get('/user-games/100000')
        expect(res.statusCode).toEqual(404)
    })

    it('Vieq user-games/add: Should view usergames', async () => {
        const res = await request(app)
            .get('/user-games/add')
        expect(res.statusCode).toEqual(302)
    })

    it('POST /user-games/ : Should insert usergames', async () => {
        const res = await request(app)
            .post('/user-games/add')
            .send({
                username: 'testiscoolyeahdude',
                password: '1',
            })
        expect(res.statusCode).toEqual(302)
    })
    it('POST /user-games/ : Should not insert usergames', async () => {
        const res = await request(app)
            .post('/user-games/add')
        expect(res.statusCode).toEqual(302)
    })

    // //PUT
    // it('PUT /user-games/id : Should not update usergames', async () => {
    //     const res = await request(app)
    //         .put('/user-games/9')
    //         .send({
    //             username: 'testiscoolyeah',
    //             password: '1',
    //         })
    //     expect(res.statusCode).toEqual(401)
    //     expect(res.body).toHaveProperty('message')
    // })

    // it('PUT /user-games/id : Should update usergames', async () => {
    //     const res = await request(app)
    //         .put('/user-games/1')
    //         .send({
    //             username: 'isMailbinMail',
    //             password: 'pwMail',
    //             email: 'iniemail@gmail.com'
    //         })
    //     expect(res.statusCode).toEqual(302)
    // })

    // it('PUT /user-games/id : Should not update usergames because id not find', async () => {
    //     const res = await request(app)
    //         .put('/user-games/30')
    //         .send({
    //             username: 'isMailbinMail',
    //             password: 'pwMail',
    //             email: 'iniemail@gmail.com'
    //         })
    //     expect(res.statusCode).toEqual(404)
    // })

    // it('PUT /user-games/id : Should update usergames', async () => {
    //     const res = await request(app)
    //         .put('/user-games/1000')
    //         .send({
    //             username: 'isMailbinMail',
    //             password: 'pwMail',
    //             email: 'iniemail@gmail.com'
    //         })
    //     expect(res.statusCode).toEqual(404)
    // })

    // //DELETE
    // it('DELETE /user-games/id : Should not delete usergames', async () => {
    //     const res = await request(app)
    //         .delete('/user-games/9')
    //     expect(res.statusCode).toEqual(401)
    //     expect(res.body).toHaveProperty('message')
    // })

    // it('DELETE /user-games/id : Should delete usergames', async () => {
    //     const res = await request(app)
    //         .delete(`/user-games/1`)
    //     //expect(res.statusCode).toEqual(404)
    //     expect(res.statusCode).toEqual(302)// harusnya kalo sekali jalan berhasil tapi karena bakal di running terus jadi statusnya ganti
    // })

    // it('DELETE /user-games/id : Should not delete usergames because id not find', async () => {
    //     const res = await request(app)
    //         .delete('/user-games/1000')
    //     expect(res.statusCode).toEqual(404)
    // })

})

