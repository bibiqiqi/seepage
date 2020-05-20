import React from 'react';
import {shallow, mount} from 'enzyme';

import {Thumbnail} from '../../components/multi-side/thumbnail';
import {API_BASE_URL} from '../../config';

const fileObject = {
  fileId: "5e79a54eebc35daf5f3e1f66",
  fileName: "Ryne_Heslin_Flux/Stasis_0.jpg",
  fileType: "image/jpeg",
  _id: "5e79a550ebc35daf5f3e1f6a"
};

describe('<Thumbnail />', () => {
    it('Renders without crashing', () => {
      shallow(<Thumbnail fileObject={fileObject} index={0} gallery={false}  />);
    });
    it('Renders without crashing', () => {
      const url = `${API_BASE_URL}/content/files/${fileObject.fileId}`
      const wrapper = shallow(<Thumbnail fileObject={fileObject} index={0} gallery={false}  />);
      expect(wrapper.state('fileUrl')).toEqual(url)
    });
});
