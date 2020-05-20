import React from 'react';
import {shallow, mount} from 'enzyme';

import LabeledInput from '../../components/multi-side/labeled-input-controlled';

describe('<LabeledInput />', () => {
    it('Renders without crashing', () => {
        shallow(<LabeledInput />);
    });
    it('Renders a component with the correct classname', () => {
        const wrapper = shallow(<LabeledInput className='testClass' checked={true} name='test' label='testLabel' />);
        expect(wrapper.prop('className')).toEqual('testClass');
    });
});
