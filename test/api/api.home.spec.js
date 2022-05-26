const base = require("./../../controllers/api/api.home")
const mockRequest = (body ={}) =>({body})
const mockResponse = () => {
    const res = {}
    res.json = jest.fn().mockReturnValue(res)
    res.status = jest.fn().mockReturnValue(res)
    return res
}

describe('base controller', ()=>{
    const req = mockRequest()
    const res = mockResponse()
    test('res.json Endpoint Index', done=>{
        base.home(req, res)
        expect(res.status).toBeCalledWith(200);
        expect(res.json).toBeCalledWith({
            success: "Welcome API GAMES",
        })
        done()
    })
})