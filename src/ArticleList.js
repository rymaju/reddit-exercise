import styled from 'styled-components'
import { deepOrange } from '@material-ui/core/colors'
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemAvatar,
  CircularProgress,
  Hidden
} from '@material-ui/core'
import InfiniteScroll from 'react-infinite-scroll-component'
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline'

const ErrorContainer = styled.div`
  display: flex;
  min-height: 120px;
  align-items: center;
`
const ErrorIcon = styled(ErrorOutlineIcon)`
  color: ${deepOrange[500]};
  font-size: 40px;
  margin: 10px;
`
const LoadingIndicatorListItem = styled(ListItem)`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 120px;
`

const TextPlaceholder = styled.div`
  height: 100px;
  width: 100px;
  margin-left: 1em;
  display:flex;
  justify-content: center;
  align-items: center;
`

const ListImageRight = styled.img`
  height: 100px;
  width: 100px;
  object-fit: cover;
  display: block;
  margin-left: 1em;
`

const PostListItemBody = styled(ListItem)`
  min-height: 100px;
  :visited {
    color: ${deepOrange[500]};
  }
`
function formatScore (redditScore) {
  if (redditScore >= 1000000) {
    return `${(redditScore / 1000000).toFixed(0)}M`
  } else if (redditScore >= 1000) {
    return `${(redditScore / 1000).toFixed(0)}k`
  } else {
    return redditScore
  }
}
function PostListItem ({ href, title, author, score, thumbnail }) {
  return (
    <>
      <PostListItemBody button component='a' href={href} target='_blank'>

        <Hidden xsDown>
          <ListItemAvatar>
            <Typography variant='overline'>{formatScore(score)}</Typography>

          </ListItemAvatar>
        </Hidden>

        <ListItemText primary={title} secondary={`Posted by u/${author}`} />
        {thumbnail &&
          thumbnail !== 'self' &&
          (thumbnail === 'nsfw' ? (
            <TextPlaceholder>
              <Typography color='primary' variant='overline'>
                NSFW
              </Typography>
            </TextPlaceholder>
          )
            : (thumbnail === 'spoiler' ? (
              <TextPlaceholder>
                <Typography color='primary' variant='overline'>
                  SPOILER
                </Typography>
              </TextPlaceholder>
              ) : thumbnail.startsWith('http') && (
                <ListImageRight src={thumbnail} />
              )))}
      </PostListItemBody>
      <Divider variant='inset' component='li' />
    </>
  )
}

function LoadingIndicator () {
  return (
    <LoadingIndicatorListItem>
      <CircularProgress />
    </LoadingIndicatorListItem>
  )
}
function ArticleList ({ posts, fetchMoreData, hasMore }) {
  return (
    <Container maxWidth='md'>
      {posts.state === 'Loaded' ? (
        <InfiniteScroll
          dataLength={posts.data.length}
          next={fetchMoreData}
          hasMore={hasMore}
          loader={<LoadingIndicator />}
        >
          <List>
            {posts.data.map((post, i) => (
              <PostListItem
                key={i}
                title={post.title}
                author={post.author}
                score={post.score}
                thumbnail={post.thumbnail}
                href={'https://reddit.com' + post.permalink}
                target='blank'
              />
            ))}
          </List>
        </InfiniteScroll>
      ) : posts.state === 'Error' ? (
        <ErrorContainer>
          <ErrorIcon fontSize='large' /> <Typography variant='body1'>{posts.msg}</Typography>
        </ErrorContainer>
      ) : (
        <LoadingIndicator />
      )}
    </Container>
  )
}

export default ArticleList
