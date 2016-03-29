const vm = require("./vm");
const readline = require("readline");
const rl = readline.createInterface({
    "input": process.stdin,
    "output": process.stdout,
    "terminal": false
});

console.log(vm.state);
rl.prompt();

rl.on("line", function (line) {
    if (line === "first" || line === "second" || line === "timeout") {
        vm[line + "Choice"].call(vm);
        var state = vm.state;
        console.log(vm.state);
        if (state.type === "End") {
            process.exit();
        }
    } else {
        console.log("usage: first, second, timeout");
    }
    rl.prompt();
});

rl.on("close", function () {
    process.exit(1);
});