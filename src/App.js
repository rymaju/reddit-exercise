import styled from "styled-components";

import {
  Container,
  Typography,
  TextField,
  Select,
  List,
  ListItem,
  Avatar,
  ListItemText,
  Divider,
  ListItemAvatar,
  CircularProgress,
  Box,
} from "@material-ui/core";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import InfiniteScroll from "react-infinite-scroll-component";
import { useHistory, useLocation } from "react-router-dom"


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

const NumberOfPostsField = styled(BigTextField)`
  div input {
    width: 3ch;
  }
`;

const SubredditField = styled(BigTextField)`
  div input {
    width: min(17ch, 70vw);
  }
`;
const TimeRangeSelect = styled(Select)`
  select {
    padding-left: 0.5ch;
    padding-right: 0.5ch;
    font-size: 3.75rem;
    color: white; // color of the selected option
    font-weight: 800;
    option {
      color: black; // color of all the other options
      font-weight: 400;
      font-size: 1rem;
    }
  }
`;

function LoadingIndicator() {
  return (
    <ListItem>
      <Box
        display="flex"
        justifyContent="center"
        width="100%"
        color="orangered"
      >
        <CircularProgress />
      </Box>
    </ListItem>
  );
}

function App() {
  const history = useHistory()
  const { search } = useLocation();

  const query = new URLSearchParams(search);

  const [subreddit, setSubreddit] = useState(query.get('r') || "news");
  const [limit, setLimit] = useState(25);
  const [timerange, setTimerange] = useState(query.get('t') || "all");
  const [hasMore, setHasMore] = useState(false);
  const [afterAnchor, setAfterAnchor] = useState(null);
  

  const [posts, setPosts] = useState({
    state: "isLoading",
    data: undefined,
  });

  const handleSubredditChange = (event) => {
    setSubreddit(event.target.value);
  };

  const handleLimitChange = (event) => {
    setLimit(event.target.value);
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

    history.push({search: `?r=${subreddit}&t=${timerange}`})




    setPosts({
      state: "isLoading",
      data: undefined,
    });

    axios
      .get(
        `http://localhost:5000/api/posts/${subreddit}?timerange=${timerange}&limit=${fetchBatchSize}`
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
        //setPosts(response.data);
        console.log(err);
        setPosts({
          state: "Error",
          msg:
            "An error occurred while loading the data! Please verify the subreddit name and try again!",
        });
      });
    //console.log(response.json())
  }

  function fetchMoreData() {
    console.log("fetching more data...");
    axios
      .get(
        `http://localhost:5000/api/posts/${subreddit}?timerange=${timerange}&after=${afterAnchor}&limit=${fetchBatchSize}`
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
    <div className="App">
      <Header>
        <Container maxWidth="md">
          <WhiteText variant="h2">
            The top{" "}
            {posts.state == "Loaded" ? posts.data.length : fetchBatchSize} posts
            from
          </WhiteText>
          <WhiteText variant="h2">
            r/
            <SubredditField
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
            .
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
  );
}

function PostListItem({ href, title, author, score }) {
  function formatScore(redditScore) {
    if (redditScore >= 1000000) {
      return `${(redditScore / 1000000).toFixed(0)}M`;
    } else if (redditScore >= 1000) {
      return `${(redditScore / 1000).toFixed(0)}k`;
    } else {
      return redditScore;
    }
  }

  return (
    <>
      <ListItem button component="a" href={href} target="blank">
        <ListItemAvatar>
          <Typography variant="overline">{formatScore(score)}</Typography>
        </ListItemAvatar>

        <ListItemText primary={title} secondary={`Posted by u/${author}`} />
      </ListItem>
      <Divider variant="inset" component="li" />
    </>
  );
}

export default App;
