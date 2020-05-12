const config={
    fps:40,
    limitBackBounceDeg:20
}
var globalSettings = {
    minAngle:45, 
    maxAngle:315
}

var controllerContexts = {
    contDialtop:{
        pivX:138,
        pivY:194,
        rad:120,
        dotsRad:130,
        containerId:"divSprite2",
        dialId:"svgDialRing2",
        dragging:false,   /*runtime state, init to false*/
        isDescrete:false,
        stopsDeg:[90, 135, 180, 225, 270],
        fDescValSelectHandler:null,
        /**change pivot location within moving dial */
        offsetX:45,
        offsetY:45,
        //handler specific to container, to be invoked from the common handler 
        postMouseRepositionfunc:handFPSChange,
        startDraggingFunc:()=>{showTradeOffSymbols(false)},
        stopDraggingFunc:()=>{showTradeOffSymbols(true)},
        onload:drawSpotDialTop

    },
    contOOPRings:{
        pivX:123,
        pivY:128,
        rad:105,
        dotsRad:90,
        containerId:"divRingsOutOfPhase",
        dialId:"svgDialRingOOP",
        dragging:false,   /*runtime state, init to false*/
        isDescrete:true,
        /* 0deg is....*/
       /*  stopsDeg:[60, 100, 140, 180, 220, 260, 300], */
        stopsDeg:[60, 94.3, 128.6, 162.85, 197.14, 231.42, 265.71, 300],
        //fDescValSelectHandler:(x)=>{console.log("selected stop no " + x); invokeSwitchFunc(x);},
        fDescValSelectHandler:handleSelctionOOPDial,
        //stopsDeg:[-120,-80, -40, 0, 40, 80, 120],
        stopTexts:["home","1 ring", "3 rings", "crossing", "accuomlator", "masks", "stop","about"],
        //stopTexts:["1", "2", "3", "4", "5", "6","7"],
        /**change pivot location within moving dial */
        offsetX:45,
        offsetY:45,
        postMouseRepositionfunc:move3OOPWheels.bind(null,/*scale*/3.0),
        startDraggingFunc:null,
        stopDraggingFunc:null,
        onload:setupLabels.bind(null, 'contOOPRings', 100, 'divRingsOutOfPhase')
    }
}

function handleSelctionOOPDial(i){
    console.log("selected stop no " + i); 
    invokeSwitchFunc(i);
    if(i==controllerContexts.contOOPRings.stopsDeg.length-1){
        expFuncs.showAboutContent();
    }else{
        expFuncs.hideAboutContent();
    }
}



//knobSwitchFuncs = [switchTosingleRing, switchTo3Rings, switchToRingsCrossing, switchToAccumulator,  startMasksClock, stopTick, toggleAboutContentShow ];
       
knobSwitchFuncNamesOrdered= ['switchToHome', 'switchTosingleRing', 'switchTo3Rings', 'switchToRingsCrossing', 'switchToAccumulator',  'startMasksClock', 'stop', 'toggleAboutContentShow' ];



function invokeSwitchFunc(i){
    var key = knobSwitchFuncNamesOrdered[i];
    expFuncs[key]();
}
        

const fpsSetup = {
    min:2,
    max:60
}


var fpsAnimationConfig = {
    elmsInfos:{
        objWeights : {
            minScale:0.03,
            maxScale:0.27,
            isGrowingClockwise:true
        },
        objFeather : {
            minScale:0.16,
            maxScale:0.6,
            isGrowingClockwise:false
        },
        objSineSmooth:{
            minScale:0.16,
            maxScale:0.45,
            isGrowingClockwise:true
        },
        objSineDesc : {
            minScale:0.16,
            maxScale:0.6,
            isGrowingClockwise:false
        }
    }
}


function applyFPSScales(/**in range (0-1)**/scaleVal){
    var keys=Object.keys(fpsAnimationConfig.elmsInfos);
    var i;
    for (i in keys){
        if(!keys[i]){
            continue;
        }
        var elm=fpsAnimationConfig.elmsInfos[keys[i]];
        if(!elm){
            continue;
        }
        var localScale = elm.isGrowingClockwise? scaleVal : 1-scaleVal;
        var shouldSCale = (elm.maxScale - elm.minScale) * localScale + elm.minScale;
        document.getElementById(keys[i]).style.transform = "scale(" + shouldSCale + ")";
    }

}




function setupLabels(containerName, lblRAd, divParnetId){
    var texts = controllerContexts[containerName].stopTexts;
    var angles = controllerContexts[containerName].stopsDeg;
    //arrays are assumed to be the same length, Nth is coresponding to Nth
    for (i in texts){
        var angel = [i];
        var id="divRotLabel_" + containerName + "_" + i;
        var newElm = document.createElement("div");
        newElm.id=id;
        newElm.innerHTML= texts[i];
        newElm.style='position:absolute';
        newElm.classList='clsOOPDialLabel';
        document.getElementById(divParnetId).appendChild(newElm);
        //0 deg is DOWN
        newElm.style.top=controllerContexts[containerName].pivX + lblRAd * Math.cos(angles[i]/360 * 2* Math.PI) + 'px';
        //if the label is ont left side correct x position so that it aligns to the right edge of the text (push it left)
        var xCorrection = angles[i] < 180 ? newElm.getBoundingClientRect().width : 0;
        newElm.style.left=controllerContexts[containerName].pivY - lblRAd * Math.sin(angles[i]/360 * 2* Math.PI) - xCorrection + 'px'; 
    }

    setupCirclesArr(controllerContexts[containerName].pivX, controllerContexts[containerName].pivY, controllerContexts[containerName].dotsRad,  
        document.getElementById(divParnetId), controllerContexts[containerName].stopsDeg, -5, 0);
}



function setupCirclesArr(pivX, pivY, rad, parent,angles, offsetX, offsetY){
    for(i in angles){
        var avngle=angles[i] + 90;
        var left = pivX + Math.cos(avngle/360 * 2* Math.PI) * rad + offsetX;
        var top = pivY + Math.sin(avngle/360 * 2* Math.PI) * rad + offsetY;
        addNewCircle(left, top, parent);
    }
}

function setupCircleRange(pivX, pivY, rad, angMin, angMax, nmSteps, offsetX, offsetY){
    const degInStep = (angMax - angMin) / nmSteps;
    var curAng = angMin;
    var parent = document.getElementById(controllerContexts['contDialtop'].containerId);
    for(var i=0; i < nmSteps; i++){
        var locAngle = curAng + 90;
        var left = pivX + Math.cos(locAngle/360 * 2* Math.PI) * rad + offsetX;
        var top = pivY + Math.sin(locAngle/360 * 2* Math.PI) * rad + offsetY;
        addNewCircle(left, top, parent);
        curAng = curAng + degInStep;
    }
}

function drawSpotDialTop(){
    setupCircleRange(controllerContexts['contDialtop'].pivX, controllerContexts['contDialtop'].pivY,
    controllerContexts['contDialtop'].dotsRad, 82, 302, 9, -10, 0);
}




function addNewCircle(left,top, parent){
    var newDiv = document.createElement("div");
    newDiv.classList="clsScleDot";
    newDiv.innerHTML = 
        `<svg height="20" width="20" >
            <circle class="clsCircleDot" cx="10" cy="10" r="5" stroke="black" stroke-width="3" fill="red" />
        </svg>`;
 
    /*     `<svg height="100" width="100">
        <circle cx="50" cy="50" r="5" stroke="black" stroke-width="3" fill="red" />
    </svg>`; */
    parent.appendChild(newDiv);
    //newDiv.style='position:absolute';
    newDiv.style.left=left + "px";
    newDiv.style.top=top + "px";
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

function handleContainerStartDragging(contName){
    var func= controllerContexts[contName].startDraggingFunc;
    if(func){
        func();
    }
}

function handleContainerStopDragging(contName){
    var func= controllerContexts[contName].stopDraggingFunc;
    if(func){
        func();
    }
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
    if(offsetedAngle<globalSettings.minAngle){
        controllerContexts[containerName].dragging=false;
        handleContainerStopDragging(containerName);
        offsetedAngle=globalSettings.minAngle + config.limitBackBounceDeg;
    }
    if(offsetedAngle>globalSettings.maxAngle){
        offsetedAngle=globalSettings.maxAngle - config.limitBackBounceDeg;
        controllerContexts[containerName].dragging=false;
        handleContainerStopDragging(containerName);
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

    
    //console.log("positioning lef,top:" + left,top);
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
    var closestIdx = -1;
    for (i in stops){
        if(Math.abs(stops[i]  + 90 - angle) < Math.abs(closestAngle - angle)){
            closestAngle = stops[i] + 90;
            closestIdx=i;
        }
    }
    fDescValSelectHandler = controllerContexts[containerName].fDescValSelectHandler;
    if(fDescValSelectHandler){
        fDescValSelectHandler(closestIdx);
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
    handleContainerStartDragging(containerName);
}


function mouseMoveHandler(containerName, e){
    //if mouse is moving in the context of dragging, that is while pressing left click, etc
    if(!controllerContexts[containerName].dragging){
        return;
    }
    //console.log(e.pageX, e.pageY);
    positionDialByMouse(containerName, e, false);
}

function mouseUpInContainer(containerName, e){
    if(!controllerContexts[containerName].dragging){
        return;
    }
    
    console.log("stopped traking"); 
    controllerContexts[containerName].dragging=false; 
    handleContainerStopDragging(containerName);
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


//read current string from Style field 
/* function currentScale(transformStr){
    var i = transformStr.indexOf("scale");
    for(;transformStr[i]!='(';i++){}
    for(;)
}
 */


/**continer specific handlers **/


function handFPSChange(angle){
    //to keep consistnent with our orientation system
    angle = angle-90; 
    move3gearsControls(angle);
    var normScale = (angle - globalSettings.minAngle) / (globalSettings.maxAngle - globalSettings.minAngle);
    applyFPSScales(normScale);
    var newFPSVal = fpsSetup.min + (fpsSetup.max - fpsSetup.min) * normScale;
    
   /*  console.log("newFpsVal = " + newFPSVal);
    console.log("normScale = " + normScale);
    console.log("angle = " + angle); */
    
    expFuncs.changeFPS(newFPSVal);
}


function move3gearsControls(angle){
    document.getElementById("pathOuter").style.transform="rotate(" + angle * -0.5 + "deg)";
    document.getElementById("pathMid").style.transform="rotate(" + angle * 1 + "deg)";
    document.getElementById("pathInner").style.transform="rotate(" + angle * -1 + "deg)";
}

function move3OOPWheels(scale, angle){
    document.getElementById("divPathOOPOuter").style.transform="scale(" + scale + ") rotate(" + angle * -0.7 + "deg)";
    document.getElementById("divPathOOPMidr").style.transform="scale(" + scale + ") rotate(" + angle * 1.5 + "deg)";
    document.getElementById("divPathOOPInner").style.transform="scale(" + scale + ") rotate(" + angle * -1 + "deg)";
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

    document.getElementById('circleDialOOP').addEventListener('mousedown', mouseDownInDial.bind(null, 'contOOPRings'));
    document.getElementById('divRingsOutOfPhase').addEventListener('mousemove', mouseMoveHandler.bind(null, 'contOOPRings'));
    document.getElementById('divRingsOutOfPhase').addEventListener('mouseup', mouseUpInContainer.bind(null, 'contOOPRings'))
}

//TODO - should move to main insex.html script ?
function onLoad_ringsControl(){
    setUpListeners();
    const keys = Object.keys(controllerContexts);
    //invoke onLoad functions of containers 
    for (i in keys){
        var onLoadF =  controllerContexts[keys[i]].onload;
        if(onLoadF){
            onLoadF();
        }
    }

    initDials();
}

//setst initial position of dials at 180deg (up)
function initDials(){
    var continerNames= Object.keys(controllerContexts);
    for (var i in continerNames){
        positionDial(180 , continerNames[i], false);
    }
}




function showTradeOffSymbols(flag){
    var items = document.querySelectorAll(".objTradeOffSymbol");
    var i;
    for (i in items){
        if(!items[i] || !items[i].style){
            continue;
        }
        if(flag){
            items[i].style.visibility="hidden";
        }else{
            items[i].style.visibility="visible";
        }
    }
}



//window.addEventListener("load", onLoad);
