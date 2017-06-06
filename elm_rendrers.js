            
     /**
      * handels creationg of different peripherial SVG circle elements
      * **/       
            
            
            
            /*
             * returns constant color and ardius element, regardless of time and location             
             */
            function fElmConstant(angle, time) {

                //TODO - a defualt to support usage without binded context? 
                var color = this.color;
                var radius = this.radius;

                var circle = document.createElementNS(svgNS, 'circle');
                circle.setAttribute('r', radius);
                var cssClass = this.cssClass;
                if(typeof(cssClass) === 'undefined' || cssClass == null){
                    cssClass = "clsCircElmDflt";
                }
                circle.setAttribute('class', cssClass);
                return circle;
            }

            //returns a factory of color element
            function fCircElmColorHrSec(angle, time) {
                var elmGenerator = fCircElm.bind(this);
                return elmGenerator(angle, time, true);

            }
            
            //returns a factory of colorless element
            function fCircElmNoColorHrSec(angle, time) {
                var elmGenerator = fCircElm.bind(this);
                return elmGenerator(angle, time, false);
            }



            //returns proper circling element to to given time and angular position  
            function fCircElm(angle, time, shouldColorHrMin) {

                //TODO - a defualt to support usage without binded context? 
                var radiusNormal = this.radiusNormal;
                var radiusFullHr = this.radiusFullHr;
                var mnClr = this.mnClr;
                var hrClr = this.hrClr;
                var dfltClr = this.dfltClr;
                var thrshMin = 2 * Math.PI / 400;
                var thrshHr = 2 * Math.PI / 200;
                var circle = document.createElementNS(svgNS, 'circle');
                var mntAngle = (time.getMinutes() / 60) * Math.PI * 2;
                var diffMinAng = sharpAngel((angle + Math.PI / 2) - mntAngle);
                var hrAngle = (time.getHours() / 12) * Math.PI * 2 + mntAngle / 12;
                var diffHrAngle = sharpAngel((angle + Math.PI / 2) - hrAngle);
                
               

                //pointed by minutes hand
                if (shouldColorHrMin && Math.abs(diffMinAng) < thrshMin) {
                    //circle.setAttribute('fill', mnClr);
                    circle.setAttribute('class', "clsCircElmActiveMin");
                    circle.setAttribute('r', radiusFullHr);
                    return circle;
                }

                //pointed by hour hand
                if (shouldColorHrMin && Math.abs(diffHrAngle) < thrshHr) {
                    //circle.setAttribute('fill', hrClr);
                    circle.setAttribute('class', "clsCircElmActiveHr");
                    circle.setAttribute('r', radiusFullHr);
                    return circle;
                }

                //match for hour mark
                if (angleCloeToHrMark(angle)) {
                    //circle.setAttribute('fill', dfltClr);
                    circle.setAttribute('class', "clsCircElmDflt");
                    circle.setAttribute('r', radiusFullHr);
                    return circle;
                }
                
                //an element that is normal and not pointed by any dial 
                //if there is also a default class, keep it, else assign a global default 
                var cssClassDefault = this.cssClass;
                if(typeof(cssClassDefault) === 'undefined' || cssClassDefault == null){
                    cssClassDefault = "clsCircElmDflt";
                }
                circle.setAttribute('class', cssClassDefault);
                circle.setAttribute('r', radiusNormal);
                return circle;
                
            }



            //returns true iff angle close within margin to a whole hour marign mark 
            function angleCloeToHrMark(angle) {
                var margin = Math.PI * 2 / 250;
                var hrSlice = Math.PI * 2 / 12;
                var hrBelow = angle - angle % hrSlice;
                var hrAbove = hrBelow + hrSlice;
                if (hrAbove - angle < margin || angle - hrBelow < margin) {
                    return true;
                }
                return false;
            }