# rcge-cli
`rcge-cli` 是一款基于react项目的脚手架。用于用户快速的生成项目模板。

支持的项目模板：
- ✅ pc-admin：pc端的项目管理后台通用模板，此模板已经开源在github上：链接为：[https://github.com/Chechengyi/antd-admin](https://github.com/Chechengyi/antd-admin)
- ❌ mobile: todo 模板待完善
- ❌ basic: todo  模板待完善

## 如何使用
```bash
npm install rcge-cli -g

rcg-cli create app
```

## 相关命令

| 命令          | 功能         | 示范                                                         |
| ------------- | ------------ | ------------------------------------------------------------ |
| create        | 创建一个项目 | `rcg-cli create app`                                         |
| add page      | 添加页面     | `rcg-cli add page home `  <br />添加page页面模板到指定目录   |
| add component | 添加组件     | `rcg-cli add component select`<br />添加select组件模板到指定目录 |

后续还有部署、集成相关的命令会继续完善。

## 如何工作

目前来讲，`rcg-cli` 所做的工作就是将 `github` 上的项目模板拉取到本地。添加了 生成页面以及 生成组件的脚本已减轻开发时的工作量。那么，在生成页面的时候，模板从何而来？脚手架如何知道要将模板复制到哪个位置？由此，需要维护一份配置文件：

### 配置文件

```json
{
  "target": "pc-admin", // 项目类型
  "pageMenu": "src/routes", // 页面所在目录
  "componentsMenu": "src/components", // 组件所在目录
  "templateMenu": "template" // 模板目录
}
```

不同类型的项目模板最终对应文件结构不同，但是可以使用相同的参数去描述。这是 `pc-admin` 类型项目所对应的配置文件，会在项目创建的时候一并的被写入到创建项目的根目录，于此同时会将模板文件也写到项目根目录。命名为 `template` 文件夹，`template` 文件下对应两个文件夹：`page`、`component` 。这就是对应的页面和组件的模板。

![](https://s3.ax1x.com/2020/11/14/DPtwWV.png)

将模板文件暴露给用户的意义在于，用户可以自己定制模板的内容。**但是在定制的同时，模板文件的命名一定要遵循 page、component**

## 未来展望

目前来讲，`rcg-cli` 是一套功能很简单的脚手架。即便在后面部署的功能添加，在创建项目时的模板选择方面，仍会有极大的限制。开发者只能选择我提供的几种模板。

如果能将拉去模板的这个行为在提取出来作为一个包，姑且称之为物料，在配置文件里面去声明所要使用的物料，当然，在开发 `rcg-cli` 所使用的物料时，一定要遵循相关的规范。 我认为这样的设计比较适合一个公司下的内部使用。获取不同部门的每个团队最终自己所沉淀的模板是不相同的。这样做，既可以统一使用一个脚手架供全部开发人员使用，又可以自己定制符合自己团队的项目模板内容。

总的来说，目前提供的功能还是很有限，在未来的时间里，有更好的想法会继续完善这个工具。

