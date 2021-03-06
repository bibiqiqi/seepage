import React from 'react';
import Logo from '../multi-side/logo';

import './cover-page.css';
import '../multi-side/logo.css';

export default function CoverPage(props) {
  // const history = props.history;
  return (
    <section id="cover-page" className="screen">
      <Logo/>
      <main>
        <div>
          <p><b>seepage</b> is a forum for facilitating critical and experimental engagement with content <i>outside</i> the confines of traditional discipline or medium.<br/> <b>seepage</b> will exist as a website, periodically crystallizing into print editions as themes emerge.<br/> <b>seepage</b> is now accepting works mapping the <i>slippage</i> and <i>stoppage</i> in, around, and outside of your practice. including, but not limited to: </p>
        </div>
        <ul>
          <li><i className="material-icons">check</i> text (research, proposals, interviews, fiction) </li>
          <li><i className="material-icons">check</i> media works that are not dependent upon gallery installation (web-based or otherwise)</li>
          <li><i className="material-icons">check</i> performances that are not dependent upon three-dimensional space </li>
        </ul>
        <div>
          <p>form and content of submissions are open to interpretation, if you're not sure please ask.</p>
        </div>
        <button
          onClick={() => {props.history.push('/home')}}
        >Enter
        </button>
        <footer>
          <p>
            send submissions and enquiries to: see.pagejournal@gmail.com
          </p>
        </footer>
      </main>
    </section>
  )
}
