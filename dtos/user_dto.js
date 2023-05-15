module.exports = class UserDto{
    id
    login
    statys
    firstName
    lastName
    city
    timezone
    email
    phone

    constructor(model){
        this.id  = model.id
        this.login = model.login
        this.statys = model.assets
        this.firstName = model.firstName
        this.lastName = model.lastName
        this.city = model.city
        this.timezone = model.timezone
        this.email = model.email
        this.phone = model.phone
    }
}