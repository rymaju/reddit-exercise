/* eslint-env jest */
const { validateParams, fetchTopPosts, sanitizePostData } = require('./APIUtils')

test('validateParams works with nice parameters', () => {
  expect(() => validateParams('news', 21, 'today', 't3_l56mtd')).not.toThrow()
})

test('validateParams works with default parameters', () => {
  expect(() => validateParams('subreddit', 20, 'all', null)).not.toThrow()
})

test('validateParams throws on bad subreddit names', () => {
  expect(() => validateParams('21893', 20, 'all', null)).toThrow()
  expect(() => validateParams('--_--_--', 20, 'all', null)).toThrow()
  expect(() => validateParams('.', 20, 'all', null)).toThrow()
  expect(() => validateParams('0_COOL', 20, 'all', null)).toThrow()
})

test('validateParams amount edge cases work correctly', () => {
  expect(() => validateParams('subreddit', 1, 'all', null)).not.toThrow()
  expect(() => validateParams('subreddit', 100, 'all', null)).not.toThrow()
  expect(() => validateParams('subreddit', 0, 'all', null)).toThrow()
  expect(() => validateParams('subreddit', 101, 'all', null)).toThrow()
})

test('validateParams throws on invalid amounts', () => {
  expect(() => validateParams('subreddit', null, 'all', null)).toThrow()
  expect(() => validateParams('subreddit', -1, 'all', null)).toThrow()
  expect(() => validateParams('subreddit', 4.23, 'all', null)).toThrow()
  expect(() => validateParams('subreddit', 10000, 'all', null)).toThrow()
})

test('validateParams accepts all timeranges', () => {
  expect(() => validateParams('subreddit', 20, 'all', null)).not.toThrow()
  expect(() => validateParams('subreddit', 20, 'week', null)).not.toThrow()
  expect(() => validateParams('subreddit', 20, 'month', null)).not.toThrow()
  expect(() => validateParams('subreddit', 20, 'now', null)).not.toThrow()
  expect(() => validateParams('subreddit', 20, 'today', null)).not.toThrow()
  expect(() => validateParams('subreddit', 20, 'hour', null)).not.toThrow()
})

test('validateParams throws on invalid timeranges', () => {
  expect(() => validateParams('subreddit', 20, 'later', null)).toThrow()
  expect(() => validateParams('subreddit', 20, 'decade', null)).toThrow()
  expect(() => validateParams('subreddit', 20, null, null)).toThrow()
})

test('validateParams works when after is a good fullname', () => {
  expect(() => validateParams('subreddit', 20, 'all', 'my_username')).toThrow()
  expect(() => validateParams('subreddit', 20, 'all', 0)).toThrow()
  expect(() => validateParams('subreddit', 20, 'all', 'g3_s213')).toThrow()
})

test('validateParams throws on invalid after fullname', () => {
  expect(() => validateParams('subreddit', 20, 'all', 'my_username')).toThrow()
  expect(() => validateParams('subreddit', 20, 'all', 0)).toThrow()
  expect(() => validateParams('subreddit', 20, 'all', 'g3_s213')).toThrow()
})

test('fetchTopPosts works on nice parameters', async () => {
  expect((await fetchTopPosts('news', 3, 'all', null)).data.children).toHaveLength(3)
  expect((await fetchTopPosts('pics', 5, 'all', null)).data.children).toHaveLength(5)
})

test('fetchTopPosts works on default parameters', async () => {
  expect((await fetchTopPosts('news', 20, 'all', null)).data.children).toHaveLength(20)
})

test('fetchTopPosts throws on unknown/banned subreddits', async () => {
  await expect(fetchTopPosts('pp', 20, 'all', null)).rejects.toThrow()
})

test('sanitizePostData cleans reddit posts', () => {
  const examples = require('./example-data.json').data.children

  expect(sanitizePostData(examples[0])).toStrictEqual({
    title: 'Harvard and MIT sue ICE over threat to remove international students who are only taking online classes',
    score: 8049,
    created: 1594243066,
    author: 'lonelypeaches3',
    permalink: '/r/college/comments/hngw7d/harvard_and_mit_sue_ice_over_threat_to_remove/',
    thumbnail: 'https://b.thumbs.redditmedia.com/9gJ7gKcjNv9fq1tuPrMeg1sE9jEy7ajFwJRA74mWmjY.jpg'
  })
  expect(sanitizePostData(examples[1])).toStrictEqual({
    title: "Professor learned my mom died 6 months ago and wrote me this letter. The last 2 sentences... I'm crying",
    score: 7713,
    created: 1512016286,
    author: 'madz43211',
    permalink: '/r/college/comments/7ggf3v/professor_learned_my_mom_died_6_months_ago_and/',
    thumbnail: 'https://b.thumbs.redditmedia.com/hdNJzYHITlx5V2-UG7qfNNsOLpd1kif7iCXtV5UaNso.jpg'
  })
  expect(sanitizePostData(examples[2])).toStrictEqual({
    title: '(Serious question) Can anyone tell me why this happens? Give me psychology, biology, anything, please! It seems almost universal that the moment you hit college, a forever exhaustion hits. Any ideas?',
    score: 7381,
    created: 1593308603,
    author: 'chuck-hunter-chuck',
    permalink: '/r/college/comments/hgxvuw/serious_question_can_anyone_tell_me_why_this/',
    thumbnail: 'https://b.thumbs.redditmedia.com/c1sQ-g0AGmvfoAC15DwATOTma5wgaDgeVuzaq3KWJkU.jpg'
  })
})
