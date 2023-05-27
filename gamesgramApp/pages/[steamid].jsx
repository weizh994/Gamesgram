import { useRouter } from 'next/router';

import { useEffect, useState, useContext } from 'react';
import Sidebar from '@/components/Siderbar';
import Profile from '@/components/Profile';
import styles from '@/styles/Home.module.css';
import PostWall from '@/components/PostWall';
import Post from '@/components/Post';
import { Modal } from 'react-bootstrap';

const UserProfile = ({ dataUserInfo, userFollower, userFriends, userPosts }) => { 
  const [userViewInfo,setUserInfo] = useState(dataUserInfo); 
  const [follower,setFollower] = useState(userFollower); 
  const [friends,setFriends] = useState(userFriends); 

  const [mediaPosts,setMediaPosts] = useState(userPosts); 

  const router = useRouter();
  
  //constant for the sidebar selection css which is passed as a prop
  const SidebarSelect = 
                        {home: "nav-link text-white",
                        search: "nav-link text-white",
                        reels: "nav-link text-white",
                        teamMates: "nav-link text-white",
                        profile: "nav-link active",
                        signout: "nav-link text-white"};

  //TODO change mediapost layout
  return (
    <main>
     <div>
      <Modal
        show={!!router.query.postID}
        size="lg"
        onHide={() => router.push(`/${userViewInfo[0].steamid}`, undefined, { scroll: false })}
        //contentLabel="Post modal"
      >
      <Modal.Header>Details</Modal.Header>  
      <Modal.Body>

          <Post postID={router.query.postID} urlPost={router.query.urlPost} pathname={router.pathname} />
        
      </Modal.Body>
      </Modal>
    </div> 

    <div className={styles.main}>
        <div className={styles.one}><Sidebar selection={SidebarSelect}/></div>
        <div><Profile userInfo={userViewInfo[0]} follower={follower} friends={friends}/></div>
    </div>
    <div>
      {mediaPosts&&userViewInfo ? <PostWall userInfo={userViewInfo[0]} media={mediaPosts} />: "No posts available"}:
    </div>
</main>
  );
};

export default UserProfile;

export async function getStaticPaths(){


  const res = await fetch("http://127.0.0.1:5001/getUsers");
  const users = await res.json();
 
  const paths = users.map((steamid) => ({
      params: { steamid: steamid.toString()},
  }));

  return {paths, fallback: false}; //fallback true in case the page never has been rendered
}

export async function getStaticProps( { params } ){
  
  //Notice: Don't fetch the server directly, use api interface
  const resuserInfo = await fetch(`http://127.0.0.1:5001/GetUserInfo/${params.steamid}`);
  const resposts = await fetch(`http://127.0.0.1:5001/getPosts/${params.steamid}`);
  const refollows = await fetch(`http://127.0.0.1:5001/getFollowers/${params.steamid}`);
  const refriends = await fetch(`http://127.0.0.1:5001/GetFriendList/${params.steamid}`);

  const dataUserInfoJ = await resuserInfo.json();
  const posts = await resposts.json();
  const follower = await refollows.json();
  const friends = await refriends.json();

  const dataUserInfo = dataUserInfoJ.response.players;
  
  return {
    props: {
      key: params.steamid,
      dataUserInfo: dataUserInfo,
      userFollower: follower,
      userFriends: friends,
      userPosts: posts
    }
  };
}

