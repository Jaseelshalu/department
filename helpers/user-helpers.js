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
                    db.get().collection(collection.PENDING_COLLECTION).insertOne(userData)
                    db.get().collection(collection.TURN_PENDING_COLLECTION).insertOne(userData)
                    response.user = userData
                    response.status = true
                    resolve(response)
                })
            }
        })
    },
    doLogin: (userData) => {
        let dobParts = userData.Password.split('-');
        let formattedDob = dobParts[2] + '-' + dobParts[1] + '-' + dobParts[0];
        let response = {}
        return new Promise(async (resolve, reject) => {
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({ Email: userData.Email })
            if (user && user.DOB === formattedDob) {
                response.user = user;
                response.status = true
                resolve(response)
            } else {
                resolve({ status: false })
            }
        })
    },
    formTransfer: (data) => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            let exist = await db.get().collection(collection.FORM_COLLECTION).findOne({ userId: data.userId })
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
                    db.get().collection(collection.PENDING_COLLECTION).deleteOne({ _id: new ObjectId(data.userId) })
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
                resolve(rrrr);
            } else {
                resolve(rrrr)
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
    checkingForm: (name) => {
        return new Promise(async (resolve, reject) => {
            let exist = await db.get().collection(collection.FORM_COLLECTION).findOne({ Name: name })
            if (exist) resolve({ staus: true })
            else resolve(false)
        })
    },
    getUserProfile: (name) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).findOne({ Name: name }).then((data) => {
                resolve(data)
            })
        })
    },
    candidates: () => {
        return new Promise(async (resolve, reject) => {
            let candidates = await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(candidates)
        })
    },
    getUserId: () => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).findOne({ Name: name }).then((data) => {
                resolve(data)
            })
        })
    }
}