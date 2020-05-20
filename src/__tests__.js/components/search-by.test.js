import React from 'react';
import {shallow, mount} from 'enzyme';

import {SearchBy} from '../../components/user-side/search-by';
import {searchByKeyWord} from '../../actions/content/user-side';

describe('<SearchBy />', () => {
    it('Renders without crashing', () => {
        shallow(<SearchBy />);
    });
    it('Updates the state when user inputs text', () => {
        const wrapper = shallow(<SearchBy />);
        wrapper.instance().handleChange({target: {value: 't'}});
        wrapper.update()
        expect(wrapper.state('keyWord')).toEqual('t')
    });
});
