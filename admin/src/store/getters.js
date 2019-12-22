const getters = {
  token: state => state.adminUser.token,
  userInfo: state => state.adminUser.userInfo,
  filterRoutes: state => state.adminUser.filterRoutes,
  redirect: state => state.adminUser.redirect
}

export default getters