# Graph

TODO: Description
cg.Graph

# Blocks

TODO: Description
cg.Block

# Points

Either in input or output

Use block.addInput or block.addOutput to add a new point,
The base class of a point is cg.Point

A point has only one type at a time, but can accept a finite number of types if needed (template)
A point is configured to accept/emit one or many connections to another point
A point is configured to accept/emit to certain types only (Boolean, Number, Stream, Sound, ...)

# Connections

A connection is a "link" between two points
cg.Connection