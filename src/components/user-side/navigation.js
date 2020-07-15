import React from 'react';
import './navigation.css';
import SearchBy from './search-by';
import {Button} from '../multi-side/clickables';
import classnames from 'classnames';

export default class Navigation extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      navigation: false,
    }
  }

  renderColorKey() {
    return(
      <ul className="color-key">
        <li className="media">
          <div></div>
          <h5>media</h5>
        </li>
        <li className="media-performance">
          <div></div>
          <h5>media & performance</h5>
        </li>
        <li className="performance">
          <div></div>
          <h5>performance</h5>
        </li>
        <li className="performance-text">
          <div></div>
          <h5>performance & text</h5>
        </li>
        <li className="text">
          <div></div>
          <h5>text</h5>
        </li>
        <li className="text-media">
          <div></div>
          <h5>text & media</h5>
        </li>
        <li className="all-colors">
          <div></div>
          <h5>media & performance & text</h5>
        </li>
      </ul>
    )
  }

  render () {
    const windowWidth = window.innerWidth;
    // console.log('window width is', windowWidth);
    // console.log('this.state.navigation is', this.state.navigation);
    return(
      <div className="navigation">
        <Button
          className={classnames({
            clickable: true,
            hidden: (windowWidth >= 992) || ((windowWidth < 992) && this.state.navigation)
          })}
          handleClick={() => this.setState({navigation:true})}
          glyph='dehaze'
        />
        <Button
          className={classnames({
            clickable: true,
            hidden: (windowWidth >= 992) || ((windowWidth < 992) && !this.state.navigation)
          })}
          handleClick={() => this.setState({navigation:false})}
          glyph='close'
        />
        <div
          className={classnames({
            hidden: (windowWidth < 992) && !this.state.navigation,
            'navigation-open': true
          })}
        >
          <SearchBy
            onSubmit={() => this.props.onSearch()}
          />
          <label
            for='keyword-search'
          >
            <h5>browse map or search by keyword</h5>
          </label>
          {this.renderColorKey()}
        </div>
      </div>
    )
  }
}
