exports.initializeMapResource = async (req, res) => {
    let productList = [
        {
            name: "WheatField",
            produce: "wheat",
            demandNameList: ["sickle", "farmer"],
            demandCountList: [1, 1],
            hex_count: 1,
            demandText: "1 sickle, 1 farmer"
        },
        {
            name: "Banana tree",
            produce: "banana",
            demandNameList: ["busket", "farmer"],
            demandCountList: [1, 1],
            hex_count: 1,
            demandText: "1 busket, 1 farmer"
        },
        {
            name: "Olive tree",
            produce: "olive",
            demandNameList: ["busket", "farmer"],
            demandCountList: [1, 1],
            hex_count: 1,
            demandText: "1 busket, 1 farmer"
        }
    ];

    res.json({data: productList, status: true, type: "InitMap"});
}

exports.initializeCommunityInfomation = async (req, res) => {
    let communities = [
        {
            name: "Farmer's villege",
            produce: "farmer",
            demandTileCount: 4,
            points: [{x: 11, y: 13}, {x: 12, y: 13}, {x:12, y:14}, {x:13, y:13}]
        },
        {
            name: "Fisherman's villege",
            produce: "fisherman",
            demandTileCount: 3,
            points: [{x:21, y:7}, {x:22, y:7}, {x:22, y:8}]
        }
    ];

    res.json({data: communities, status: true, type: "CreateCommunity"});
}