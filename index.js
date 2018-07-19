let runner = require("./dist/runner");

// const inputDir = "./data/input";
// const outputDir = "./data/output";

console.log(process.argv);
var args = process.argv.slice(2);


runner.run(args[0])