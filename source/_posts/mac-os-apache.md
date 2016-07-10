title: Mac OS中Apache服务器（httpd）的使用与控制
id: 17
categories:
  - 操作系统
tags:
  - mac os
  - apache
  - httpd
date: 2015-08-12 00:38:08
---

本文主要介绍Mac OS中预装的Apache服务器（httpd）的基本使用方法，不涉及Apache的编译或安装方法。

1\. 查看是否已经安装，以及安装的版本信息

```
whereis httpd
/usr/sbin/httpd
whereis apachectl
/usr/sbin/apachectl
httpd -v
Server version: Apache/2.4.10 (Unix)
Server built: Jan 8 2015 20:48:33
```

注：2.2.x与2.4.x的配置文件中的指令存在较大的差别，故使用网上搜来的配置时，请特别注意版本之间的差异。

<!--more-->

2\. 关于httpd和apachectl的简单介绍
httpd是Apache服务器程序，是实际运行的进程。
apachectl是Apache服务器的控制程序，实际上是一段脚本（在Mac OS中是shell的脚本）。
apachectl是通过系统相关的指令，调用httpd来实现服务器的控制，可以视为对httpd的包装。
根据系统不同，apachectl的执行方式略有差异，主要有以下参数：
apachectl command
start
通过Mac系统的launchd加载org.apache.httpd任务
stop, graceful-stop
通过Mac系统的launchd卸载org.apache.httpd任务
restart, graceful
通过Mac系统的launchd重启org.apache.httpd任务
configtest
调用httpd -t测试配置文件格式
fullstatus, startssl
废弃的功能

apachectl [ httpd-argument ]
对于apachectl不支持的指令，直接传递给httpd去调用实现

相比之下httpd的指令更加丰富，下面列出一些常用的：
httpd -h
查看帮助信息

httpd -S
httpd -t -D DUMP_VHOSTS -D DUMP_RUN_CFG
查看已配置的虚拟主机，以及基本配置信息，可用于快速查看配置是否生效

httpd -M
httpd -t -D DUMP_MODULES
使用新的模块时，查看模块是否加载

注：httpd -S | -M 针对的不是正在运行的httpd，而是通过单独解析配置文件得出。

3\. 默认的相关路径(Mac OS)
可执行文件httpd, apachectl
/usr/sbin/httpd
/usr/sbin/apachectl

默认的配置文件目录
/etc/apache2/
/private/etc/apache2/
(实际为同一目录，Mac系统中，将/etc与/private/etc连接到一起，实际上是同一个地方，访问任意地址均可)

默认的日志文件目录
/var/log/apache2/
/private/var/log/apache2/

默认进程文件(记录主进程的pid)
/private/var/run/httpd.pid

默认服务器根目录(DocumentRoot)
???

4\. 启动
先检查httpd是否已经启动，'ps -ef | grep httpd'

如果没有，则可以通过sudo apachectl start启动(使用launchd启动，其副作用为，开机自启动，进程被杀自动重启)

如果通过httpd -k start或httpd直接启动，则没有上述副作用。

通过launchd启动的httpd不能通过指令httpd -k stop来停止，使用kill指令杀进程后，也会自动重启，必须使用sudo apachectl stop来停止。同时开机自启动也会被取消。不建议直接通过launchd来直接控制，因为launchd的指令真是太多了，而且挺长的(launchctl load -w /System/Library/LaunchDaemons/org.apache.httpd.plist)。