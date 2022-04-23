var PixelDrawr;(function(PixelDrawr_1){"use strict";var PixelDrawr=(function(){function PixelDrawr(settings){this.PixelRender=settings.PixelRender;this.MapScreener=settings.MapScreener;this.createCanvas=settings.createCanvas;this.unitsize=settings.unitsize||1;this.noRefill=settings.noRefill;this.spriteCacheCutoff=settings.spriteCacheCutoff||0;this.groupNames=settings.groupNames;this.framerateSkip=settings.framerateSkip||1;this.framesDrawn=0;this.epsilon=settings.epsilon||.007;this.keyWidth=settings.keyWidth||"width";this.keyHeight=settings.keyHeight||"height";this.keyTop=settings.keyTop||"top";this.keyRight=settings.keyRight||"right";this.keyBottom=settings.keyBottom||"bottom";this.keyLeft=settings.keyLeft||"left";this.keyOffsetX=settings.keyOffsetX;this.keyOffsetY=settings.keyOffsetY;this.generateObjectKey=settings.generateObjectKey||function(thing){return thing.toString();};this.resetBackground();}
PixelDrawr.prototype.getFramerateSkip=function(){return this.framerateSkip;};PixelDrawr.prototype.getThingArray=function(){return this.thingArrays;};PixelDrawr.prototype.getCanvas=function(){return this.canvas;};PixelDrawr.prototype.getContext=function(){return this.context;};PixelDrawr.prototype.getBackgroundCanvas=function(){return this.backgroundCanvas;};PixelDrawr.prototype.getBackgroundContext=function(){return this.backgroundContext;};PixelDrawr.prototype.getNoRefill=function(){return this.noRefill;};PixelDrawr.prototype.getEpsilon=function(){return this.epsilon;};PixelDrawr.prototype.setFramerateSkip=function(framerateSkip){this.framerateSkip=framerateSkip;};PixelDrawr.prototype.setThingArrays=function(thingArrays){this.thingArrays=thingArrays;};PixelDrawr.prototype.setCanvas=function(canvas){this.canvas=canvas;this.context=canvas.getContext("2d");};PixelDrawr.prototype.setNoRefill=function(noRefill){this.noRefill=noRefill;};PixelDrawr.prototype.setEpsilon=function(epsilon){this.epsilon=epsilon;};PixelDrawr.prototype.resetBackground=function(){this.backgroundCanvas=this.createCanvas(this.MapScreener[this.keyWidth],this.MapScreener[this.keyHeight]);this.backgroundContext=this.backgroundCanvas.getContext("2d");};PixelDrawr.prototype.setBackground=function(fillStyle){this.backgroundContext.fillStyle=fillStyle;this.backgroundContext.fillRect(0,0,this.MapScreener[this.keyWidth],this.MapScreener[this.keyHeight]);};PixelDrawr.prototype.drawBackground=function(){this.context.drawImage(this.backgroundCanvas,0,0);};PixelDrawr.prototype.setThingSprite=function(thing){if(thing.hidden){return;}
thing.sprite=this.PixelRender.decode(this.generateObjectKey(thing),thing);if(thing.sprite.constructor===PixelRendr.SpriteMultiple){thing.numSprites=0;this.refillThingCanvasMultiple(thing);}
else{thing.numSprites=1;this.refillThingCanvasSingle(thing);}};PixelDrawr.prototype.refillThingCanvasSingle=function(thing){if(thing[this.keyWidth]<1||thing[this.keyHeight]<1){return;}
var canvas=thing.canvas,context=thing.context,imageData=context.getImageData(0,0,canvas[this.keyWidth],canvas[this.keyHeight]);this.PixelRender.memcpyU8(thing.sprite,imageData.data);context.putImageData(imageData,0,0);};PixelDrawr.prototype.refillThingCanvasMultiple=function(thing){if(thing[this.keyWidth]<1||thing[this.keyHeight]<1){return;}
var spritesRaw=thing.sprite,canvases=thing.canvases={"direction":spritesRaw.direction,"multiple":true},canvas,context,imageData,i;thing.numSprites=1;for(i in spritesRaw.sprites){if(!spritesRaw.sprites.hasOwnProperty(i)){continue;}
canvas=this.createCanvas(thing.spritewidth*this.unitsize,thing.spriteheight*this.unitsize);context=canvas.getContext("2d");imageData=context.getImageData(0,0,canvas[this.keyWidth],canvas[this.keyHeight]);this.PixelRender.memcpyU8(spritesRaw.sprites[i],imageData.data);context.putImageData(imageData,0,0);canvases[i]={"canvas":canvas,"context":context};thing.numSprites+=1;}
if(thing[this.keyWidth]*thing[this.keyHeight]<this.spriteCacheCutoff){thing.canvas[this.keyWidth]=thing[this.keyWidth]*this.unitsize;thing.canvas[this.keyHeight]=thing[this.keyHeight]*this.unitsize;this.drawThingOnContextMultiple(thing.context,thing.canvases,thing,0,0);}
else{thing.canvas[this.keyWidth]=thing.canvas[this.keyHeight]=0;}};PixelDrawr.prototype.refillGlobalCanvas=function(){this.framesDrawn+=1;if(this.framesDrawn%this.framerateSkip!==0){return;}
if(!this.noRefill){this.drawBackground();}
for(var i=0;i<this.thingArrays.length;i+=1){this.refillThingArray(this.thingArrays[i]);}};PixelDrawr.prototype.refillThingArray=function(array){for(var i=0;i<array.length;i+=1){this.drawThingOnContext(this.context,array[i]);}};PixelDrawr.prototype.refillQuadrantGroups=function(groups){var i;this.framesDrawn+=1;if(this.framesDrawn%this.framerateSkip!==0){return;}
for(i=0;i<groups.length;i+=1){this.refillQuadrants(groups[i].quadrants);}};PixelDrawr.prototype.refillQuadrants=function(quadrants){var quadrant,i;for(i=0;i<quadrants.length;i+=1){quadrant=quadrants[i];if(quadrant.changed&&quadrant[this.keyTop]<this.MapScreener[this.keyHeight]&&quadrant[this.keyRight]>0&&quadrant[this.keyBottom]>0&&quadrant[this.keyLeft]<this.MapScreener[this.keyWidth]){this.refillQuadrant(quadrant);this.context.drawImage(quadrant.canvas,quadrant[this.keyLeft],quadrant[this.keyTop]);}}};PixelDrawr.prototype.refillQuadrant=function(quadrant){var group,i,j;if(!this.noRefill){quadrant.context.drawImage(this.backgroundCanvas,quadrant[this.keyLeft],quadrant[this.keyTop],quadrant.canvas[this.keyWidth],quadrant.canvas[this.keyHeight],0,0,quadrant.canvas[this.keyWidth],quadrant.canvas[this.keyHeight]);}
for(i=this.groupNames.length-1;i>=0;i-=1){group=quadrant.things[this.groupNames[i]];for(j=0;j<group.length;j+=1){this.drawThingOnQuadrant(group[j],quadrant);}}
quadrant.changed=false;};PixelDrawr.prototype.drawThingOnContext=function(context,thing){if(thing.hidden||thing.opacity<this.epsilon||thing[this.keyHeight]<1||thing[this.keyWidth]<1||this.getTop(thing)>this.MapScreener[this.keyHeight]||this.getRight(thing)<0||this.getBottom(thing)<0||this.getLeft(thing)>this.MapScreener[this.keyWidth]){return;}
if(typeof thing.numSprites==="undefined"){this.setThingSprite(thing);}
if(thing.canvas[this.keyWidth]>0){this.drawThingOnContextSingle(context,thing.canvas,thing,this.getLeft(thing),this.getTop(thing));}
else{this.drawThingOnContextMultiple(context,thing.canvases,thing,this.getLeft(thing),this.getTop(thing));}};PixelDrawr.prototype.drawThingOnQuadrant=function(thing,quadrant){if(thing.hidden||this.getTop(thing)>quadrant[this.keyBottom]||this.getRight(thing)<quadrant[this.keyLeft]||this.getBottom(thing)<quadrant[this.keyTop]||this.getLeft(thing)>quadrant[this.keyRight]||thing.opacity<this.epsilon){return;}
if(thing.numSprites===1){return this.drawThingOnContextSingle(quadrant.context,thing.canvas,thing,this.getLeft(thing)-quadrant[this.keyLeft],this.getTop(thing)-quadrant[this.keyTop]);}
else{return this.drawThingOnContextMultiple(quadrant.context,thing.canvases,thing,this.getLeft(thing)-quadrant[this.keyLeft],this.getTop(thing)-quadrant[this.keyTop]);}};PixelDrawr.prototype.drawThingOnContextSingle=function(context,canvas,thing,left,top){if(thing.repeat){this.drawPatternOnContext(context,canvas,left,top,thing.unitwidth,thing.unitheight,thing.opacity||1);}
else if(thing.opacity!==1){context.globalAlpha=thing.opacity;context.drawImage(canvas,left,top,canvas.width*thing.scale,canvas.height*thing.scale);context.globalAlpha=1;}
else{context.drawImage(canvas,left,top,canvas.width*thing.scale,canvas.height*thing.scale);}};PixelDrawr.prototype.drawThingOnContextMultiple=function(context,canvases,thing,left,top){var sprite=thing.sprite,topreal=top,leftreal=left,rightreal=left+thing.unitwidth,bottomreal=top+thing.unitheight,widthreal=thing.unitwidth,heightreal=thing.unitheight,spritewidthpixels=thing.spritewidthpixels,spriteheightpixels=thing.spriteheightpixels,widthdrawn=Math.min(widthreal,spritewidthpixels),heightdrawn=Math.min(heightreal,spriteheightpixels),opacity=thing.opacity,diffhoriz,diffvert,canvasref;switch(canvases.direction){case "vertical":if((canvasref=canvases[this.keyBottom])){diffvert=sprite.bottomheight?sprite.bottomheight*this.unitsize:spriteheightpixels;this.drawPatternOnContext(context,canvasref.canvas,leftreal,bottomreal-diffvert,widthreal,heightdrawn,opacity);bottomreal-=diffvert;heightreal-=diffvert;}
if((canvasref=canvases[this.keyTop])){diffvert=sprite.topheight?sprite.topheight*this.unitsize:spriteheightpixels;this.drawPatternOnContext(context,canvasref.canvas,leftreal,topreal,widthreal,heightdrawn,opacity);topreal+=diffvert;heightreal-=diffvert;}
break;case "horizontal":if((canvasref=canvases[this.keyLeft])){diffhoriz=sprite.leftwidth?sprite.leftwidth*this.unitsize:spritewidthpixels;this.drawPatternOnContext(context,canvasref.canvas,leftreal,topreal,widthdrawn,heightreal,opacity);leftreal+=diffhoriz;widthreal-=diffhoriz;}
if((canvasref=canvases[this.keyRight])){diffhoriz=sprite.rightwidth?sprite.rightwidth*this.unitsize:spritewidthpixels;this.drawPatternOnContext(context,canvasref.canvas,rightreal-diffhoriz,topreal,widthdrawn,heightreal,opacity);rightreal-=diffhoriz;widthreal-=diffhoriz;}
break;case "corners":diffvert=sprite.topheight?sprite.topheight*this.unitsize:spriteheightpixels;diffhoriz=sprite.leftwidth?sprite.leftwidth*this.unitsize:spritewidthpixels;this.drawPatternOnContext(context,canvases.topLeft.canvas,leftreal,topreal,widthdrawn,heightdrawn,opacity);this.drawPatternOnContext(context,canvases[this.keyLeft].canvas,leftreal,topreal+diffvert,widthdrawn,heightreal-diffvert*2,opacity);this.drawPatternOnContext(context,canvases.bottomLeft.canvas,leftreal,bottomreal-diffvert,widthdrawn,heightdrawn,opacity);leftreal+=diffhoriz;widthreal-=diffhoriz;diffhoriz=sprite.rightwidth?sprite.rightwidth*this.unitsize:spritewidthpixels;this.drawPatternOnContext(context,canvases[this.keyTop].canvas,leftreal,topreal,widthreal-diffhoriz,heightdrawn,opacity);this.drawPatternOnContext(context,canvases.topRight.canvas,rightreal-diffhoriz,topreal,widthdrawn,heightdrawn,opacity);topreal+=diffvert;heightreal-=diffvert;diffvert=sprite.bottomheight?sprite.bottomheight*this.unitsize:spriteheightpixels;this.drawPatternOnContext(context,canvases[this.keyRight].canvas,rightreal-diffhoriz,topreal,widthdrawn,heightreal-diffvert,opacity);this.drawPatternOnContext(context,canvases.bottomRight.canvas,rightreal-diffhoriz,bottomreal-diffvert,widthdrawn,heightdrawn,opacity);this.drawPatternOnContext(context,canvases[this.keyBottom].canvas,leftreal,bottomreal-diffvert,widthreal-diffhoriz,heightdrawn,opacity);rightreal-=diffhoriz;widthreal-=diffhoriz;bottomreal-=diffvert;heightreal-=diffvert;break;default:throw new Error("Unknown or missing direction given in SpriteMultiple.");}
if((canvasref=canvases.middle)&&topreal<bottomreal&&leftreal<rightreal){if(sprite.middleStretch){context.globalAlpha=opacity;context.drawImage(canvasref.canvas,leftreal,topreal,widthreal,heightreal);context.globalAlpha=1;}
else{this.drawPatternOnContext(context,canvasref.canvas,leftreal,topreal,widthreal,heightreal,opacity);}}};PixelDrawr.prototype.getTop=function(thing){if(this.keyOffsetY){return thing[this.keyTop]+thing[this.keyOffsetY];}
else{return thing[this.keyTop];}};PixelDrawr.prototype.getRight=function(thing){if(this.keyOffsetX){return thing[this.keyRight]+thing[this.keyOffsetX];}
else{return thing[this.keyRight];}};PixelDrawr.prototype.getBottom=function(thing){if(this.keyOffsetX){return thing[this.keyBottom]+thing[this.keyOffsetY];}
else{return thing[this.keyBottom];}};PixelDrawr.prototype.getLeft=function(thing){if(this.keyOffsetX){return thing[this.keyLeft]+thing[this.keyOffsetX];}
else{return thing[this.keyLeft];}};PixelDrawr.prototype.drawPatternOnContext=function(context,source,left,top,width,height,opacity){context.globalAlpha=opacity;context.translate(left,top);context.fillStyle=context.createPattern(source,"repeat");context.fillRect(0,0,width,height);context.translate(-left,-top);context.globalAlpha=1;};return PixelDrawr;})();PixelDrawr_1.PixelDrawr=PixelDrawr;})(PixelDrawr||(PixelDrawr={}));