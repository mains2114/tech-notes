title: 基本的服务器安全措施——修改sshd_config限制用户登陆
id: 11
categories:
  - 服务器
tags:
  - linux
date: 2015-07-14 22:54:37
---

最常见同时也是最简单无脑的一种服务器攻击方式，应该是暴力的密码破解。如果服务器的root账户没有限制密码错误次数，而且密码设置过于简单的话，简单暴力的密码破解都很有可能攻击成功，获取root权限。我们可以通过简单的修改sshd_config文件达到限制用户登陆的目的，在一定程度上减少这样的威胁。

首先，在Linux服务器上，sshd服务是默认开启的（可以通过`service sshd status`查看），并且监听22端口，所以我们才能通过ssh登陆到服务器。而sshd_config文件则是sshd服务的配置文件，修改该配置文件就可以达到限制用户通过ssh登陆的作用。

配置文件sshd_config的位置默认是/etc/ssh/sshd_config，配置的文件格式可以通过`man sshd_config`指令查看。这里只介绍其中比较实用和有效的几个配置。

<!--more-->

DenyUsers，AllowUsers，DenyGroups，AllowGroups

设置拒绝、允许登陆的用户、组，默认情况下都没有设置，表示不限制登陆。同时设置时，处理顺序为DenyUsers，AllowUsers，DenyGroups，AllowGroups。支持通配符等模式（暂时没有了解具体的，没有太多必要），同时设置时相互之间的影响没有具体测试，故而不明。建议只使用AllowUsers即可。

ListenAddress，Port，Protocol

设置sshd监听的地址、端口，以及ssh协议支持的版本。

PermitRootLogin

限制root用户的登陆方式，可用值为yes（默认），without-password，forced-commands-only，no。其中，no代表禁止登陆，forced-commands-only代表只允许使用公钥认证执行单指令，without-password代表不允许通过密码登陆。

PasswordAuthentication

是否允许使用密码认证登陆，默认是yes。

考虑一般的安全性，我们可以做以下限定：

* 禁止密码认证，使用公私钥登陆
* 禁止root用户登陆
* 只允许某个特定的账户login-user登陆
则sshd_config文件需要做的修改如下：

```
# 禁止root用户登陆
#
PermitRootLogin no

# 禁止使用密码登陆，杜绝通过ssh密码破解的可能性
#
PasswordAuthentication no

# 只允许以下用户登陆
#
AllowUsers login-user
```

这样我们只需要为login-user设置公私钥认证，并设置sudo权限就可以完成一般的安全性设置。但现在我还没有了解到sudo权限的设置方法，所以给出另一个推荐的设置方案。

```
# 只允许root用户通过公私钥认证登陆
#
PermitRootLogin without-password

# 禁止使用密码登陆，杜绝通过ssh密码破解的可能性
# Note: 设置该项为no之后，通过ssh连接服务器不再会有输入密码的提示
#
PasswordAuthentication no

# 只允许以下用户登陆
# Note: 如果在这里不增加root，则root无法登陆
#
AllowUsers root login-user
```

关于如何设置公私钥认证，请查看另一篇文章【Link】

参考资料：

1\. Linux Manuel for sshd_config（`man sshd_config`）