const mongoose = require('mongoose')

class BaseSchema extends mongoose.Schema {
  constructor(properties, schemaName) {
    super(properties, {
      timestamps: true
    });
    this.statics = {
      /**************************************查询方法**************************************/
      /**
       * 查询
       */
      findAll() {
        return this.model(schemaName).find().sort({createdAt: -1}).lean()
      },
      /**
       * 查询并分页
       * @param {Number} page 页码
       * @param {Nuber} size 分页大小
       */
      findAllAndSkipLimit(page, size) {
        return this.model(schemaName).find().sort({createdAt: -1}).skip(size * (page - 1)).limit(size).lean()
      },
      /**
       * 查询并排序
       * @param {Object} order 排序方式
       */
      findAllAndOrder(order) {
        return this.model(schemaName).find().sort(order).lean()
      },
      /**
       * 查询并排序分页
       * @param {Object} order 排序方式
       * @param {Number} page 页码
       * @param {Number} size 分页大小
       */
      findAllAndOrderSkipLimit(order, page, size) {
        return this.model(schemaName).find().sort(order).skip(size * (page - 1)).limit(size).lean()
      },
      /**
       * 关联查询
       * @param {String} refs 关联字段
       */
			findAllAndRef(refs) {
        return this.model(schemaName).find().populate(refs).sort({createdAt: -1}).lean()
      },
      /**
       * 关联查询并分页
       * @param {String} refs 关联字段
       * @param {Number} page 页码
       * @param {Number} size 分页大小
       */
      findAllAndRefSkipLimit(refs, page, size) {
        return this.model(schemaName).find().populate(refs).sort({createdAt: -1}).skip(size * (page - 1)).limit(size).lean()
      },
      /**
       * 关联查询并排序
       * @param {String} refs 关联字段
       * @param {Object} order 排序方式
       */
      findAllAndRefOrder(refs, order) {
        return this.model(schemaName).find().populate(refs).sort(order).lean()
      },
      /**
       * 关联查询并排序分页
       * @param {String} refs 关联字段
       * @param {Object} order 排序方式
       * @param {Number} page 页码
       * @param {Number} size 分页大小
       */
      findAllAndRefOrderSkipLimit(refs, order, page, size) {
        return this.model(schemaName).find().populate(refs).sort(order).skip(size * (page - 1)).limit(size).lean()
      },
      /**
       * 根据id查询
       * @param {String} id id
       */
      findByID(id) {
        return this.model(schemaName).findById(id).lean()
      },
      /**
       * 根据id关联查询
       * @param {String} id id
       * @param {String} refs 关联字段
       */
      findByIDAndRef(id, refs) {
        return this.model(schemaName).findById(id).populate(refs).lean()
      },
      /**
       * 带条件查询
       * @param {Object} filter 过滤条件
       */
      findByFilter(filter) {
        return this.model(schemaName).find().where(filter).sort({createdAt: -1}).lean()
      },
      /**
       * 带条件查询并分页
       * @param {Object} filter 过滤条件
       * @param {Number} page 页码
       * @param {Number} size 分页大小
       */
      findByFilterAndSkipLimit(filter, page, size) {
        const result = this.model(schemaName).find().where(filter).sort({createdAt: -1}).skip(size * (page - 1)).limit(size).lean()
        return result
      },
      /**
       * 带条件查询并排序
       * @param {Object} filter 过滤条件
       * @param {String} order 排序方式
       */
      findByFilterAndOrder(filter, order) {
        return this.model(schemaName).find().where(filter).sort(order).lean()
      },
      /**
       * 带条件查询并排序分页
       * @param {Object} filter 过滤条件
       * @param {Obejct} order 排序方式
       * @param {Numebr} page 页码
       * @param {Number} size 分页大小
       */
      findByFilterAndOrderSkipLimit(filter, order, page, size) {
        return this.model(schemaName).find().where(filter).sort(order).skip(size * (page - 1)).limit(size).lean()
      },
      /**
       * 带条件关联查询
       * @param {Object} filter 过滤条件
       * @param {String} refs 关联字段
       */
      findByFilterAndRef(filter, refs) {
        return this.model(schemaName).find().where(filter).sort({createdAt: -1}).populate(refs).lean()
      },
      /**
       * 带条件关联查询并分页
       * @param {Object} filter 过滤条件
       * @param {String} refs 关联字段
       * @param {Number} page 页码
       * @param {Number} size 分页大小
       */
      findByFilterAndRefSkipLimit(filter, refs, page, size) {
        return this.model(schemaName).find().where(filter).populate(refs).sort({createdAt: -1}).skip(size * (page - 1)).limit(size).lean()
      },
      /**
       * 带条件关联查询并排序
       * @param {Object} filter 过滤条件
       * @param {String} refs 关联字段
       * @param {Object} order 排序方式
       */
      findByFilterAndRefOrder(filter, refs, order) {
        return this.model(schemaName).find().where(filter).populate(refs).sort(order).lean()
      },
      /**
       * 带条件关联查询并排序分页
       * @param {Object} filter 过滤条件
       * @param {String} refs 关联字段
       * @param {Object} order 排序方式
       * @param {Number} page 页码
       * @param {Number} size 分页大小
       */
      findByFilterAndRefOrderSkipLimit(filter, refs, order, page, size) {
        return this.model(schemaName).find().where(filter).populate(refs).sort(order).skip(size * (page - 1)).limit(size).lean()
      },
      /**************************************更新方法**************************************/
      /**
       * 根据id更新数据
       * @param {String} id id
       * @param {Object} update 更新的数据
       */
      updateObj(id, update) {
        return this.model(schemaName).findByIdAndUpdate(id, update, { new: true })
      },
      /**************************************插入方法**************************************/
      /**
       * 添加数据
       * @param {Object} obj 添加的数据
       */
      createObj(obj) {
        return this.model(schemaName).create(obj)
      },
      /**************************************删除方法**************************************/
      /**
       * 根据id删除数据
       * @param {String} id id
       */
      removeObj(id) {
        return this.model(schemaName).findByIdAndRemove(id)
      },
      /**
       * 根据条件删除数据
       */
      removeObjByFilter(filter) {
        return this.model(schemaName).deleteMany(filter)
      }
    }
  }
}

module.exports = BaseSchema