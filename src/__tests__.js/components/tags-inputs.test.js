import React from 'react';
import {shallow, mount} from 'enzyme';

import {TagsInput} from '../../components/editor-side/tags-input';

describe('<TagsInput />', () => {
    const tags = ['test', 'test1', 'test2'];
    it('Renders without crashing', () => {
        shallow(<TagsInput tags={tags}/>);
    });
    it('Filters out a tag that is a repeat', () => {
        const wrapper = shallow(<TagsInput tags={tags}/>);
        expect(wrapper.instance().handleValidate('test1')).toEqual(false)
    });
    it('Accepts a tag that isn\'t a repeat', () => {
        const wrapper = shallow(<TagsInput tags={tags}/>);
        expect(wrapper.instance().handleValidate('test3')).toEqual(true)
    });
});
