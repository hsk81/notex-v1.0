if(!Array.prototype.forEach){Array.prototype.forEach=function(g){var f=this.length;if(typeof g!="function"){throw new TypeError()}var e=arguments[1];for(var h=0;h<f;h++){if(h in this){g.call(e,this[h],h,this)}}}}if(!Array.prototype.filter){Array.prototype.filter=function(j){var h=this.length;if(typeof j!="function"){throw new TypeError()}var k=new Array();var g=arguments[1];for(var l=0;l<h;l++){if(l in this){var i=this[l];if(j.call(g,i,l,this)){k.push(i)}}}return k}};