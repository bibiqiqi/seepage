import React from 'react';
import LogoPng from '../../seepage-logo.svg';

export default function Logo() {
  return (
    <header>
      <img className='logo' src={LogoPng} alt='seepage logo'></img>
    </header>
  )
}
