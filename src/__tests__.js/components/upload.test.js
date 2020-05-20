import React from 'react';
import {shallow, mount} from 'enzyme';

import {EditorUpload} from '../../components/editor-side/upload';

describe('<Upload />', () => {
    const dispatch = jest.fn();
    it('Renders without crashing', () => {
      shallow(<EditorUpload dispatch={dispatch}/>);
    });
    it('Updates the state when user inputs', () => {
      const wrapper = shallow(<EditorUpload dispatch={dispatch}/>);
      wrapper.find('input[name="title"]').simulate('change', {target: {name: 'title', value: 't'}});
      expect(wrapper.state('uploadForm').title).toEqual('t')
    });
    it('Dispatches an action upon the component mounting', () => {
      const wrapper = shallow(<EditorUpload dispatch={dispatch}/>);
      expect(dispatch).toHaveBeenCalled();
    });
    it('Updates the validation state if the user submits the form without any inputs', () => {
      const validationState = ['artistName', 'title', 'category', 'tags']
      const wrapper = shallow(<EditorUpload dispatch={dispatch}/>);
      wrapper.instance().handleSubmit({preventDefault: () => {}});
      wrapper.update();
      validationState.forEach((node) => {
        expect(wrapper.state('validation')[node]).not.toEqual(undefined)
      })
    });
    it('Updates the category state when user selects a category checkbox', () => {
      const wrapper = shallow(<EditorUpload dispatch={dispatch}/>);
      wrapper.instance().handleCheckBoxChange({target: {name: 'media', checked: true}})
      wrapper.update();
      expect(wrapper.state('uploadForm').category.media).toEqual(true)
    });
});
