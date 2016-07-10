title: css notes
date: 2016-05-24 16:41:11
tags:
---


CSS 语法
- 选择器 selector
- 声明 decleration
- 规则 rule
- 属性 property
- 值 value

<!--more-->

选择器
- 基本
  - 类型选择器，标签选择器
  - 类选择器
  - ID选择器
  - 全局选择器 *
  - 属性选择器
    - [attr]
    - [attr='button']
    - [attr~=key]
    - [attr|=es]
    - [attr*="example" i]
    - [attr^="https://"]
    - [attr$=".png"]
- 关系
  - A B
  - A > B
  - A + B
  - A ~ B
- 分组选择符 `,`
- 伪类 pseudo-class
  - :link
  - :visited
  - :active
  - :hover
  - :focus
  - :not()
  - :first, :last
  - :first-child, :last-child
  - :nth-child(), :nth-last-child()
  - :checked
  - :empty
  - :target
  - :enabled
  - :disabled
- 伪元素 pseudo-element
  - ::after
  - ::before
  - ::first-letter
  - ::first-line
  - ::selection
  - ...


CSS 部分样式具有继承性，该样式会影响选择的元素及其后代元素，如 color；
但大部分的样式都没有继承性，如 border。
当元素的一个 继承属性 （inherited property ）没有指定值时，则取父元素的同属性的 计算值 computed value 。只有文档根元素取该属性的概述中给定的初始值（initial value）。
当元素的一个 非继承属性 (在Mozilla code 里有时称之为 reset property  ) 没有指定值时，则取属性的 初始值initial value （该值在该属性的概述里被指定）。
inherit 关键字 用于显式地指定继承性，可用于继承性/非继承性属性。


样式的特殊性以及权重
- 继承 0.1 (???)
- 标签选择器 1
- 类选择器 10
- ID 选择器 100

如果一个元素有多个相同的样式，会使用高权重的样式；
如果一个元素有多个权重相同的样式，后面的规则会覆盖前面的规则；
使用`!important`使样式具有最高的权重。


文字排版
- color
- font-family
- font-size
- font-weight
- font-style
- font-variant
- text-decoration
- text-indent
- line-height
- letter-spacing
- word-spacing
- text-align


盒模型
- box-model
- border
  - ...
  - border-width
  - border-style
  - border-color
- padding
- margin

