import React from 'react';

import './video-player.css';

export default function VideoPlayer(props) {
  return (
    <div className='video-thumbnail'>
      <div className='player-wrapper'>
        <iframe
          title='video-thumbnail'
          src={props.url}
          frameBorder={0}
          autoplay={props.autoplay}
          fs={0}
          rel={0}
        />
        <div
          class="invisible-click"
          onClick={() => {console.log('you clicked the invisible div')}}
        >
        </div>
      </div>
    </div>
  );
};
