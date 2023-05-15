const bcrypt  = require('bcrypt')
const conection = require('../DB')
const tokenServise = require('./token-service')
const UserDto = require('../dtos/user_dto.js')
const ApiError = require('../exeptions/api-error')

class userService{


    async login(login, password){
        const user =  await new Promise((resolve, reject) => {
            conection.query("select * from users where login = ?", [login], (err, results, fields, rows) =>{
                resolve(results[0])
            })
        })

        if(!user){
            throw ApiError.BagRequest("Неверный логин")
        }

        const isPassEquals = await bcrypt.compare(password, user.password)
        if(!isPassEquals){
            throw ApiError.BagRequest('Не верный пароль')
        }

        const userDto = new UserDto(user)
        const tokens = await tokenServise.generateTokes({"user":user.id, "login":user.login, "statys":user.assets})
        await tokenServise.saveToken(userDto.id, tokens.refreshToken)
        return{...tokens, user:userDto}

    }

    async refresh(refreshToken){
        if(!refreshToken){
            throw ApiError.UnauthorizeError();
        }
        const userData =  tokenServise.validateRefreshToken(refreshToken)
        const tokenFromDb = await tokenServise.findToken(refreshToken)

        if(!userData || !tokenFromDb){
            throw ApiError.UnauthorizeError()
        }
        
        
        const user =  await new Promise((resolve, reject) => {
            conection.query("select * from users where id = ?", [userData.user], (err, results, fields, rows) =>{
                resolve(results[0])
            })
        })

        //Заменить функцией Update_tokens
        const userDto = new UserDto(user)
        const tokens = await tokenServise.generateTokes({"user":user.id, "login":user.login, "statys":user.assets})
        await tokenServise.saveToken(userDto.id, tokens.refreshToken)
        return{...tokens, user:userDto}
    }

    async users(){
        const user =  await new Promise((resolve, reject) => {
            conection.query("select * from users", (err, results, fields, rows) =>{
                resolve(results)
            })
        })

        return user
    }


    // Add new 
    async Update_tokens(user){
        const userDto = new UserDto(user)
        const tokens = await tokenServise.generateTokes({"user":user.id, "login":user.login, "statys":user.assets})
        await tokenServise.saveToken(userDto.id, tokens.refreshToken)
        return{...tokens, user:userDto}
    }

    async registration(data){
        const user =  await new Promise((resolve, reject) => {
            conection.query("select * from users where login = ?", [data.login] ,(err, results, fields, rows) =>{
                resolve(results[0])
            })
        })
        
        
        if(user){
            throw ApiError.BagRequest('Логин занят')
        }
        console.log(data.login)
        const password = await bcrypt.hash(data.password, 12)
        new Promise((resolve, reject) => {
            conection.query("INSERT INTO `users`(`login`, `password`, `firstName`, `assets`, `lastName`, `city`, `timezone`, `email`, `phone`) VALUES (?, ?, ?, ?, ?, ? , ?, ?, ?)", 
                [data.login, password, data.name, data.role, data.surname, data.city, data.timezone, data.email, data.phone], (err, results, fields, rows) =>{
                    resolve("ok")})
        })

        return    
        
    }
}


module.exports = new userService()