import React from 'react';
import {shallow, mount} from 'enzyme';

import Accordian from '../../components/multi-side/accordian';

const results = [
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

describe('<Accordian />', () => {
    it('Renders without crashing', () => {
        shallow(<Accordian user='user' results={results} />);
    });
    it('Opens the component when the user clicks a closed component', () => {
        const wrapper = shallow(<Accordian user='user' results={results} />);
        wrapper.instance().handleCollapsibleClick(0);
        wrapper.update();
        expect(wrapper.state('collapsible')).toEqual([0]);
    });
    it('Closes the component when the user clicks a closed component', () => {
        const wrapper = shallow(<Accordian user='user' results={results} />);
        wrapper.instance().handleCollapsibleClick(0);
        wrapper.update();
        wrapper.instance().handleCollapsibleClick(0);
        wrapper.update();
        expect(wrapper.state('collapsible')).toEqual([]);
    });
});
