const express = require('express');
const router = express.Router();
const libraryController = require('../controllers/libraryController');

router.post('/', libraryController.saveResearch);
router.get('/saved', libraryController.getSavedResearch);
router.delete('/:id', libraryController.deleteResearch);

module.exports = router;
