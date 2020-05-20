import React from 'react';
import {shallow, mount} from 'enzyme';

import Trigger from '../../components/multi-side/trigger';

const props = {
  title: 'testTitle',
  artistName: 'testArtistName'
}

describe('<Trigger />', () => {
    it('Renders without crashing', () => {
      shallow(<Trigger />);
    });
    it('Renders the correct text in first child', () => {
      const wrapper = shallow(<Trigger title={props.title} artistName={props.artistName} />);
      expect(wrapper.childAt(0).text()).toEqual(props.title);
    });
});
