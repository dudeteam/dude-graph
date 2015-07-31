/**
 *
 * @type {{type: String, id: String, parent: cg.RendererGroup}}
 */
cg.RendererBlock = {"type": "block", "id": String, "parent": cg.RendererGroup};

/**
 *
 * @type {{type: string, id: String, parent: cg.RendererGroup, children: Array<cg.RendererGroup>}}
 */
cg.RendererGroup = {"type": "group", "id": String, "parent": cg.RendererGroup, "children": Array};

/**
 *
 * @type {cg.RendererBlock|cg.RendererGroup}
 */
cg.RendererNode = {"type": "block"|"group", "id": String, "parent": cg.RendererGroup, "children": Array};