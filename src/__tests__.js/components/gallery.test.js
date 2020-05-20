import React from 'react';
import {shallow, mount} from 'enzyme';

import Gallery from '../../components/multi-side/gallery';

const fileObjects = [
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
];

const alt = () => {
  `Gallery view of file 0 for This Art, by This Artist`
}

describe('<Gallery />', () => {
    it('Renders without crashing', () => {
        shallow(<Gallery fileObjects={fileObjects} firstArtIndex={0} alt={alt} />);
    });
    it('Updates the state correctly when user presses the forward button', () => {
        const wrapper = shallow(<Gallery fileObjects={fileObjects} firstArtIndex={0} alt={alt} />);
        wrapper.instance().handleArrowClick('forward');
        wrapper.update();
        expect(wrapper.state('currentArtIndex')).toEqual(1);
    });
    it('Updates the state correctly when user presses the backwards button', () => {
        const wrapper = shallow(<Gallery fileObjects={fileObjects} firstArtIndex={0} alt={alt} />);
        wrapper.instance().handleArrowClick('back');
        wrapper.update();
        expect(wrapper.state('currentArtIndex')).toEqual(1);
    });
});
