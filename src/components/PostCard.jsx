import { BadgeCheck } from 'lucide-react'
import moment from 'moment'
import React from 'react'

const PostCard = ({ post }) => {
  return (
    <div>
      <div>
        <img src={post.user.profile_picture} alt="" />

        <div>
          <span>{post.user.full_name}</span>
          <BadgeCheck />
        </div>

        <div>
          @{post.user.username} ⦁ {moment(post.createdAt).fromNow()}
        </div>
      </div>
    </div>
  );
};
export default PostCard