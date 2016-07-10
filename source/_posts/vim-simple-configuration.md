title: VIM 的简单配置
date: 2016-06-23 22:40:59
tags:
  - VIM
category:
  - 开发环境
---

VIM 是一个强大的编辑器。但可惜, 对于我这种菜鸡来说, 它并不是一个好用的编辑器。为了让 VIM 成为堪为我用的编辑器, 我也曾经耐着性子看了两遍`vimtutor`, 做了一些练习。可惜, 我最终选择了 Sublime 以及其它 IDE。但在连接服务器时, 我还是不得不使用它。

为了能在新的服务器快速配置 VIM, 我还是参考`vimtutor` 整理了一个简单快速的配置方法。其实, 从百度上直接搜一个现成 VIM 配置文件的配置文件, 也是可以的。但我毕竟好歹也看了两遍教程, 使用百度出来的配置实在无法展现我通过教程学习到的姿势。所以, 才有了这篇很啰嗦的笔记。

1. 在命令行输入`vim` 直接打开 VIM
2. 切换到命令模式, 输入`:e $HOME/.vimrc`, 打开 VIM 的配置文件
3. 输入`:r $VIMRUNTIME/vimrc_example.vim`, 将示例配置文件内容读入当前的配置文件
4. 在文件最后, 加上一些额外的配置
5. 输入 `:wq`, 保存并退出

<!--more-->

```vim
set number          " show line numbers
set autoindent
set smartindent
set cindent
set tabstop=4
set shiftwidth=4
set softtabstop=4
set nobackup
set bg=dark
set encoding=utf-8

" optional configurations
"
set expandtab       " convert tab to space
                    " use `set noexpandtab` to disable
set mouse=          " disable mouse
                    " use `set mouse` to enable mouse
```

- 关于鼠标

  VIM 提供的示例配置文件会在终端支持鼠标的情况下, 启动鼠标功能, 此时你就能使用鼠标来进行操作: 滚轮可以用来滚动页面, 拖动鼠标可以在选中块。具体效果可以自己体验。可以通过`set mouse=`来关闭鼠标功能。

- 关于`expandtab`

  根据原始文件使用的缩进方式, 可能会造成一些麻烦。总之, 自己根据需要来启用和关闭。
