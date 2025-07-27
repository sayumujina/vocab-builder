const vocabBuilder = require('../controllers/vocabController');

module.exports = (app) => {
    // Define the routes for the vocab builder
    app
        .route('/words')
        .get(vocabBuilder.getAllWords) // Get all words
        .post(vocabBuilder.createWord); // Create a new word
    app
        .route('/words/:wordId')
        .get(vocabBuilder.getWord) // Get a specific word by ID
        .put(vocabBuilder.updateWord) // Update a specific word by ID
        .delete(vocabBuilder.deleteWord); // Delete a specific word by ID
};