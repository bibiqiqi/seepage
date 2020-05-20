import React from 'react';
import {shallow, mount} from 'enzyme';

import Dropzone from '../../components/editor-side/dropzone';

describe('<Dropzone />', () => {
    it('Renders without crashing', () => {
        shallow(<Dropzone />);
    });
});
