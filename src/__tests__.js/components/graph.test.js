import React from 'react';
import {shallow, mount} from 'enzyme';

import {LargeScreenGraph} from '../../components/user-side/largescreen-graph';

const nodes = [
  {
    artistName: "Ryne Heslin",
    category: ["media"],
    description: "",
    files: [
      {
        fileId: "5e79a54eebc35daf5f3e1f66",
        fileName: "Ryne_Heslin_Flux/Stasis_0.jpg",
        fileType: "image/jpeg",
        _id: "5e79a550ebc35daf5f3e1f6a"
      },
      {
        fileId: "5e79a54eebc35daf5f3e1f67",
        fileName: "Ryne_Heslin_Flux/Stasis_1.jpg",
        fileType: "image/jpeg",
        _id: "5e79a550ebc35daf5f3e1f6b"
      }
    ],
    id: "5e79a54eebc35daf5f3e1f65",
    index: 0,
    px: 398.3621018832091,
    py: 559.4351936328436,
    tags: (3) ["installation", "assemblage", "chaos"],
    title: "Flux/Stasis",
    type: "secondary",
    weight: 3,
    x: 398.37187693680033,
    y: 559.4511310899992
  },
  {
    index: 5,
    px: 350.511539622255,
    py: 650.4700019824232,
    tag: "installation",
    type: "primary",
    weight: 1,
    x: 350.508100357265,
    y: 650.5378658220807
  }
];

const links = [
  {
    distance: 100,
    index: 0,
    key: "5, 0",
    source: nodes[0],
    target: nodes[1]
  }
]

describe('<Graph />', () => {
    it('Renders without crashing', () => {
        shallow(<LargeScreenGraph nodes={nodes} links={links}/>);
    });
    it('Updates the state with the props', () => {
        const wrapper = shallow(<LargeScreenGraph nodes={nodes} links={links}/>);
        expect(wrapper.state('nodes')).toEqual(nodes);
    });
    it('Updates the state with the props', () => {
        const wrapper = shallow(<LargeScreenGraph nodes={nodes} links={links}/>);
        expect(wrapper.state('links')).toEqual(links);
    });
    it('Updates the nodePreview state when user clicks on a node', () => {
        const wrapper = shallow(<LargeScreenGraph nodes={nodes} links={links}/>);
        wrapper.instance().handleNodeClick(0);
        wrapper.update();
        expect(wrapper.state('nodePreview')).toEqual(0);
    });
});
