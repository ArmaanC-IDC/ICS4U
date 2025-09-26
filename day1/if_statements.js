const prompt = require("prompt-sync")();

function checkTemperature(temperature) {
    if (temperature > 30) {
        console.log("it's hot outside");
    } else if (temperature > 20) {
        console.log("it is warm outside");
    }else{
        console.log("it is cold outside");
    }
}

let temp = parseFloat(prompt("temp: "));
checkTemperature(temp);