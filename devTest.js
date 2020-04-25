const Block = require("./blockchain/block")

const fooBlock = Block.mineBlock(Block.genesis(), "data");
console.log(fooBlock.toString())
console.log(fooBlock);