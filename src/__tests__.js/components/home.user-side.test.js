import React from 'react';
import {shallow, mount} from 'enzyme';

import {Home} from '../../components/user-side/home';

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

describe('<Home />', () => {
  const dispatch = jest.fn()
    it('Renders without crashing', () => {
      shallow(<Home galleryFiles={fileObjects} galleryStarting={0} dispatch={dispatch}/>);
      expect(dispatch).toHaveBeenCalled();
    });
    it('Dispatches an action upon component mount', () => {
      shallow(<Home galleryFiles={fileObjects} galleryStarting={0} dispatch={dispatch}/>);
      expect(dispatch).toHaveBeenCalled();
    });
    it('To not render Gallery component when no gallery files are in state', () => {
      const wrapper = shallow(<Home galleryFiles={[]} galleryStarting={null} dispatch={dispatch}/>);
      expect(wrapper.exists('Gallery')).toEqual(false);
    });
});
