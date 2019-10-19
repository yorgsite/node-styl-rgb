

// ------- datas ------------


var stylRef={
	'bold': ['\x1B[1m', '\x1B[22m'],
	'italic': ['\x1B[3m', '\x1B[23m'],
	'underline': ['\x1B[4m', '\x1B[24m'],
	'inverse': ['\x1B[7m', '\x1B[27m'],
	'strikethrough': ['\x1B[9m', '\x1B[29m'],
};

var types={};

types['c256']={
	getCode:(rgb)=>{
		var srgb=rgb.map(d=>Math.max(0,Math.min(5,Math.round(d/55))));
		return 16+(srgb[0] * 36) + (srgb[1] * 6) + srgb[2];
	},
	getFront:(code)=>'\x1b[38;5;' + code,
	getBack:(code)=>'\x1b[48;5;' + code
};

types['c16m']={
	getCode:(rgb)=>rgb.map(d=>Math.floor(Math.max(0,Math.min(255,d)))).join(';'),
	getFront:(code)=>'\x1b[38;2;' + code,
	getBack:(code)=>'\x1b[48;2;' + code
};

// ------- rendering ------------

var _none=function(txt){
	return txt.split(/\x1B\[[0-9;]*m/).join('');
};

var Renderer=function(type,data){
	this.type=type;
	this.color=function(front,back){
		let txt='';
		if(front)txt+=data.getFront(data.getCode(front))+'m';
		if(back)txt+=data.getBack(data.getCode(back))+'m';
		return txt.length?[txt,'\x1B[39m\x1B[49m']:['',''];
	};
};

Renderer.prototype.style=function(styles){
	let res=['',''];
	styles=((styles instanceof Array)?styles:[styles])
	.filter(nam=>(nam in stylRef))
	.map(nam=>stylRef[nam])
	.forEach(v=>{
		res[0]=res[0]+v[0];
		res[1]=v[1]+res[1];
	});
	return res;
};

Renderer.prototype.get=function(front,back,style){
	let styl=this.style(style);
	let coll=this.color(front,back);
	return [coll[0]+styl[0],styl[1]+coll[1]];
};
Renderer.prototype.text=function(txt,front,back,style){
	return this.get(front,back,style).join(txt);
};

var Renderers=new function(){
	for(let type in types){
		this[type]=new Renderer(type,types[type]);
	}
}();

// ------- style interface ------------

var Styl=function(rd,txt){
	let sk={},col={front:0,back:0};
	let setrgb=(c,rgb)=>{
		if(!rgb||rgb.length!==3||rgb.filter(v=>typeof(v)==='number').length!==3){
			throw('rgb-styl.'+c+' Error:\nInvalid rgb value : '+rgb);
		}
		col[c]=rgb;
		return this;
	};
	txt=txt||'';
	for(let k in stylRef){
		Object.defineProperty(this,k,{
			get:()=>{
				sk[k]=1;
				return this;
			}
		});
	}
	this.text=function(v){
		txt=v+'';
		return this;
	};
	this.front=function(rgb){
		return setrgb('front',rgb);
	};
	this.back=function(rgb){
		return setrgb('back',rgb);
	};
	this.toString=function(){
		return rd.text(txt,col.front,col.back,Object.keys(sk));
	};
};

//---------- public interface

var rgbstyl=function(txt){
	return rgbstyl.c256(txt);
};
rgbstyl.none=_none;

rgbstyl.c256=function(txt){
	return new Styl(Renderers['c256'],txt);
};
rgbstyl.c256.none=_none;

rgbstyl.c16m=function(txt){
	return new Styl(Renderers['c16m'],txt);
};
rgbstyl.c16m.none=_none;



module.exports = rgbstyl;
