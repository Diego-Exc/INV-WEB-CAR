import { useVehicleCatalog } from '../context/VehicleCatalogContext.jsx'

export default function Navbar() {
  const { compareIds } = useVehicleCatalog()

  return (
    <header className="navbar glass hairline">
      <div className="container navbar__inner">
        <div className="navbar__brand">
          <span className="navbar__mark">E</span>
          <span className="navbar__word">ESCOR</span>
        </div>

        <nav className="navbar__links">
          <a href="#catalogo">Catálogo</a>
          <a href="#concierge">Búsqueda</a>
          <a href="#coleccion">Colección</a>
          <a href="#comparador">
            Comparador
            {compareIds.length > 0 && <span className="navbar__badge navbar__badge--inline">{compareIds.length}</span>}
          </a>
        </nav>

        <div className="navbar__actions">
          <a href="#asesoria" className="btn btn-primary navbar__cta">Asesoría Presencial</a>
        </div>
      </div>
    </header>
  )
}
