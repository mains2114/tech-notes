title: Nginx基于域名的虚拟主机配置
id: 4
categories:
  - 服务器
tags:
  - nginx
  - 虚拟主机
  - virtual host
date: 2015-06-10 23:28:30
---

首先，一般服务器的公网IP地址只有一个。如果要在Nginx中建立多个虚拟主机的话，如果使用基于端口的虚拟主机配置，就必然会使用到多个端口，URL也会变成这样：www.example.com:8080。虽然也达到了同样的目的，但这URL却不方便记忆，对用户更是不友好的。

如果你拥有一个域名，并且可以设置其解析规则的话，设置多个二级域名并根据域名建立虚拟主机是一个比较好的选择。比如，论坛服务由forum.example.com提供，博客服务由blog.example.com提供。

整个配置文件的结构如下所示：
```
http {
    # global configuration
    #
    ...

    # default server handles those unmatched pattern
    #
    server {
        listen 80 default_server;
        server_name example.com www.example.com;
        ...
    }

    # forum host
    #
    server {
        listen 80;
        server_name forum.example.com;
        ...
    }

    # blog host
    #
    server {
        listen 80;
        server_name blog.example.com;
        ...
    }
}
```

<!--more-->

上面的代码片段已经可以达到最终的目的。

补充：

如果想要禁止通过IP地址直接访问，只允许通过域名访问，可以添加以下片段：
```
server {
    listen 80;
    server_name 127.0.0.1;# 改为具体的IP地址
    return 444;
}
```
如果要了解更多关于Nginx如何处理HTTP请求，请参看官方的文档。

参考文档： [How nginx processes a request](http://nginx.org/en/docs/http/request_processing.html)

&nbsp;