import React from 'react';
import Logo from '../logo';
import TagMap from './tag-map';

import './home.css';

export default function Home() {
  return (
    <section id="user-browse" className="page">
      <Logo/>
      <main>
        <div id="browse" className="panel">
          <TagMap/>
        </div>
        <div id="content" className="panel">
          <div id="content-preview">
            <p>content preview here</p>
          </div>
        </div>
      </main>
    </section>
  )
}
