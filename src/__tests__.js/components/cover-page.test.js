import React from 'react';
import {shallow, mount} from 'enzyme';

import CoverPage from '../../components/user-side/cover-page';

describe('<CoverPage />', () => {
    it('Renders without crashing', () => {
        shallow(<CoverPage />);
    });
});
