import React from 'react';
import {shallow, mount} from 'enzyme';

import VideoPlayer from '../../components/multi-side/video-player';

const props = {
  autoplay: 1,
  url: 'https://www.youtube.com/embed/kZ0Wh2CayH8'
}

describe('<VideoPlayer />', () => {
    it('Renders without crashing', () => {
      shallow(<VideoPlayer autoplay={props.autoplay} url={props.url} />);
    });
    it('Renders the correct video', () => {
      const wrapper = shallow(<VideoPlayer autoplay={props.autoplay} url={props.url} />);
      expect(wrapper.find('iframe').prop('src')).toEqual(props.url)
    });
});
