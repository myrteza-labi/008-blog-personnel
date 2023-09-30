import React, {useState, useEffect} from 'react'; 
import axios from "axios"; 

const App = () => {
  
  const [formData, setFormData] = useState({
    name: "", 
    content: "", 
    createdAt: "", 
    updatedAt: null
  })
  const [articleToUpdate, setArticleToUpdate] = useState(null); 

  const [showUpdateInput, setShowUpdateInput] = useState(false); 

  const [articles, setArticles] = useState([]); 

  useEffect(() => {
    fetchData(); 
  }, [])
  
  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/articles'); 
      setArticles(response.data); 
    }
    catch (error) {
      console.error("Erreur lors de la récupération des articles"); 
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      setFormData(data => ({
        ...data, 
        createdAd: new Date(),
      }))
      await axios.post('http://localhost:5000/articles', formData); 
      fetchData();
      setFormData({
        name: "", 
        content: "", 
        createdAt: "", 
        updatedAt: null
      })
    }
    catch (error) {
      console.error("Erreur lors de l'envoi du formulaire"); 
    }; 
  }; 

  const deleteArticle = async (articleId) => {
    try {
      await axios.delete(`http://localhost:5000/articles/${articleId}`); 
      fetchData(); 
    }
    catch (error) {
      console.error("Erreur lors de la suppression de l'article")
    }
  }

  const updateArticle =  (articleId) => {
      setShowUpdateInput(true);
      getArticleById(articleId); 
  }

  const getArticleById = async (articleId) => {
    try {
      const response = await axios.get(`http://localhost:5000/articles/${articleId}`); 
      const articleData = response.data; 
      setArticleToUpdate(articleData); 
    }
    catch(error) {
      console.error("Erreur lors de la récupération de l'article"); 
    }
  }

  const cancelModification = () => {
    setShowUpdateInput(false); 
    setArticleToUpdate(null); 
  }
   
  const postUpdates = async (articleId) => {
    try {
      const response = await axios.put(`http://localhost:5000/articles/${articleId}`, articleToUpdate); 
      fetchData(); 
      setArticleToUpdate(null); 

      console.log(response); 
    }
    catch (error) {
      console.error("Erreur lors de la modification de la ")
    }
  }


  return (
    <div>
      <h1>Blog personnel - Entrainement fullstack n°3</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="title">Titre</label>
        <input 
          name="title" 
          type="text"
          required={true}
          onChange={e => setFormData(data => ({
            ...data, name: e.target.value
          }))}
          value={formData.name}
        />
        <br/>
        <label htmlFor="content">Contenu</label>
        <textarea 
          name="content"
          required={true}
          onChange={e => setFormData(data => ({
            ...data, content: e.target.value
          }))}
          value={formData.content}
        >
        </textarea>
        <br/>
        <input 
          type="submit" 
          value="Enregistrer l'article"
        />
      </form>
      {
        articles.length > 0 &&
        articles.map(article => (
          <div key={article._id}>
            <p>Titre de l'article : {article.name}</p>
            <p>Contenu de l'article : {article.content}</p>
            <p>Article créer le : {article.createdAt}</p>
            {article.updatedAt && <p>Article mis à jour le {article.updatedAt}</p>}
            <button onClick={() => deleteArticle(article._id)}>Supprimer l'article</button>
            <button onClick={() => updateArticle(article._id)}>Modifier l'article</button>
            {
              articleToUpdate && articleToUpdate._id === article._id && 
              <div>
                <div>
                  <label htmlFor="name">Nom de l'article : </label>
                  <input 
                    name="name"
                    type="text"
                    value={articleToUpdate.name}
                    onChange={(e) => setArticleToUpdate(prevData => ({
                      ...prevData, 
                      name: e.target.value, 
                      updatedAt: new Date()
                    }))}
                  />
                </div>
                <div>
                  <label htmlFor="content">Contenu de votre article</label>
                <input 
                  name="content"
                  type="text"
                  value={articleToUpdate.content}
                  onChange={(e) => setArticleToUpdate(prevData => ({
                    ...prevData, 
                    content: e.target.value,
                    updatedAt: new Date()
                  }))}
                />
                </div>
                  <div>
                      <button onClick={() => postUpdates(article._id)}>Enregistrer les modification</button>
                      <button onClick={cancelModification}>Annuler</button>
                  </div>
              </div>
            }
          </div>
        ))
      }
    </div>
  )
}

export default App; 