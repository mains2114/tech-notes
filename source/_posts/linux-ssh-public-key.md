title: Linux服务器使用公钥认证实现免密码登录
id: 13
categories:
  - 服务器
tags:
  - linux
date: 2015-07-14 23:55:55
---

关于使用ssh进行公钥认证的说明，可以查看man ssh，然后查看认证部分，里面有详细的说明，这里只给出一个通用的操作流程。

```bash
# 1\. 使用ssh-keygen生成公私钥对
# 这里使用rsa加密算法，并且指定了输出文件的名称和路径（当前路径）
# 提示要输入密码时，一路enter跳过即可（不设置密码）
#
[test@CentOS-7 ~]$ ssh-keygen -t rsa -f test
Generating public/private rsa key pair.
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in test.
Your public key has been saved in test.pub.
The key fingerprint is:
7a:b4:9a:70:5a:d6:9e:4f:64:d2:ea:6e:e2:17:cc:3c test@localhost.localdomain
The key's randomart image is:
+--[ RSA 2048]----+
|                 |
|                 |
|                 |
|         .       |
|       +S +      |
|       +E*       |
|    . = =o.      |
|     *.*oo       |
|    ..+==..      |
+-----------------+

# 生成的公钥为test.pub, 私钥为test
#
[test@CentOS-7 ~]$ ll test*
total 8
-rw-------. 1 test test 1675 Jul 14 23:11 test
-rw-r--r--. 1 test test  408 Jul 14 23:11 test.pub
```

<!--more-->

```
# 2\. 使用使用ssh-copy-id将公钥添加到服务器
# 通过-i指定添加test.pub到服务器上指定用户的~/.ssh/authorized_keys文件中
# ssh-copy-id会提示输入密码以登陆服务器，并进行后续操作
#
[test@CentOS-7 ~]# ssh-copy-id -i test.pub test@127.0.0.1
/usr/bin/ssh-copy-id: INFO: attempting to log in with the new key(s), to filter out any that are already installed
/usr/bin/ssh-copy-id: INFO: 1 key(s) remain to be installed -- if you are prompted now it is to install the new keys
test@127.0.0.1's password:

Number of key(s) added: 1

Now try logging into the machine, with:   "ssh 'test@127.0.0.1'"
and check to make sure that only the key(s) you wanted were added.

# 3\. 使用私钥登陆服务器
# 通过ssh -i指令选择要使用的私钥文件'test'
# 使用-v指令打印出ssh登陆服务器的处理流程，便于debug
#
[test@CentOS-7 ~]$ ssh -i test test@127.0.0.1 -v
OpenSSH_6.6.1, OpenSSL 1.0.1e-fips 11 Feb 2013
debug1: Reading configuration data /etc/ssh/ssh_config
debug1: /etc/ssh/ssh_config line 56: Applying options for *
debug1: Connecting to 127.0.0.1 [127.0.0.1] port 22.
debug1: Connection established.
debug1: identity file test type 1
debug1: identity file test-cert type -1
...
debug1: Next authentication method: publickey
debug1: Offering RSA public key: test               # NOTE
debug1: Server accepts key: pkalg ssh-rsa blen 279
debug1: key_parse_private2: missing begin marker
debug1: read PEM private key done: type RSA
debug1: Authentication succeeded (publickey).       # NOTE
Authenticated to 127.0.0.1 ([127.0.0.1]:22).
debug1: channel 0: new [client-session]
debug1: Requesting no-more-sessions@openssh.com
debug1: Entering interactive session.
debug1: Sending environment.
debug1: Sending env LANG = en_US.UTF-8
Last login: Tue Jul 14 23:31:40 2015 from localhost

# 4\. 现在已经在服务器上了，查看.ssh/authorized_keys的内容吧
#
[test@CentOS-7 ~]# ll .ssh/
total 4
-rw-------. 1 test test 408 Jul 14 23:18 authorized_keys
[root@CentOS-7 test]# cat .ssh/authorized_keys
ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQDegiE85/x22gJzjJIiex9dgpB37wWQDcC++E6N+RUpu1osKek10BybmSmD8U5N6F77kQc4PW1S5y9XwGG5oJBGmlZhJmcelRjiJVWWlZyOM806saxpuR4DEvx6cLCCimrorUnkkAZOVl3t/15fZr/7aT/MwryLWBOO0RmGOybDqnkLgoaPOAVk8vokdjXoDQW7uAXnRVwhKzyx5M0jiPeDfSYfkcaan+zsIPa8mmnwTYawcO36D9TtIKzM/ZzZAMi/ZsDL49uOC2GMYNfkzpwRJQUn3OqFih/njmG/HqRcrlFsemAwfSJ0wmAGf42sHdSrSx5CjUQCQ7mapscMpzaL test@localhost.localdomain
```

从此登陆服务器使用第3步使用的指令即可。

总结：

1\. 生成密钥时没有使用默认的输出文件（对于rsa加密算法，默认文件和路径是~/.ssh/id_rsa，~/.ssh/id_rsa.pub），这是因为如果之前生成过密钥的话，这样会覆盖掉之前的文件。

2\. 使用ssh登陆时，通过选项-i指定了特定的文件作为私钥进行认证，更具有一般性，也助于将私钥分发给其他用户使用。

3\. 只需要把公钥添加到服务器上，本地使用ssh登陆服务器只需要私钥而已

4\. 如果没有ssh-copy-id命令，那么你只能scp test test@127.0.0.1:~ ，然后登陆服务器ssh test@127.0.0.1，再执行cat test &gt;&gt; ~/.ssh/authorized_keys，最后将文件权限改为600 chmod 600 ~/.ssh/authorized_keys。

5\.  其实你可以在本地测试和实践以上操作（Linux），因为你可以：
<pre>ssh user@127.0.0.1</pre>