title: MySQL数据备份与恢复 - mysqldump简介
date: 2016-01-01 16:28:29
tags:
  - mysql
  - 数据备份
  - 数据恢复
  - mysqldump
categories:
  - 数据库
---

# 基本介绍

`mysqldump`是MySQL数据库提供的数据库备份程序，用于执行数据库的逻辑备份。它通过生成一系列SQL语句来备份数据库结构和数据。这些语句执行后，可以恢复数据库原有的结构和数据。`mysqldump`也能通过调用`select into outfile`语句输出`csv`文件和其它类似格式的纯文本文件。

`mysqldump`的优点有使用便利、灵活性强等。不仅可以备份整个数据库，也可以备份数张数据表，或者只导出部分数据。但在备份大规模的数据时，相比物理备份，`mysqldump`无论是备份还是恢复数据都会占用大量时间。因此，`mysqldump`常用于小规模、灵活性强的数据备份和导出。

说到数据导出，`mysqldump`可以通过指定参数来调用`select into outfile`语句生成格式灵活的纯文本数据，但是不如直接使用SQL语句导出直接和灵活。在使用`mysqldump`导出SQL文件形式的数据时，导出的数据很难被其它程序进行处理，但是单纯的备份和恢复数据都比`select into outfile`要快捷和方便。

<!--more-->

# 常用参数介绍

根据备份数据的范围，`mysqldump`的使用大概可以分为三种：
- 备份一个或多个数据表
- 备份一个或多个数据库
- 备份所有的数据库

使用的指令有类似结构：
```
mysqldump [options] db_name [tbl_name ...]
mysqldump [options] --databases db_name ...
mysqldump [options] --all-databases
```
要备份整个完整的数据库，不要在db_name后面指定tbl_name，或者通过使用`--databases`或`--all-databases`参数。

部分的参数说明，完整参数可以使用`mysqldump --help`或`man mysqldump`查看
```
--opt      # 默认开启的参数，包括一组常用的设置：
           # --add-drop-table
           # --add-locks
           # --create-options
           # --disable-keys
           # --extended-insert
           # --lock-tables
           # --quick
           # --set-charset
--skip-opt # 取消默认开启的参数


# 配置文件选项
--no-defaults            # 不读取任何配置文件（除了`.mylogin.cnf`）
                         # 某些常用的、通用的参数可以保存在配置文件中，禁止读取这些配置
--print-defaults         # 打印程序名称和从配置文件中获取的参数


# DDL（数据定义语言）选项
--add-drop-database      # 在`create database`语句前面，添加`drop database`语句
                         # 总是重新创建数据库。
--add-drop-table         # 在`create table`语句前面，添加`drop table`语句
                         # 总是重新创建数据表。

--no-create-db, -n       # 省略`create database`语句
                         # 在设置了`--databases`或`--all-databases`的情况下，不会添加`create database`语句。
--no-create-info, -t     # 省略`create table`语句
                         # 避免重新建立数据表，常用于备份和恢复部分数据时。
--create-options         # 在`create table`语句中包含`mysql`所有的特定选项

--replace                # 使用`replace`语句代替`insert`语句，可以在导入数据时，忽略主键冲突。


# 导出数据格式选项
--tab=path, -T path      # 分别导出每个数据表结构为`tb_name.sql`文件，数据为`tbl_name.txt`文件
--fields-terminated-by=...
--fields-enclosed-by=...
--fields-optionally-enclosed-by=...
--fields-escaped-by=...
--lines-terminated-by=...

--result-file=file_name, -r file_name # 指定生成的结果文件


# 过滤选项，用于指定需要导出的数据
--all-databases, -A             # 导出所有数据库
--databases, -B                 # 导出指定的一个或多个数据库
--ignore-table=db_name.tbl_name # 忽略某个数据表
--tables                        # 仅导出一个或多个数据表
--no-data, -d                   # 不导出数据表中的数据（仅导出结构）
--where='where_condition', -w 'where_condition' # 通过`where`语句选取需要导出的数据


--single-transaction            # 对备份`Innodb`引擎数据库生效
```

**关于参数组的使用：**

参数`--opt`是默认启用的，它包含一组其它设置用来快速的进行备份工作。因此一般情况下，你不需要指定参数`--opt`。相反，如果你不需要包含的这些默认设置，你可以通过指定`--skip-opt`来关闭它们。然后，在后面的参数中启用其中某些需要的参数。

参数`--compact`关闭了一些用来控制额外的信息和注释显示的设置。同样的，你也可以在这个参数后面指定其它的参数来开启那些被关闭的设置，或者通过参数`--skip-compact`的方式。

当你选择性的开启或关闭一组设置中的一部分时，参数的顺序是很重要的，而且参数的处理是由前向后进行的。


# 常用的使用情况

## 备份到文件

默认情况下，`mysqldump`会以SQL语句的形式输出数据到标准输出，你可以使用输出重定向将数据保存为一个文件：
```
mysqldump [arguments] > file_name
```
在`Windows`下，可能会发生换行符`\n`被转换为`\r\n`的情况，可以使用：
```
mysqldump [arguments] --result-file=file_name
```

## 备份一个、多个数据库

如果要导出全部数据库，可以在调用`mysqldump`的时候使用参数`--all-databases`:
```
mysqldump --all-databases > dump.sql
```

如果只导出部分数据库的数据，则使用参数`--databases`，并且在命令中输入需要导出的数据库的名称：
```
mysqldump --databases db1 db2 db3 > dump.sql
```

参数`--databases`使得后面提供的名称被视为数据库名称；没有这个参数，`mysqldump`只会把第一个名称作为数据库名称，接下来的其余名称则视为数据表名称。

命令中带有`--databases`或`--all-databases`参数时，`mysqldump`会写入相应的`create database`和`use`语句。这是为了确保恢复数据时，在相应数据库不存在的情况下，它会创建这个数据库。并且会在恢复各个数据库时，通过`use`语句设定默认数据库，确保每个数据库的数据正确导入。

如果你希望在恢复数据时，总是删除相应原有的数据库并重新创建数据库，请使用`--add-drop-database`参数。这种情况下，`mysqldump`会在`create database`语句前，写入`drop database`语句。

如果只导出单个数据库，可以使用以下语句：
```
mysqldump --databases test > dump.sql
```
此时也可以省略`--databases`参数
```
mysqldump test > dump.sql
```

然而以上两种情况是有区别的，在没有`--databases`参数的情况下，输出的数据中不会有`create database`和`use`语句。此时它会有一些其它的区别：
- 在导入数据时，你必须指定默认的数据库，这样服务器才知道你需要把数据导入哪个数据库。
- 在导入数据时，你可以指定一个与原来数据库名称不同的数据库，使你能够把数据导入到一个其他的数据库中。
- 如果要导入数据的数据库不存在，你必须手动创建这个数据库。
- 参数`--add-drop-database`将失去作用，即不生成`drop database`语句。

如果只希望导出几个数据表，则在命令中跟着数据库名称给出：
```
mysqldump test t1 t3 t7 > dump.sql
```

## 导入SQL格式的备份

为了导入由`mysqldump`命令导出的SQL文件，可以使用它作为`mysql`客户端的输入。如果备份文件在创建时，使用了参数`--databases`或`--databases`，则其中包含了`create database`和`use`语句，所以不必指定默认的数据库:
```
mysql < dump.sql
```
在mysql客户端内，使用`source`语句：
```
source dump.sql;
```

如果备份文件中没有包含`create database`和`use`语句，你需要在导入时指定要导入数据的数据库名称，必要时还需要创建相应的数据库：
````
mysql db1 < dump.sql
```
```
create database if not exists db1;
use db1;
source dump.sql;
```

## 导出部分数据

对于一些保存监控类数据的表，数据量一般都比较大。在开发过程中，一般只需要完整的数据表结构和部分的数据即可。此时我们就会需要导出部分数据（不再是为了备份）。

以下的参数可以很好的符合上述要求：
```
mysqldump db1 tbl1 --where="date(time) ＝ '2015-12-01'" > tb1_1201.sql
```

如果你需要在原先的数据的基础上，再额外导入一些数据的话，则需要注意添加参数`--no-create-info`，否则在导入时会因为数据表已经存在，导致`create table`语句出错.
```
mysqldump db1 tbl1 --no-create-info --where="date(time) ＝ '2015-12-08'" > tb1_1208.sql
```

如果某些数据进行了修改，现在想要把这部分数据的修改更新到其它服务器，则可以使用以下语句来导出数据：
```
mysqldump db1 tbl1 --no-create-info --replace --where="date(time) ＝ '2015-12-08'" > tb1_1208_new.sql
```
通过使用`--replace`语句可以使插入数据部分的SQL语句由`insert`语句改为`replace`语句，这样在主键或唯一键冲突时（即相同的记录），可以使用新的记录覆盖旧的记录。
