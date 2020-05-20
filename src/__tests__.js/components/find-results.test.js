import React from 'react';
import {shallow, mount} from 'enzyme';

import {EditorFindResults} from '../../components/editor-side/find-results';
import Accordian from '../../components/multi-side/accordian';

const results = [
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
      }
    ]
  }
];

describe('<FindResults />', () => {
    it('Renders without crashing', () => {
        shallow(<EditorFindResults filteredContent={results} />);
    });
    it('Passes filteredContent data to the Accordian component correctly', () => {
        const wrapper = shallow(<EditorFindResults filteredContent={results} />);
        expect(wrapper.find(Accordian).prop('results')).toEqual(results);
    });
    it('Renders a <p> element with a string if there are no results from query', () => {
        const filteredContentNone = "your query didn't match any results"
        const wrapper = shallow(<EditorFindResults filteredContent={[]} filteredContentNone={filteredContentNone} />);
        expect(wrapper.exists('p')).toEqual(true);
    });
});
