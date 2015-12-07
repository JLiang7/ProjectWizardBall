var MapInfo = {
	levelOne: {
		spawnLocations: [{x: 6, y: 1}, {x: 16, y: 1}, {x: 6, y: 6}, {x: 16, y: 6}],
		collisionTiles: [127, 361],
		groundLayer: "Ground",
		blockLayer: "Blocks",
		tilesetName: "tiles",
		tilesetImage: "tiles",
		destructibleTileId: 361
	},
	levelTwo: {
		spawnLocations: [{x: 1, y: 1}, {x: 16, y: 1}, {x: 2, y: 7}, {x: 16, y: 7}],
		collisionTiles: [169, 191],
		groundLayer: "Ground",
		blockLayer: "Blocks",
		tilesetName: "tiles",
		tilesetImage: "tiles",
		destructibleTileId: 191
	}
};

module.exports = MapInfo;