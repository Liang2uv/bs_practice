const express = require('express')
const FriendService = require('../../service/FriendService')

const router = express.Router({
  mergeParams: true // 合并参数
})

// 获取好友列表
router.get('/', async (req, res, next) => {
  try { res.send(await FriendService.getList(req.user._id.toString())) } catch (err) { next(err) }
})
// 添加好友
router.post('/', async (req, res, next) => {
  try { res.send(await FriendService.addFriend(req.user._id.toString(), req.body['toUser'], req.body['remark'])) } catch (err) { next(err) }
})

module.exports = router
