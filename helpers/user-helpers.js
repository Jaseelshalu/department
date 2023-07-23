var db = require('../config/connection')
var collection = require('../config/collection')
const { ObjectId } = require('mongodb')

module.exports = {
    doSignup: (userData) => {
        let response = {}
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ Email: userData.Email })
            if (user) {
                response.status = false
                resolve(response)
            } else {
                db.get().collection(collection.USER_COLLECTION).insertOne(userData).then(() => {
                    response.user = userData
                    response.status = true
                    resolve(response)
                })
            }
        })
    },
    doLogin: (userData) => {
        let response = {}
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ Email: userData.Email })
            if (user) {
                if (user.Password === userData.Password) {
                    response.user = user;
                    response.status = true
                    resolve(response)
                } else {
                    resolve({ status: false })
                }
            } else {
                resolve({ status: false })
            }
        })
    },
    formTransfer: (data) => {
        return new Promise(async (resolve, reject) => {
            let exist = await db.get().collection(collection.FORM_COLLECTION).findOne({ Name: data.Name })
            if (exist) {
                resolve(false)
            } else {
                db.get().collection(collection.FORM_COLLECTION).insertOne(data).then((response) => {
                    resolve(response)
                })
            }
        })
    }
}