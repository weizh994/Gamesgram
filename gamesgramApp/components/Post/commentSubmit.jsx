import Context from '@/context/Context';
import { useState, useEffect,useContext } from 'react';
import Image from 'next/image';

const CommentSubmit = ({postID, commentID}) => {

    //Data hooks for user information of logged in user and comment input field
    const {userInfo} = useContext(Context); 
    const [steamid, setSteamid] = useState(null);
    const [avatar, setAvatar] = useState(null);
    const [commentBox, setCommentBox] = useState(null);

    //TODO: replace with userUser state (SWR)
    useEffect(() => {
        if(userInfo && !steamid){
            initFields();
        }
    },[userInfo]);
    const initFields = () => {
        setSteamid(userInfo.steamid);
        setAvatar(userInfo.avatar);
    };

    //Submit function of comment form
    const handleCommentSubmit = async (event) => {

        //Preventing auto refresh
        event.preventDefault();

        //Data structure for comment store procedure
        let commentData = {
        "commentID": commentID,  //ID of the comment. only set in case sent comment is a sub comment
        "authorSteamID": steamid, //Authors steam id
        "postID": postID,   //ID of the post
        "content": commentBox //Content of the comment input
        }; 
        
        //Translate data structure into JSON
        //TODO: REPLACE BY SWR?
        const JSONComment = JSON.stringify(commentData);

        const endpoint = '/api/sendComment';

        const options = {
            method: 'POST',
            headers: {
                'token': localStorage.getItem("token"),
                'Content-Type': 'application/json',
            },
            body: JSONComment,
        };

        const response = await fetch(endpoint, options);
            
        if (!response.ok){
            console.log("error");
        }else{
            //Reset comment box
            document.getElementById("commentInputForm").reset();
            setCommentBox("");
            console.log("success");
        }
    }

    return (
        <>
            <div className="mt-3 d-flex flex-row align-items-center p-3 form-color">
                {avatar ? <Image src={avatar} width={50} height={50} className="rounded-circle mr-2" alt={steamid} /> : null}
                <form id="commentInputForm" onSubmit={handleCommentSubmit}>
                        <input required onChange={(e) => setCommentBox(e.target.value)} value={commentBox} type="text" className="form-control" placeholder="Enter your comment..." id="commentBox"/>
                </form>
            </div>
        </>
    )
}

export default CommentSubmit