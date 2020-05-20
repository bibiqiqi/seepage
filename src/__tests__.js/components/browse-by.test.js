import React from 'react';
import {shallow, mount} from 'enzyme';

import {BrowseBy} from '../../components/user-side/browse-by';

const allContent = [
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
    tags: ["installation", "assemblage", "chaos"],
    title: "Flux/Stasis"
  }
]

describe('<BrowseBy />', () => {
    it('Renders without crashing', () => {
        shallow(<BrowseBy />);
    });
});
