title: Windows 系统 PHP 环境配置简易教程
date: 2016-05-09 15:23:27
tags:
  - php
  - apache
  - windows
category:
  - 服务器
---

### 简介

一个相当简单的 Windows 系统 PHP 环境配置教程，搭配 Apache 服务器、MySQL 数据库进行配置。因为 MySQL 官网提供安装包，所以连 MySQL 的安装都省略了。选择 PHP 官网推荐的资源进行安装配置，尽量使用软件编译时的默认值，避免修改过多配置文件，减少出错几率。

<!--more-->

### 下载文件

请从 [windows.php.net](http://windows.php.net/) 和 [Apache Lounge](https://www.apachelounge.com/) 下载以下文件（VC14，x86）（其它资源不适合该教程提供的配置）：
- [php-7.0.6-Win32-VC14-x86.zip](http://windows.php.net/downloads/releases/php-7.0.6-Win32-VC14-x86.zip)
- [httpd-2.4.20-win32-VC14.zip](https://www.apachelounge.com/download/VC14/binaries/httpd-2.4.20-win32-VC14.zip)

从微软官网下载 VC 运行库（VC14，x86）
- [vc_redist.x86.exe](https://www.microsoft.com/zh-CN/download/details.aspx?id=48145)

这里选择了下载当前最新的版本。如果你要自己选择下载其它版本的 PHP 和 Apache 软件，请注意：
- PHP 选择 5.5 以上的版本，Apache 选择 2.4 以上的版本
- 必须同时选择32位或64位编译的版本
- 必须选择使用同一编译器（VC14、VC11等）编译的版本，并且安装相应的运行库
- 搭配 Apache 服务器使用，必须选择TS(Thread Safe)版本的 PHP


### 安装Apache

首先安装 VC 运行库，执行安装程序`vc_redist.x86.exe`，按照引导安装即可。

然后，把Apache安装到`C:/Apache24`。

打开压缩文件`httpd-2.4.20-win32-VC14.zip`，提取文件夹`Apache24`到C盘根目录。Apache 文件结构以及部分重要的文件如下：

```
C:/Apache24
├── bin/
│   ├── httpd.exe*
│   └── ...
├── cgi-bin/
├── conf/
│   ├── extra/
│   ├── original/
│   ├── httpd.conf*
│   └── ...
├── error/
├── htdocs/
├── icons/
├── include/
├── lib/
├── logs/
├── manual/
├── modules/
├── ...
└── README.txt*
```

使用**管理员权限**打开命令提示符，进入 Apache 可执行文件目录 bin，执行命令`httpd.exe -k install`，安装Apache服务。

```
cd C:/Apache24/bin
httpd.exe -k install

# 正常情况下的输出如下
#
Installing the 'Apache2.4' service
The 'Apache2.4' service is successfully installed.
Testing httpd.conf....
Errors reported here must be corrected before the service can be started.
AH00558: httpd.exe: Could not reliably determine the server's fully qualified domain name, ...
```

成功安装服务后，就可以在任务管理器的服务选项卡中管理Apache服务器。右击`Apache2.4`服务，选择‘启动’。在浏览器中查看网址 [127.0.0.1](http://127.0.0.1)，检查Apache是否正常工作。
![Apache 默认的页面](/images/apache-startup-test.png)

- 上面出现的关于`ServerName`的错误可以忽略，因为它不会影响Apache正常工作；如果有强迫症，可以修改配置文件中`ServerName`的配置取消注释（可以修改为任意值），即可避免此错误提示。
- 配置文件中默认的`ServerRoot`的值为`C:/Apache24`，默认的`DocumentRoot`配置为`C:/Apache24/htdocs`，并且针对目录`C:/Apache24/htdocs`设置好了`Directory`配置，所以把Apache安装在目录`C:/Apache24`，不用修改配置文件就可以直接启动了。
- 如果要把Apache安装到其它目录，必须相应的修改配置文件中`ServerRoot`、`DocumentRoot`、`Directory`配置。


### 安装和配置PHP

把PHP安装到目录`C:/php`。

在C盘根目录创建目录`php`，打开压缩文件`php-7.0.6-Win32-VC14-x86.zip`，提取所有文件到目录`C:/php`。复制`php.ini-development`文件，命名为`php.ini`，作为PHP加载的配置文件。PHP文件结构以及部分重要的文件如下：

```
C:/php
├── dev/
├── ext/
├── extras/
├── lib/
├── sasl2/
├── ...
├── phar.phar.bat*
├── pharcommand.phar*
├── php-cgi.exe*
├── php-win.exe*
├── php.exe*
├── ...
├── php.ini
├── php.ini-development*
├── php.ini-production*
├── php7apache2_4.dll*
├── ...
├── phpdbg.exe*
└── ...
```

修改 Apache 配置文件`C:/Apache24/conf/httpd.conf`，在文件的最后加上以下配置，使 Apache 加载 PHP 模块，并正常处理 PHP 请求。

```
LoadModule php7_module C:/php/php7apache2_4.dll
PHPIniDir C:/php

<IfModule php7_module>
    AddType application/x-httpd-php .php
    AddType application/x-httpd-php-source .phps

    <IfModule dir_module>
        DirectoryIndex index.html index.php
    </IfModule>
</IfModule>
```

在`C:/Apache24/htdocs/`目录下创建文件`phpinfo.php`，输入内容：

```php
<?php phpinfo();
```

重启 Apache 服务器，在浏览器中打开地址 [127.0.0.1/phpinfo.php](http://127.0.0.1/phpinfo.php)，如果能正确查看到 PHP 的信息，则 PHP 基本配置成功。
![phpinfo 显示的页面（此处显示的加载的配置文件路径是错误的，应该是 C:\php\php.ini）](/images/phpinfo2.png)

- 函数`phpinfo()`能输出当前运行的PHP环境中的配置信息，在出现问题时是很好的参考信息。
- 把PHP安装在`C:/php`目录下，在需要加载额外的扩展时，就不用修改配置文件中`extension_dir`的值。从`phpinfo()`中的信息可以看出，`extension_dir`的默认值就是`C:/php/ext`，正好与目前扩展文件所在目录相符。不如说，`php.ini`的默认值就是针对 PHP 安装在`C:/php`目录设置的。
![phpinfo 中 extension_dir 的值](/images/phpinfo-extension-dir.png)

### 配置PHP加载额外的扩展

建议加载的模块：curl、gd、mysqli、pdo-mysql。针对 php.ini 的修改可以参考以下图片，把相应扩展前面的注释取消即可：
![修改 php.ini 加载其它扩展](/images/diff-php-ini-extensions.png)

### 配置 PATH

将目录`C:/php`、`C:/Apache24/bin`加入环境变量`PATH`中。重新启动命令行，通过`where`命令检查是否能够正确查找到`php`和`httpd`的文件路径。出现下面的结果，则表示配置成功。接下来的操作依赖于这一步操作。
```
where php
C:\php\php.exe

where httpd
C:\Apache24\bin\httpd.exe
```

#### 安装 PEAR

PEAR（PHP 扩展与应用库）是 PHP 官方提供的一个框架，它可以用于为已有的 PHP 环境增加一些共用的扩展。为了方便以后的使用，建议先将它安装好。

从 [PEAR 官网](http://pear.php.net) 下载文件 [go-pear.phar](http://pear.php.net/go-pear.phar)，进入命令行执行`php go-pear.phar`，然后根据提示配置相关路径即可。安装完成后，可以通过命令`where pear`和`pear version`测试是否安装成功。
在这里，建议把文件 `go-pear.phar` 放在 PHP 安装目录中（C:\php，因为已经加入到 PATH 环境变量中，就不用为之后安装的 pear 额外配置环境变量），然后在这个目录执行安装命令`php go-pear.phar`。根据提示，把第12项配置 `Name of configuration file` 改为 `C:\php\pear.ini`（默认配置文件为`C:\WINDOWS\pear.ini`，修改为`C:\php\pear.ini`避免污染系统目录）。
```
C:\php>php go-pear.phar

Are you installing a system-wide PEAR or a local copy?
(system|local) [system] :

Below is a suggested file layout for your new PEAR installation.  To
change individual locations, type the number in front of the
directory.  Type 'all' to change all of them or simply press Enter to
accept these locations.

 1. Installation base ($prefix)                   : C:\php
 2. Temporary directory for processing            : C:\php\tmp
 3. Temporary directory for downloads             : C:\php\tmp
 4. Binaries directory                            : C:\php
 5. PHP code directory ($php_dir)                 : C:\php\pear
 6. Documentation directory                       : C:\php\docs
 7. Data directory                                : C:\php\data
 8. User-modifiable configuration files directory : C:\php\cfg
 9. Public Web Files directory                    : C:\php\www
10. System manual pages directory                 : C:\php\man
11. Tests directory                               : C:\php\tests
12. Name of configuration file                    : C:\WINDOWS\pear.ini
13. Path to CLI php.exe                           : C:\php

1-13, 'all' or Enter to continue: 12
(Use $prefix as a shortcut for 'C:\php', etc.)
Name of configuration file [C:\WINDOWS\pear.ini] : C:\php\pear.ini

Below is a suggested file layout for your new PEAR installation.  To
change individual locations, type the number in front of the
directory.  Type 'all' to change all of them or simply press Enter to
accept these locations.

 1. Installation base ($prefix)                   : C:\php
 2. Temporary directory for processing            : C:\php\tmp
 3. Temporary directory for downloads             : C:\php\tmp
 4. Binaries directory                            : C:\php
 5. PHP code directory ($php_dir)                 : C:\php\pear
 6. Documentation directory                       : C:\php\docs
 7. Data directory                                : C:\php\data
 8. User-modifiable configuration files directory : C:\php\cfg
 9. Public Web Files directory                    : C:\php\www
10. System manual pages directory                 : C:\php\man
11. Tests directory                               : C:\php\tests
12. Name of configuration file                    : C:\php\pear.ini
13. Path to CLI php.exe                           : C:\php

1-13, 'all' or Enter to continue:
Beginning install...
Configuration written to C:\php\pear.ini...
Initialized registry...
Preparing to install...
...

# 以下命令用于检查 pear 安装结果
#
C:\> where pear
C:\php\pear.bat

C:\> pear
Commands:
build                  Build an Extension From C Source
bundle                 Unpacks a Pecl Package
channel-add            Add a Channel
...

C:\> pear version
PEAR Version: 1.10.1
PHP Version: 7.0.6
Zend Engine Version: 3.0.0
Running on: Windows NT HUANG 10.0 build 10586 (Windows 10) i586

```


#### 安装 Composer

Composer 是 PHP 用来管理依赖（dependency）关系的工具。你可以在自己的项目中声明所依赖的外部工具库（libraries），Composer 会帮你安装这些依赖的库文件。相比 PEAR，Composer 主要用来管理项目的依赖，而 PEAR 主要用于管理 PHP 环境全局的共用扩展。

从 [Composer 官网](https://getcomposer.org) 下载文件 [composer.phar](https://getcomposer.org/download/1.0.3/composer.phar)，保存到目录`C:/php`中。打开命令行，切换到目录`C:/php`，输入指令`echo @php "%~dp0composer.phar" %* > composer.bat`。然后通过`composer -V`查看版本信息，测试是否正常安装。


### 测试 MySQL

安装 MySQL 可以使用其官方网站上提供的安装包，几乎不会有任何问题，所以不介绍具体过程。这里只给出测试 MySQL 的 PHP 脚本。安装完成后，启动 MySQL 数据库。在`C:/Apache24/htdocs`目录中创建文件`mysql_test.php`，输入以下内容，并在浏览器中访问该文件，查看测试结果。
```php
<?php
$dbuser = 'root';
$dbpass = ''; // 修改为相应的密码，无密码则使用空字符串
mysqli_connect('127.0.0.1', $dbuser, $dbpass) or die('连接MySQL数据库失败');
echo '连接MySQL数据库成功';
```


### 总结

如果没有出现问题，那么 PHP 环境就配置完成了，请记住以下关键信息：
- Apache 主配置文件：`C:/Apache24/conf/httpd.conf`
- Apache DocumentRoot：`C:/Apache24/htdocs`
- Apache 的错误日志：`C:/Apache24/logs/error.log`
- PHP 加载的配置文件：`C:/php/php.ini`

其它建议：
- 可以将该目录`C:/Apache24/htdocs`加入到资源管理器的库中，固定在窗口左边，方便访问。
- 可以将已经配置好的 Apache、PHP 打包压缩，做一个备份。这样就算重装电脑，只需要重新安装 Apache 服务以及配置 PATH。


### 其它

如果本文描述存在错误，欢迎指正。

- 最后修改：2016-05-16
