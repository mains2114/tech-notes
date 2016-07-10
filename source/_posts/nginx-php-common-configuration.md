title: Nginx与PHP的一般配置
date: 2016-03-30 22:49:11
categories:
  - 服务器
tags:
  - nginx
  - php
---

关于Nginx和PHP的配置，网上能够搜到一大堆的结果和相关的例子。这些例子不能说有错，它们大都能满足基本的测试要求，但在使用一些PHP框架或者使用特殊的部署方式时，在会显示出配置文件的缺陷。这篇文章中，我会结合开发过程中经常遇到的情况，介绍基本的思路，总结出一个比较通用的配置。然而，这个配置并不一定能满足你的需求，但希望能够给你一些帮助。

首先，直接给出最终的配置方案：

```
server {
    listen  80;
    server_name example.com;

    root    /home/huang/www;
    index   index.php index.html index.htm;

    location / {
        # ...
    }

    location ~ \.php($|/) {
        fastcgi_index   index.php;
        fastcgi_pass    127.0.0.1:9000;
        # fastcgi_pass    unix:/home/huang/php/var/run/php-fpm.socket;

        fastcgi_split_path_info ^(.+\.php)(.*)$;
        include     fastcgi_params;
        fastcgi_param   SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }
}
```

<!--more-->

然后，介绍这个配置文件的基本思路：

`root`指令用于设置服务器接受请求的根目录，一般建议使用绝对路径。`index`指令用于指定当URL指向目录时，Nginx会在该目录下搜索指定的文件，依据第一个找到的文件来修改URI，进行`location`匹配，然后进行后续的处理。

将`root`和`index`指令放在`server`块中，这样就不用为每个`location`单独设置，每个`location`块都会继承`server`中的配置。需要改写时，只要在相应的`location`中覆盖`server`中的配置就行了。

采用正则表达式`\.php($|/)`匹配PHP请求，匹配URI中以`.php`结尾或包含`.php/`的请求。对于这种类型的URL`http://127.0.0.1/project/index.php/news/get/1`，网上的一些配置以`\.php$`来匹配，是无法正常处理的。而Nginx官方给出的例子中也有使用`^(.+\.php)(.*)$`来匹配，则能够处理，但这个表达式匹配的条件太宽松。

指令`fastcgi_split_path_info ^(.+\.php)(.*)$;`中，是以正则表达式来捕捉两个分组，第一个分组会作为Nginx中变量`$fastcgi_script_name`的值，第二个分组则会成为变量`$fastcgi_path_info`的值，这两个变量可以供后面的指令使用。

`include`指令引入了一个Nginx配置文件`fastcgi_params`，这个文件用于设置`fastcgi`协议中一些变量的值。其中，`SCRIPT_NAME`如果不正确，会出现`File Not Found`错误。上面的配置文件最后一行重新设置了它的值。

```
fastcgi_param  QUERY_STRING       $query_string;
fastcgi_param  REQUEST_METHOD     $request_method;
fastcgi_param  CONTENT_TYPE       $content_type;
fastcgi_param  CONTENT_LENGTH     $content_length;

fastcgi_param  SCRIPT_NAME        $fastcgi_script_name;
fastcgi_param  REQUEST_URI        $request_uri;
fastcgi_param  DOCUMENT_URI       $document_uri;
fastcgi_param  DOCUMENT_ROOT      $document_root;
fastcgi_param  SERVER_PROTOCOL    $server_protocol;
fastcgi_param  HTTPS              $https if_not_empty;

fastcgi_param  GATEWAY_INTERFACE  CGI/1.1;
fastcgi_param  SERVER_SOFTWARE    nginx/$nginx_version;

fastcgi_param  REMOTE_ADDR        $remote_addr;
fastcgi_param  REMOTE_PORT        $remote_port;
fastcgi_param  SERVER_ADDR        $server_addr;
fastcgi_param  SERVER_PORT        $server_port;
fastcgi_param  SERVER_NAME        $server_name;

# PHP only, required if PHP was built with --enable-force-cgi-redirect
fastcgi_param  REDIRECT_STATUS    200;
```

第一个`location`其实是可以省略的，但是因为经常会在里面加入其它配置，就暂且留在这了。
