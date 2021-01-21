import styled from "styled-components";
import { deepOrange, orange } from "@material-ui/core/colors";
import {
  Container,
  Typography,
  TextField,
  Select,
  List,
  ListItem,
  ListItemText,
  Divider,
  ListItemAvatar,
  CircularProgress,
  Box,
  Card,
  CardContent,
  createMuiTheme,
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
  IconButton ,
  CardMedia,
  Hidden,
} from "@material-ui/core";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { useHistory, useLocation } from "react-router-dom";
import RedditIcon from '@material-ui/icons/Reddit';
// If developing frontend only...
// Set URI to http://localhost:5000 to interface with local backend
const URI = "https://reddit-stack.herokuapp.com";
//const URI = "http://localhost:5000";

// If running with server, set URI "", which makes links relative
//const URI = "";

const fetchBatchSize = 25;

const Header = styled.header`
  padding-top: 3.75em;
  padding-bottom: 3.75em;
  background: linear-gradient(160deg, #ffa51f 17.46%, #ff450a 78.55%);
  height: max(fit-content, 50vh);
`;

const WhiteText = styled(Typography)`
  color: white;
  font-weight: 500;
`;

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
`;

const SubredditField = styled(BigTextField)`
  div input {
    width: min(17ch, 70vw);
  }
`;
const TimeRangeSelect = styled(Select)`
  min-height: 3.75rem;
  :before {
    min-height: 3.75rem;
  }
  select {
    font-family: inherit;
    padding-left: 0.5ch;
    padding-right: 0.5ch;
    font-size: 3.75rem;
    line-height: 3.75rem;
    color: white; // color of the selected option
    font-weight: 800;
    option {
      font-family: inherit;
      color: black; // color of all the other options
      font-weight: 400;
      font-size: 1rem;
    }
  }
`;

const LoadingIndicatorListItem = styled(ListItem)`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 120px;
`;


function LoadingIndicator() {
  return (
    <LoadingIndicatorListItem>
      <CircularProgress />
    </LoadingIndicatorListItem>
  );
}

function App() {
  const history = useHistory();
  const { search } = useLocation();

  const query = new URLSearchParams(search);

  const [subreddit, setSubreddit] = useState(query.get("r") || "news");
  const [timerange, setTimerange] = useState(query.get("t") || "all");
  const [hasMore, setHasMore] = useState(false);
  const [afterAnchor, setAfterAnchor] = useState(null);

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = createMuiTheme({
    palette: {
      type: prefersDarkMode ? "dark" : "light",
      primary: deepOrange,
      secondary: orange,
    },
  });

  const [posts, setPosts] = useState({
    state: "isLoading",
    data: undefined,
  });

  const handleSubredditChange = (event) => {
    setSubreddit(event.target.value);
  };

  const handleTimeChange = (event) => {
    setTimerange(event.target.value);
  };
  useEffect(getPosts, [timerange]);

  const onKeyPress = (ev) => {
    if (ev.key === "Enter") {
      getPosts();
    }
  };

  function getPosts() {
    if (!subreddit.match(/^([A-Za-z]|[0-9]|-|_)+$/)) {
      setPosts({
        state: "Error",
        msg: "Please enter a valid subreddit name.",
      });
      return;
    }

    history.push({ search: `?r=${subreddit}&t=${timerange}` });

    setPosts({
      state: "isLoading",
      data: undefined,
    });

    axios
      .get(
        `${URI}/api/posts/${subreddit}?timerange=${timerange}&limit=${fetchBatchSize}`
      )
      .then((response) => {
        console.log(response);
        setPosts({
          state: "Loaded",
          data: response.data.data,
        });
        setHasMore(response.data.data.length === fetchBatchSize);
        setAfterAnchor(response.data.after);
      })
      .catch((err) => {
        console.log(err);
        setPosts({
          state: "Error",
          msg:
            "An error occurred while loading the data! Please verify the subreddit name and try again!",
        });
      });
  }

  function fetchMoreData() {
    console.log("fetching more data...");
    axios
      .get(
        `${URI}/api/posts/${subreddit}?timerange=${timerange}&after=${afterAnchor}&limit=${fetchBatchSize}`
      )
      .then((response) => {
        console.log(response);
        setPosts({
          state: "Loaded",
          data: [...posts.data, ...response.data.data],
        });

        setHasMore(response.data.data.length === fetchBatchSize);
        setAfterAnchor(response.data.after);
      })
      .catch((err) => {
        //setPosts(response.data);
        console.log(err);
        setPosts({
          state: "Error",
          msg:
            "An error occurred while loading the data! Please verify the subreddit name and try again!",
        });
      });
  }

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <Header>
          <Container maxWidth="md">
            <WhiteText variant="h2">
              The top{" "}
              {posts.state === "Loaded" ? posts.data.length : fetchBatchSize}{" "}
              posts from
            </WhiteText>
            <WhiteText variant="h2">
              r/
              <SubredditField
                type="search"
                autoComplete='false'
                id="post-limit"
                value={subreddit}
                onChange={handleSubredditChange}
                onKeyPress={onKeyPress}
              />
            </WhiteText>
            <WhiteText variant="h2">
              of
              <TimeRangeSelect
                native
                value={timerange}
                onChange={handleTimeChange}
              >
                <option value={"now"}>today</option>
                <option value={"week"}>this week</option>
                <option value={"month"}>this month</option>
                <option value={"year"}>this year</option>
                <option value={"all"}>all time</option>
              </TimeRangeSelect>
            </WhiteText>
            {/* <Button onClick={getPosts}>
            Search!
          </Button> */}
          </Container>
        </Header>

        <Container maxWidth="md">
          {posts.state === "Loaded" ? (
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
                    href={"https://reddit.com" + post.permalink}
                    target="blank"
                  />
                ))}
              </List>
            </InfiniteScroll>
          ) : posts.state === "Error" ? (
            <p>{posts.msg}</p>
          ) : (
            <LoadingIndicator />
          )}
        </Container>
      </div>
    </ThemeProvider>
  );
}


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
`;

const PostListItemBody = styled(ListItem)`
  min-height: 100px;
  :visited {
    color: ${deepOrange[500]};
  }
`;
function formatScore(redditScore) {
  if (redditScore >= 1000000) {
    return `${(redditScore / 1000000).toFixed(0)}M`;
  } else if (redditScore >= 1000) {
    return `${(redditScore / 1000).toFixed(0)}k`;
  } else {
    return redditScore;
  }
}
function PostListItem({ href, title, author, score, thumbnail, }) {


  return (
    <>
      <PostListItemBody button component="a" href={href} target="_blank">
        

        <Hidden xsDown>
        <ListItemAvatar>
          <Typography variant="overline">{formatScore(score)}</Typography>
          
        </ListItemAvatar>
        </Hidden>

      
        <ListItemText primary={title} secondary={`Posted by u/${author}`} />
        {thumbnail &&
          thumbnail !== "self" &&
          (thumbnail === "nsfw" ? (
            <TextPlaceholder>
              <Typography color="primary" variant="overline">
                NSFW
              </Typography>
            </TextPlaceholder>
          ) : 
          (thumbnail === "spoiler" ? (
              <TextPlaceholder>
                <Typography color="primary" variant="overline">
                  SPOILER
                </Typography>
              </TextPlaceholder>
            ) : thumbnail.startsWith('http') && (
           <ListImageRight src={thumbnail} />
          )))}
      </PostListItemBody>
      <Divider variant="inset" component="li" />
    </>
  );
}

export default App;
