const mongoose = require('mongoose');
const Vocab = mongoose.model('Vocab');

// Get all words
exports.getAllWords = (req, res) => {
    Vocab.find({}, (err, words) => {
        if (err) return res.send(err);
        res.json(words);
    });
};

// Create a new word
exports.createWord = (req, res) => {
    const newWord = new Vocab(req.body);
    newWord.save((err, word) => {
        if (err) return res.send(err);
        res.json(word);
    });
};

// Get a word
exports.getWord = (req, res) => {
    Vocab.findById(req.params.wordId, (err, word) => {
        if (err) return res.send(err);
        res.json(word);
    });
};

// Update a word
exports.updateWord = (req, res) => {
    Vocab.findOneAndUpdate(
        { _id: req.params.wordId },
        req.body,
        { new: true },
        (err, word) => {
            if (err) return res.send(err);
            res.json(word);
        }
    );
};

// Delete a word
exports.deleteWord = (req, res) => {
    Vocab.deleteOne({ _id: req.params.wordId }, (err) => {
        if (err) return res.send(err);
        res.json({ 
            message: 'Word successfully deleted', 
            _id: req.params.wordId 
        });
    });
};
        