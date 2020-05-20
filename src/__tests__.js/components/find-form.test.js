import React from 'react';
import {shallow, mount} from 'enzyme';
import produce from 'immer';

import {EditorFindForm} from '../../components/editor-side/find-form';

const content = [
  {
    artistName: "Ryne Heslin",
    category: ["media"],
    description: "",
    tags: ["theory", "biosemiotics", "new materialism"],
    title: "Worlding: Semiosis and Nested Reality",
    files: [
      {
        fileId: "5e79a54eebc35daf5f3e1f66",
        fileName: "Ryne_Heslin_Flux/Stasis_0.jpg",
        fileType: "image/jpeg",
        _id: "5e79a550ebc35daf5f3e1f6a"
      }
    ]
  }
];

describe('<EditorFindForm />', () => {
    it('Renders without crashing', () => {
      const dispatch = jest.fn();
      const wrapper = shallow(<EditorFindForm content={content} dispatch={dispatch} />)
    });
    it('Opens "browseBy" collapsible when user clicks', () => {
      const dispatch = jest.fn();
      const wrapper = mount(<EditorFindForm content={content} dispatch={dispatch} />);
      wrapper.instance().handleCollapsibleClick('browseBy')
      wrapper.update();
      expect(wrapper.state('findForm').browseBy.open).toEqual(true)
    });
    it('Expect component to dispatch an action upon mounting', () => {
      const dispatch = jest.fn();
      const wrapper = mount(<EditorFindForm content={content} dispatch={dispatch} />);
      expect(dispatch).toHaveBeenCalled();
    });
    it('Expect component to dispatch an action after user submits a "browseBy" query', () => {
      const dispatch = jest.fn();
      const validationString = (validationProperty) => `${validationProperty} is required`;
      const wrapper = mount(<EditorFindForm content={content} dispatch={dispatch} />);
      wrapper.instance().handleCollapsibleClick('browseBy');
      wrapper.instance().setState(
        produce(draft => {
          draft.findForm.browseBy.inputs.media = true;
        })
      );
      wrapper.update();
      wrapper.instance().handleBrowse(validationString);
      expect(dispatch).toHaveBeenCalled();
    });
});
