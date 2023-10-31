import React, { useState, useEffect} from 'react'
import { NavLink, Routes, Route, useNavigate } from 'react-router-dom'
import Articles from './Articles'
import LoginForm from './LoginForm'
import Message from './Message'
import ArticleForm from './ArticleForm'
import Spinner from './Spinner'
import axios from 'axios'

const articlesUrl = 'http://localhost:9000/api/articles'
const loginUrl = 'http://localhost:9000/api/login'

// const axiosWithAuth = () => {
//   const token = localStorage.getItem('token');
//   return axios.create({
//     headers: {
//       Authorization: token,
//     },
//   });
// };

export default function App() {
  // ✨ MVP can be achieved with these states
  const [message, setMessage] = useState('')
  const [articles, setArticles] = useState([])
  const [currentArticleId, setCurrentArticleId] = useState()
  const [spinnerOn, setSpinnerOn] = useState(false)

  // ✨ Research `useNavigate` in React Router v.6
  const navigate = useNavigate()
  const redirectToLogin = () => {
    navigate('/')
    /* ✨ implement */ }

  const redirectToArticles = () => { 
    navigate('/articles')
    /* ✨ implement */ }

  const logout = () => {
    localStorage.removeItem('token')
    setMessage('Goodbye!')
    redirectToLogin()
    // ✨ implement
    // If a token is in local storage it should be removed,
    // and a message saying "Goodbye!" should be set in its proper state.
    // In any case, we should redirect the browser back to the login screen,
    // using the helper above.
  }

  const login = ({ username, password }) => {
    // ✨ implement
    setMessage('')
    setSpinnerOn(true);

    axios.post('http://localhost:9000/api/login', {username, password})
    .then(res => {
      localStorage.setItem('token', res.data.token);
      redirectToArticles();
      setSpinnerOn(false);
      setMessage(res.data.message)
      
    })
    .catch(err => {
      console.log(err)
    })
    
    
    // We should flush the message state, turn on the spinner
    // and launch a request to the proper endpoint.
    // On success, we should set the token to local storage in a 'token' key,
    // put the server success message in its proper state, and redirect
    // to the Articles screen. Don't forget to turn off the spinner!
  }

  const getArticles = () => {
    // ✨ implement
    setMessage('')
    setSpinnerOn(true);
    const token = localStorage.getItem('token')
    //console.log(token);
    axios.get('http://localhost:9000/api/articles', {
      headers: {
        authorization: token
      }
    })
    .then(res => {
      //console.log(res)
      setArticles(res.data.articles)
      setMessage(res.data.message)
      setSpinnerOn(false);
    })
    .catch(err => {
      if (err.response && err.response.status === 401) {
        redirectToLogin();
      }
      console.log(err)
      setSpinnerOn(false);
    })
    // We should flush the message state, turn on the spinner
    // and launch an authenticated request to the proper endpoint.
    // On success, we should set the articles in their proper state and
    // put the server success message in its proper state.
    // If something goes wrong, check the status of the response:
    // if it's a 401 the token might have gone bad, and we should redirect to login.
    // Don't forget to turn off the spinner!
  }

  const postArticle = (article) => {
    // ✨ implement
    setMessage('')
    setSpinnerOn(true);
    const token = localStorage.getItem('token')
    //console.log(token);
    axios.post('http://localhost:9000/api/articles', article, {
      headers: {
        authorization: token
      }
    })
    .then(res => {
      console.log(res);
      setArticles([...articles, res.data.article])
      setMessage(res.data.message)
      setSpinnerOn(false);
    })
    .catch(err => {
      console.log(err)
      if (err.response && err.response.status === 401) {
         redirectToLogin();
       }
       console.log(err)
      setSpinnerOn(false);
    })
    // The flow is very similar to the `getArticles` function.
    // You'll know what to do! Use log statements or breakpoints
    // to inspect the response from the server.
  }

  const updateArticle = ({ article_id, article }) => {
    setMessage('')
    setSpinnerOn(true);
    const updatedArticle = {
      title: article.title,
      text: article.text,
      topic: article.topic,
    };
    const token = localStorage.getItem('token')
    axios.put(`http://localhost:9000/api/articles/${article_id}`, updatedArticle, {
      headers: {
        authorization: token
      }
    })
    .then(res => {
      console.log(res);
      setSpinnerOn(false);
      //setCurrentArticleId(article_id);
      
      setMessage(res.data.message)
    })
    .catch(err => {
      console.log(err)
      setSpinnerOn(false);
      if (err.response && err.response.status === 401) {
         redirectToLogin();
       }
       console.log(err)
    })
    // ✨ implement
    // You got this!
  }

  const deleteArticle = (article_id) => {
    const token = localStorage.getItem('token');
  
    axios
      .delete(`http://localhost:9000/api/articles/${article_id}`, {
        headers: {
          Authorization: token,
        },
      })
      .then((res) => {
        // Handle the successful deletion, such as removing the article from the state.
        // You can filter the articles array to remove the deleted article.
        setArticles(articles.filter((article) => article.article_id !== article_id));
        setMessage(res.data.message);
      })
      .catch((err) => {
        // Handle any errors, including unauthorized access.
        if (err.response && err.response.status === 401) {
          redirectToLogin();
        } else {
          console.error(err);
        }
      });
  };
  

  return (
    // ✨ fix the JSX: `Spinner`, `Message`, `LoginForm`, `ArticleForm` and `Articles` expect props ❗
    <>
      <Spinner spinnerOn={spinnerOn}/>
      <Message message={message}/>
      <button id="logout" onClick={logout}>Logout from app</button>
      <div id="wrapper" style={{ opacity: spinnerOn ? "0.25" : "1" }}> {/* <-- do not change this line */}
        <h1>Advanced Web Applications</h1>
        <nav>
          <NavLink id="loginScreen" to="/">Login</NavLink>
          <NavLink id="articlesScreen" to="/articles">Articles</NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<LoginForm login={login}/>} />
          <Route path="articles" element={
            <>
              <ArticleForm 
              postArticle={postArticle}
              updateArticle={updateArticle}
              currentArticleID={currentArticleId}
              setCurrentArticleId={setCurrentArticleId}/>
              
              <Articles 
              articles={articles} 
              getArticles={getArticles} 
              redirectToLogin={redirectToLogin}
              updateArticle={updateArticle}
              deleteArticle={deleteArticle}
              currentArticleID={currentArticleId}
              setCurrentArticleId={setCurrentArticleId}
              
              />
            </>
          } />
        </Routes>
        <footer>Bloom Institute of Technology 2022</footer>
      </div>
    </>
  )
}
