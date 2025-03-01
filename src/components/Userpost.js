import React, { useState } from 'react'
import './style/Userpost.css'

const Userpost = (props) => {

const {post} = props;
const [showMore,setShowmore] = useState(false)
const toggleShowMore = () =>{
  setShowmore(!showMore);
}
  return (
    <div>
      {/* userpost */}
             <div className='Useritem-main-container'>
            <div className="postitem-first-container">
                <div className="postitem-subfirst-container">
                                <ul>
                                <li id='name' ><div className='post-username'>@{post.username}</div><div id='post_time'> Updated {post.time_since_posted}</div></li>
                                
                                </ul>
                </div>

                <div className="postitem-subsecond-container">
                    <ul>
                        <li id='Title'>Need: {post.title}</li>
                        <li id="Category">Category: {post.category}</li>
                        {/* <li id='Title'>Backend Developer</li> */}
                        <li id='Description'>              {showMore
                ? post?.description
                : post?.description?.substring(0, 400)} {/* show first 400 characters */}
              {post?.description?.length > 400 && (
                <span className="read-more" onClick={toggleShowMore}>
                  {showMore ? " Show Less" : "... Read More"}
                </span>
              )}</li>
                        {/* <li id='Description'>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Alias autem, quod aperiam veritatis aspernatur saepe optio magnam libero tenetur asperiores quaerat doloribus labore eligendi blanditiis sapiente. Suscipit dolorem magni exercitationem, quas magnam nam obcaecati! Consectetur consequatur iusto ea explicabo vitae! Et mollitia delectus iste eveniet culpa doloribus qui est recusandae?</li> */}
                    </ul>

                </div>
            </div>
        </div>
    </div>
  )
}

export default Userpost
