import React from 'react';

import Thumbnails from '../multi-side/thumbnails';

export default function UserInnerCollapsible(props) {
  const {content, openState} = props;

  if(openState){
    let tags = '';
    for(let i = 0; i < content.tags.length; i++) {
      if(i === content.tags.length - 2) {
        tags += content.tags[i] + ','
      } else tags += content.tags[i]
    }
     return (
     <div className='category-line'>
       <Thumbnails
        content={content}
        gallery={true}
       />
       <p className='tags' >{tags}</p>
     </div>
     )
  } else {
    return null
  }
}
