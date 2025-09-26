function manageFruits() {
    let fruits = ["apple", "Banana", "cherry"];

    console.log("fruitsarray:",fruits);

    console.log(fruits[0]);
    fruits.push("date");
    console.log("new fruits", fruits);

    for (let i = 0; i<fruits.length; i++) {
        console.log("fruit at inde",i,":",fruits[i]);
    }
}

manageFruits();