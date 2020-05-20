import React from 'react';
import {shallow, mount} from 'enzyme';
import {SearchResults} from '../../components/user-side/search-results';

const searchResults = [
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
    tags: (3) ["installation", "assemblage", "chaos"],
    title: "Flux/Stasis"
  }
];

const none = "your query didn't match any results";

describe('<SearchResults />', () => {
    it('Renders without crashing', () => {
      shallow(<SearchResults />);
    });
    it('Doesn\'t render the SearchResults component if user hasn\'t made a search yet', () => {
      const wrapper = shallow(<SearchResults searchResults={{}} show={false} submits={0} />);
      expect(wrapper).toEqual({})
    });
    it('Renders the SearchResults component if user hase made a search', () => {
      const wrapper = shallow(<SearchResults searchResults={searchResults} show={true} submits={1} />);
      expect(wrapper).not.toEqual(null)
    });
});
