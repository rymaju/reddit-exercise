const router = require('express').Router()
const fetch = require('node-fetch')

async function fetchTopPosts(subreddit, amount, timerange, after) {
    const URL = `https://www.reddit.com/r/${subreddit}/top/.json?t=${timerange}&limit=${amount}&after=${after}`

    const response = await fetch(URL)

    if(response.ok) {
        return response.json()
    }
    else {
        throw new Error("Bad response when fetching data from Reddit API.")
    }

}

function sanitizePostData(post) {
    const postData = post.data
    let res = {
        title: postData.title,
        score: postData.score,
        created: postData.created,
        author: postData.author,
        permalink: postData.permalink
    }

    if (postData.thumbnail.length > 0) {
        res.thumbnail = postData.thumbnail
    }

    return res
}

router.route('/:subreddit').get(async (req, res) => {
  const subreddit = req.params.subreddit
  const limit = req.query.limit || 20
  const timerange = req.query.timerange || 'all'
  const after = req.query.after || null
  
  try {
    const rawData = await fetchTopPosts(subreddit, limit, timerange, after)

    const dataArray = rawData.data.children

    const sanitizedData = dataArray.map(sanitizePostData)

    res.status(200).json({ data: sanitizedData, after: rawData.data.after}).end()

  }
  catch(e) {
    res
    .status(400)
    .json({error: e.message})
    .end()
  }

  
})



module.exports = router