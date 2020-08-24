const commander = require('commander')
const pkg = require('../package.json')
const Creator = require('./creator')

commander
  .version(String(pkg.version));

commander
  .command('create <name>')
  .description('创建项目')
  .option('-F, --force', '忽略文件检查，如果存在直接覆盖')
  .action((source, desc)=> {
    new Creator(source, desc)
  })

commander.parse(process.argv);