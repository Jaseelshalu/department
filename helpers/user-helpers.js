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
            let response = {}
            let exist = await db.get().collection(collection.FORM_COLLECTION).findOne({ Name: data.Name })
            let sub = await db.get().collection(collection.FORM_COLLECTION).findOne({ RadioName: data.RadioName })
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
            let rrrr = {}
            let documents = await db.get().collection(collection.FORM_COLLECTION).find({ RadioName: { $exists: true } }).toArray()
            if (documents && documents.length > 0) {
                const numIterations = Math.min(30, documents.length);
                for (let i = 1; i <= numIterations; i++) {
                    if (documents[i - 1].RadioName) {
                        rrrr['sum' + i] = documents[i - 1].RadioName;
                    }
                }
                console.log(rrrr);
                resolve(rrrr);
            } else {
                resolve()
            }
        })
    },
    subTransfer: (data) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.SUBJECT_COLLECTION).insertOne(data).then(() => {
                resolve()
            })
        })
    },
    findSubject: (name) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.FORM_COLLECTION).findOne({ Name: name }, { Name: 0, Program: 1 }).then((sub) => {
                resolve(sub)
            })
        })
    },
    addPending: (name) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.PENDING_COLLECTION).deleteOne({ Name: name }).then(() => {
                resolve()
            })
        })
    },
    turnTransfer: (turnData) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.TURN_COLLECTION).insertOne(turnData).then(() => {
                resolve()
            })
        })
    },
    checkingTurn: (name) => {
        return new Promise(async (resolve, reject) => {
            let exist = await db.get().collection(collection.TURN_COLLECTION).findOne({ Name: name })
            if (exist) resolve({ staus: true })
            else resolve(false)
            })
    }
}