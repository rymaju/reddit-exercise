const router = require('express').Router()
const fetch = require('node-fetch')

const VALID_TIMERANGE = ['hour', 'today', 'now', 'month', 'week', 'all']

function validateParams (subreddit, amount, timerange, after) {
  if (!subreddit.match(/^([A-Za-z]|[0-9]|-|_)+$/)) {
    throw new Error('Invalid subreddit name')
  }

  if (amount < 1 || amount > 100) {
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

  const response = await fetch(URL)

  if (response.ok) {
    return response.json()
  } else {
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

router.route('/:subreddit').get(async (req, res) => {
  const subreddit = req.params.subreddit
  const limit = Number(req.query.limit) || 20
  const timerange = req.query.timerange || 'all'
  const after = req.query.after || null

  try {
    validateParams(subreddit, limit, timerange, after)

    const rawData = await fetchTopPosts(subreddit, limit, timerange, after)

    const dataArray = rawData.data.children

    const sanitizedData = dataArray.map(sanitizePostData)

    res.status(200).json({ data: sanitizedData, after: rawData.data.after }).end()
  } catch (e) {
    res
      .status(400)
      .json({ error: e.message })
      .end()
  }
})

module.exports = router
