import React from 'react';
import {shallow, mount} from 'enzyme';
import {BrowserRouter as Router, Route} from 'react-router-dom';

import {App} from '../../components/multi-side/app';

const props = {
  loggedIn: 'testUser'
}

describe('<App />', () => {
  it('Renders without crashing', () => {
    shallow(<App/>);
  });
  it('Renders the editor-side', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.exists('.editor-side')).toEqual(true)
  });
  it('Renders the user-side', () => {
    const wrapper = shallow(<App />);
    expect(wrapper.exists('.user-side')).toEqual(true)
  });
});
