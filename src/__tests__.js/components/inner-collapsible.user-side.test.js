import React from 'react';
import {shallow, mount} from 'enzyme';

import {UserInnerCollapsible} from '../../components/user-side/inner-collapsible';

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

describe('<UserInnerCollapsible />', () => {
    it('Renders without crashing', () => {
        shallow(<UserInnerCollapsible openState={false} content={result} index={0}/>);
    });
    it('Renders without crashing', () => {
        const wrapper = shallow(<UserInnerCollapsible openState={false} content={result} index={0}/>);
        expect(wrapper).toEqual({})
    });
    it('Renders without crashing', () => {
        const dispatch = jest.fn();
        const wrapper = shallow(<UserInnerCollapsible openState={true} content={result} index={0} dispatch={dispatch}/>);
        wrapper.find('.tags-container').childAt(0).simulate('click', { currentTarget: {innerText: 'test tag' }});
        expect(dispatch).toHaveBeenCalled();
    });
});
