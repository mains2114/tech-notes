安装PEAR包管理器

[安装过程](http://pear.php.net/manual/en/installation.getting.php)

1. 下载文件 [go-pear.phar](http://pear.php.net/go-pear.phar)
2. 执行命令 `php go-pear.phar`

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
installing phar://C:/php/go-pear.phar/PEAR/go-pear-tarballs/Archive_Tar-1.4.0.tar...
installing phar://C:/php/go-pear.phar/PEAR/go-pear-tarballs/Console_Getopt-1.4.1.tar...
installing phar://C:/php/go-pear.phar/PEAR/go-pear-tarballs/PEAR-1.10.1.tar...
installing phar://C:/php/go-pear.phar/PEAR/go-pear-tarballs/Structures_Graph-1.1.1.tar...
installing phar://C:/php/go-pear.phar/PEAR/go-pear-tarballs/XML_Util-1.3.0.tar...
install ok: channel://pear.php.net/Archive_Tar-1.4.0
install ok: channel://pear.php.net/Console_Getopt-1.4.1
install ok: channel://pear.php.net/Structures_Graph-1.1.1
install ok: channel://pear.php.net/XML_Util-1.3.0
install ok: channel://pear.php.net/PEAR-1.10.1
PEAR: Optional feature webinstaller available (PEAR's web-based installer)
PEAR: Optional feature gtkinstaller available (PEAR's PHP-GTK-based installer)
PEAR: Optional feature gtk2installer available (PEAR's PHP-GTK2-based installer)

PEAR: To install optional features use "pear install pear/PEAR#featurename"

** WARNING! Old version found at C:\php, please remove it or be sure to use the
new c:\php\pear.bat command

The 'pear' command is now at your service at c:\php\pear.bat


* WINDOWS ENVIRONMENT VARIABLES *
For convenience, a REG file is available under C:\phpPEAR_ENV.reg .
This file creates ENV variables for the current user.

Double-click this file to add it to the current user registry.


C:\php>
```

[检查 PEAR 是否正常工作](http://pear.php.net/manual/en/installation.checking.php)

在命令行中执行以下命令
```
C:\>where pear
C:\php\pear.bat

C:\>pear
Commands:
build                  Build an Extension From C Source
bundle                 Unpacks a Pecl Package
channel-add            Add a Channel
...

C:\>pear version
PEAR Version: 1.10.1
PHP Version: 7.0.6
Zend Engine Version: 3.0.0
Running on: Windows NT HUANG 10.0 build 10586 (Windows 10) i586

```


安装 phpcs (PHP_CodeSniffer)

执行命令 `pear install PHP_CodeSniffer`

检查安装结果
```
C:\>where phpcs
C:\php\phpcs
C:\php\phpcs.bat

C:\>where phpcbf
C:\php\phpcbf
C:\php\phpcbf.bat
```

安装 node.js

直接打开安装包``，按照引导，在安装过程中选择安装所有功能即可。
检查安装结果，保证指令`node`和`npm`可用。
```
C:\Users\mains2114>where node
C:\Program Files (x86)\nodejs\node.exe

C:\Users\mains2114>where npm
C:\Program Files (x86)\nodejs\npm
C:\Program Files (x86)\nodejs\npm.cmd
```

安装 jscs

使用 npm 安装，执行指令 `npm install jscs --global`。因为 npm 从国外的站点下载资源，所以速度比较慢，耐心等待即可。
另外也可以尝试淘宝提供的 [cnpm](https://npm.taobao.org/) 。

检查安装结果，保证`jscs`可以被正常执行。
```
C:\Users\mains2114>
C:\Users\mains2114>npm install jscs -g
C:\Users\mains2114\AppData\Roaming\npm\jscs -> C:\Users\mains2114\AppData\Roamin
g\npm\node_modules\jscs\bin\jscs
jscs@3.0.3 C:\Users\mains2114\AppData\Roaming\npm\node_modules\jscs
├── to-double-quotes@2.0.0
├── estraverse@4.2.0
├── to-single-quotes@2.0.0
├── reserved-words@0.1.1
├── natural-compare@1.2.2
├── vow@0.4.12
├── strip-json-comments@1.0.4
├── pathval@0.1.1
├── jscs-preset-wikimedia@1.0.0
├── exit@0.1.2
├── xmlbuilder@3.1.0
├── strip-bom@2.0.0 (is-utf8@0.2.1)
├── cli-table@0.3.1 (colors@1.0.3)
├── resolve@1.1.7
├── glob@5.0.15 (path-is-absolute@1.0.0, inherits@2.0.1, inflight@1.0.4, once
@1.3.3)
├── commander@2.9.0 (graceful-readlink@1.0.1)
├── js-yaml@3.4.6 (inherit@2.2.3, esprima@2.7.2, argparse@1.0.7)
├── minimatch@3.0.0 (brace-expansion@1.1.4)
├── vow-fs@0.3.5 (vow-queue@0.4.2, uuid@2.0.2, glob@4.5.3)
├── htmlparser2@3.8.3 (domelementtype@1.3.0, entities@1.0.0, domhandler@2.3.0
, domutils@1.5.1, readable-stream@1.1.14)
├── chalk@1.1.3 (escape-string-regexp@1.0.5, ansi-styles@2.2.1, supports-colo
r@2.0.0, strip-ansi@3.0.1, has-ansi@2.0.0)
├── jscs-jsdoc@2.0.0 (jsdoctypeparser@1.2.0, comment-parser@0.3.1)
├── lodash@3.10.1
├── prompt@0.2.14 (revalidator@0.1.8, pkginfo@0.4.0, read@1.0.7, winston@0.8.
3, utile@0.2.1)
├── jsonlint@1.6.2 (nomnom@1.8.1, JSV@4.0.2)
└── cst@0.1.6 (babylon@6.8.0, source-map-support@0.4.0, babel-runtime@6.6.1,
babel-types@6.8.1)

C:\Users\mains2114>where jscs
C:\Users\mains2114\AppData\Roaming\npm\jscs
C:\Users\mains2114\AppData\Roaming\npm\jscs.cmd
C:\Users\mains2114>jscs -h

  Usage: jscs [options] <file ...>

  A code style linter for programmatically enforcing your style guide.

  Options:

    -h, --help                       output usage information
    -V, --version                    output the version number
    -c, --config [path]              configuration file path
    --auto-configure <path> [paths]  auto-generate a JSCS configuration file
    -x, --fix                        fix code style violations (applies to fixable violations)
    --extract <mask>                 set file masks from which to extract JavaScript
    --es3                            validates code as es3
    -n, --no-colors                  clean output without colors
    -p, --preset <preset>            preset config
    -m, --max-errors <number>        maximum number of errors to report
    -f, --error-filter <path>        a module to filter errors
    -r, --reporter <reporter>        error reporter, console - default, text, checkstyle, junit, inline, unix, summary, json
                                     Also accepts relative or absolute path to custom reporter
                                     For instance:
                                          ../some-dir/my-reporter.js    (relative path with extension)
                                          ../some-dir/my-reporter       (relative path without extension)
                                          /path/to/my-reporter.js       (absolute path with extension)
                                          /path/to/my-reporter          (absolute path without extension)

```