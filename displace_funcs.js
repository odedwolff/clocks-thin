

//--------------------------------------------------------------------------------------------------
//sample for params context 
params = {
    width: 5,
    height: 12
};


/**
 * parameters x,y expected to be ´bound through context 
 * **/
function squareBump(x) {
    if (x > this.width / 2 || x < -1 * this.width / 2) {
        return 0;
    }
    return this.height;
}

//--------------------------------------------------------------------------------------------------

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




//returns a gausian function of x
function gausianMaker(a, b, c) {
    var f = function (x) {
        return 1.0 * a * Math.exp(-1.0 * Math.pow((x - b), 2)) / (2 * Math.pow(c, 2));
    }
    return f;
}

//------------------------------------------------------------------------------------------------

