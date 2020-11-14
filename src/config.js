const InquirerConfig = {
  // 文件夹已存在的名称的询问参数
  folderExist: [{
    type: 'list',
    name: 'recover',
    message: '当前文件夹已存在，请选择操作：',
    choices: [
      { name: '创建一个新的文件夹', value: 'newFolder' },
      { name: '覆盖', value: 'cover' },
      { name: '退出', value: 'exit' },
    ]
  }],
  // 重命名的询问参数
  rename: [{
    name: 'inputNewName',
    type: 'input',
    message: '请输入新的项目名称: '
  }],
  // 选择项目类型
  chooseProType: [{
    type: 'list',
    name: 'type',
    message: '期望创建什么类型项目',
    choices: [
      {name: 'pc-admin(PC管理后台)', value: 'pc-admin'},
      {name: 'mobile(手机端)', value: 'mobile'},
    ]
  }],
  // 移动端项目选择使用的 css loader
  chooseCssLoader: [{
    type: 'list',
    name: 'mobileCssLoader',
    message: '选择移动端适配方案',
    choices: [
      {name: 'rem(px2rem)', value: 'rem'},
      {name: 'vw(px2vw)', value: 'vw'}
    ]
  }]
}

const typeMap = {
  'page': '页面',
  'component': '组件'
}
const InputFloderName = {
  type: 'input',
  name: 'floderName',
  message: '请输入文件名'
}
function getInputFloderNameConfig(type) {
  InputFloderName.message = `请输入${typeMap[type]}名`
  return InputFloderName
}

const pcAdminRepo = 'github:chechengyi/antd-admin'


module.exports = {
  InquirerConfig,
  pcAdminRepo,
  getInputFloderNameConfig
}