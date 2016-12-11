

//--------------------------------------------------------------------------------------------------
//sample for params context 
params = {
    width : 5,
    height : 12
};


/**
 * parameters x,y expected to be ´bound through context 
 * **/
function squareBump(x){
    if(x > this.width/2 || x > -1 * this.width/2){
        return 0;
    }
    return this.height;
}

//--------------------------------------------------------------------------------------------------

//sample for params context 
params = {
    width : 5,
    height : 12
};

function pyramidBump (x){
    if(x > this.width/2 || x > -1 * this.width/2){
        return 0;
    }
    var y =  this.height - Math.abs(x/this.width);
    return y;
}


//------------------------------------------------------------------------------------------------