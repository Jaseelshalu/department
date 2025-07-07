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
                    db.get().collection(collection.SURAH_PENDING_COLLECTION).insertOne(userData)
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
            try {
                let users = await db.get().collection(collection.USER_COLLECTION).find({ Email: userData.Email }).toArray();
                let userFound = false;
                for (let user of users) {
                    if (user.DOB === formattedDob) {
                        response.user = user;
                        response.status = true;
                        userFound = true;
                        break;
                    }
                }
                if (!userFound) {
                    response.status = false;
                }
                resolve(response);
            } catch (error) {
                reject(error);
            }
        });
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
                console.log(data);

                let res = await db.get().collection(collection.SUBJECTS_COLLECTION).findOne({ code: data.Program })
                data.Program = res.subject
                console.log(data);

                db.get().collection(collection.FORM_COLLECTION).insertOne(data).then(async (result) => {
                    response.result = result
                    db.get().collection(collection.PENDING_COLLECTION).deleteOne({ _id: new ObjectId(data.userId) })
                    resolve(response)
                })
            }
        })
    },
    surahTransfer: (data) => {
        return new Promise(async (resolve, reject) => {
            let response = {}
            let exist = await db.get().collection(collection.SURAH_COLLECTION).findOne({ UserId: data.userId })
            let sub = await db.get().collection(collection.SURAH_COLLECTION).findOne({ RadioName: data.RadioName })
            console.log(exist);
            if (exist) {
                response.exist = "You are already submitted"
                resolve(response)
            } else if (sub) {
                response.sub = "This subject already taken"
                resolve(response)
            } else {
                db.get().collection(collection.SURAH_COLLECTION).insertOne(data).then(async (result) => {
                    response.result = result
                    db.get().collection(collection.SURAH_PENDING_COLLECTION).deleteOne({ _id: new ObjectId(data.userId) })
                    resolve(response)
                })
            }
        })
    },
    unlockedItems: () => {
        return new Promise(async (resolve, reject) => {
            let result = {}
            let documents = await db.get().collection(collection.FORM_COLLECTION).find({ RadioName: { $exists: true } }).toArray()
            if (documents && documents.length > 0) {
                const numIterations = Math.min(30, documents.length);
                for (let i = 1; i <= numIterations; i++) {
                    if (documents[i - 1].RadioName) {
                        result['sum' + i] = documents[i - 1].RadioName;
                    }
                }
                resolve(result);
            } else {
                resolve(result)
            }
        })
    },
    unlockedSurahs: () => {
        return new Promise(async (resolve, reject) => {
            let result = {}
            let documents = await db.get().collection(collection.SURAH_COLLECTION).find({ RadioName: { $exists: true } }).toArray()
            if (documents && documents.length > 0) {
                const numIterations = Math.min(30, documents.length);
                for (let i = 1; i <= numIterations; i++) {
                    if (documents[i - 1].RadioName) {
                        result['sum' + i] = documents[i - 1].RadioName;
                    }
                }
                resolve(result);
            } else {
                resolve(result)
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
    findSubject: (id) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.FORM_COLLECTION).findOne({ userId: id }, { userId: 0, Program: 1 }).then((sub) => {
                resolve(sub)
            })
        })
    },
    findSurah: (id) => { // new
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.SURAH_COLLECTION).findOne({ userId: id }, { userId: 0, Program: 1 }).then((sub) => {
                resolve(sub)
            })
        })
    },
    findTlink: (sub) => { // new
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.SUBJECTS_COLLECTION).findOne(
                { subject: sub },
                { projection: { tlink: 1, _id: 0 } }
            ).then((tlink) => {
                resolve(tlink)
            }).catch((err) => {
                reject(err)
            })
        })
    },
    checkingForm: (id) => {
        return new Promise(async (resolve, reject) => {
            let exist = await db.get().collection(collection.FORM_COLLECTION).findOne({ userId: id })
            if (exist) resolve({ staus: true })
            else resolve(false)
        })
    },
    checkingSurah: (id) => { // new
        return new Promise(async (resolve, reject) => {
            let exist = await db.get().collection(collection.SURAH_COLLECTION).findOne({ userId: id })
            if (exist) resolve({ staus: true })
            else resolve(false)
        })
    },
    getUserProfile: (id) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).findOne({ _id: new ObjectId(id) }).then((data) => {
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
    getUsersApi: () => {
        return new Promise(async (resolve, reject) => {
            let users = await db.get().collection(collection.USER_COLLECTION).aggregate([
                {
                    $lookup: {
                        from: collection.FORM_COLLECTION,
                        let: { userIdStr: { $toString: '$_id' } },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$userId', '$$userIdStr'] }
                                }
                            },
                            { $limit: 1 } // Only one program
                        ],
                        as: 'subject'
                    }
                },
                {
                    $lookup: {
                        from: collection.SURAH_COLLECTION,
                        let: { userIdStr: { $toString: '$_id' } },
                        pipeline: [
                            {
                                $match: {
                                    $expr: { $eq: ['$userId', '$$userIdStr'] }
                                }
                            },
                            { $limit: 1 } // Only one subject
                        ],
                        as: 'surah'
                    }
                },
                {
                    $project: {
                        _id: 0,
                        Code: 1,
                        Name: 1,
                        Institution: 1,
                        Place: 1,
                        Email: 1,
                        Phone: { $toString: '$Phone' },
                        DOB: 1,
                        subject: { $arrayElemAt: ['$subject.Program', 0] },
                        surah: { $arrayElemAt: ['$surah.Subject', 0] }
                    }
                }
            ]).toArray();
            resolve(users)
        })
    }
}