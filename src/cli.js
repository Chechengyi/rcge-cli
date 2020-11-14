const commander = require('commander')
const pkg = require('../package.json')
const Creator = require('./creator')
const Add = require('./add')

commander
  .version(String(pkg.version));

commander
  .command('create <name>')
  .description('创建项目')
  .option('-F, --force', '忽略文件检查，如果存在直接覆盖')
  .action((source, desc)=> {
    new Creator(source, desc)
  })


commander
  .command('add <type>')
  .description('创建页面')
  .option('-F, --force', '忽略文件检查，如果存在直接覆盖')
  .action((source, desc)=> {
    new Add(source, desc)
  })

commander.parse(process.argv);


