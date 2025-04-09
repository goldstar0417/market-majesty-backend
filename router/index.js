const router = require('express').Router();
const Resource = require('./resource');

//resource api
router.get("/resource/init", Resource.initializeMapResource);

module.exports = router;