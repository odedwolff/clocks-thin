var rawText = "loading...";

var waitAnimConf = {
    textStartX:200,
    textStartY:320,
    letterSpacing:40,
    minScale:1.0,
    maxScale:3.0,
    //timeOutMs:350,
    largeSusMs:200,
    smallSusMs:350,
    diffMs:70

}

var domLetters = [];

function prepText(){
    var parentElm=document.getElementById('divLoadingAlert');
    //make a dive for each letter
    for(i=0; i < rawText.length ;  i++){
        var cr = rawText[i];
        var newElm = document.createElement("div");
        newElm.innerHTML =cr;
        newElm.classList="clsDynLetter"
        parentElm.append(newElm);
        newElm.style.left=i*waitAnimConf.letterSpacing + waitAnimConf.textStartX + "px";
        newElm.style.top=waitAnimConf.textStartY + "px";
        domLetters.push(newElm);
    }
}

var drummingStopped = false;

function stepOut(elm){
    if(drummingStopped)
        return;
    //elm.style.transform = "scale(" + conf.maxScale + ")";
    elm.style.transform = "translate(0,-10px)";
    setTimeout(stepIn.bind(null, elm), waitAnimConf.largeSusMs);
}

function stepIn(elm){
    if(drummingStopped)
        return;
    //elm.style.transform = "scale(" + conf.minScale + ")";
    elm.style.transform = "translate(0,10px)";
    setTimeout(stepOut.bind(null, elm), waitAnimConf.smallSusMs);
}

function initDrumming(){
    for(i in domLetters){
        //stepOut(domLetters[i])
        setTimeout(stepOut.bind(null, domLetters[i]), waitAnimConf.diffMs * i);
    }
}

function stopWaitAnim(){
    drummingStopped=true;

    var lettersToRemove =  document.querySelectorAll(".clsDynLetter");
    for (i in lettersToRemove){
        var elm =  lettersToRemove[i];
        if(elm && elm.style)
            elm.style.display="none";
    }
   
}

function startWaitAnim(){
    prepText();
    initDrumming();
}




