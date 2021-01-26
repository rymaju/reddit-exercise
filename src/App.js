import { deepOrange, orange } from '@material-ui/core/colors'
import {
  createMuiTheme,
  CssBaseline,
  ThemeProvider,
  useMediaQuery
} from '@material-ui/core'
import { useState, useEffect } from 'react'

import axios from 'axios'
import { useHistory, useLocation } from 'react-router-dom'

import SearchHeader from './SearchHeader'
import ArticleList from './ArticleList'

// If developing frontend only...
// Set URI to http://localhost:5000 to interface with local backend
const URI = 'https://reddit-stack.herokuapp.com'
// const URI = "http://localhost:5000";

// If running with server, set URI "", which makes links relative
// const URI = "";

const fetchBatchSize = 25

const LOADING_STATE = {
  state: 'isLoading'
}
const ERROR_STATE = {
  state: 'Error',
  msg: 'An error has occured!'
}
const LOADED_STATE = {
  state: 'Loaded',
  data: {}
}

function App () {
  const history = useHistory()
  const { search } = useLocation()

  const query = new URLSearchParams(search)

  const [subreddit, setSubreddit] = useState(query.get('r') || 'news')
  const [timerange, setTimerange] = useState(query.get('t') || 'all')
  const [hasMore, setHasMore] = useState(false)
  const [afterAnchor, setAfterAnchor] = useState(null)
  const [posts, setPosts] = useState(LOADING_STATE)

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const theme = createMuiTheme({
    palette: {
      type: prefersDarkMode ? 'dark' : 'light',
      primary: deepOrange,
      secondary: orange
    }
  })

  const handleSubredditChange = (event) => {
    setSubreddit(event.target.value)
  }

  const handleTimeChange = (event) => {
    setTimerange(event.target.value)
  }
  // eslint-disable-next-line
  useEffect(getPosts, [timerange]) // eslint-disable-line no-eval

  function getPosts () {
    if (!subreddit.match(/^[A-Za-z]([A-Za-z]|[0-9]|-|_)*$/)) {
      setPosts({
        state: 'Error',
        msg: 'Please enter a valid subreddit name.'
      })
      return
    }

    history.push({ search: `?r=${subreddit}&t=${timerange}` })

    setPosts(LOADING_STATE)

    axios
      .get(
        `${URI}/api/posts/${subreddit}?timerange=${timerange}&limit=${fetchBatchSize}`
      )
      .then((response) => {
        console.log(response)
        setPosts({
          ...LOADED_STATE,
          data: response.data.data
        })
        setHasMore(response.data.data.length === fetchBatchSize)
        setAfterAnchor(response.data.after)
      })
      .catch((err) => {
        console.log(err)
        setPosts({
          ...ERROR_STATE,
          msg:
            'An error occurred while loading the data! Please verify the subreddit name and try again!'
        })
      })
  }

  function fetchMoreData () {
    axios
      .get(
        `${URI}/api/posts/${subreddit}?timerange=${timerange}&after=${afterAnchor}&limit=${fetchBatchSize}`
      )
      .then((response) => {
        console.log(response)
        setPosts({
          ...LOADED_STATE,
          data: [...posts.data, ...response.data.data]
        })

        setHasMore(response.data.data.length === fetchBatchSize)
        setAfterAnchor(response.data.after)
      })
      .catch((err) => {
        console.log(err)
        setPosts({
          ...ERROR_STATE,
          msg:
            'An error occurred while loading the data! Please verify the subreddit name and try again!'
        })
      })
  }

  useEffect(() => {
    getPosts()
  // eslint-disable-next-line
  }, [])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className='App'>
        <SearchHeader
          posts={posts}
          subreddit={subreddit}
          timerange={timerange}
          getPosts={getPosts}
          handleSubredditChange={handleSubredditChange}
          handleTimeChange={handleTimeChange}
        />

        <ArticleList
          posts={posts}
          fetchMoreData={fetchMoreData}
          hasMore={hasMore}
        />
      </div>
    </ThemeProvider>
  )
}

export default App
