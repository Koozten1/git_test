const jwt = require('jsonwebtoken')
const conection = require('../DB')

class TokenServise{

    async generateTokes(payload){
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY, {expiresIn:"30m"})
        const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY, {expiresIn:"30d"})
        return {
            accessToken, 
            refreshToken
        }
    }

    async saveToken(userId, refreshToken){
        const tokenData = await new Promise((resolve, reject) => {
            conection.query("select * from tokens where id_login = ?", userId, (err, results) => {
            resolve(results)
            })
        })

        if(tokenData[0]){
            const token = await new Promise((resolve, reject) => {
                conection.query("update tokens set token = ? where id_login = ?", [refreshToken, userId], (err, results) => {
                resolve(results)
               })
            })
            return token
        }
    }

    validateAccessToken(token){
        try{
            console.log(token)
            const userData = jwt.verify(token, process.env.JWT_ACCESS_KEY)
            return userData

        }catch(e){
            return null
        }
    }

    validateRefreshToken(token){
        try{
            const userData = jwt.verify(token, process.env.JWT_REFRESH_KEY)
            console.log(12323)
            return userData

        }catch(e){
            return null 
        }
    }
 
    async findToken(refreshToken){
        const tokenData = await new Promise((resolve, reject) => {
            conection.query("select * from tokens where token = ?", refreshToken, (err, results) => {
            resolve(results)
            })
        })
        return tokenData
    }

}

module.exports = new TokenServise();