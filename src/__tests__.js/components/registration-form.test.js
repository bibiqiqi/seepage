import React from 'react';
import {shallow, mount} from 'enzyme';

import {EditorRegForm} from '../../components/editor-side/registration-form';

describe('<RegistrationForm />', () => {
    const callback = jest.fn();
    const dispatch = jest.fn();
    it('Renders without crashing', () => {
        shallow(<EditorRegForm handleSubmit={callback}/>);
    });
    it('Renders without crashing', () => {
        const values = {
          email: 'EddieEditor@places.com',
          firstName: 'Eddie',
          lastName: 'Editor',
          password: '123456789'
        }
        const wrapper = shallow(<EditorRegForm handleSubmit={callback} dispatch={dispatch}/>);
        wrapper.instance().onSubmit(values);
        expect(callback).toHaveBeenCalled();
        expect(dispatch).toHaveBeenCalled();
    });
});
