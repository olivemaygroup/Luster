const { Router } = require('express');
const { clientId, clientSecret, redirectUri } = require('../secret');
const controller = require('./controller')

// const router = express.Router();


router.get('/api/spotify-credentials', controller.getCredentials);

router.get('/api/top-artists', controller.getArtists)


module.exports = router;