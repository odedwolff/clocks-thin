function testAddCirclesArray(startLoc, spacing, radius, numInstances) {
    for (var i = 0; i < numInstances; i++) {
        var circle = document.createElementNS(svgNS, 'circle');
        circle.setAttribute('cx', startLoc[0] + i * spacing);
        circle.setAttribute('cy', startLoc[1]);
        circle.setAttribute('fill', 'red');
        circle.setAttribute('r', radius);

    }
}