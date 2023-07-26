var db = require('../config/connection')
var collection = require('../config/collection')
const { ObjectId } = require('mongodb')

let fg = null

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
            let response = {}
            let exist = await db.get().collection(collection.FORM_COLLECTION).findOne({ Name: data.Name })
            let sub = await db.get().collection(collection.FORM_COLLECTION).findOne({ Program: data.Program })
            if (exist) {
                response.exist = "You are already submitted"
                resolve(response)
            } else if (sub) {
                response.sub = "This subject already taken"
                resolve(response)
            } else {
                db.get().collection(collection.FORM_COLLECTION).insertOne(data).then(async (result) => {
                    response.result = result
                    resolve(response)
                })
            }
        })
    },
    unlockedItems: () => {
        return new Promise(async (resolve, reject) => {
            const documents = await db.get().collection(collection.FORM_COLLECTION).find({ Program: { $exists: true } }).toArray();
            let count = documents.length
            let pr = {}
            for (i = 1; i <= count; i++) {
                if (count >= i) {
                    pr['sum' + i] = documents[i - 1].Program;
                }
            }
            pr.count = count
            resolve(pr)
        })
    },
    subTransfer: (data) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.SUBJECT_COLLECTION).insertOne(data).then(() => {
                fg = data.Program
                resolve()
            })
        })
    },
    findSubject: () => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.SUBJECT_COLLECTION).findOne({ Program: fg },{ Name: 0, Program: 1 }).then((sub) => {
                resolve(sub)
            })
        })
    }
}