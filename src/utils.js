const chalk = require('chalk');
const childProcess = require('child_process');

const log = {
  warning(msg = '') {
    console.log(chalk.yellow(`${msg}`));
  },
  error(msg = '') {
    console.log(chalk.red(`${msg}`));
  },
  success(msg = '') {
    console.log(chalk.green(`${msg}`));
  }
}

function parseCmdParams (cmd) {
  if (!cmd) return {}
  const resOps = {}
  cmd.options.forEach(option => {
    const key = option.long.replace(/^--/, '');
    if (cmd[key] && ! (typeof cmd[key] === 'function') ) {
      resOps[key] = cmd[key]
    }
  })
  return resOps
}

// 运行cmd命令
function runCmd (cmd) {
  return new Promise((resolve, reject) => {
    childProcess.exec(cmd, (err, ...arg) => {
      if (err) return reject(err)
      return resolve(...arg)
    })
  })
}


function getGitUserInfo(){
  return new Promise(async (resolve, reject)=> {
    const user = {}
    try {
      const name = await runCmd('git config user.name')
      const email = await runCmd('git config user.email')
      if (name) user.name = name.replace(/\n/g, '');
      if (email) user.email = `<${email || ''}>`.replace(/\n/g, '')
      resolve(user)
    } catch (err) {
      log.error('获取git用户信息失败')
      resolve(user)
    }
  })
}

module.exports = {
  parseCmdParams,
  log,
  getGitUserInfo,
  runCmd
}