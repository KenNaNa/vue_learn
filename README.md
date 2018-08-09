# vue_learn
vue学习


vnode虚拟DOM

https://segmentfault.com/a/1190000009017324

https://blog.csdn.net/violetjack0808/article/category/6246882


http://www.bubuko.com/infodetail-2283915.html


http://www.php.cn/js-tutorial-393672.html

手写VUE mvvm双向数据绑定

https://blog.csdn.net/alinachanchan/article/details/76952194

```
翻译自 https://mithril.js.org/vnodes.html

什么是虚拟DOM
虚拟DOM树是描述DOM树的Javascript数据结构。它由嵌套的虚拟DOM节点组成，也称为vnodes。

第一次呈现虚拟DOM树时，它将用作蓝图来创建与其结构匹配的DOM树。

通常，然后在每个渲染周期重新创建虚拟DOM树，这通常在响应事件处理程序或数据更改时发生。
秘银DIFFS一个虚拟节点树针对其以前的版本，仅修改在有斑点的变化DOM元素。

如此频繁地重新创建vnode似乎很浪费，但事实证明，现代Javascript引擎可以在不到一毫秒的时间内创建数十万个对象。
另一方面，修改DOM比创建vnode要贵几个数量级。

出于这个原因，Mithril使用复杂且高度优化的虚拟DOM差异算法来最小化DOM更新量。Mithril 还生成精心设计的vnode数据结构，
这些数据结构由Javascript引擎编译，用于接近原生数据结构访问性能。此外，Mithril还积极优化了创建vnodes的功能。

Mithril为支持在每个渲染上重新创建整个虚拟DOM树的渲染模型而工作的原因是提供声明性立即模式 API，这种渲染风格使得管理UI复杂性变得非常容易。

为了说明立即模式如此重要的原因，请考虑DOM API和HTML。DOM API是命令式保留模式 API，需要1.编写精确的指令以便在程序上组装DOM树，
以及2.写出其他指令来更新该树。DOM API的必要性意味着您有很多机会对代码进行微优化，但这也意味着您有更多机会引入错误并有更多机会使代码更难理解。

相比之下，HTML更接近立即模式渲染系统。使用HTML，您可以以更加自然和可读的方式编写DOM树，而不必担心忘记将子项附加到父项，
在渲染极深树时运行堆栈溢出等。

虚拟DOM比HTML更进一步，允许您编写动态 DOM树，而无需手动编写多组DOM API调用，以有效地将UI与任意数据更改同步。

基本
虚拟DOM节点，或虚拟节点，是代表DOM元素（或DOM的部分）javascript对象。秘银的虚拟DOM引擎使用一个vnode树来生成一个DOM树。

Vnodes是通过m()hyperscript实用程序创建的：

m("div", {id: "test"}, "hello")
Hyperscript也可以使用组件：

// define a component
var ExampleComponent = {
    view: function(vnode) {
        return m("div", vnode.attrs, ["Hello ", vnode.children])
    }
}

// consume it
m(ExampleComponent, {style: "color:red;"}, "world")

// equivalent HTML:
// <div style="color:red;">Hello world</div>
结构体
虚拟DOM节点，或虚拟节点，是代表一个元素的Javascript对象（或DOM的部分），并且具有以下性质：

属性	类型	描述
tag	String|Object	的nodeNameDOM元素的。[如果vnode是片段，#如果它是文本vnode，或者<它是可信的HTML vnode ，它也可能是字符串。
另外，它可能是一个组件。
key	String?	用于将DOM元素映射到数据数组中的相应项的值。
attrs	Object?	DOM属性，事件，属性和生命周期方法的散列图。
children	(Array|String|Number|Boolean)?	在大多数vnode类型中，该children属性是一个vnode 数组。
对于文本和受信任的HTML vnode，该children属性可以是字符串，数字或布尔值。
text	(String|Number|Boolean)?	children如果vnode包含文本节点作为其唯一子节点，则使用此方法。
这是出于性能原因而完成的。组件vnodes从不使用该text属性，即使它们有一个文本节点作为他们唯一的子节点。
dom	Element?	指向与vnode对应的元素。此属性undefined位于oninit生命周期方法中。在片段和可信任的HTML vnode中，dom指向范围中的第一个元素。
domSize	Number?	这仅在片段和受信任的HTML undefinedvnode中设置，并且在所有其他vnode类型中。
它定义了vnode表示的DOM元素的数量（从dom属性引用的元素开始）。
state	Object?	在重绘之间持久存在的对象。它在需要时由核心引擎提供。在POJO组件vnode中，state从组件对象/类继承原型。
在类组件vnodes中，它是类的实例。在闭包组件中，它是闭包返回的对象。
events	Object?	在重绘之间持久存储的对象，它存储事件处理程序，以便可以使用DOM API删除它们。
如果没有定义事件处理程序，则该events属性undefined。此属性仅由Mithril在内部使用，请勿使用或修改它。
instance	Object?	对于组件，由...返回的值的存储位置view。此属性仅由Mithril在内部使用，请勿使用或修改它。
skip	Boolean	此属性仅在分散键控列表时由Mithril内部使用，不使用或修改它。
Vnode类型
tagvnode 的属性决定了它的类型。有五种vnode类型：

Vnode类型	例	描述
元件	{tag: "div"}	表示DOM元素。
分段	{tag: "[", children: []}	表示DOM元素的列表，其父DOM元素还可以包含不在片段中的其他元素。
使用m()辅助函数时，只能通过将数组嵌套到children参数中来创建片段vnode m()。m("[")不会创建有效的vnode。
文本	{tag: "#", children: ""}	表示DOM文本节点。
受信任的HTML	{tag: "<", children: "<br>"}	表示HTML字符串中的DOM元素列表。
零件	{tag: ExampleComponent}	如果tag是带有view方法的Javascript对象，则vnode表示通过呈现组件生成的DOM。
虚拟DOM树中的所有内容都是vnode，包括文本。该m()实用程序自动规范化其children参数，并将字符串转换为文本vnodes，
将嵌套数组转换为片段vnode。

只有元素标记名称和组件可以是该m()函数的第一个参数。换句话说，[，#和<无效selector的论据m()。
可以通过创建受信任的HTML vnodem.trust()

单形类
mithril/render/vnodeMithril使用该模块生成所有vnode。这确保了现代Javascript引擎可以通过始终将vnodes编译到同一个隐藏类来优化虚拟dom diffing。

在创建发出vnode的库时，您应该使用此模块而不是编写裸Javascript对象，以确保高水平的呈现性能。

避免反模式
避免记忆可变的vnodes
Vnodes应该表示某个时间点的DOM状态。Mithril的渲染引擎假设重用的vnode未更改，因此修改先前渲染中使用的vnode将导致未定义的行为。

可以重用vnode来防止差异，但最好使用onbeforeupdate钩子让你的意图对其他开发者（或你未来的自己）清楚。
```
