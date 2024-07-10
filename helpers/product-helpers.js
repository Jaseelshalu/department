var db = require('../config/connection')
var collection = require('../config/collection')
var bcrypt = require('bcrypt')
const { ObjectId } = require('mongodb')
module.exports = {
    doSignup: (adminData) => {
        let response = {}
        return new Promise(async (resolve, reject) => {
            let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ Email: adminData.Email })
            if (admin) {
                response.status = false
                response.loginErr = "this email has already taken"
                resolve(response)
            } else {
                if (adminData.Code == 984697) {
                    adminData.Password = await bcrypt.hash(adminData.Password, 10)
                    db.get().collection(collection.ADMIN_COLLECTION).insertOne(adminData).then(() => {
                        db.get().collection(collection.ADMIN_COLLECTION).updateMany({ Email: adminData.Email }, {
                            $unset: { Code: "" }
                        })
                        response.admin = adminData
                        response.status = true
                        resolve(response)
                    })
                } else {
                    response.loginErr = "the code is incorrect"
                    resolve(response)
                }
            }
        })
    },
    doLogin: (adminData) => {
        let response = {}
        return new Promise(async (resolve, reject) => {
            let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ Email: adminData.Email })
            if (admin) {
                bcrypt.compare(adminData.Password, admin.Password).then((result) => {
                    if (result) {
                        response.admin = admin
                        response.status = true
                        resolve(response)
                    } else {
                        resolve({ status: false })
                    }
                })
            } else {
                resolve({ status: false })
            }
        })
    },
    adduser: (user) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).insertOne(user).then((data) => {
                db.get().collection(collection.PENDING_COLLECTION).insertOne(user)
                db.get().collection(collection.TURN_PENDING_COLLECTION).insertOne(user)
                resolve(data.insertedId)
            })
        })
    },
    getAllUsers: () => {
        return new Promise(async (resolve, reject) => {
            let users = await db.get().collection(collection.USER_COLLECTION).find().toArray()
            resolve(users)
        })
    },
    deleteuser: (proId) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).deleteOne({ _id: new ObjectId(proId) }).then((response) => {
                resolve(response)
            })
        })
    },
    getUserDetails: (proId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).findOne({ _id: new ObjectId(proId) }).then((user) => {
                resolve(user)
            })
        })
    },
    edituser: (proId, newuser) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).updateOne({ _id: new ObjectId(proId) }, {
                $set: {
                    Name: newuser.Name,
                    Age: newuser.Age,
                    Place: newuser.Place,
                    Address: newuser.Address,
                    District: newuser.District,
                    DOB: newuser.DOB,
                    Institution: newuser.Institution,
                    Email: newuser.Email,
                    Phone: newuser.Phone
                }
            })
            db.get().collection(collection.TURN_COLLECTION).updateOne({ userId: proId }, {
                $set: {
                    Name: newuser.Name,
                    Age: newuser.Age,
                    Place: newuser.Place,
                    Address: newuser.Address,
                    District: newuser.District,
                    DOB: newuser.DOB,
                    Institution: newuser.Institution,
                    Email: newuser.Email,
                    Phone: newuser.Phone
                }
            })
            db.get().collection(collection.USERDATA_COLLECTION).updateOne({ userId: proId }, {
                $set: {
                    Name: newuser.Name,
                    Age: newuser.Age,
                    Place: newuser.Place,
                    Address: newuser.Address,
                    District: newuser.District,
                    DOB: newuser.DOB,
                    Institution: newuser.Institution,
                    Email: newuser.Email,
                    Phone: newuser.Phone
                }
            }).then(() => {
                resolve()
            })
        })
    },
    getUserST: (stnum) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.USERDATA_COLLECTION).findOne({ STNO: stnum }).then((user) => {
                resolve(user)
            })
        })
    },
    tvShow: () => {
        return new Promise(async (resolve, reject) => {
            let candidates = await db.get().collection(collection.ARABIC_COLLECTION).find({ Order: { $exists: true } }).toArray()
            var sorted = await candidates.sort((a, b) => a.Order - b.Order);
            resolve(sorted[0])
        })
    },
    viewShow: (Id) => {
        return new Promise(async (resolve, reject) => {
            let candidate = await db.get().collection(collection.USERDATA_COLLECTION).findOne({ userId: Id })
            resolve(candidate)
        })
    },
    editShow: (Id) => {
        return new Promise(async (resolve, reject) => {
            let candidate = await db.get().collection(collection.ARABIC_COLLECTION).findOne({ userId: Id })
            resolve(candidate)
        })
    },
    overShow: (Id, Order) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.ARABIC_COLLECTION).updateOne({ userId: Id }, {
                $set: {
                    Order: Order+"00"
                }
            }).then(() => {
                resolve()
            }) 
        })
    },
    editArabic: (Id, newuser) => {
        return new Promise(async (resolve, reject) => {
            db.get().collection(collection.ARABIC_COLLECTION).updateOne({ userId: Id }, {
                $set: {
                    Name: newuser.Name,
                    Age: newuser.Age,
                    Place: newuser.Place,
                    Address: newuser.Address,
                    District: newuser.District,
                    DOB: newuser.DOB,
                    Institution: newuser.Institution,
                    Email: newuser.Email,
                    Phone: newuser.Phone,
                    Turn: newuser.Turn,
                    Order: newuser.Order
                }
            }).then(() => {
                resolve()
            })
        })
    }
}