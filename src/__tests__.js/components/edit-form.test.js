import React from 'react';
import {shallow, mount} from 'enzyme';

import {EditorEditForm} from '../../components/editor-side/edit-form';

const result = {
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

describe('<EditorEditForm />', () => {
    it('Renders without crashing', () => {
        shallow(<EditorEditForm content={result} name='title' label='Title' />);
    });
   it('Should render an edit form for the correct field', () => {
     const wrapper = shallow(<EditorEditForm content={result} name='title' label='Title' />);
     expect(wrapper.find('input').prop('name')).toEqual('title');
  });
  it('Should update the state with files that are passed as props', () => {
    const wrapper = shallow(<EditorEditForm content={result} name='title' label='Title' />);
    expect(wrapper.state('uploadForm').files.totalFiles).toEqual(result.files.length);
  });
});
