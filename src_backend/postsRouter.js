const router = require('express').Router()
const { validateParams, fetchTopPosts, sanitizePostData } = require('./APIUtils')

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
