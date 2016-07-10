title: 使用 Sublime 约束 PHP Web 开发代码风格
date: 2016-05-10 11:42:42
tags:
  - 代码规范
  - sublime
  - jscs
  - phpcs
category:
  - 开发环境
---

### 概述

本文主要介绍，如何基于 Sublime Text 3 编辑器，使用 SublimeLinter 插件，配合 jscs、phpcs 进行 PHP、JS、CSS 代码风格的约束，以保证团队开发时能够保持统一的编码风格。

<!--more-->

### JSCS 的基本安装

首先安装 [Node.js](https://nodejs.org)。从官方网站下载 [msi 安装包](https://nodejs.org/dist/v4.4.4/node-v4.4.4-x86.msi)（不要下载 exe 文件，那不是安装包）。不过官网被墙，也可以从 [Node.js中文网](http://nodejs.cn/) 下载相应的安装包。直接打开安装文件，按照引导，在安装过程中选择安装所有功能即可。检查安装结果，保证指令`node`和`npm`可用。
```
> where node
C:\Program Files (x86)\nodejs\node.exe

> where npm
C:\Program Files (x86)\nodejs\npm
C:\Program Files (x86)\nodejs\npm.cmd
```

使用 npm 安装，执行指令 `npm install jscs --global`。检查安装结果，保证`jscs`可以被正常执行。
因为 npm 从国外的站点下载资源，所以速度比较慢，耐心等待即可。另外也可以尝试淘宝提供的 [cnpm](https://npm.taobao.org/) 。
```
> npm install jscs -g
...

> where jscs
C:\Users\huang\AppData\Roaming\npm\jscs
C:\Users\huang\AppData\Roaming\npm\jscs.cmd

# 使用 jscs -h 查看帮助信息
> jscs -h
...

# jscs 的基本使用方法
> jscs --preset=airbnb /path/to/file.js
...
```


### phpcs 的基本安装

如果 PEAR 已经配置成功，使用命令`pear install PHP_CodeSniffer`。安装完成后，就可以使用`phpcs -h`和`phpcbf -h`。
```
> where phpcs
C:\php\phpcs
C:\php\phpcs.bat

> where phpcbf
C:\php\phpcbf
C:\php\phpcbf.bat
```

### Sublime Text 3 以及相关插件的安装

从 [Sublime 官网](https://www.sublimetext.com/) 下载 Windows 系统最新版本（3103）的安装包，然后安装即可。（顺便提供一个[注册码](http://9iphp.com/web/html/sublime-text-3-license-key.html/comment-page-1)，但不提供汉化版本）

[Package Control](https://packagecontrol.io/) 是 Sublime Text 的包管理工具。从 [https://packagecontrol.io/installation](https://packagecontrol.io/installation) 获取安装 Package Control 的代码和方法。安装完成后，就可以使用 Package Control 来安装其它插件了。

使用快捷键`ctrl+shift+p`打开 Command Palette，输入`Package Control`，就会列出 Package Control 相关的命令。选择`Package Control: Install Package`，然后输入插件部分名称，找到相关插件之后就可以安装了。

安装以下插件：
- SublimeLinter
- SublimeLinter-jscs
- SublimeLinter-phpcs

使用 Sublime Text 3 的原因是插件`SublimeLinter`只支持 ST3。


### 项目的设置

使用 Sublime 提供的 Project 管理不同的项目。从菜单`Project -> Add Folder to Project...`添加项目的根目录到 Project。然后使用`Project -> Save Project As...`保存 Project 配置到项目的根目录。通过菜单`Project -> Edit Project`，编辑项目相关设置，然后保存。在提交代码时，可以把该文件提交，用于保存项目公共的配置。

对项目配置文件做以下修改
- 修改其中`path`为`.`，使用相对路径，使得项目文件在所有人的电脑上都可用
- 修改`settings`中的配置，为项目需要使用的同一设置
- 针对 phpcs，需要增加下面给出的额外配置

```
{
    "folders":
    [
        {
            "path": "."
        }
    ],
    "settings": {
        "ensure_newline_at_eof_on_save": true,
        "trim_trailing_white_space_on_save": true,
        "show_encoding": true,
        "show_line_endings": true,
        "translate_tabs_to_spaces": false
    },
    "SublimeLinter": {
        "linters": {
            "phpcs": {
                // "cmd": "${project}/vendor/bin/phpcs"
                "standard": "${project}/phpcs.xml"
            }
        }
    }
}
```

另外，在项目的根目录下，创建文件：
- `.jscsrc`，用于保存 jscs 针对该项目的配置
- `phpcs.xml`，用于保存 phpcs 针对该项目的配置

以下给出两个文件的样例，具体的配置方法请参考 jscs 和 phpcs 的文档。

JSCS 配置样例：
- 基于 [airbnb 代码规范](https://github.com/airbnb/javascript)
- 使用制表符进行缩进
- 允许在任何地方通过`var`创建变量
- 允许空的代码块
- 削弱对空行的要求

```
{
    "preset": "airbnb",
    "validateIndentation": "\t",
    "disallowMultipleVarDecl": null,
    "disallowEmptyBlocks": null,
    "requirePaddingNewLinesBeforeLineComments": null
}
```

phpcs 配置样例：
- 基于 [PSR2 代码规范](https://jifei.gitbooks.io/php-fig-standards/content/index.html)
- 使用制表符进行缩进

```
<?xml version="1.0"?>
<ruleset name="MyStandard">
    <description>PSR2 with tabs instead of spaces.</description>
    <file>scripts</file>
    <exclude-pattern>*/Tests/*</exclude-pattern>
    <arg name="tab-width" value="4"/>
    <rule ref="PSR2">
        <exclude name="Generic.WhiteSpace.DisallowTabIndent"/>
    </rule>
    <rule ref="Generic.WhiteSpace.DisallowSpaceIndent"/>
    <rule ref="Generic.WhiteSpace.ScopeIndent">
        <properties>
            <property name="indent" value="4"/>
            <property name="tabIndent" value="true"/>
        </properties>
    </rule>
</ruleset>
```

注：JSCS 可以从当前目录往上到父目录自动查找`.jscsrc`文件，phpcs 则必须手动通过指令配置自定义的代码配置，如：`phpcs --standard=/path/to/custom.xml`。

相关资源汇总：[百度云](http://pan.baidu.com/s/1kUSjPR5)

### 参考资料

- [Package Control](https://packagecontrol.io/)
- [JSCS](http://jscs.info)
- [phpcs - PHP_CodeSniffer](https://github.com/squizlabs/PHP_CodeSniffer)
- [Sublime Text Unofficial Documentation](http://docs.sublimetext.info/en/latest/index.html)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [Airbnb JavaScript Style Guide 中文版](https://github.com/sivan/javascript-style-guide/blob/master/es5/README.md)
- [php-fig-standards](https://jifei.gitbooks.io/php-fig-standards/content/index.html)
- [PSR2 with tabs instead of spaces](https://gist.github.com/gsherwood/9d22f634c57f990a7c64)
