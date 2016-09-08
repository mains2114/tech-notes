title: PHP 数组函数分类
date: 2016-04-21 09:37:26
tags:
  - php
  - 数组
category:
  - 编程语言
---

### 排序
一般排序的目标是将元素按从小到大排序，对于 PHP 的自定义排序来说，根据以下条件确定比较函数的返回值：
如果 a < b，表示不必交换元素位置，返回 -1；
如果 a = b，表示元素相等且不必交换元素位置，返回 0；
如果 a > b，表示需要交换元素位置，返回 1。

- range                   — 建立一个包含指定范围单元的数组
- shuffle                 — 将数组打乱


- sort                    — 值排序
- rsort                   — 值排序，反向
- asort                   — 值排序，保持索引
- arsort                  — 值排序，保持索引，反向
- ksort                   — 键排序
- krsort                  — 键排序，反向
- usort                   — 自定义比较函数，值排序
- uasort                  — 自定义比较函数，值排序，保持索引
- uksort                  — 自定义比较函数，键排序


- array_multisort         — 对多个数组或多维数组进行排序
- natsort                 — 用“自然排序”算法对数组排序
- natcasesort             — 用“自然排序”算法对数组进行不区分大小写字母的排序

<!--more-->


### Map & Reduce
- array_map               — 将回调函数作用到给定数组的单元上
- array_reduce            — 用回调函数迭代地将数组简化为单一的值
- array_sum               — 计算数组中所有值的和
- array_product           — 计算数组中所有值的乘积
- array_filter            — 用回调函数过滤数组中的单元
- array_walk              — 对数组中的每个成员应用用户函数
- array_walk_recursive    — 对数组中的每个成员递归地应用用户函数


### 数组比较
- array_diff_assoc        — 带索引检查计算数组的差集
- array_diff_key          — 使用键名比较计算数组的差集
- array_diff_uassoc       — 用用户提供的回调函数做索引检查来计算数组的差集
- array_diff_ukey         — 用回调函数对键名比较计算数组的差集
- array_diff              — 计算数组的差集
- array_udiff_assoc       — 带索引检查计算数组的差集，用回调函数比较数据
- array_udiff_uassoc      — 带索引检查计算数组的差集，用回调函数比较数据和索引
- array_udiff             — 用回调函数比较数据来计算数组的差集


### 堆栈 & 队列
- array_pop               — 将数组最后一个单元弹出（出栈）
- array_push              — 将一个或多个单元压入数组的末尾（入栈）
- array_shift             — 将数组开头的单元移出数组
- array_unshift           — 在数组开头插入一个或多个单元


### 集合操作
- array_intersect         — 计算数组的交集
- array_intersect_assoc   — 带索引检查计算数组的交集
- array_intersect_key     — 使用键名比较计算数组的交集
- array_intersect_uassoc  — 带索引检查计算数组的交集，用回调函数比较索引
- array_intersect_ukey    — 用回调函数比较键名来计算数组的交集
- array_uintersect_assoc  — 带索引检查计算数组的交集，用回调函数比较数据
- array_uintersect_uassoc — 带索引检查计算数组的交集，用回调函数比较数据和索引
- array_uintersect        — 计算数组的交集，用回调函数比较数据
- array_unique            — 移除数组中重复的值
- array_merge             — 合并一个或多个数组
- array_merge_recursive   — 递归地合并一个或多个数组


### 数组成员操作
- array_slice             — 从数组中取出一段
- array_splice            — 把数组中的一部分去掉并用其它值取代


### 特殊操作
- compact                 — 建立一个数组，包括变量名和它们的值
- extract                 — 从数组中将变量导入到当前的符号表


### 数组迭代相关函数
- current                 — 返回数组中的当前单元
- pos                     — current 的别名
- key                     — 返回数组中当前单元的键名
- each                    — 返回数组中当前的键／值对并将数组指针向前移动一步
- end                     — 将数组的内部指针指向最后一个单元
- prev                    — 将数组的内部指针倒回一位
- next                    — 将数组中的内部指针向前移动一位
- reset                   — 将数组的内部指针指向第一个单元


### 键值操作
- array_keys              — 返回数组中所有的键名
- array_values            — 返回数组中所有的值，并给其建立数字索引
- in_array                — 检查数组中是否存在某个值
- array_key_exists        — 检查给定的键名或索引是否存在于数组中
- key_exists              — 别名 array_key_exists
- array_search            — 在数组中搜索给定的值，如果成功则返回相应的键名
- array_replace           — 根据键，使用传递的数组替换第一个数组的值
- array_replace_recursive — 使用传递的数组递归替换第一个数组的元素


### 其它

- array_combine           — 创建一个数组，用一个数组的值作为其键名，另一个数组的值作为其值
- array_flip              — 交换数组中的键和值


- array_change_key_case   — 返回字符串键名全为小写或大写的数组
- array_chunk             — 将一个数组分割成多个
- array_column            — 返回数组中指定的一列
- array_count_values      — 统计数组中所有的值出现的次数
- array_fill_keys         — 使用指定的键和值填充数组
- array_fill              — 用给定的值填充数组


- list                    — 把数组中的值赋给一些变量
- array_pad               — 用值将数组填补到指定长度
- array_rand              — 从数组中随机取出一个或多个单元
- array_reverse           — 返回一个单元顺序相反的数组
- count                   — 计算数组中的单元数目或对象中的属性个数
- sizeof                  — count 的别名
