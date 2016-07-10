title: MySQL数据导入与导出
date: 2015-12-29 21:28:02
tags:
  - mysql
  - 数据导入
  - 数据导出
  - select into outfile
  - load data infile
categories:
  - 数据库
---

# 基本说明

本文主要介绍MySQL数据库从文件导入数据，以及导出数据到文件的简单方法，其中包括`select into outfile`和`load data infile`语句的语法介绍，以及`mysqlimport`命令的使用说明。对于常用于导出数据或备份数据的`mysqldump`命令，则请参看数据库备份相关文章。

本文介绍的用于导入数据或者数据导出的文件为纯文件文件，常见的文件格式一般为`txt`和`csv`。其中，`txt`文件为一般文本文件；`csv`文件则一般是使用逗号分隔不同字段、使用换行符分隔多条记录的文件。

<!--more-->


# 相关语句语法简介

以下语句的语法并非标准SQL的语法，仅使用于MySQL数据库。不同的数据库请参考相关的文档。

## `load data infile`

`load data infile`语句用于快速导入文本文档的记录到数据表中。相比于使用`insert`语句进行插入，使用`load data infile`语句的导入速度一般是其20倍。

MySQL官方文档中给出的语法如下：

```
LOAD DATA [LOW_PRIORITY | CONCURRENT] [LOCAL] INFILE 'file_name'
    [REPLACE | IGNORE]
    INTO TABLE tbl_name
    [PARTITION (partition_name,...)]
    [CHARACTER SET charset_name]
    [{FIELDS | COLUMNS}
        [TERMINATED BY 'string']
        [[OPTIONALLY] ENCLOSED BY 'char']
        [ESCAPED BY 'char']
    ]
    [LINES
        [STARTING BY 'string']
        [TERMINATED BY 'string']
    ]
    [IGNORE number {LINES | ROWS}]
    [(col_name_or_user_var,...)]
    [SET col_name = expr,...]
```

部分参数的简要说明：
- `file_name`为用于导入的数据文件的文件名，必须通过字符串字面量给出（用单引号或双引号转义即可）。
- `CHARACTER SET`用来指定文件的字符集，在输入文件的字符集与数据库默认字符集不同时使用。

- `LOW_PRIORITY`、`CONCURRENT`用于指定导入数据时的优先级，对于不同的存储引擎有不同的行为。

- `LOCAL`用于指定文件查找的位置：
  - 如果设置了`LOCAL`，则文件会从客户端的系统中获取，并通过客户端发送到数据库服务器上，再有数据库服务器读取并进行导入。
  - 如果没有设置`LOCAL`，则文件必须存在于数据库服务器的文件系统中。
  - 不同情况下，使用相对路径的文件名查找文件的位置有差异，所以建议使用绝对路径来指定文件名。

- `REPLACE`、`IGNORE`用于控制插入数据时出现唯一键冲突时的处理方法
  - `REPLACE`，新的记录会替代已经存在的记录
  - `IGNORE`，冲突的记录会被忽略并跳过
  - 如果不指定，则会根据`LOCAL`参数决定处理方式
    - 设置`LOCAL`的情况下，行为同`IGNORE`
    - 没有`LOCAL`的情况下，产生错误并停止处理流程

- `IGNORE ... LINES`可以用于忽略前面几行无效的数据

- `FIELDS`、`LINES`的使用方法与在`select into outfile`语句中的使用方法大致相同，故在后面单独列出来。


导入数据时，可以指定数据列与所读取的字段的对应关系：
```
LOAD DATA INFILE 'persondata.txt' INTO TABLE persondata (col1, col2, ...);
```
对于不需要插入的字段，可以将值赋予变量：
```
LOAD DATA INFILE 'file.txt'
INTO TABLE t1
(column1, @dummy, column2, @dummy, column3);
```
使用`SET`可以为数据表中某些列赋给不是直接从文件中读取出来的值，也可以使用之前赋给变量的值：
```
LOAD DATA INFILE 'file.txt'
INTO TABLE t1 (column1, @var1)
SET column2 = @var1/100;
```

## `select into outfile`

MySQL官方文档中给出的语法如下：

```
SELECT ...
    [INTO OUTFILE 'file_name'
        [CHARACTER SET charset_name]
        [{FIELDS | COLUMNS}
            [TERMINATED BY 'string']
            [[OPTIONALLY] ENCLOSED BY 'char']
            [ESCAPED BY 'char']
        ]
        [LINES
            [STARTING BY 'string']
            [TERMINATED BY 'string']
        ]
    ]
```

部分参数说明的简要说明：
- `file_name`是输出到**数据库服务器**的文件系统中的文件，必须不能是一个已经存在的文件名（不能覆盖已有文件）。
- `CHARACTER SET`指定输出文件的字符集。
- `FIELDS`、`LINES`的使用方法与在`load data infile`语句中的使用方法大致相同，在后面小节中单独列出来。


## `fields`、`lines`

```
[{FIELDS | COLUMNS}
    [TERMINATED BY 'string']
    [[OPTIONALLY] ENCLOSED BY 'char']
    [ESCAPED BY 'char']
]
[LINES
    [STARTING BY 'string']
    [TERMINATED BY 'string']
]
```

对于`load data infile`和`select into outfile`语句，`FIELDS`和`LINES`部分的语法是相同的。`FIEDLS`和`LINES`都是可选的配置参数，但如果都要配置，`FIELDS`必须在`LINES`的前面。

如果你没有指定`FIELDS` `LINES`，则采用的默认参数为：
```
FIELDS TERMINATED BY '\t' ENCLOSED BY '' ESCAPED BY '\\'
LINES TERMINATED BY '\n' STARTING BY ''
```

对于`FIELDS`：
- `TERMINATED BY`指定用于分隔不同字段的字符（可以是多个字符），一般使用制表符`\t`、逗号`,`。
- `[OPTIONALLY] ENCLOSED BY`指定用于包裹字段的字符（单个字符），一般使用单引号`'`、双引号`"`。
  - 如果设置`OPTIONALLY`参数，则字段只会在必要情况下（字符型字段，`CHAR`，`TEXT`，`BINARY`，`ENUM`等）才进行包裹。
  - 如果值为空，即`ENCLOSED BY ''`，则表示不使用引用来包裹字段。
- `ESCAPED BY`指定用于转义字符的值（单个字符），建议使用MySQL的默认值，即反斜线，`ESCAPED BY '\\'`。

对于`LINES`:
- `TERMINATED BY`指定用于分隔不同记录的字符（可以是多个字符）,一般使用换行符`\n`或Windows换行符`\r\n`。
  - 如果该参数值设为空，则不同记录依然会使用`FIELDS TERMINATED BY`参数的值来分隔
- `STARTING BY`仅对导入数据有效，用于指定每行记录需要忽略的前缀
  - 该前缀以及其之前的字符会被忽略
  - 不存在该前缀的行会被忽略


## mysqlimport命令参数

`mysqlimport`命令提供命令行下调用`load data infile`语句的接口，其大部分的参数直接对应于`load data infile`语句的语法。

使用`mysqlimport`命令的基本格式如下：
```
mysqlimport [options] db_name textfile1 [textfile2 ...]
```
对于命令中给出的多个文件名，`mysqlimport`会去除文件名中的扩展名，作为要导入的数据表的名称。如`patient.txt`、`patient.csv`、`patient`这样的文件最终都会导入到同一张数据表`patient`中。

其常用的参数如下：
```
--default-character-set=charset_name | 指定默认的字符集
--delete, -D                         | 在导入文件之前清空数据表

--ignore, -i                         | 用于控制唯一键冲突时的处理方法，ignore下会忽略冲突的记录
--replace, -r                        | replace下会替代冲突的记录

--force, -f                          | 忽略错误，出现错误时，继续执行后续任务
--silent, -s                         | 静默模式，只在出错的情况下输出信息

--lock-tables, -l                    | 在导入文件前锁定所有表
--low-priority                       | 低优先级

--ignore-lines=N                     | 忽略文件开始的几行数据
--local, -L                          | 从客户端本地文件系统中读取输入文件

--fields-terminated-by=...           | 相关的作用与load data infile语句语法一致
--fields-enclosed-by=...
--fields-optionally-enclosed-by=...
--fields-escaped-by=...
--lines-terminated-by=...
```

注意在使用`mysqlimport`命令时，也需要指定数据库连接相关的参数，参数格式类似与`mysql`命令：
```
mysqlimport
    --user=user_name, -u user_name
    --password[=password], -p[password]
    --host=host_name, -h host_name
    --port=port_num, -P port_num
    db_name

mysqlimport -u root -p -h 127.0.0.1 -P 3306 db_name
```

# 操作示例

## 导入`csv`格式的数据

对于以下格式的`csv`数据，
```
criteria_id,name,canonical_name,parent_id,region_code,country_code,target_type
1003334,"Beijing","Beijing,Beijing,China","20163,2156","","CN","City"
1003338,"Tianjin","Tianjin,Tianjin,China","20164,2156","","CN","City"
1003339,"Chengde","Chengde,Hebei,China","20165,2156","","CN","City"
1003341,"Handan","Handan,Hebei,China","20165,2156","","CN","City"
1003342,"Hengshui","Hengshui,Hebei,China","20165,2156","","CN","City"
1003343,"Langfang","Langfang,Hebei,China","20165,2156","","CN","City"
1003345,"Qinhuangdao","Qinhuangdao,Hebei,China","20165,2156","","CN","City"
1003347,"Shijiazhuang","Shijiazhuang,Hebei,China","20165,2156","","CN","City"
1003350,"Zhangjiakou","Zhangjiakou,Hebei,China","20165,2156","","CN","City"
```

导入数据前，如果不存在相应的表，则要先创建保存数据的数据表。在创建表时，可以先把列定义的宽泛一些，导入数据之后再修改结构。
```
create table tmp (
    criteria_id int,
    name varchar(255),
    canonical_name varchar(255),
    parent_id varchar(255),
    region_code varchar(255),
    country_code varchar(255),
    target_type varchar(255)
);
```

使用以下SQL语句导入`csv`数据：
```
load data infile '/path/to/input.csv' ignore into table `table_name`
fields terminated by ',' optionally enclosed by '"'
ignore 1 lines;
```

操作完成后，如果提示有`warning`，则可以使用`show warning`查看警告信息，并进行处理。


## 导出`csv`格式的数据

使用与导入`csv`数据类似的`FIELDS`、`LINES`参数，即可导出数据为`csv`文件。
```
select ... from `table_name` where ... into outfile '/path/to/output.csv'
fields terminated by ',' optionally enclosed by '"' escaped by '\\'
lines terminated by '\n';
```
注意：相比导入数据，导出数据时，指定参数最好明确一些。导入数据时，只要保证能正常导入即可。后面通过其它SQL语句处理也是很方便的。


## 导出其它格式的数据

常用的格式化数据经常使用制表符'\t'来分隔不同字段，这种类型的数据，复制之后，可以直接应用于Word中行列数相匹配的表格中。我们导出数据时，只要通过指定`FIELDS TERMINATED BY '\t'`即可导出这种数据。

# 与`mysqldump`命令导出、导入数据的对比

1. 使用`mysqldump`命令导出的文件为SQL文件，里面可以包含数据表的结构信息，多用于数据库备份和恢复，也可以用于不同数据库之间数据交换。

2. 使用`select into outfile`导出的文件为最基本的纯文本，而且格式更加自由灵活（可以通过`select`语句生成各种数据），一般用于跟其他程序交换数据。

我们可以根据最终目的来选择使用那种方式来进行操作：
- 如果为了备份和恢复数据，使用`mysqldump`命令
- 如果为了导入其他格式化的数据，使用`load data infile`语句
- 如果为了导出数据供其他程序（如Excel）使用，使用`select into outfile`语句


