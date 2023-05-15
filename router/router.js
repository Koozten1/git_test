const Router = require('express').Router
const router = new Router()
const { request } = require('express')
const userController = require('../controllers/user-controler')
const authMiddleware = require('../middlewares/auth-middleware')
const assetsMiddleware = require('../middlewares/assets-middleware')

router.post('/login', userController.login)
router.post('/registration', assetsMiddleware, userController.registration )
router.get('/refresh', userController.refresh )
router.get('/get_users', authMiddleware, userController.users)
module.exports = router