title: Nginx使用HTTP认证实现简单的访问控制
id: 8
categories:
  - 服务器
tags:
  - nginx
  - http认证
date: 2015-06-27 18:28:27
---

HTTP认证可以用于实现基本的访问控制。这个功能在系统没有实现具体的权限控制功能前，可以简单快速的实现通过用户名和密码进行认证登陆的功能。实际上，以前很多路由器管理界面的登陆就是使用的HTTP认证。这个功能是HTTP协议的一部分，在移动平台上使用也没有任何问题。

在Nginx中，可以通过模块 ngx_http_auth_basic_module 来实现基本的HTTP认证，限制用户对服务器资源的访问。

```
# 密码验证的提示信息
#
auth_basic "Please input username and password";
# 保存用户名和密码的文件
#
auth_basic_user_file /path/to/file;
```

<!--more-->

```
# 文件格式
# --------
# comment
name1:password1
name2:password2:comment
name3:password3

# 文件中保存的password并非密码的明文，而是通过其他方式生成的密文
# 可以简单的使用以下命令生成密码的密文
# > openssl passwd 1234
# oJ4Qw7.cTc4oo
#
# 注：重复使用该命令的生成的密文是不一样的
```

Nginx中的HTTP认证指令根据配置文件上下文不同，达到的限定结果不同。在http配置块中设置HTTP认证，则内部的server和location会继承上一级的HTTP认证设置。建议在server配置中添加HTTP认证，简单快捷。配置文件格式如下：

```
# 配置文件格式
#
server {
    listen      80;
    server_name example.com;

    auth_basic  "Please input username and password";
    auth_basic_user_file /path/to/file;

    ...
}

# 密码文件格式
#
user1234:oJ4Qw7.cTc4oo
```

这样重启服务器后，就可以使用用户名user1234和密码1234进行认证登陆了。

参考文档：[Module ngx_http_auth_basic_module](http://nginx.org/en/docs/http/ngx_http_auth_basic_module.html)