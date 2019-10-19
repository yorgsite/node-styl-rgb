# node-styl-rgb
simple bash console rgb syling. like [node-styl](https://www.npmjs.com/package/node-styl)
 for 256 and 16m color terminals.

 Install :

 ```
 npm install node-styl-rgb
 ```


Add colors and styles to your logs :
```javascript
var styl = require('node-styl-rgb').c16m;
...
console.log("_"+styl('hello').front([80,255,0]).back([30,0,120]).underline);

```

 Use preformated style :
```javascript
...
var title = styl().front([80,255,0]).back([30,0,120]).underline.text;
console.log("this is "+title(" A TITLE "));
console.log("this is "+title(" AN OTHER TITLE "));
```

 Clean rendered styles to handle text length :
 ```javascript
 ...
 var styled = "this is "+title(" A TITLE ");
 var text = styl.none(styled);
 console.log("styled=","'"+styled+"'",' length=',text.length);
 ```
**available rgb displays are :**
* **types :**
	* c256 : 256 colors. ```require('node-styl-rgb').c256 ```
	* c16m : 16M colors. ```require('node-styl-rgb').c16m ```

```javascript
var styl = require('node-styl-rgb');
```
is equivalent to
```javascript
var styl = require('node-styl-rgb').c256;
```

**available style properties are :**
* **styles :**
	* bold
	* italic
	* underline
	* inverse
	* strikethrough

**available methods are :**

* **methods :**
	* front : sets rgb front color.
	* back : sets rgb back color.
	* text : sets text.
