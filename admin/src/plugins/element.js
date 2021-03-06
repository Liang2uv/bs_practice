import Vue from 'vue'
// 布局
import { Container, Aside, Main, Header, Row, Col } from 'element-ui'
// 导航
import { Menu, Submenu, MenuItemGroup, MenuItem, Dropdown, DropdownItem, DropdownMenu } from 'element-ui'
// 表单
import { Button, Input, Form, FormItem, Radio, RadioGroup, Select, Option, Cascader, Upload, DatePicker, InputNumber } from 'element-ui'
// 数据展示
import { Table, TableColumn, Pagination, Tree, Image } from 'element-ui'
// 交互
import { Dialog, Message, Popconfirm, MessageBox, Tooltip, Loading } from 'element-ui'
// 其他
import { Icon, Avatar, Card, Tag, TabPane, Tabs } from 'element-ui'

// 布局
Vue.use(Container)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Header)
Vue.use(Row)
Vue.use(Col)

// 导航
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Dropdown)
Vue.use(DropdownMenu)
Vue.use(DropdownItem)

// 数据展示
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Tree)
Vue.use(Image)

// 表单
Vue.use(Button)
Vue.use(Input)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Upload)
Vue.use(DatePicker)
Vue.use(InputNumber)

// 交互
Vue.use(Dialog)
Vue.prototype.$message = Message
Vue.use(Popconfirm)
Vue.prototype.$confirm = MessageBox.confirm
Vue.prototype.$prompt = MessageBox.prompt
Vue.prototype.$alert = MessageBox.alert
Vue.use(Tooltip)
Vue.prototype.$loading = Loading.service

// 其他
Vue.use(Icon)
Vue.use(Avatar)
Vue.use(Card)
Vue.use(Tag)
Vue.use(TabPane)
Vue.use(Tabs)