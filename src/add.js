const path = require('path')
const { log, parseCmdParams } = require('./utils')
const { getInputFloderNameConfig, InquirerConfig } = require('./config')
const inquirer = require('inquirer')
const fs = require('fs-extra')
const { exit } = require('process')

class Add {
  constructor(source, desc){
    this.type = source
    // this.cmdDatas = parseCmdParams(desc)
    this.folderName = desc.parent.args[2]
    // console.log(this.cmdDatas)
    // console.log(this.getTargetPath('dddd'))
    this.init()
  }
  async init(){
    await this.getConfig()
    await this.checkFolderName()
    await this.formatFolderName()
    this.targetPath = await this.getTargetPath(this.folderName)
    await this.checkFolderNameHasIn()
    console.log(this.targetPath)
    await this.getTemplatePath()
    await this.copyTemplateToProject()
  }
  async checkFolderName(){
    if (!this.folderName) {
      let inputerConfig = getInputFloderNameConfig(this.type)
      let { floderName } = await inquirer.prompt(inputerConfig)
      this.folderName = floderName
    }
  }
  async formatFolderName(){
    let floderName = this.folderName
    floderName = floderName[0].toUpperCase() + floderName.slice(1)
    this.folderName = floderName
    console.log(this.folderName)
  }
  async checkFolderNameHasIn(){
    // 检查是否重复 如果重复询问是覆盖还是重新输入
    // await fs.pathExistsSync(this.targetPath)
    const isExist = await fs.pathExistsSync(this.targetPath)
    if ( isExist ) {
      // console.log('名字重复')
      const { recover } = await inquirer.prompt(InquirerConfig.folderExist)
      switch (recover) {
        case 'newFolder':
          const { inputNewName } = await inquirer.prompt(InquirerConfig.rename)
          if (inputNewName == this.folderName) {
            log.error('输入的文件名还是重复')
            exit(1)
            return
          }
          this.folderName = inputNewName
          this.targetPath = await this.getTargetPath(this.folderName)
          break
        case 'cover':
          await fs.removeSync(this.targetPath)
          break
        case 'exit':
          exit(1)
          break   
        default:
          break  
      }
    } else {

    }
  }
  async getConfig(){
    try {
      let config = await fs.readFileSync(path.resolve(process.cwd(), 'rcg.config.json'), 'utf-8')
      config = JSON.parse(config)
      this.config = config
    } catch (err) {
      log.error(err)
      log.error('未能读取到config文件，请保证是在项目根目录执行命令且配置文件存在')
    }
  }
  async getTargetPath(){
    try {
      let config = this.config
      switch (this.type) {
        case 'page':
          return path.resolve(process.cwd(), config.pageMenu + '/' + this.folderName)
        case 'component':
          return path.resolve(process.cwd(), config.componentsMenu + '/' + this.folderName)  
        default:
          return path.resolve(process.cwd(), config.pageMenu + '/' + this.folderName)
      }
    } catch (err) {
      log.error(err)
      log.error('未能读取到config文件，请保证是在项目根目录执行命令且配置文件存在')
      exit(1)
    }
  }
  async getTemplatePath(){
    let url
    switch (this.type) {
      case 'page':
        url = path.resolve(process.cwd(), this.config.templateMenu + '/page')
        break;
      case 'component':
        url = url = path.resolve(process.cwd(), this.config.templateMenu + '/component')
        break
      default:
        break;
    }
    // 检测模板文件是否存在
    let isExit = await fs.pathExistsSync(url)
    if (!isExit) {
      log.error(`未发现模板文件:${url}，或许您已经删除，这将导致add功能不可使用`)
      // log.warning('可以执行: rcg-cli template 命令重新写入模板文件，然后将config配置里的模板路径改到此位置')
      exit(1)
      return
    }
    this.templatePath = url
  }
  async copyTemplateToProject(){
    await fs.ensureDirSync(this.targetPath)
    let cssText = fs.readFileSync(path.resolve(this.templatePath, 'css'))
    await fs.outputFileSync(path.resolve(this.targetPath, 'index.less'), cssText)
    let jsText = fs.readFileSync(path.resolve(this.templatePath, 'index'), 'utf-8')
    jsText = this.replateText(jsText, '_NAME_', this.folderName)
    await fs.outputFileSync(path.resolve(this.targetPath, 'index.tsx'), jsText)
  }
  replateText(souce, target, str){
    let reg = new RegExp(target, 'g')
    return souce.replace(reg, str)
  }
}

module.exports = Add;