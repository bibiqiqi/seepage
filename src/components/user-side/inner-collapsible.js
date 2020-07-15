import React from 'react';
import {connect} from 'react-redux';

import Thumbnails from '../multi-side/thumbnails';
import './inner-collapsible.css';
import {searchByTag} from '../../actions/content/user-side';

export function UserInnerCollapsible(props) {
  const {content, openState} = props;

  const handleTagQuery = (tag) => {
    props.dispatch(searchByTag(tag.currentTarget.innerText));
  }

  if(openState){
    let tags = [];
    let tag;
    for(let i = 0; i < content.tags.length; i++) {
      if(i < content.tags.length - 1) {
      tag = content.tags[i] + ',';
      } else tag = content.tags[i];
      const tagString =
      <li
       className='tags clickable'
       onClick={handleTagQuery}
       key={i}
      >
      {tag}
      </li>;
      tags.push(tagString);
    }

    const description = () => {
      if (content.description) {
        return (
          <div className='search-results-description'>
            <p>{content.description}</p>;
          </div>
        )
      } else {
        return null
      }
    }

     return (
     <div className='category-line'>
       <Thumbnails
        content={content}
        gallery={true}
        autoplay={0}
       />
        {description()}
       <ul className='tags-container'>
        {tags}
       </ul>
     </div>
     )
  } else {
    return null
  }
}

export default connect()(UserInnerCollapsible);
