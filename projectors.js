/**
 * renders a Seconds dial for given offset and given projected function 
 * the passed time does not affect the porjection of the function, that is, the computed locaiton 
 * of elements, but it is being passed on to the function that renders the elemnts, thus allowes for 
 * instance to mark the seconds and minutes hands by coloring their corresponing elemnts 
 * **/
function pojectFunctionOnRadCrd(panelName, center, numSections, outerRadius, f, zoomX, zoomY, offsetAngleRad, circElmFnc, currentTime) {
    colorsPointer = 0;
    var angle = 0;
    for (var i = 0; i < numSections; i++) {
        //the angular distance of currently rendered angle from the offset (offset is the center of the projected
        //function) 
        var angDist = sharpAngel(angle - offsetAngleRad) * zoomX;
        var addedRad = f(angDist);
        var x = center[0] + Math.cos(angle) * outerRadius * (1 + zoomY * addedRad);
        var y = center[1] + Math.sin(angle) * outerRadius * (1 + zoomY * addedRad);
        angle += 2 * Math.PI / numSections;
        var circle = circElmFnc(angle, currentTime);
        circle.setAttribute('cx', x);
        circle.setAttribute('cy', y);
        $("#" + panelName).append(circle);
    }
}


function sharpAngel(angle) {

    angle = angle % (2 * Math.PI);
    if (angle > Math.PI) {
        return  -1 * (2 * Math.PI - angle);
    }
    if (angle < -Math.PI) {
        return  (2 * Math.PI + angle);
    }
    return angle;

}