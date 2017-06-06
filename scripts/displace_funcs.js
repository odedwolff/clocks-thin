
/**
 * R1 -> R1 funtions, that shape elevetion of surface, having a visible "centre" to be used as a clock dial
 * 
 * **/
//-------a function with square elevation (constant). 'params' (like example bellow)
//should be bound to funtion on invokation 
//------------------------------------------------------------------------------------
//sample for params context 
params = {
    width: 5,
    height: 12
};


/**
 *  
 * parameters x,y expected to be ´bound through context 
 * **/
function squareBump(x) {
    if (x > this.width / 2 || x < -1 * this.width / 2) {
        return 0;
    }
    return this.height;
}

//--------------------------------------------------------------------------------------------------
//-------a function with triangle / pyriamid elevation (constant). 'params' (like example bellow)
//should be bound to funtion on invokation 
//sample for params context 
params = {
    width: 5,
    height: 12
};

function pyramidBump(x) {
    if (x > this.width / 2 || x < -1 * this.width / 2) {
        return 0;
    }
    //var y =  this.height - Math.abs(x/this.width);
    var y = this.height / 2 + -1 * this.height * Math.abs(x / this.width);
    return y;
}


//------------------------------------------------------------------------------------------------
//-------a function with qaussian shape (constant). 'params' (like example bellow)
//should be bound to funtion on invokation 

params = {
    width: 30,
    height: 12
};

function gausianBump(x) {
    var b = 0;
    var c = this.width;
    var a = this.height;
    var y =  1.0 * a * Math.exp((-1.0 * Math.pow((x - b), 2)) / (2 * Math.pow(c, 2)));
    return y;
}




//returns a gausian function of x - a,b,c are the normal gaussia parameters 
function gausianMaker(a, b, c) {
    var f = function (x) {
        return 1.0 * a * Math.exp(-1.0 * Math.pow((x - b), 2)) / (2 * Math.pow(c, 2));
    }
    return f;
}

//------------------------------------------------------------------------------------------------
//   a function i thought would look nice as clock dial 

//a surface function: cos(?t)*?1/?(6+?(t/?2)^?2)
//decay must be integer !!
function fCustom1(scaleX, scaleY, decay) {
    var f = function (x) {
        x = x * scaleX;
        //x = Math.abs(x);
        return scaleY * Math.cos(x) / (6 + Math.pow(x / 2, decay));
        //return scaleY * Math.cos(x) / (6  + (Math.pow(x/2, decay))); 
    }
    ;
    return f;
}         