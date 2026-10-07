export default function Footer() {
  return (
    <footer className="footer hairline">
      <div className="container footer__inner">
        <div className="footer__brand">
          <img className="brand-logo brand-logo--footer" src="/escor-logo.svg" alt="ESCOR Motors Atelier" />
        </div>
        <p className="footer__tagline">
          Marketplace de vehículos usados con datos técnicos oficiales (NHTSA vPIC) e imágenes
          de referencia (Wikimedia Commons). Los precios marcados como "estimados" se calculan
          mediante un modelo interno y no constituyen una oferta de venta real.
        </p>
        <div className="footer__meta">
          <span className="label">© {new Date().getFullYear()} ESCOR</span>
          <span className="label">Hecho con React 19 + Vite</span>
        </div>
      </div>
    </footer>
  )
}
