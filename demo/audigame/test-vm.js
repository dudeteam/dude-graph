const readline = require("readline");
const rl = readline.createInterface({
    "input": process.stdin,
    "output": process.stdout,
    "terminal": false
});
const blocks = {
    "2e49-1e75-0881-3719-7dfa-5f19b8c70641": {
        "type": "Start",
        "sound": {
            "resourceType": "Sound"
        },
        "cover": {
            "resourceType": "Image"
        },
        "text": null,
        "timer": 32,
        "first": {
            "blockId": "3b38-1320-2a94-2ce4-8094-f920fbe56d27"
        },
        "second": {
            "blockId": "3b38-751e-1d7f-8cc3-3df5-3fe196dbe008"
        }
    },
    "3b38-1320-2a94-2ce4-8094-f920fbe56d27": {
        "type": "Step",
        "sound": {
            "resourceType": "Sound"
        },
        "cover": {
            "resourceType": "Image"
        },
        "choice": "Knock guard",
        "text": "You knock the guard and go past him, you see a camera, what will you do?",
        "timer": 0,
        "first": {
            "blockId": "3b38-855d-312c-20d9-0e9a-abd7be2a4068"
        },
        "second": {
            "blockId": "3b38-32d7-cdfb-0232-1e41-d5f4c2d45503"
        }
    },
    "3b38-751e-1d7f-8cc3-3df5-3fe196dbe008": {
        "type": "Step",
        "sound": {
            "resourceType": "Sound"
        },
        "cover": {
            "resourceType": "Image"
        },
        "choice": "Kill guard",
        "text": "You kill the guard and go past him, you see a camera, what will you do?",
        "timer": 0,
        "first": {
            "blockId": "3b38-855d-312c-20d9-0e9a-abd7be2a4068"
        },
        "second": {
            "blockId": "3b38-32d7-cdfb-0232-1e41-d5f4c2d45503"
        }
    },
    "3b38-855d-312c-20d9-0e9a-abd7be2a4068": {
        "type": "Step",
        "sound": {
            "resourceType": "Sound"
        },
        "cover": {
            "resourceType": "Image"
        },
        "choice": "Disable camera",
        "text": "You disable the camera and go to the hostage, here she is!",
        "timer": 0,
        "first": {
            "blockId": "3b38-9283-0adc-807e-e5a3-de2af797e449"
        },
        "second": {
            "blockId": "3b38-060f-5ea8-df83-8616-262156ef9fa9"
        }
    },
    "3b38-32d7-cdfb-0232-1e41-d5f4c2d45503": {
        "type": "Step",
        "sound": {
            "resourceType": "Sound"
        },
        "cover": {
            "resourceType": "Image"
        },
        "choice": "Avoid camera",
        "text": "You avoid the camera and go to the hostage, here she is!",
        "timer": 0,
        "first": {
            "blockId": "3b38-9283-0adc-807e-e5a3-de2af797e449"
        },
        "second": {
            "blockId": "3b38-060f-5ea8-df83-8616-262156ef9fa9"
        }
    },
    "3b38-9283-0adc-807e-e5a3-de2af797e449": {
        "type": "Step",
        "sound": {
            "resourceType": "Sound"
        },
        "cover": {
            "resourceType": "Image"
        },
        "choice": "Who are you",
        "text": "\"Who are you?\" \"I'm Sarah\", I need to leave now",
        "timer": 0,
        "first": {
            "blockId": "3b38-a5b4-ead7-24c9-fd4f-6a497ed79286"
        },
        "second": {
            "blockId": "3b38-f547-58f5-1732-4382-fbc8c08c22d9"
        }
    },
    "3b38-060f-5ea8-df83-8616-262156ef9fa9": {
        "type": "Step",
        "sound": {
            "resourceType": "Sound"
        },
        "cover": {
            "resourceType": "Image"
        },
        "choice": "Come with me",
        "text": "Come now, we need to leave",
        "timer": 0,
        "first": {
            "blockId": "3b38-a5b4-ead7-24c9-fd4f-6a497ed79286"
        },
        "second": {
            "blockId": "3b38-f547-58f5-1732-4382-fbc8c08c22d9"
        }
    },
    "3b38-a5b4-ead7-24c9-fd4f-6a497ed79286": {
        "type": "End",
        "sound": {
            "resourceType": "Sound"
        },
        "cover": {
            "resourceType": "Image"
        },
        "choice": "Go to chopper",
        "text": null
    },
    "3b38-f547-58f5-1732-4382-fbc8c08c22d9": {
        "type": "End",
        "sound": {
            "resourceType": "Sound"
        },
        "cover": {
            "resourceType": "Image"
        },
        "choice": "Leave her",
        "text": null
    }
};
const vm = new (require("./vm"))(blocks, "2e49-1e75-0881-3719-7dfa-5f19b8c70641", {
    "has_key": false,
    "nb_coins": 32
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