const path = require('path')
const { log, parseCmdParams, getGitUserInfo } = require('./utils')
const fs = require('fs-extra')
const ora = require('ora');
const inquirer = require('inquirer')
const download = require('download-git-repo')
const { exit } = require('process')
const { InquirerConfig, pcAdminRepo } = require('./config');

class Create {
  constructor(source, desc){
    this.source = source
    this.cmdDatas = parseCmdParams(desc)
    this.targetPath = this.getTargetPath(this.source)
    this.proInfo = {
      type: 'pc-admin',
      MobileCssLoader: 'rem',
      temp: __dirname
    };
    this.getTargetPath()
    this.spinner = ora()
    this.init()
  }
  async init(){
    try {
      await this.checkFloder()
      await this.chooseProjectType()
      await this.downloadRepo()
      // await this.copyFolderToTarget()
      await this.updatePackageFile()
      await this.writeConfig()
      await this.copyTemplateForProject()

      log.success('项目初始化完成')
      log.success(`cd ${this.source}`)
      log.success('npm install')
      log.success('npm start')

    } catch (err) {
      log.error(err)
      exit(1)
    } finally {
      this.spinner.stop()
    }
  }
  
  checkFloder(){
    return new Promise(async (resolve, reject)=> {
      if ( this.cmdDatas.force ) {
        await fs.removeSync(this.targetPath);
        return resolve()
      }
      try{

        const isExist = await fs.pathExistsSync(this.targetPath)
        if (!isExist) return resolve()

        const { recover } = await inquirer.prompt(InquirerConfig.folderExist)

        if ( recover === 'newFolder' ) {
          const { inputNewName } = await inquirer.prompt(InquirerConfig.rename)
          if (inputNewName === this.source) {
            log.error('输入的文件名还是重复')
            exit(1)
            return
          }
          this.source = inputNewName
          this.targetPath = this.getTargetPath(this.source)
          return resolve()
        } else if (recover === 'cover') {
          await fs.removeSync(this.targetPath)
          return resolve()
        } else {
          log.success('退出成功')
          exit(1)
        }

      } catch (err) {

      }
    })
  }
  
  async chooseProjectType(){
    const { type } = await inquirer.prompt(InquirerConfig.chooseProType)
    console.log(type)
    this.proInfo = {
      ...this.proInfo,
      type
    }
    // todo 加上其他类型的项目初始化
    if ( type !== 'pc-admin' ) {
      log.warning('功能开发中，暂不可用')
      exit(1)
      return;
    }
    if (type==='mobile'){
      const { mobileCssLoader }  = await inquirer.prompt(InquirerConfig.chooseCssLoader)
      this.proInfo.MobileCssLoader = mobileCssLoader
    }
  }

  downloadRepo(){
    this.spinner.start('正在拉取项目模板...')
    const repo = this.getRepoPath()
    // const { temp } = this.proInfo
    let temp = this.targetPath
    return new Promise(async (resolve, reject)=> {
      await fs.removeSync(temp)
      download(repo, temp, async (err)=> {
        if (err) return reject(err)
        this.spinner.succeed('模板下载成功')
        return resolve()
      })
    })
  }

  async copyFolderToTarget(){
    const { temp } = this.proInfo
    const targetPath = this.targetPath
    
    await fs.copySync(temp, targetPath)
    await fs.removeSync(path.resolve(targetPath, './git'))
    
  }

  async updatePackageFile(){
    this.spinner.start('更新package.json...')
    const pkgPath = path.resolve(this.targetPath, 'package.json')
    const unnecessaryKey = ['keywords', 'license', 'files', 'private']
    const {name, email} = await getGitUserInfo()
    if ( !name || !email ) {
      log.warning('未获取到git user 信息')
    }

    let jsonData = fs.readFileSync(pkgPath, 'utf-8')
    jsonData = JSON.parse(jsonData)

    unnecessaryKey.forEach(key => delete jsonData[key])
    Object.assign(jsonData, {
      name: this.source,
      author: name && email ? `${name} ${email}` : '',
      version: "1.0.0"
    })
    await fs.writeJsonSync(pkgPath, jsonData, { spaces: '\t' })
    this.spinner.succeed('package.json更新完成')
  }

  getTargetPath(fileName='react-app'){
    // process.cwd() 命令执行的地址
    return path.resolve(process.cwd(), fileName);
  }

  getRepoPath(){
    switch(this.proInfo.type){
      case 'pc-admin':
        return pcAdminRepo
      default:
        return pcAdminRepo  
    }
  }

  async writeConfig(){
    let configName
    switch (this.proInfo.type) {
      case 'pc-admin':
        configName = 'pcAdminSettingConfig.json'
        break
      default:
        configName = 'pcAdminSettingConfig.json'
        break
    }
    const { temp } = this.proInfo
    let tempPath = path.resolve(temp, configName)
    let targetPath = path.resolve(this.targetPath,  './' + 'rcg.config.json')
    await fs.copySync(tempPath, targetPath)
    log.success('脚手架配置写入成功, rcg.config.json')
  }

  async copyTemplateForProject(){
    const { temp } = this.proInfo
    let tempPath = path.resolve(temp, 'template')
    let targetPath = path.resolve(this.targetPath, './'+ 'template')
    await fs.copySync(tempPath, targetPath)
    log.success('脚手架模板写入成功, template')
  }

}

module.exports = Create