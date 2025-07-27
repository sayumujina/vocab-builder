const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Import vocab model and routes
global.Vocab = require('./api/modules/vocabModel');
const routes = require('./api/routes/vocabRoutes');

// Database connection
mongoose.Promise = global.Promise;
mongoose.connect(`mongodb+srv://sayumujinaVocabBuilder:naZuna2309@vocabbuilder.ebnhtjp.mongodb.net/COMP1842LeHoang?retryWrites=true&w=majority&appName=vocabBuilder`);

// Specifies port
const port = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Initialize routes
routes(app);

// Start the server
app.listen(port);

app.get('/', (req, res) => {
    res.send('Hello, World!');
});

console.log(`Server started on port`, port)