const express = require('express');
const router = express.Router();
const researchController = require('../controllers/researchController');

router.get('/', researchController.performResearch);
router.get('/company', researchController.performCompanyAnalysis);
router.get('/competitors', researchController.performCompetitorAnalysis);

module.exports = router;
