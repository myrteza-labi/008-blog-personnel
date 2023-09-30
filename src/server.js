const express = require('express'); 
const cors = require('cors'); 
const bodyParser = require('body-parser'); 
const mongoose = require('mongoose'); 

const app = express(); 

app.use(cors()); 
app.use(bodyParser.json()); 

const PORT = 5000; 

const db = mongoose.connection; 
const dbConfig = {
    useNewUrlParser : true, 
    useUnifiedTopology: true
}

const dbUri = "mongodb://localhost/personalblog"; 

mongoose.connect(dbUri, dbConfig); 

db.once('open', () => {
    console.log("Connexion à mongoDB réussi");
});

db.once("close", () => {
    console.log("Déconnexion de mongodb"); 
}); 

db.on("error", () => {
    console.error("Une erreur liée à mongoDB est survenu"); 
}); 

const articlesSchema = mongoose.Schema({
    name: String, 
    content: String, 
    createdAt: String, 
    updatedAt: {
        default: null, 
        type: String
    }
})

const Article = mongoose.model('Article', articlesSchema); 

app.get('/articles', async (req,res) => {
    try {
        const response = await Article.find(); 
        res.status(200).json(response); 
    }
    catch(error) {
        res.status(500).json({
            message: "Erreur lors de la récupération des articles", 
            error: error
        })
    }
})

app.get('/articles/:articleId', async (req,res) => {
    try {
        const {articleId} = req.params; 
        const response = await Article.findById(articleId); 
        res.status(200).json(response);
    }
    catch (error) {
        res.status(500).json({
            message: "Erreur lors de la récup&ration de l'article", 
            error : error
        })
    }
})

app.put('/articles/:articleId', async (req,res) => {
    try {
        const {articleId} = req.params; 
        const updates = req.body; 
        const response = await Article.findByIdAndUpdate(articleId, updates); 
        res.status(200).json({
            message: "Article mis à jour avec succès", 
            response: response
        })
    }
    catch (error) {
        res.status(500).json({
            message: "Erreur lors de la modification de l'article", 
            error: error
        })
    }
})

app.post('/articles', async (req,res) => {
    try {
        const article = new Article(req.body); 
        response = await article.save(); 
        res.status(201).json({
            message: "Article créé avec succès", 
            response: response
        })
    }
    catch (error) {
        res.status(500).json({
            message: "Erreur lors de la création de l'article", 
            error: error
        })
    }
})

app.delete('/articles/:articleId', async (req,res) => {
    try {
        const {articleId} = req.params; 
        const response = await Article.findByIdAndDelete(articleId); 
        res.status(200).json({
            message: "Article supprimé avec succes", 
            response: response
        })
    }
    catch (error) {
        res.status(500).json({
            message: "Erreur lors de la suppression de l'article", 
            error: error
        })
    }
})

app.listen(PORT, () => {
    console.log(`Serveur en cours d'éxécution sur le port ${PORT}`); 
}); 



