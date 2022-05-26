const express = require('express')
const router = express.Router()
const ctl = require('../../controllers/view/userGamesBiodataController')

router.get('/', ctl.get)

router.get('/add', ctl.add)
router.post('/add', ctl.create)

router.get('/:id', ctl.getUserGamesBiodataById)
router.put('/update/:id', ctl.update)

router.get('/delete/:id', ctl.del)
router.delete('/delete/:id', ctl.delete)


module.exports = router