 /*
             * returns constant color and ardius element, regardless of time and location
             *              
             */
            function fElmConstant(angle, time) {

                //TODO - a defualt to support usage without binded context? 
                var color = this.color;
                var radius = this.radius;

                var circle = document.createElementNS(svgNS, 'circle');
                circle.setAttribute('r', radius);
                //circle.setAttribute('fill', color);
                //circle.className = "clsTest1";
                circle.setAttribute('class', "clsCircElmDflt");
                return circle;
            }


            function fCircElmColorHrSec(angle, time) {
                var elmGenerator = fCircElm.bind(this);
                return elmGenerator(angle, time, true);

            }

            function fCircElmNoColorHrSec(angle, time) {
                var elmGenerator = fCircElm.bind(this);
                return elmGenerator(angle, time, false);
            }



            //returns proper circling element 
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
                    circle.setAttribute('class', "clsCircElmDflt");
                    circle.setAttribute('r', radiusFullHr);
                    return circle;
                }

                //pointed by hour hand
                if (shouldColorHrMin && Math.abs(diffHrAngle) < thrshHr) {
                    //circle.setAttribute('fill', hrClr);
                    circle.setAttribute('class', "clsCircElmDflt");
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

                //the default element 
                //circle.setAttribute('fill', dfltClr);
                circle.setAttribute('class', "clsCircElmDflt");
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