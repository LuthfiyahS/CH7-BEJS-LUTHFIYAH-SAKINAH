const express = require('express')
const router = express.Router()
const ctl = require('../../controllers/view/profileController')
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
            if (file.mimetype == 'video/mp4' || file.mimetype == 'video/quicktime' ) {
                cb(null, true)
            } else {
                cb(null, false)
                return cb(new "Error, Only accepted .png .jpg and .jpeg")
            }
        }
        
    }
});

router.get('/', ctl.viewprofile)

router.get('/insert', ctl.insertprofile)
router.post('/insert', ctl.create)

// router.get('/update', ctl.editprofile)
// router.post('/update', ctl.update)

router.post('/history', ctl.create)

router.get('/account', ctl.show)
router.post('/account',upload.any(), ctl.updateUserGames)

module.exports = router
