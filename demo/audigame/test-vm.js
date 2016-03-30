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
        "text": "I'm on the platform, I see a guard, what will I do?",
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
        "text": "I knocked the guard and go past him, I see a camera, what will I do?",
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
        "text": "I killed the guard and go past him, I see a camera, what will I do?",
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
        "text": "The camera is disabled, I can now safely go to the hostage, oh! I see her",
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
        "text": "Sneaky, I can now safely go to the hostage, oh! I see her",
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
        "choice": "Who are you?",
        "text": "\"Who are you?\" \"I'm Sarah\", I need to leave now",
        "timer": 0,
        "first": {
            "blockId": "508d-3a09-ed83-a71e-b20f-7d7a17c1ffb9"
        },
        "second": {
            "blockId": "f111-e69c-28eb-147b-7d03-376c229c31ae"
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
            "blockId": "508d-3a09-ed83-a71e-b20f-7d7a17c1ffb9"
        },
        "second": {
            "blockId": "f111-e69c-28eb-147b-7d03-376c229c31ae"
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
        "text": "Alright, come on in!"
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
        "text": "I had no time to escape with her, she's on her own now!"
    },
    "508d-3a09-ed83-a71e-b20f-7d7a17c1ffb9": {
        "type": "Condition",
        "test": {
            "blockId": "508d-7ae1-83c5-f194-3ee0-d56ee886a0d7"
        },
        "true": {
            "blockId": "3b38-a5b4-ead7-24c9-fd4f-6a497ed79286"
        },
        "false": {
            "blockId": "f111-1381-83d7-8a88-8120-0833263add3e"
        }
    },
    "508d-7ae1-83c5-f194-3ee0-d56ee886a0d7": {
        "type": "Variable",
        "name": "has_key"
    },
    "f111-1381-83d7-8a88-8120-0833263add3e": {
        "type": "Step",
        "sound": {
            "resourceType": "Sound"
        },
        "cover": {
            "resourceType": "Image"
        },
        "choice": "Find the key",
        "text": "Damn, where is the key, oh here it is, come on now.",
        "timer": 0,
        "first": {
            "blockId": "3b38-a5b4-ead7-24c9-fd4f-6a497ed79286"
        },
        "second": {
            "blockId": "3b38-f547-58f5-1732-4382-fbc8c08c22d9"
        }
    },
    "f111-e69c-28eb-147b-7d03-376c229c31ae": {
        "type": "go",
        "out": {
            "blockId": "3b38-f547-58f5-1732-4382-fbc8c08c22d9"
        }
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