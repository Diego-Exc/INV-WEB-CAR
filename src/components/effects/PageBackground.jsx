import ColorBends from './ColorBends.jsx'

export default function PageBackground() {
  return (
    <div className="page-bg" aria-hidden="true">
      <ColorBends
        colors={['#5B4011', '#C5A059', '#E5C158']}
        rotation={100}
        autoRotate={1.2}
        speed={0.18}
        scale={1.4}
        frequency={0.9}
        warpStrength={1}
        mouseInfluence={0.6}
        noise={0.06}
        parallax={0.3}
        iterations={2}
        intensity={1.1}
        bandWidth={5}
        transparent
      />
    </div>
  )
}
