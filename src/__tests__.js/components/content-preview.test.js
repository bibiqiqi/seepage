import React from 'react';
import {shallow, mount} from 'enzyme';

import ContentPreview from '../../components/user-side/content-preview';

const secondaryNode = {
  artistName: "Ryne Heslin",
  category: ["text"],
  description: "",
  files: [
    {
      fileId: "5e79a5faebc35daf5f3e1f71",
      fileName: "Ryne_Heslin_Worlding:_Semiosis_and_Nested_Reality_0.pdf",
      fileType: "application/pdf",
      _id: "5e79a604ebc35daf5f3e1f7a"
    }
  ],
  id: "5e79a5faebc35daf5f3e1f70",
  index: 4,
  px: 468.18482307039864,
  py: 414.8089617153386,
  tags: ["theory", "biosemiotics", "new materialism"],
  title: "Worlding: Semiosis and Nested Reality",
  type: "secondary",
  weight: 3,
  x: 468.23544738880116,
  y: 414.7600422779217
}

const primaryNode = {
  index: 6,
  px: 516.4463985387956,
  py: 462.64911981952605,
  tag: "assemblage",
  type: "primary",
  weight: 1,
  x: 516.52500141522,
  y: 462.6584327853822
}

describe('<ContentPreview />', () => {
    it('Renders without crashing', () => {
        shallow(<ContentPreview node={secondaryNode} />);
    });
    it('Renders the correct text of a secondary node', () => {
        const wrapper = shallow(<ContentPreview node={secondaryNode} />);
        expect(wrapper.find('.title').text()).toEqual(secondaryNode.title);
    });
    it('Renders the correct text of a primary node', () => {
        const wrapper = shallow(<ContentPreview node={primaryNode} />);
        expect(wrapper.find('text').text()).toEqual(primaryNode.tag);
    });
});
