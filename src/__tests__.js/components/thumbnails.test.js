import React from 'react';
import {shallow, mount} from 'enzyme';

import Thumbnails from '../../components/multi-side/thumbnails';

const content = {
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
  tags: [
    0: "installation",
    1: "assemblage",
    2: "chaos"
  ],
  title: "Flux/Stasis"
}

describe('<Thumbnails />', () => {
  it('Renders without crashing', () => {
    const wrapper = shallow(<Thumbnails content={content} gallery={false} autoplay={false} />);
  });
  it('Renders the component that contains the thumbnails', () => {
    const wrapper = shallow(<Thumbnails content={content} gallery={false} autoplay={false} />);
    expect(wrapper.exists('.thumbnail-container')).toEqual(true)
  });
});
