import { getToken } from '../utils/auth'

export default {
  computed: {
    uploadUrl() {
      return 'http://127.0.0.1:3002/api/public/upload/';
    }
  },
  methods: {
    getAuthHeaders() {
      const token = getToken()
      const headers = {}
      if (token) {
        headers.Authorization = 'Bearer ' + token
      }
      return headers
    }
  }
}