import styled from 'styled-components'
import {
  Container,
  Typography,
  TextField,
  Select
} from '@material-ui/core'

const Header = styled.header`
padding-top: 3.75em;
padding-bottom: 3.75em;
background: linear-gradient(160deg, #ffa51f 17.46%, #ff450a 78.55%);
height: max(fit-content, 50vh);
`

const WhiteText = styled(Typography)`
color: white;
font-weight: 500;
`

const BigTextField = styled(TextField)`
color: white;

div input {
  font-size: 3.75rem;
  color: white;
  padding: 0;
  border-color: white;
  font-weight: 800;
}
padding-left: 0.5ch;
padding-right: 0.5ch;
`

const SubredditField = styled(BigTextField)`
div input {
  width: min(17ch, 70vw);
}
`
const TimeRangeSelect = styled(Select)`
min-height: 3.75rem;
:before {
  min-height: 3.75rem;
}
select {
  padding-left: 0.5ch;
  padding-right: 0.5ch;
  font-size: 3.75rem;
  line-height: 3.75rem;
  color: white; // color of the selected option
  font-weight: 800;
  option {
    color: black; // color of all the other options
    font-weight: 400;
    font-size: 1rem;
    @media (prefers-color-scheme: dark) {
      color: white;
    }
  }
}
`

function SearchHeader ({ posts, subreddit, timerange, getPosts, handleSubredditChange, handleTimeChange }) {
  const onSubmit = (e) => {
    e.preventDefault()
    getPosts()
  }

  return (
    <Header>
      <Container maxWidth='md'>
        <form onSubmit={onSubmit}>
          <WhiteText variant='h2'>
            The top{' '}
            {posts.state === 'Loaded' ? posts.data.length : ''}{' '}
            posts from
          </WhiteText>
          <WhiteText variant='h2'>
            r/
            <SubredditField
              type='search'
              autoComplete='false'
              id='post-limit'
              value={subreddit}
              onChange={handleSubredditChange}
              onBlur={getPosts}
            />
          </WhiteText>
          <WhiteText variant='h2'>
            of
            <TimeRangeSelect
              native
              value={timerange}
              onChange={handleTimeChange}
            >
              <option value='now'>today</option>
              <option value='week'>this week</option>
              <option value='month'>this month</option>
              <option value='year'>this year</option>
              <option value='all'>all time</option>
            </TimeRangeSelect>
          </WhiteText>
          <input type='submit' id='submitbtn' style={{ display: 'none' }} />
        </form>
      </Container>
    </Header>
  )
}

export default SearchHeader
