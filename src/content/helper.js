let _mapMaxValue = 17.0;
let _mapMinValue = 8.0;
let _mapScale = (100.0/(_mapMaxValue - _mapMinValue));

function map(value){
    let float = parseInt(value) + (parseFloat(value) % 1 * (100/60) );
    return (float - _mapMinValue) * _mapScale;
}

function getBgColor(fach){
    if(data[fach] == undefined){
        return "none";
    }else{
        return data[fach].bgColor;
    }
}

function getColor(fach){
    if(data[fach] == undefined){
        return "none";
    }else{
        return data[fach].color;
    }
}

function getIsBlocked(fach){
    if(data[fach] == undefined){
        return false;
    }else{
        return data[fach].isBlocked;
    }
}