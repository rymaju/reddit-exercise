const VALID_TIMERANGE = ['hour', 'today', 'now', 'month', 'week', 'all']
const axios = require('axios')

function validateParams (subreddit, amount, timerange, after) {
  if (!subreddit.match(/^[A-Za-z]([A-Za-z]|[0-9]|-|_)*$/)) {
    throw new Error('Invalid subreddit name')
  }

  if (amount == null || !Number.isInteger(amount) || amount < 1 || amount > 100) {
    throw new Error('Invalid limit. Must be an integer in the range [1,100]')
  }

  if (!VALID_TIMERANGE.includes(timerange)) {
    throw new Error(`Invalid timerange. Must be an one of ${VALID_TIMERANGE}`)
  }

  if (after != null && !after.match(/^t[0-9]_([A-Za-z]|[0-9])+$/)) {
    throw new Error('Invalid after, must be a valid reddit article fullname')
  }
}

async function fetchTopPosts (subreddit, amount, timerange, after) {
  const URL = `https://www.reddit.com/r/${subreddit}/top/.json?t=${timerange}&limit=${amount}&after=${after}`

  try {
    const response = await axios.get(URL)
    return response.data
  } catch (e) {
    throw new Error('Bad response when fetching data from Reddit API.')
  }
}

function sanitizePostData (post) {
  const postData = post.data
  const res = {
    title: postData.title,
    score: postData.score,
    created: postData.created,
    author: postData.author,
    permalink: postData.permalink,
    thumbnail: postData.thumbnail || null
  }

  return res
}

module.exports = { validateParams, fetchTopPosts, sanitizePostData }
