import { CalendarCheck } from 'lucide-react'

export default function CtaBanner({ onOpenChat, onOpenBooking }) {
  return (
    <section id="asesoria" className="cta-banner">
      <div className="container cta-banner__inner">
        <div className="cta-banner__card glass hairline-gold">
          <span className="label label--gold">Concierge Personal</span>
          <h2>¿Prefiere que le ayudemos a elegir?</h2>
          <p>Cuéntele al Concierge IA su presupuesto y estilo de vida, o reserve una cita privada con un asesor humano en nuestro showroom.</p>
          <div className="cta-banner__actions">
            <button className="btn btn-primary" onClick={onOpenChat}>Hablar con el Concierge IA</button>
            <button className="btn btn-outline" onClick={onOpenBooking}>
              <CalendarCheck size={16} strokeWidth={1.75} /> Reservar asesoría
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
