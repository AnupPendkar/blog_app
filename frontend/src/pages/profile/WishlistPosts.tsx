import { PostViewEnum } from '@models/homepage';
import { IPostDetails } from '@models/post_model';
import { Autocomplete, TextField } from '@mui/material';
import Post from '@pages/shared-comp/posts/Post';
import React from 'react';

interface IWishlistPostsProp {
  data: IPostDetails[];
}

export default function WishlistPosts({ data }: IWishlistPostsProp) {
  return (
    <Autocomplete
      options={data}
      getOptionLabel={(option) => option.title}
      renderOption={(props, option) => <Post postDetails={option} postView={PostViewEnum.TITLE_WITH_IMG} />}
      renderInput={(params) => <TextField {...params} color="primary" variant="outlined" label="Posts" placeholder="Search post title" />}
    />
  );
}
