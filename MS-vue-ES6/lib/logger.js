/**
 * Created by allenshow on 6/11/15.
 */

var winston=require("winston");

var D=[];
for(var i=0;i<60;i++){
    if(i<10){
        D[i]='0'+i;
    }else{
        D[i]=i;
    }
}

var logger = new (winston.Logger)({
    transports: [new (winston.transports.Console)({ level: 'debug', colorize: true,timestamp: function() {
        var d=new Date();
        return d.getFullYear()+'-'+D[d.getMonth()+1]+'-'+D[d.getDate()]+' '
            +D[d.getHours()]+':'+D[d.getMinutes()]+':'+D[d.getSeconds()];
    }})]
});

/*
* There will be some configs here
* */

module.exports=logger;