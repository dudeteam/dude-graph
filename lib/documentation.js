/**
 *
 * @type {{type: String, id: String, parent: cg.RendererGroup}}
 */
cg.RendererBlock = {"type": "block", "id": "", "parent": new cg.RendererGroup, "position": [0, 0], "size": [0, 0]};

/**
 *
 * @type {{type: string, id: String, parent: cg.RendererGroup, children: Array<cg.RendererGroup>}}
 */
cg.RendererGroup = {"type": "group", "id": "", "parent": new cg.RendererGroup, "children": Array, "position": [0, 0], "size": [0, 0]};

/**
 *
 * @type {cg.RendererBlock|cg.RendererGroup}
 */
cg.RendererNode = {"type": "block"|"group", "id": "", "parent": new cg.RendererGroup, "children": Array, "position": [0, 0], "size": [0, 0]};

cg.d3Nodes = d3.selection();
cg.d3Blocks = d3.selection();
cg.d3Groups = d3.selection();
cg.d3Selection = d3.selection();
cg.d3GroupedSelection = d3.selection();
cg._rendererBlocks = d3.selection();
cg._rendererGroups = d3.selection();

/**
 * Creates an instruction
renderer._cgGraph.addBlock(
    new cg.Instruction(renderer._cgGraph, {
        "cgId": "nullId",
        "cgInputs": [
            {
                "cgType": "Point",
                "cgName": "a",
                "cgValueType": "Number"
            }
        ],
        "cgOutputs": [],
        "cgName": "Hello"
    })
);
**/