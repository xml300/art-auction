import { createHash } from "crypto";

const hashVal = (value) => {
    return createHash('sha256').update(value).digest('hex');
}

hashVal("Tomo")

console.time("1 Iteration")
hashVal("Hello World")
console.timeEnd("1 Iteration");

for(let i = 10; i < 1_000_000_000; i*=10){
    console.time(`${i} Iterations`);
    let hash = "Hello World";
    for(let j = 0; j < i; j++){
        hash = hashVal(hash);
    }
    console.timeEnd(`${i} Iterations`);
}