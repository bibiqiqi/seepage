import React from 'react';
import {shallow, mount} from 'enzyme';

import Categories from '../../components/editor-side/categories';
import LabeledInput from '../../components/multi-side/labeled-input-controlled';

const categories = {media: false, performance: false, text: false};

describe('<Categories />', () => {
    it('Renders without crashing', () => {
        shallow(<Categories />);
    });
    it('Renders the checked inputs as false', () => {
        const wrapper = mount(<Categories categories={categories} />);
        wrapper.find('input').forEach(el => {
          expect(el.prop('checked')).toEqual(false);
        })
    });
    it('Passes the correct value to the name prop', () => {
        const wrapper = mount(<Categories categories={categories} />);
        expect(wrapper.find('.assign-category').childAt(0).prop('name')).toEqual('media')
    });
});
