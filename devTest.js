const Block = require("./block")

const fooBlock = Block.mineBlock(Block.genesis(), "data");
console.log(fooBlock.toString())