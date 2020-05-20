import React from 'react';
import {shallow, mount} from 'enzyme';

import {EditorHome} from '../../components/editor-side/home';

const currentEditor = {
  email: "eddieeditor@places.com",
  firstName: "eddie",
  id: "5ea922e7ebc30330300c83f9",
  lastName: "editor"
}

describe('<EditorHome />', () => {
    it('Renders without crashing', () => {
        shallow(<EditorHome currentEditor={currentEditor}/>);
    });
    it('Displays the name of the Editor that\'s currently logged in', () => {
        const wrapper = shallow(<EditorHome currentEditor={currentEditor}/>);
        expect(wrapper.find('.greeting').find('span').text()).toEqual(currentEditor.firstName);
    });
    it('Renders the correct buttons', () => {
        const wrapper = shallow(<EditorHome currentEditor={currentEditor}/>);
        expect(wrapper.find('.button-container').childAt(0).text()).toEqual('upload new content');
    });
});
