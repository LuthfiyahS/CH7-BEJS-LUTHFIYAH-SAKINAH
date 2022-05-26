const jwt = require('jsonwebtoken')
const privateKey = 'ch-bejs'

exports.verifyJwt = (req, res, next) => {
    const authHeader = req?.headers['authorization']
    if (!authHeader) {
        return res.status(401).json({
            'message': 'Unauthorized'
        })
    }
    const token = authHeader

    if (token == null) return res.status(401).json({
        'message': 'Unauthorizedddd'
    })

    jwt.verify(token, privateKey, (err, user) => {
        console.log(token)
        const newStr = token.replace('Bearer ', '');
        const decode  = jwt.decode(newStr);
        next()
    })
}

// exports.verifyJwtPage = (req, res, next) => {
//     let token = req?.session?.token

//     jwt.verify(token, privateKey, (err, user) => {
//         if (err) res.redirect('/login');
//         req.user = user
//         next()
//     })
// }