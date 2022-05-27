require('dotenv').config();
const jwt = require('jsonwebtoken')
const privateKey = process.env.PRIVATE_KEY

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
