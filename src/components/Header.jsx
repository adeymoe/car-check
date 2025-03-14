import React from 'react'
import './carCheck.css'
import {assets} from '../assets/assets'

const Header = () => {
  return (
    <div>
        <div className="header">
            <img src={assets.car_logo} className="car" alt="Moving Car"/>
        </div>
    </div>
  )
}

export default Header