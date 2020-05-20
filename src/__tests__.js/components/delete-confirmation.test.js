import React from 'react';
import {shallow, mount} from 'enzyme';
import {editContentInState} from '../../actions/content/editor-side';

import {DeleteConfirmation} from '../../components/editor-side/delete-confirmation';

const props = {
  authToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNWVhOTIyZTdlYmMzMDMzMDMwMGM4M2Y5IiwiZW1haWwiOiJlZGRpZWVkaXRvckBwbGFjZXMuY29tIiwiZmlyc3ROYW1lIjoiZWRkaWUiLCJsYXN0TmFtZSI6ImVkaXRvciJ9LCJpYXQiOjE1ODk1ODM0MjIsImV4cCI6MTU5MDE4ODIyMiwic3ViIjoiZWRkaWVlZGl0b3JAcGxhY2VzLmNvbSJ9.7v_D1f9-QA7nAp39Ij0rwrtTcI7Tl6zhy7cQWvU_teo",
  contentId: "5e79a54eebc35daf5f3e1f65",
  index: 0
}

describe('<DeleteConfirmation  />', () => {
    it('Renders without crashing', () => {
        shallow(<DeleteConfirmation authToken={props.authToken} contentId={props.contentId} index={props.index} />);
    });
    it('Dispatches editContentInState()', () => {
        const dispatch = jest.fn();
        const wrapper = shallow(<DeleteConfirmation authToken={props.authToken} contentId={props.contentId} index={props.index} dispatch={dispatch} />);
        wrapper.instance().deleteEntry();
        expect(wrapper.state('asyncCall')).toEqual({ loading: true, success: null });
    });
});
