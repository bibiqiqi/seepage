import React from 'react';
import {shallow, mount} from 'enzyme';

import {EditorFindPage} from '../../components/editor-side/find-page';

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

describe('<FindPage />', () => {
    it('Renders without crashing', () => {
        shallow(<EditorFindPage galleryFiles={fileObjects} galleryStarting={0} />);
    });
    it('Renders the Gallery component, if gallery files are being passed in as props', () => {
        const wrapper = shallow(<EditorFindPage galleryFiles={fileObjects} galleryStarting={0}/>);
        expect(wrapper.childAt(0).exists('Gallery')).toEqual(true)
    });
    it('Renders the FindForm component, if gallery files aren\'t being passed in as props', () => {
        const wrapper = shallow(<EditorFindPage galleryFiles={[]} galleryStarting={0}/>);
        expect(wrapper.childAt(1).exists('main')).toEqual(true)
    });
});
