// const assert = require('http-assert')

// function aaa() {
//   assert(false, 422, '错了')
// }

// function bbb() {
//   try {
//     aaa()
//   } catch (error) {
//     console.log(error);
//     console.log(JSON.stringify(error))
//     console.log(error.status);
//     console.log(error.message);
//   }
// }

// bbb()

// function AutoWritedAdminUserModel(target, key, descriptor) {
//   target.model = { t: '测试添加' }
// }

// @AutoWritedAdminUserModel
// class AdminUserService {
//   constructor() {
//     this.haha = {a: '急急急'}
//     console.log(AdminUserService.model);
//   }
// }

// const adminuser = new AdminUserService()
// console.log(adminuser.haha);
// console.log(AdminUserService.model);

// function foo(obj) {
//   const { a, b, ...rest } = obj
//   console.log(a);
//   console.log(b);
//   console.log(rest);
// }

// foo({ a: 1, b: 2, c: 3, d: 4 })
const Model = require('./model/AdminUser')
const mongoose = require('mongoose')
mongoose.connect(`mongodb://127.0.0.1:27017/bs-practice-test`, {
  useFindAndModify: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
})
Model.find({}, function (err, doc) {
  if (err) {
    console.log(err);
  }
  console.log(doc);
})

// Model.createObj({phone: "13768131071", password: "123456", username: "王小明", status: 1, role: "superadmin"}, function(err, docs){
//   console.log(docs);
// })

