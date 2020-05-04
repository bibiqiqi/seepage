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
          autoPlay={props.autoplay}
          fs={0}
          rel={0}
        />
        <div className="invisible-click"></div>
      </div>
    </div>
  );
};
