import { getNoteList } from '../../api/note'

const note = {
  state: {
  },
  mutations: {
  },
  actions: {
    GetNoteList({ commit }, params) {
      return getNoteList(params).then(res => {
        return [null, res]
      }).catch(err => {
        return [err]
      })
    }
  }
}
export default note