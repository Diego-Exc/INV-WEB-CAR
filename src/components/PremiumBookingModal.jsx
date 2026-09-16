import { useState } from 'react'
import { X, CalendarCheck, MapPin, CheckCircle2, Car, ShieldCheck, Handshake, Sparkles, Star, Crown } from 'lucide-react'
import { useVehicleCatalog } from '../context/VehicleCatalogContext.jsx'

const BENEFITS = [
  { icon: Car, text: 'Test drive privado con el vehículo de su elección' },
  { icon: ShieldCheck, text: 'Inspección técnica junto a nuestro mecánico certificado' },
  { icon: Handshake, text: 'Asesoría legal y de financiamiento incluida' },
  { icon: Sparkles, text: 'Traslado de cortesía dentro del área metropolitana' },
]

function generateReference() {
  return `ESCOR-${Math.floor(1000 + Math.random() * 9000)}`
}

export default function PremiumBookingModal({ open, onClose, prefillVehicle }) {
  const { allVehicles } = useVehicleCatalog()
  const [submitted, setSubmitted] = useState(false)
  const [location, setLocation] = useState('showroom')
  const [reference, setReference] = useState('')

  if (!open) return null

  function handleSubmit(e) {
    e.preventDefault()
    setReference(generateReference())
    setSubmitted(true)
  }

  function handleClose() {
    onClose()
    setTimeout(() => setSubmitted(false), 300)
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="booking-modal glass hairline-gold" onClick={(e) => e.stopPropagation()}>
        <button className="modal__close" onClick={handleClose} aria-label="Cerrar">
          <X size={20} strokeWidth={1.75} />
        </button>

        <div className="booking-modal__aside">
          <span className="booking-modal__crown"><Crown size={22} strokeWidth={1.5} /></span>
          <span className="label label--gold">Servicio Premium</span>
          <h2>Asesoría Presencial</h2>
          <p>Reserve una cita privada con un asesor ESCOR. Sin filas, sin presión, a su ritmo.</p>

          <div className="booking-modal__rating">
            <div className="booking-modal__stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={13} strokeWidth={0} fill="currentColor" />
              ))}
            </div>
            <span className="label">4.9/5 · +500 asesorías completadas</span>
          </div>

          <ul className="booking-modal__benefits">
            {BENEFITS.map(({ icon: Icon, text }) => (
              <li key={text}>
                <span className="booking-modal__benefit-icon"><Icon size={15} strokeWidth={1.75} /></span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="booking-modal__form">
          {submitted ? (
            <div className="booking-modal__success">
              <span className="booking-modal__success-ring"><CheckCircle2 size={36} strokeWidth={1.5} /></span>
              <h3>Solicitud recibida</h3>
              <p>Un asesor personal le contactará en menos de 24 horas para confirmar los detalles de su cita.</p>
              <div className="booking-modal__reference">
                <span className="label">Código de referencia</span>
                <span className="booking-modal__reference-code">{reference}</span>
              </div>
              <button className="btn btn-primary" onClick={handleClose}>Entendido</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h3 className="booking-modal__form-title">
                <CalendarCheck size={18} strokeWidth={1.75} /> Datos de la cita
              </h3>

              <div className="booking-modal__field">
                <span className="label">Nombre completo</span>
                <input type="text" required placeholder="Su nombre" />
              </div>

              <div className="booking-modal__row">
                <div className="booking-modal__field">
                  <span className="label">Correo electrónico</span>
                  <input type="email" required placeholder="correo@ejemplo.com" />
                </div>
                <div className="booking-modal__field">
                  <span className="label">Teléfono</span>
                  <input type="tel" required placeholder="+1 234 567 8900" />
                </div>
              </div>

              <div className="booking-modal__row">
                <div className="booking-modal__field">
                  <span className="label">Fecha preferida</span>
                  <input type="date" required />
                </div>
                <div className="booking-modal__field">
                  <span className="label">Hora preferida</span>
                  <input type="time" required />
                </div>
              </div>

              <div className="booking-modal__field">
                <span className="label">Vehículo de interés (opcional)</span>
                <select defaultValue={prefillVehicle?.id || ''}>
                  <option value="">Aún no lo sé</option>
                  {allVehicles.slice(0, 40).map((v) => (
                    <option key={v.id} value={v.id}>{v.title}</option>
                  ))}
                </select>
              </div>

              <div className="booking-modal__field">
                <span className="label">Ubicación</span>
                <div className="booking-modal__toggle">
                  <button
                    type="button"
                    className={location === 'showroom' ? 'is-active' : ''}
                    onClick={() => setLocation('showroom')}
                  >
                    <MapPin size={14} strokeWidth={1.75} /> Showroom ESCOR
                  </button>
                  <button
                    type="button"
                    className={location === 'home' ? 'is-active' : ''}
                    onClick={() => setLocation('home')}
                  >
                    <MapPin size={14} strokeWidth={1.75} /> Visita a domicilio
                  </button>
                </div>
              </div>

              <button type="submit" className="btn btn-primary booking-modal__submit">
                Confirmar solicitud
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
