# node-styl-rgb
simple bash console rgb syling. like [node-styl](https://www.npmjs.com/package/node-styl)
 for 256 and 16m color terminals.

 Install :

 ```
 npm install node-styl-rgb
 ```


Add colors and styles to your logs :
```javascript
const { styl } = require('node-styl-rgb');
// or
import styl from 'node-styl-rgb';
...
console.log(""+styl('hello').front([80,255,0]).back([30,0,120]).underline);

```

 Use preformated style with the property **theme** :
```javascript
...
const title = styl().front([80,255,0]).back([30,0,120]).underline.theme;
console.log("this is "+title(" A TITLE "));
console.log("this is "+title(" AN OTHER TITLE "));
```

 Clean rendered styles to handle text length :
 ```javascript
 ...
 const styled = "this is "+title(" A TITLE ");
 const text = styl.none(styled);
 console.log("styled=","'"+styled+"'",' length=',text.length);
 ```
**available rgb displays are :**
* **types :**
	* c256 : 256 colors. ```require('node-styl-rgb').c256 ```
	* c16m : 16M colors. ```require('node-styl-rgb').c16m ```

```javascript
const { styl } = require('node-styl-rgb');
```
is equivalent to
```javascript
const { c16m } = require('node-styl-rgb');
```

**available properties are :**

* **theme :** theme renderer

* **text :** unstyled text content

* **styles :**
	* **bold** or **b**
	* **italic** or **i**
	* **underline** or **u**
	* **inverse**
	* **blink**
	* **strikethrough** or **s**

* **front colors :**
	* **white**
	* **grey**
	* **black**
	* **blue**
	* **cyan**
	* **green**
	* **magenta**
	* **red**
	* **yellow**

* **back colors :**
	* **whiteBG**
	* **greyBG**
	* **blackBG**
	* **blueBG**
	* **cyanBG**
	* **greenBG**
	* **magentaBG**
	* **redBG**
	* **yellowBG**

**available methods are :**

* **methods :**
	* front : sets rgb front color.
	* back : sets rgb back color.
	* style : sets styles.
	* string : sets new contents.
	* parse : parse contents characters
	
## Exemples

### Exemple 1
Base use exemple : simple title.
```javascript
console.log("-".repeat(10) + "|" + styl("node-styl demo").green.bold + "|" + "-".repeat(10));
```

### Exemple 2
Recursive styling.
```javascript
console.log('' 
    + styl('test1 ' + styl('custom ').front('#08f')
    + styl('green ').back([100, 255, 50]).black
    + styl(' cyan ').cyan.italic.bold
    + styl('un' + styl('der').red + 'line').u).green + ' ');
```
![image info](./imgs/exemple0.png)


## Exemples with **parse**

### Exemple 3
Use **parse** to make simple linear gradient.
```javascript
console.log(
    styl('gradient ' + styl('underlined').u + ' text')
        .gradient(obj => obj.styl
            .back([255 * obj.colP, 0, 0])
            .front([255, 255 * obj.colP, 255])
        )
    + '');
```

![image info](./imgs/exemple1.png)


### Exemple 4
Use **parse** to make 2d linear gradient.
```javascript
console.log(
    styl("gradient displayed\non multiple\nrows with some\n2d variations").gradient(obj => {
        obj.styl.front([255 * (1 - obj.colP), 255 * obj.colP, 255 * obj.rowP]);
    }) + ""
);
```
![image info](./imgs/exemple2.png)


### Exemple 4
Use **parse** to draw a box.
```javascript
console.log("* box :");
console.log(
    styl(
        [
            "+---------------+",
            "|               |",
            "|  " + styl(`checkerboard`).bold + " |",
            "|     in a      |",
            "|      box      |",
            "|               |",
            "+---------------+",
        ].join("\n")
    ).gradient(obj => {
        if ("+-|".includes(obj.char)) {
            obj.styl.back([255 * obj.colP, 255 * obj.rowP, 255 * (1 - obj.colP * obj.rowP)]).hidden;
        } else if (Math.round(obj.col * 0.5 + obj.row) % 2) obj.styl.back("#444");
    }) + ""
);
```
![image info](./imgs/exemple3.png)