const ApiError = require('../exeptions/api-error')
const tokenServise = require('../service/token-service')
module.exports = function(req, res, next){
    try{
        const authorizationHeader = req.headers.authorization
        
        if(!authorizationHeader){
            return next(ApiError.UnauthorizeError())
        }
        
        const accessToken = authorizationHeader.split(' ')[1]
        
        
        if(!accessToken){
            return next(ApiError.UnauthorizeError());
        }
        
        const userData =  tokenServise.validateAccessToken(accessToken)

        if(!userData || userData.statys != 'admin'){
            return next(ApiError.UnauthorizeError())
        }

        req.user = userData
        next()

    }catch(e){
        return next(ApiError.UnauthorizeError())
    }
}