import './Hero.css'
import arrow_btn from '../../assets/arrow-btn.png'
import play_btn from '../../assets/play-button.png'
import pause_btn from '../../assets/pause-button.png'
import { Link } from "react-router-dom";

const Hero = ({heroData, setHeroCount, heroCount, setPlayStatus, playStatus}) => {
  return (
    <div className='hero'>
      <div className="hero-text">
        <p>{heroData.text1}</p>
        <p>{heroData.text2}</p>
      </div>
      <div className="hero-explore">
      <Link to="/search">Check Medical Records</Link>
        <img src={arrow_btn} alt=""/>
      </div>
      <div className="hero-dot-play">
        <ul className="hero-dots">
          <li onClick={()=>setHeroCount(0)} className = {heroCount === 0? "hero-dot blue": "hero-dot"}></li>
          <li onClick={()=>setHeroCount(1)} className = {heroCount === 1? "hero-dot blue": "hero-dot"}></li>
          <li onClick={()=>setHeroCount(2)} className = {heroCount === 2? "hero-dot blue": "hero-dot"}></li>
        </ul>
        <div className= "hero-play">
        <img onClick={()=>setPlayStatus(!playStatus)} src={playStatus?pause_btn:play_btn} alt="" />
          <p>Play Video</p>
        </div>
      </div>
    </div>
  )
}

export default Hero
