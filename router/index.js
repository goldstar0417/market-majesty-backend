const router = require('express').Router();
const Resource = require('./resource');

//resource api
router.get("/resource/init", Resource.initializeMapResource);
router.get("/resource/createcommunity", Resource.initializeCommunityInfomation);

module.exports = router;