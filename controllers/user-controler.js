const { json } = require('body-parser')
const userService = require('../service/user-service')

class UserController{

    async login(req, res, next){
        try{
            const {login, password} = req.body
            const userData = await userService.login(login, password)
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30* 24 * 60 * 60 * 1000, httpOnly: true})
            res.json(userData)
        }catch (e){
            next(e)
        }
    }

    async refresh(req, res, next){
        try{
            const {refreshToken} = req.cookies
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30* 24 * 60 * 60 * 1000, httpOnly: true})
            return res.json(userData);
        }catch(e){
            next(e)
        }
    }

    async users(req, res, next){
        try{
            const data = await userService.users();
            return res.json(data)
        }catch(e){
            next(e)
        }
    }

    async registration (req, res, next){
        try{
            await userService.registration(req.body)
            
            return res.send("Пользователь добавлен")
        }catch(e){
            next(e)
        }
    }


 }

 module.exports = new UserController();