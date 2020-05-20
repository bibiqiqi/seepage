import React from 'react';
import {shallow, mount} from 'enzyme';

import {Autocomplete} from '../../components/editor-side/autocomplete';

describe('<Autocomplete />', () => {
  it('Renders without crashing', () => {
      shallow(<Autocomplete className='autocomplete' name='artistName'/>);
  });
  it('Updates the state with the correct props', () => {
      const wrapper = shallow(<Autocomplete className='autocomplete' name='artistName'/>);
      expect(wrapper.state('name')).toEqual('artistName');
  });
  it('Updates the state with the correct props', () => {
      const callback = jest.fn();
      const wrapper = mount(<Autocomplete className='autocomplete' name='artistName' onChange={callback}/>);
      const e = {target: {value: "s"}}
      wrapper.instance().handleChange(e)
      expect(callback).toHaveBeenCalled();
  });
});
