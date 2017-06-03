//var intervalMask;
        
        
        var RAY_HR_WIDTH = Math.PI * 2 * 0.04;
        var RAY_MIN_WIDTH = Math.PI * 2 * 0.02;
        var RAY_SEC_WIDTH = Math.PI * 2 * 0.01;
        var CORRECT_OFFSET = 0.25;
        
        var origin = [400, 250];
        
        function manipulate1() {
            var path = document.getElementById('maskElm1');
            var newPath = "M150,150 h50 v250z";
            path.setAttribute("d", newPath);
        }

        //returns a string for a ray in given angel 
        function pathOfRay(angeRad, rayWidthRad, boardWidth, boardHeight, origin) {
            var radius = Math.max(boardHeight, boardWidth) / 2;
            var varUpVector = [Math.cos(angeRad + rayWidthRad) * radius, Math.sin(angeRad + rayWidthRad) * radius];
            varUpVector = add2DVector(varUpVector, origin);
            var varDownVector = [Math.cos(angeRad - rayWidthRad) * radius, Math.sin(angeRad - rayWidthRad) * radius];
            varDownVector = add2DVector(varDownVector, origin);
            return "M" + origin + " " + varUpVector + " " + varDownVector + "z";
        }

        function add2DVector(v1, v2) {
            var out = [];
            var x = v1[0] + v2[0];
            var y = v1[1] + v2[1];
            out.push(x);
            out.push(y);
            return out;
        }

        function testPathOfRay() {
            out = pathOfRay(Math.PI * 2 * 1 / 3, Math.PI * 2 / 20, 400, 300, [0, 0]);
            console.log(out);
        }
        function testRenderRay(){
                var d = pathOfRay(Math.PI * 2 * 0.25, Math.PI * 2 / 80, 400, 300, [300,300]);
//                var path= "<path id=maskElm2 d=" + d +  fill="red"/>;
                var path = document.getElementById('pathRay1');
                path.setAttribute("d", d);
        
        }
        function testAddVectors(){
            console.log(add2DVector([1,2], [2,1]));
        }
        
        
        
        function startMaskTicking(){
            var interval; 
            function tick(){
                var d = new Date();
                var curruentSecProp;
                var time;
                dt = new Date();
                time = dt.getTime();
                var curruntSecProp = (time % (1000 * 60)) / (1000 * 60);
                var currentMinProp = d.getMinutes() / 60;
                //var currentHrProp = d.getHours() / 12;
                
                var currentHrProp = d.getHours() / 12 + currentMinProp / 12;
                
                //set seconds ray 
                var d= pathOfRay(Math.PI * 2 * (curruntSecProp - CORRECT_OFFSET) , RAY_SEC_WIDTH, 400, 300, origin);
                var path = document.getElementById('pathRaySec');
                path.setAttribute("d", d);
                
                //set minutes ray 
                d= pathOfRay(Math.PI * 2 * (currentMinProp - CORRECT_OFFSET), RAY_MIN_WIDTH, 400, 300, origin);
                path = document.getElementById('pathRayMin');
                path.setAttribute("d", d);
                
                //set hours ray 
                d= pathOfRay(Math.PI * 2 * (currentHrProp - CORRECT_OFFSET), RAY_HR_WIDTH, 400, 300, origin);
                path = document.getElementById('pathRayHr');
                path.setAttribute("d", d);
                
            }
            
            interval = setInterval(tick, 1000);
            return interval;
            
        }
        
//        function stopMaskTicking(){
//            clearInterval(intervalMask);
//        }