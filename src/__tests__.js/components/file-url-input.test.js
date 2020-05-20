import React from 'react';
import {shallow, mount} from 'enzyme';

import FileUrlInput from '../../components/editor-side/file-url-input';

describe('<FileUrlInput />', () => {
    it('Renders without crashing', () => {
        shallow(<FileUrlInput />);
    });
    it('Updates the state from user input', () => {
        const wrapper = shallow(<FileUrlInput />);
        wrapper.find('input[type="url"]').simulate('change', { target: { name: "videoUrls", value: 't' } });
        expect(wrapper.state('videoUrlInput')).toEqual('t');
    });
});
