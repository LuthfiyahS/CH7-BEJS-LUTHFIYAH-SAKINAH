const express = require('express')
const router = express.Router()
const ctl = require('../../controllers/view/userGamesController')
const ctlbio = require('../../controllers/view/userGamesBiodataController')
const ctlhis = require('../../controllers/view/userGamesHistoryController')

const multer = require('multer')
const path = require('path');

const storage = multer.diskStorage({
    destination: (req,file,cb)=>{
        if(file.fieldname === "profil"){
            cb(null, './public/file/images')   
        }else{
            cb(null, './public/file/video')   
        }
    },
    filename: (req, file, cb) => {
        const unique = Date.now() + Math.round(Math.random()*1E9);
        cb(null, file.fieldname + '-' + unique + path.extname(file.originalname))
        
    }
});

const upload = multer({
    storage: storage, 
    fileFilter: (req, file, cb) => {
        if(file.fieldname === "profil"){
            if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
                cb(null, true)
            } else {
                cb(null, false)
                return cb(new "Error, Only accepted .png .jpg and .jpeg")
            }
        }else{
            if (file.mimetype == 'video/mp4' || file.mimetype == 'video/quicktime'|| file.mimetype == 'video/x-flv' || file.mimetype == 'video/x-ms-wmv'  || file.mimetype == 'video/3gpp'|| file.mimetype == 'video/MP2T') {
                cb(null, true)
            } else {
                cb(null, false)
                return cb(new "Error, Only accepted video mp4, quicktime, wmv, flv, 3gpp, dan MP2T")
            }
        }
        
    }
});

router.get('/', ctl.index)

router.get('/add', ctl.addUserGames)
router.post('/add', upload.any(), ctl.createUserGames)

router.get('/update/:id', ctl.show)
//router.put('/update/:id',upload.any(),  ctl.updateUserGames)
router.post('/update/:id',upload.any(),  ctl.updateUserGames)

router.get('/delete/:id',  upload.any(), ctl.deleteUserGames)
router.delete('/delete/:id', ctl.deleteUserGames)

router.get('/biodata/:id', ctlbio.getUserGamesBiodataById)
router.post('/biodata', ctlbio.create)

router.put('/biodata/update/:id', ctlbio.update)
router.delete('/biodata/delete/:id', ctlbio.delete)

router.get('/history/:id', ctlhis.getUserGamesHistoryById)
router.post('/history', ctlhis.create)


router.put('/history/update/:id', ctlhis.update)
router.get('/history/delete/:id', ctlhis.del)
router.delete('/history/delete/:id', ctlhis.delete)

module.exports = router