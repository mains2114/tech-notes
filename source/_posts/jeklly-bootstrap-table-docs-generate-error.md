title: bootstrap-table文档生成过程遭遇的问题
date: 2016-01-28 16:39:33
categories:
  - 错误记录
tags:
  - jeklly
  - bootstrap table
---

# 简介

Bootstrap Table 是一款基于 Bootstrap 的 jQuery 表格插件，也是我最近使用的最多、最熟练的表格插件。简单的概括其特点的话，就是功能强大、配置简单。在引入了相关文件后，在 HTML 表格标签中添加一个属性`data-toggle="table"` ，即可为你的表格披上一层不错的外衣，并提供排序、过滤、选择、导出等强大功能。而且这个插件的文档也比较详细，所以比较容易上手。但是插件的在线文档部署在美国的服务器上，访问虽不需要跨墙，但实在是有点慢。为了方便查看，我决定使用文档的源码生成一份本地的文档。

然后，就遇到了一些问题...

如果，你也打算在本地生成一份 Bootstrap Table 的文档，那么在遇到问题时，这篇文章或许会对你有些许帮助。

<!--more-->

# 过程与问题描述

根据 [Github 上的描述](https://github.com/wenzhixin/bootstrap-table/tree/master/docs)，生成文档需要使用 2.5.x 版本的 [Jeklly](http://jekyllrb.com)，以及代码高亮工具 [Rouge](https://github.com/jneen/rouge)。鉴于本地已经安装了最新版本的 Jeklly 3.0.1，那就先使用 Gem 安装 Rouge，试试能不能正常工作吧。然而，事与愿违。

```
bootstrap-table $ sudo gem install rouge
Fetching: rouge-1.10.1.gem (100%)
Successfully installed rouge-1.10.1
Parsing documentation for rouge-1.10.1
Installing ri documentation for rouge-1.10.1
1 gem installed

bootstrap-table $ jekyll build
Configuration file: /Users/huang/Documents/www/bootstrap-table/_config.yml
jekyll 3.0.1 | Error:  undefined method `read_posts' for class `Jekyll::Site'
```

既然如此，只能老老实实安装 2.5.x 的版本了。使用`sudo gem install jeklly -v 2.5.0`安装指定的版本。然后，在调用 jeklly 的时候指定对应的版本再次尝试。

```
bootstrap-table $ jekyll _2.5.0_ build
Configuration file: /Users/huang/Documents/www/bootstrap-table/_config.yml
            Source: docs
       Destination: _gh_pages
      Generating...

Building site for default language: "en" to: /Users/huang/Documents/www/bootstrap-table/_gh_pages
Please install Rouge 1.3.0 or greater and try running Jekyll again.
  Liquid Exception: Please install Rouge 1.3.0 or greater and try running Jekyll again. in documentation.md
```

错误信息中说，需要安装 1.3.0 版本或更高版本的 Rouge。但是之前的操作已经安装了最新版本 1.10.1 的 Rouge。看来只能使用较旧版本的 Rouge 了，但是我并不知道如何配置才能让 jeklly 生成文档的时候调用指定版本的 Rouge，默认应该是调用最新版本的吧。只好把 1.10.1 版本的 Rouge 先卸载了。

```
bootstrap-table $ sudo gem uninstall rouge
You have requested to uninstall the gem:
	rouge-1.10.1

jekyll-3.0.1 depends on rouge (~> 1.7)
jekyll-2.5.0 depends on rouge (~> 1.7, development)
kramdown-1.9.0 depends on rouge (~> 1.8, development)
If you remove this gem, these dependencies will not be met.
Continue with Uninstall? [yN] y
Successfully uninstalled rouge-1.10.1
```

在卸载 Rough 的时候，Gem 给出提示其它软件包依赖这个包。根据给出的提示，先卸载最新版本的 Rouge 1.10.1，然后再安装满足依赖需求的的最低版本的 Rouge 1.8.0，再试着生成文档。
```
bootstrap-table $ sudo gem install rouge -v 1.8.0
Fetching: rouge-1.8.0.gem (100%)
Successfully installed rouge-1.8.0
Parsing documentation for rouge-1.8.0
Installing ri documentation for rouge-1.8.0
1 gem installed

bootstrap-table $ jekyll _2.5.0_ build
Configuration file: /Users/huang/Documents/www/bootstrap-table/_config.yml
            Source: docs
       Destination: _gh_pages
      Generating...

Building site for default language: "en" to: /Users/huang/Documents/www/bootstrap-table/_gh_pages
  Liquid Exception: invalid byte sequence in US-ASCII in documentation.md
jekyll 2.5.0 | Error:  invalid byte sequence in US-ASCII
```

真是好事多磨！不过经过一番搜索，在 Github 上找到了解决方法，[Jekyll error: invalid byte sequence in US-ASCII](https://gist.github.com/stephCoue/6594937)。只要设置两个环境变量就行了，`export LC_CTYPE="en_US.UTF-8"`，`export LANG="en_US.UTF-8"`。事实上，设置完第一个环境变量之后，文档就成功生成了。使用指令`jeklly _2.5.0_ serve`打开内置的Web服务器，然后就可以通过浏览器访问`0.0.0.0:4000`查看生成的文档了。

# 总结

总的来说，问题的解决过程还是比较麻烦的，相关解决问题的思路或许对自己还是有一些价值。而且，也希望这篇文章能够为其他有相同目的的人提供一些帮助和参考，避免走过多弯路。

# 额外分享

我把生成好的文档打包一份，供需要该文档的人下载。当然，如果你需要更新的文档，你可以自己参考上文去生成，或者提醒我更新下面的附件。

- [bootstrap-table-1.10.0-docs.zip](http://pan.baidu.com/s/1pKinjS3) built on 2016-01-28

使用注意：整个文档必须置于 Web 服务器的根目录下，才能正常工作。如果你安装有较高版本（>=5.5）的 PHP 的话，可以在解压文件之后，`cd`进入目录，然后使用命令`php -S 127.0.0.1:4001`构建一个简单的 Web 服务器，然后在浏览器中访问`127.0.0.1:4001`查看文档。

