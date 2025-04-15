import React, { useEffect } from "react";
import { FeedSection } from "./FeedSection";
import { getFavorites } from "../../fetch/feed";

const FavoritesFeed = (props) => {
  const [posts, setPosts] = React.useState([]);
  const postSearch = props.postSearch;
  const [filteredPosts, setFilteredPosts] = React.useState([]);
  useEffect(() => {
    console.log("Running useEffect");
    getFavorites()
      .then((res) => {
        res.data.sort(
          (a, b) => new Date(b.timeOfCreation) - new Date(a.timeOfCreation)
        );
        setPosts(res.data);
        setFilteredPosts(res.data);
        //console.log(res.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    console.log(postSearch);
    if (postSearch) {
      const filteredPosts = posts.filter((post) =>
        post.caption.toLowerCase().includes(postSearch.toLowerCase())
      );
      console.log(filteredPosts);
      setFilteredPosts(filteredPosts);
    } else {
      setFilteredPosts(posts);
    }
  }, [postSearch, posts]);

  return (
    <div className="flex justify-center items-center">
      <FeedSection posts={filteredPosts} />
    </div>
  );
};

export { FavoritesFeed };
