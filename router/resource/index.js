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