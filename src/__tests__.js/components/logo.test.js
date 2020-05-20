import React from 'react';
import {shallow, mount} from 'enzyme';

import Logo from '../../components/multi-side/logo';

describe('<Logo />', () => {
    it('Renders without crashing', () => {
        shallow(<Logo />);
    });
    it('Renders without crashing', () => {
        const wrapper = shallow(<Logo />);
        expect(wrapper.exists('img')).toEqual(true)
    });
});
