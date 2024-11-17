const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 9000;

// Middleware
app.use(bodyParser.json());

// Load Articles
let articles = require('./articles.json');

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the Article API!');
});

// Get all articles
app.get('/api/articles', (req, res) => {
    res.json(articles);
});

// Get a specific article by ID
app.get('/api/articles/:id', (req, res) => {
    const article = articles.find(a => a.id === parseInt(req.params.id));
    if (!article) return res.status(404).json({ message: 'Article not found' });
    res.json(article);
});

// Add a new article
app.post('/api/articles', (req, res) => {
    const { title, content } = req.body;
    const newArticle = {
        id: articles.length + 1,
        title,
        content
    };
    articles.push(newArticle);

    // Save articles to JSON file
    fs.writeFileSync('./articles.json', JSON.stringify(articles, null, 2));
    res.status(201).json(newArticle);
});

// Update an article
app.put('/api/articles/:id', (req, res) => {
    const article = articles.find(a => a.id === parseInt(req.params.id));
    if (!article) return res.status(404).json({ message: 'Article not found' });

    const { title, content } = req.body;
    article.title = title || article.title;
    article.content = content || article.content;

    // Save articles to JSON file
    fs.writeFileSync('./articles.json', JSON.stringify(articles, null, 2));
    res.json(article);
});

// Delete an article
app.delete('/api/articles/:id', (req, res) => {
    const articleIndex = articles.findIndex(a => a.id === parseInt(req.params.id));
    if (articleIndex === -1) return res.status(404).json({ message: 'Article not found' });

    const deletedArticle = articles.splice(articleIndex, 1);
    fs.writeFileSync('./articles.json', JSON.stringify(articles, null, 2));
    res.json(deletedArticle);
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
