import {
  crudList,
  crudListByFilter,
  crudListByFilterAndRefs,
  crudListByFilterAndPaging,
  crudListByFilterAndRefsPaging,
  crudAdd,
  crudDelete,
  crudUpdate,
  crudOneById,
  crudOneByIdAndRefs
} from '../../api/crud'

const crud = {
  state: {
  },
  mutations: {
  },
  actions: {
    // 查询所有
    CrudList({ }, params) {
      return crudList(params).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    },
    // 带条件查询
    CrudListByFilter({ }, params) {
      return crudListByFilter(params).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    },
    // 带条件关联查询
    CrudListByFilterAndRefs({ }, params) {
      return crudListByFilterAndRefs(params).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    },
    // 带条件查询并分页
    CrudListByFilterAndPaging({ }, params) {
      return crudListByFilterAndPaging(params).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    },
    // 带条件关联查询并分页
    CrudListByFilterAndRefsPaging({ }, params) {
      return crudListByFilterAndRefsPaging(params).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    },
    // 添加
    CrudAdd({ }, params) {
      return crudAdd(params).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    },
    // 修改
    CrudUpdate({ }, params) {
      return crudUpdate(params).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    },
    // 删除
    CrudDelete({ }, params) {
      return crudDelete(params).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    },
    // 根据id查询
    CrudOneById({ }, params) {
      return crudOneById(params).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    },
    // 根据id关联查询
    CrudOneByIdAndRefs({ }, params) {
      return crudOneByIdAndRefs(params).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    }
  }
}
export default crud