申明一下，我这里只是讲的textarea中的有关光标的几种方法，
并不是针对整个document的，我相信把textarea中的光标方法弄清楚了的话，其他的就简单多了。

最近接触到一个新的东西，就是textarea中光标位置的获取。
先来说一说我是怎么接触到这个东西的，最近一直在写一个能够通用的评论插件，
在这个评论插件中我们加入了表情插入这个功能，也就是技能文字评论，也能表情评论，目前这个插件的样子是这样的


就是在做表情插入功能的过程中遇到的这个问题，按照最一般的从头到尾的写评论是不会出问题的，但是如果是评论写了一大段，然后回头想再插入一个表情的时候，问题就出现了。


兼容性是老生常谈的一个问题，所以每一个功能的实现都有几种兼容性的实现方法，光标问题的兼容性主要表现在IE和非IE浏览器下面，也就是要实现IE和非IE的兼容性方法。首先，这里要说的是textarea中选中文本的获取。


在IE下选中内容的获取是很简单的，直接通过 document.selection.createRange()这个方法就可以获取到选中区域的内容，该方法返回的是一个对象，其中text字段就是选中的文本

在非IE下则是通过对象的selectionStart（选中范围的起点）和selectionEnd（选中范围的末点），然后通过截取字符串substring来获取选中范围的


几个TextRange（顾名思义，TextRange就可以理解为文本的选择范围）的常用属性及方法：

属性

boundingWidth 获取绑定TextRange对象的矩形的宽度

boundingHeight 获取绑定TextRange对象的矩形的高度

boundingLeft 获取绑定TextRange对象的矩形左边缘和包含TextRange对象的左侧之间的距离

boundingTop Retrieves the distance between the top edge of the rectangle that bounds the TextRange object and the top side of the object that contains the TextRange.

offsetLeft 获取对象相对于版面或由offsetParent属性指定的父坐标的计算左侧位置

offsetTop 获取对象相对于版面或由offsetParent属性指定的父坐标的计算顶端位置

htmltext 选中范围内包含的html片段

text 设置或获取范围内包含的纯文本

方法

moveStart 设置文本范围的开始位置

moveEnd 设置文本范围的结束位置

collapse 将插入点移动到当前范围的开始或结尾

select 将当前选择区置为当前对象，也就是从moveStart设置的位置开始到moveEnd设置的位置结束的范围



文本替换，第二个要说的是文本替换，在非IE下直接通过setRangeText(str)即可替换选中文本，未选中文本，则在光标处添加文本；在IE下通过设置document.selection.createRange().text即可达到替换文本的效果，未选中文本，则在光标处添加文本。也就是达到了在任意位置插入文本的效果