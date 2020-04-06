const config={
    fps:40,
    limitBackBounceDeg:20
}
var globalSettings = {
    meanAngle:45, 
    maxAngle:315
}

var controllerContexts = {
    cont1:{
        pivX:300,
        pivY:200,
        rad:100,
        containerId:"divSprite",
        dialId:"svgDialRing",
        dragging:false,   /*runtime state, init to false*/
        isDescrete:false,
        stopsDeg:[90, 135, 180, 225, 270],
        /*use offsets to ajdust  pivot of moving object*/
        offsetX:100,
        offsetY:100
    },
    contDialtop:{
        pivX:300,
        pivY:302,
        rad:220,
        containerId:"divSprite2",
        dialId:"svgDialRing2",
        dragging:false,   /*runtime state, init to false*/
        isDescrete:false,
        stopsDeg:[90, 135, 180, 225, 270],
        offsetX:50,
        offsetY:50,
        postMouseRepositionfunc:move3gears    
    }

}


function handleMouseEnter(){
    console.log("mouse eneter");
}
function handleMouseLeave(){
    console.log("mouse leave");
}
function go(){
    roatateAroundExt('svgDialRing', 50, 50, 200, 0, -90, 0.4);
}



//rotate an element
//args: element id, initial rotation, degrees to roatat, animation duration 
function rotateAnim(elmId, startDeg, dDeg, animDurSec){
    var elm = document.getElementById(elmId);
    var nmFrames = animDurSec * config.fps;
    degPerSec=dDeg/animDurSec;
    var curRot = startDeg;
    
    stepRotat(elm, nmFrames,curRot, degPerSec);

}

//impliments on stop of the animation 
function stepRotat(elm, remainSteps,curRot, degPerSec){
    if(remainSteps == 0){
        return; 
    }
    elm.style.transform  = 'rotate('+curRot+'deg)';
    setTimeout(stepRotat.bind(null, elm, remainSteps - 1,curRot + degPerSec / config.fps, degPerSec), 1000/config.fps);
}


function roatateAroundExt(elmId, pvtX, pvtY, rad, startRot, dDeg, animDurSec){
    var elm=document.getElementById(elmId);
    var degPerSec =  dDeg / animDurSec;
    var framesRem = animDurSec * config.fps;

    roatateAroundExtStep(elm, pvtX, pvtY, rad, startRot, degPerSec, framesRem);
}

function roatateAroundExtStep(elm, pvtX, pvtY, rad, curRot, dDegPerSec, framesRem){
    if(framesRem==0){
        return;
    }
    x=pvtX + Math.sin((curRot / 360) * (2 * Math.PI)) * rad;
    y=pvtY + Math.cos((curRot / 360) * (2 * Math.PI)) * rad;
    elm.style.transform  = 'translate('+ x + 'px,' + y + 'px)';
    setTimeout(
        roatateAroundExtStep.bind(null, elm, pvtX, pvtY, rad, curRot + dDegPerSec/ config.fps,dDegPerSec, framesRem -1)
        , 
    
    1000/config.fps);
      
}



function angleFromPivot(containerElm, pvtXLoc, pvtYLoc, xMouseAbs, yMouseAbs, containerName){
    var pivPos = posInDoc(containerElm);
    mouseXLoc = xMouseAbs - pivPos.left;
    mouseYLoc = yMouseAbs - pivPos.top; 
    var offsetFromPivot = {
        x:mouseXLoc - pvtXLoc, 
        y:mouseYLoc - pvtYLoc
    }
    var angleToOffsetRad = Math.atan(offsetFromPivot.y / offsetFromPivot.x);
    var angleToOffsetDeg = 90 * (angleToOffsetRad / Math.PI * 2);
    if(offsetFromPivot.x > 0  && offsetFromPivot.y < 0) angleToOffsetDeg=angleToOffsetDeg+180
    else 
    if (offsetFromPivot.x > 0  && offsetFromPivot.y >  0) angleToOffsetDeg=angleToOffsetDeg+180
    else 
    if (offsetFromPivot.x < 0  && offsetFromPivot.y >  0) angleToOffsetDeg=angleToOffsetDeg + 360;

    var offsetedAngle =  (angleToOffsetDeg + 90) % 360;          
    if(offsetedAngle<globalSettings.meanAngle){
        controllerContexts[containerName].dragging=false;
        offsetedAngle=globalSettings.meanAngle + config.limitBackBounceDeg;
    }
    if(offsetedAngle>globalSettings.maxAngle){
        offsetedAngle=globalSettings.maxAngle - config.limitBackBounceDeg;
        controllerContexts[containerName].dragging=false;
    }
    return offsetedAngle;
}

function positionDial(angle, containerName, atCloseststop){
    var dialElm;
    var rtDoc = documentByContainer(containerName);
    dialElm=rtDoc.getElementById(controllerContexts[containerName].dialId);
    
    angle = angle + 90 

    if(atCloseststop && controllerContexts[containerName].isDescrete){
        angle = findClosestStop(angle, containerName)
    }


    var left  = 
        controllerContexts[containerName].pivX + 
        +  Math.cos((angle/360) * 2 * Math.PI) * controllerContexts[containerName].rad;
    
    var top = 
        controllerContexts[containerName].pivY 
        + Math.sin((angle/360) * 2 * Math.PI) * controllerContexts[containerName].rad;

    
    console.log("positioning lef,top:" + left,top);
    dialElm.style.left=left - controllerContexts[containerName].offsetX;
    dialElm.style.top=top - controllerContexts[containerName].offsetY;


    var postFunc = controllerContexts[containerName].postMouseRepositionfunc;
    if(postFunc){
        postFunc(angle);
    }
}


function findClosestStop(angle, containerName){
    var stops = controllerContexts[containerName].stopsDeg
    var closestAngle = 10000;
    for (i in stops){
        if(Math.abs(stops[i]  + 90 - angle) < Math.abs(closestAngle - angle)){
            closestAngle = stops[i] + 90;
        }
    }
    return closestAngle;
}



//elements position, compansating for mouse scrolls 
function posInDoc(el) {
    var rect = el.getBoundingClientRect(),
    scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
    scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft }
}




function mouseDownInDial(containerName, e){
    console.log("started traking"); 
    controllerContexts[containerName].dragging=true; 
}


function mouseMoveHandler(containerName, e){
    if(!controllerContexts[containerName].dragging){
        return;
    }
    console.log(e.pageX, e.pageY);
    positionDialByMouse(containerName, e, false);
}

function mouseUpInContainer(containerName, e){
    console.log("stopped traking"); 
    controllerContexts[containerName].dragging=false; 
    //if descrete, hop to closest stop 
    if(controllerContexts[containerName].isDescrete){
        positionDialByMouse(containerName, e, true);
        console.log("hoping to next stop");
    }
}
/*----------------------------------------------------------------------*/
function positionDialByMouse(containerName, e, shoulHopToClosest){
    var docRT = documentByContainer(containerName);
    var containerElm=docRT.getElementById(controllerContexts[containerName].containerId);
    var pvtXLoc=controllerContexts[containerName].pivX;
    var pvtYLoc=controllerContexts[containerName].pivY;
    var angDeg=angleFromPivot(containerElm, pvtXLoc, pvtYLoc, e.pageX, e.pageY, containerName);
    positionDial(angDeg , containerName, shoulHopToClosest);
}


function documentByContainer(containerName){
    var overrideDocName=controllerContexts[containerName].overrideDocument;
    //if container points at override document (for instance an external svg file)
    if(overrideDocName){
        return document.getElementById(overrideDocName).contentDocument;
    }
    //else, return the global documment reference 
    return document;
}


/**continer specific handlers **/

function move3gears(angle){
    document.getElementById("pathOuter").style.transform="rotate(" + angle * -0.5 + "deg)"
    document.getElementById("pathMid").style.transform="rotate(" + angle * 1 + "deg)"
    document.getElementById("pathInner").style.transform="rotate(" + angle * -1 + "deg)"
}



/*******************************************************/



/**set listeners for the moving parts**/
function docLoadHandler(){
    //setUpListeners();
}

function setUpListeners(){
    
    document.getElementById('circleDial2').addEventListener('mousedown', mouseDownInDial.bind(null, 'contDialtop'));
    document.getElementById('divSprite2').addEventListener('mousemove', mouseMoveHandler.bind(null, 'contDialtop'));
    document.getElementById('divSprite2').addEventListener('mouseup', mouseUpInContainer.bind(null, 'contDialtop'));
}

window.addEventListener("load", setUpListeners);