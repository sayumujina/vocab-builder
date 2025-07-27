// Define the data required for the vocab model
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const vocabSchema = new Schema(
    {
        english: { 
            type: String, 
            required: "Enter an English word" 
        },
        german: { 
            type: String, 
            required: "Enter a German word"
        },
        japanese: {
            type: String,
            required: "Enter a Japanese word"
        }
    },
    {collection: 'vocab'}
);

module.exports = mongoose.model('Vocab', vocabSchema);