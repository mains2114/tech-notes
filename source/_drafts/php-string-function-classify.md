title: PHP 字符串函数分类
date: 2016-04-21 08:37:26
tags:
  - php
  - 字符串处理
category:
  - 编程语言
---

### 基本说明

据说对知识的归纳总结有助于加强记忆。这只是一个归纳性的笔记，将 PHP 众多跟字符串处理的函数按照功能归类。记住这些函数的所有特性对我们来说费力又不讨好，但是有特殊需求的时候，如果能够快速查找到自己所需要的函数，那是极好的。这便是这篇文章的主要目的。


### 字符串与数组的转换
- explode                    - 使用字符串将另一个字符串分割为数组
- implode                    - 使用字符串连接一维数组
- join                       - 别名 implode
- str_split                  - 根据指定的字符数将字符串分割为数组
- split                      - 用正则表达式将字符串分割为数组
- preg_split                 - 用正则表达式将字符串分割为数组

<!--more-->

### 大小写转换
- strtolower                 - 将字符串转化为小写
- strtoupper                 - 将字符串转化为大写
- lcfirst                    - 将字符串的首字母转换为小写
- ucfirst                    - 将字符串的首字母转换为大写
- ucwords                    - 将字符串中每个单词的首字母转换为大写

### 清除首尾空格（或其它字符）
- trim                       - 删除字符串首尾处的空白字符（或者其他字符）
- ltrim                      - 删除字符串开头的空白字符（或其他字符）
- rtrim                      - 删除字符串末端的空白字符（或者其他字符）
- chop                       - rtrim 的别名

### 格式化输入与输出字符串
- echo                       - 输出一个或多个字符串
- print                      - 输出字符串
- printf                     - 格式化字符串（输出）
- fprintf                    - 格式化字符串（写入到流）
- sprintf                    - 格式化字符串（不输出，返回字符串）
- vprintf                    - 格式化字符串（输出）
- vfprintf                   - 格式化字符串（写入到流）
- vsprintf                   - 格式化字符串（不输出，返回字符串）
- sscanf                     - 根据指定格式解析输入的字符

### 字符串比较
- strcmp                     - 比较字符串
- strcasecmp                 - 比较字符串（不区分大小写）
- strncmp                    - 比较字符串开头的若干个字符
- strncasecmp                - 比较字符串开头的若干个字符（不区分大小写）
- strnatcmp                  - 使用自然排序算法比较字符串
- strnatcasecmp              - 使用自然排序算法比较字符串（不区分大小写）
- substr_compare             - 比较字符串（从偏移位置比较指定长度）

### 字符串替换
- str_replace                - 字符串替换
- str_ireplace               - str_replace 的忽略大小写版本
- preg_replace               - 正则替换
- strtr                      - 转换指定字符
- substr_replace             - 从指定索引位置开始进行字符串替换

### 字符串查找
- strpos                     - 查找字符串首次出现的位置
- stripos                    - 查找字符串首次出现的位置（不区分大小写）
- strrpos                    - 查找字符串最后一次出现的位置
- strripos                   - 查找字符串最后一次出现的位置（不区分大小写）
- strpbrk                    - 查找字符串中一组字符的任一字符第一次出现的位置，并返回子字符串
- strstr                     - 查找字符串首次出现的位置，并返回子字符串
- strchr                     - 别名 strstr
- stristr                    - strstr 函数的忽略大小写版本
- strrchr                    - 查找字符串最后一次出现的位置，并返回子字符串

### 其它常用函数
- str_pad                    - 使用另一个字符串填充字符串为指定长度
- str_repeat                 - 重复一个字符串
- str_shuffle                - 随机打乱一个字符串
- strlen                     - 获取字符串长度
- substr                     - 返回字符串的子串
- strrev                     - 反转字符串

### 其它转换函数
- bin2hex                    - 将二进制数据转换成十六进制表示
- hex2bin                    - 转换十六进制字符串为二进制字符串
- chr                        - 返回指定的字符
- ord                        - 返回字符的 ASCII 码值
- addslashes                 - 使用反斜线引用字符串
- stripslashes               - 反引用一个引用字符串
- addcslashes                - 以 C 语言风格使用反斜线转义字符串中的字符
- stripcslashes              - 反引用一个使用 addcslashes 转义的字符串
- htmlentities               - 将特殊字符转换为 HTML 实体
- html_entity_decode         - 将特殊的 HTML 实体转换回普通字符
- htmlspecialchars           - 将特殊字符转换为 HTML 实体
- htmlspecialchars_decode    - 将特殊的 HTML 实体转换回普通字符
- get_html_translation_table - 返回 htmlspecialchars 和 htmlentities 使用的转换表
- strip_tags                 - 从字符串中去除 HTML 和 PHP 标记

### 其它提供有趣功能的函数
- chunk_split                - 将字符串分割成小块
- wordwrap                   - 打断字符串为指定数量的字串
- nl2br                      - 在字符串所有新行之前插入 HTML 换行标记
- md5_file                   - 计算指定文件的 MD5 散列值
- md5                        - 计算字符串的 MD5 散列值
- sha1_file                  - 计算文件的 sha1 散列值
- sha1                       - 计算字符串的 sha1 散列值
- crc32                      - 计算一个字符串的 crc32 多项式
- crypt                      - 单向字符串散列
- parse_str                  - 解析 URL 中的查询字符串
- parse_url                  - 解析 URL
- similar_text               - 计算两个字符串的相似度
- levenshtein                - 计算两个字符串之间的编辑距离
- str_getcsv                 - 解析 CSV 字符串为一个数组
- number_format              - 以千位分隔符方式格式化一个数字

