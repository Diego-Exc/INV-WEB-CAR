const PX_PER_MM = 0.045

export default function Vehicle3DBox({ vehicle, mirror = false }) {
  const { lengthMm, widthMm, heightMm } = vehicle.dimensions
  const style = {
    '--l': `${lengthMm * PX_PER_MM}px`,
    '--w': `${widthMm * PX_PER_MM}px`,
    '--h': `${heightMm * PX_PER_MM}px`,
  }

  return (
    <div className="dim-box-wrap">
      <div className={`dim-box ${mirror ? 'is-mirror' : ''}`} style={style}>
        <div className="dim-box__face dim-box__face--top" />
        <div className="dim-box__face dim-box__face--front" />
        <div className="dim-box__face dim-box__face--side" />
      </div>
      <span className="dim-box__label">{vehicle.title}</span>
    </div>
  )
}
