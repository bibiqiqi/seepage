import React from 'react';
import {shallow, mount} from 'enzyme';

import {DeleteConfirmation} from '../../components/editor-side/delete-confirmation';
import InnerCollapsible from '../../components/editor-side/inner-collapsible';

const result = {
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

describe('<InnerCollapsible />', () => {
  it('Renders without crashing', () => {
      shallow(<InnerCollapsible />);
  });
  it('Correctly renders the collapsible open', () => {
      const wrapper = shallow(<InnerCollapsible openState={true} content={result} index={0} />);
      expect(wrapper).not.toEqual(null);
  });
  it('Correctly renders the collapsible closed', () => {
      const wrapper = shallow(<InnerCollapsible openState={false} content={result} index={0} />);
      expect(wrapper).toEqual({});
  });
  it('Correctly updates the hidden state with handlePatchCompletion', () => {
      const wrapper = shallow(<InnerCollapsible openState={true} content={result} index={0} />);
      wrapper.setState({ hidden: {editForm: 'title'} });
      wrapper.instance().handlePatchCompletion();
      wrapper.update();
      expect(wrapper.state('hidden').editForm).toEqual('')
  });
  it('Correctly renders the state of delete confirmation window', () => {
      const wrapper = shallow(<InnerCollapsible openState={false} content={result} index={0} />);
      expect(wrapper.exists(DeleteConfirmation)).toEqual(false);
  });
});
