title: CentOS7下最新PHP开发环境的编译和配置
date: 2016-04-07 08:37:26
tags:
  - php
  - httpd
  - nginx
  - centos
category:
  - 服务器
---

### 基本说明

本文简单的以流水账的形式记录了一次 PHP 环境的编译和配置过程。一切操作以 root 用户进行，主要是为了便于使用 yum 安装相关依赖包。该文章其实并没有多少技术含量，相关软件的编译也是相当简单。唯一比较有价值的部分，应该是 PHP 编译时相关依赖包的安装，以及通过编译参数选择常用的 PHP 扩展的部分。这部分内容会对没有亲自编译过 PHP 的读者提供少量参考。

另外，服务器操作系统使用 CentOS7，而非 CentOS6.x 的原因，主要是方便使用 yum 安装版本比较新的依赖包。毕竟我要配置的是最新的 PHP7 开发环境。如果你使用的是 CentOS6.x 的话，你要么忍耐着使用 yum 提供的 httpd2.2 和 PHP5.3，或者就准备面对编译时我没遇到其它的依赖问题。CentOS7 官方 yum 源只提供 PHP5.4。但依我说，现在 PHP 开发使用的版本至少应该为 PHP5.5，毕竟 5.5 的版本中加入了很多新的语言特性。时代毕竟在进步，不能总是因循守旧。

在这个记录中，将会使用 yum 安装 mariadb-5.5 (其实就是 MySQL，不编译的原因是，太麻烦了...)，并编译以下软件：
- httpd-2.4.18
- php-7.0.5
- nginx-1.8.1

<!--more-->

### 准备工作

首先从官方网站下载相应软件的源代码

```
wget http://apache.fayea.com//apr/apr-1.5.2.tar.bz2
wget http://apache.fayea.com//apr/apr-util-1.5.4.tar.bz2
wget http://apache.fayea.com//httpd/httpd-2.4.18.tar.bz2
wget http://cn2.php.net/get/php-7.0.5.tar.bz2/from/this/mirror -o php-7.0.5.tar.bz2
wget http://nginx.org/download/nginx-1.8.1.tar.gz
```

### Apache 服务器（httpd）的编译安装

php 的编译过程中会需要编译 Apache 服务器起中一个模块 libphp7，所以先进行 Apache Web 服务器 httpd 的编译。httpd 的编译需要 apr、apr-util、pcre 等软件依赖。其中，pcre 库用于提供正则匹配的功能，直接使用 yum 安装。

```
# yum 安装 pcre
#
yum install pcre pcre-devel

# 解压 httpd、apr、apr-util 源代码
#
tar -jxf httpd-2.4.18.tar.bz2
tar -jxf apr-1.5.2.tar.bz2
tar -jxf apr-util-1.5.4.tar.bz2

# 解压后应该有以下文件
#
ll -lh --time-style=long-iso
total 22M
drwxr-xr-x 27 root root  4.0K 2015-04-25 20:04 apr-1.5.2
-rw-r--r--  1 root root  808K 2015-04-29 08:37 apr-1.5.2.tar.bz2
drwxr-xr-x 19 root root  4.0K 2014-09-17 07:30 apr-util-1.5.4
-rw-r--r--  1 root root  679K 2014-09-20 19:59 apr-util-1.5.4.tar.bz2
drwxr-xr-x 12 root root  4.0K 2016-04-05 21:21 httpd-2.4.18
-rw-r--r--  1 root root  5.0M 2015-12-12 06:25 httpd-2.4.18.tar.bz2

# 按照 httpd 文档的说明，将 apr、apr-util 的代码移动到 httpd 代码文件夹 srclib 目录
#
mv apr-1.5.2 httpd-2.4.18/srclib/apr
mv apr-util-1.5.4 httpd-2.4.18/srclib/apr-util
cd httpd-2.4.18/

# 使用 configure 脚本配置编译参数
# 默认的安装路径为 /usr/local/apache2，已经满足了需求，所以不更改 prefix 设置
# 使用 --with-included-apr 命令，指定使用刚才移动到 srclib 目录的 apr、apr-util
#
./configure --with-included-apr

# configure 基本运行完毕，且没有报错信息时，就可以编译和安装了
#
make && make install
```

接下来检查 httpd 是否能正常工作。

```
# 查看版本信息
#
/usr/local/apache2/bin/httpd -v
Server version: Apache/2.4.18 (Unix)
Server built:   Apr  5 2016 21:21:52

# 尝试启动
#
/usr/local/apache2/bin/apachectl

# 如果你没有改过配置文件的话，一般会有以下提示，直接忽略即可
#
AH00558: httpd: Could not reliably determine the server's fully qualified domain name, using 10.162.83.129. Set the 'ServerName' directive globally to suppress this message

# 使用 ps 检查进程信息
#
ps -ef | grep httpd
root     28510     1  0 22:20 ?        00:00:00 /usr/local/apache2/bin/httpd
daemon   28511 28510  0 22:20 ?        00:00:00 /usr/local/apache2/bin/httpd
daemon   28512 28510  0 22:20 ?        00:00:00 /usr/local/apache2/bin/httpd
daemon   28513 28510  0 22:20 ?        00:00:00 /usr/local/apache2/bin/httpd
root     28599 28464  0 22:23 pts/0    00:00:00 grep --color=auto httpd

# 使用 curl 检查 Web 服务器是否工作正常
#
curl -i 127.0.0.1
HTTP/1.1 200 OK
Date: Wed, 20 Apr 2016 14:23:53 GMT
Server: Apache/2.4.18 (Unix) PHP/7.0.5
Last-Modified: Mon, 11 Jun 2007 18:53:14 GMT
ETag: "2d-432a5e4a73a80"
Accept-Ranges: bytes
Content-Length: 45
Content-Type: text/html

<html><body><h1>It works!</h1></body></html>
```

### PHP 的依赖安装以及编译配置

PHP 的编译过程，会根据你选择的扩展，依赖很多其他软件包，建议使用 yum 解决这些依赖问题。
我使用的编译参数，选择编译了以下的扩展：
- 搭配 httpd 服务器使用的扩展 libphp7
- 搭配 nginx 服务器使用的 php-fpm
- PCRE 正则表达式
- 与压缩相关的扩展 zlib、bz2、zip
- 用于发起 HTTP 请求的 curl
- gd 图形库，可用于生成验证码
- 加密库，mcrypt
- 数据库 mysqli、pdo-mysql、mysqlnd、SQLite3（默认）
- PHP 扩展管理工具 pear

```
# yum 安装相关软件解决依赖，安装以下软件之后，配置的过程基本上就不会再报错了
#
yum install gd gd-devel
yum install libxml2 libxml2-devel
yum install libmcrypt libmcrypt-devel
yum install openssl openssl-devel
yum install bzip2 bzip2-devel
yum install curl libcurl libcurl-devel

tar -jxf php-7.0.5.tar.bz2
cd php-7.0.5/

# --prefixusr/local/php7，指定 php 安装目录
# --with-apxs2=/usr/local/apache2/bin/apxs，使用之前编译好的 httpd，用于 libphp7 的编译
# --enable-fpm，编译 php-fpm，搭配 nginx 服务器时使用
#
./configure \
--prefix=/usr/local/php7 \
--with-apxs2=/usr/local/apache2/bin/apxs \
--enable-fpm \
--with-openssl \
--with-pcre-regex \
--with-zlib \
--enable-bcmath \
--with-bz2 \
--enable-calendar \
--with-curl \
--enable-exif \
--enable-ftp \
--with-gd \
--enable-mbstring \
--with-mcrypt \
--with-mysqli \
--with-pdo-mysql \
--enable-zip \
--enable-sockets \
--enable-mysqlnd \
--with-pear

# 如果没有错误信息的话，就可以开始正式的编译和安装，大约费时 20 分钟
#
make && make install

# 拷贝一份生产环境用的 php 配置文件到默认配置文件地址
# 如果用于开发环境，使用 php.ini.development
#
cp php.ini.production /usr/local/bin/php7/lib/php.ini
```

检查 PHP 是否正常工作，以及与 httpd 是否工作正常
```
# 检查 PHP 版本信息
/usr/local/php7/bin/php -v
PHP 7.0.5 (cli) (built: Apr  5 2016 22:10:56) ( ZTS )
Copyright (c) 1997-2016 The PHP Group
Zend Engine v3.0.0, Copyright (c) 1998-2016 Zend Technologies


# 在 httpd 配置文件中添加对 php 文件的支持
# httpd 的 php 扩展模块已经在编译和安装的时候，自动加入到配置文件中去了，
# 所以我们不必再去添加相应的 LoadModule 指令了
echo 'AddType application/x-httpd-php .php' >> /usr/local/apache2/conf/httpd.conf

# 在 httpd Web 服务器跟目录（默认：/usr/loccal/apache2/htdocs）创建 php 测试文件
echo '<?php phpinfo(); ?>' > /usr/local/apache2/htdocs/phpinfo.php

# 重新启动 httpd 服务器
/usr/local/apache2/bin/apachectl restart

# 在浏览器中访问 phpinfo.php 文件，用 curl 也行，只不过不便于查看详细内容
curl -i 127.0.0.1/phpinfo.php
```

### Nginx 的编译安装

将 Nginx 的安装路径改为 /usr/local/nginx 后，其它参数使用默认值即可。

```
tar -zxf nginx-1.8.1.tar.gz
cd nginx-1.8.1/
./configure --prefix=/usr/local/nginx
make && make install

# 查看 nginx 信息
/usr/local/nginx/sbin/nginx -V
nginx version: nginx/1.8.1
built by gcc 4.8.5 20150623 (Red Hat 4.8.5-4) (GCC)
configure arguments: --prefix=/usr/local/nginx

# 关闭 httpd 服务器，避免占用 80 端口
# 启动 nginx
/usr/local/nginx/sbin/nginx

# 使用 curl 检查 nginx 是否工作正常
curl -i 127.0.0.1
```


### 安装配置 PHP、MySQL

输入指令 `yum install mariadb mariadb-server`，确定即可。MariaDB 是 MySQL 被 Oracle 收购了，由社区维护的版本。 CentOS7 官方 yum 源提供了 mariadb-5.5 的版本。

```
# 启动、关闭、重启 mariadb 的方法：
service mariadb status | start | stop | restart

# 启动 mariadb
service mariadb start

# 登录数据库，直接使用 mysql 命令即可，其它操作与 mysql 类似
# 安装完成后，root 从本地登录是没有密码的，从外网是无法登录的
# 所以只在有必要的时候设置其他登录账户以及密码
mysql -uroot
```

**问题：使用 PHP 连接数据库时，使用'localhost'无法连接，但'127.0.0.1'可以连接**

```
# 登录数据库
mysql -uroot

# 查看默认 socket 地址
MariaDB [(none)]> show variables like 'socket';
+---------------+---------------------------+
| Variable_name | Value                     |
+---------------+---------------------------+
| socket        | /var/lib/mysql/mysql.sock |
+---------------+---------------------------+

# 修改 php.ini 配置
vim /usr/local/php7/lib/php.ini

# 查找 pdo_mysql.default_socket、mysqli.default_socket
# 并修改为服务器中的值：/var/lib/mysql/mysql.sock
```


### 额外内容：阿里云服务器连接云数据库Memcache版依赖库的编译

```bash
# 安装 SASL 相关环境
yum install cyrus-sasl-plain cyrus-sasl cyrus-sasl-devel cyrus-sasl-lib

# 编译 libmemcached
wget https://launchpad.net/libmemcached/1.0/1.0.18/+download/libmemcached-1.0.18.tar.gz
tar -zxf libmemcached-1.0.18.tar.gz
cd libmemcached-1.0.18/
./configure --prefix=/usr/local/libmemcached --enable-sasl
make && make install
cd ..

# 编译 memcached
# 从 Github 下载 memcached php7 版本的源文件，然后编译
unzip php-memcached-php7.zip
cd php-memcached-php7/
/usr/local/php7/bin/phpize
./configure \
--with-libmemcached-dir=/usr/local/libmemcached \
--with-php-config=/usr/local/php7/bin/php-config \
--enable-memcached-sasl
make && make install
```

