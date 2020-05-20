import React from 'react';
import {shallow, mount} from 'enzyme';

import {EditorLoginForm} from '../../components/editor-side/login-form';

describe('<LoginForm />', () => {
  const callback = jest.fn();
    it('Renders without crashing', () => {
      shallow(<EditorLoginForm handleSubmit={callback}/>);
    });
    it('Called handleSubmit() from props when user submits login values', () => {
      const dispatch = jest.fn();
      const wrapper = shallow(<EditorLoginForm handleSubmit={callback} dispatch={dispatch}/>);
      const values = {email: 'EddieEditor@aol.com', password: '123456789' }
      wrapper.find('form').simulate('submit', values)
      expect(callback).toHaveBeenCalled();
    });
});
