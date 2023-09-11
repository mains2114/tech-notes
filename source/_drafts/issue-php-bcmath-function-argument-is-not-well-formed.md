title: Issue: bcmath function argument is not well-formed
date: 2023-09-11 17:40:00
tags:
  - issue
  - php
  - bcmath
category:
  - 问题排查
---

### 错误信息

bcdiv(): bcmath function argument is not well-formed

### 版本信息

php-7.4.33-nts-Win32-vc15-x64

### 问题排查

报错的函数调用及参数：
```
bcdiv('-1.1102230246252E-16', '0.01', 0)
```
实际调用传入的参数类型是float，调用后被转换为了string。

### 问题分析

函数定义：https://www.php.net/manual/zh/function.bcdiv.php
```
bcdiv(string $num1, string $num2, ?int $scale = null): string
```

bcdiv函数的参数num1、num2，在传入数字类型的值时，参数值被转换为字符串。
bcdiv函数不支持带指数的数字字符，导致报错。

传入的参数num1（`-1.1102230246252E-16`）是数字计算过程中生成的近似0的小数。

### 解决方法

补充对近似0的小数的处理方式，此处的小数应该按照0来处理。
增加if条件判断：
```php
if ($num < 0.000001) {
  $num = 0;
}
```

### 问题总结

报错信息直接提示的是传入函数的参数有问题，问题排查时由此开展。

程序计算过程中产生的浮点数，因为存储方式和精度问题，不能直接和0进行比较。
建议使用一个确定的精度来判断是否数值视为0。
或者使用将浮点数转换为整数进行处理。

