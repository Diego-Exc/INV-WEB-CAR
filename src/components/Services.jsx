import { ShieldCheck, Truck, SearchCheck, Wallet } from 'lucide-react'

const SERVICES = [
  {
    icon: ShieldCheck,
    title: 'Inspección de 150 Puntos',
    text: 'Cada vehículo listado pasa por una revisión técnica exhaustiva antes de publicarse.',
  },
  {
    icon: Truck,
    title: 'Entrega a Domicilio',
    text: 'Coordinamos el traslado seguro del vehículo hasta la dirección que usted indique.',
  },
  {
    icon: SearchCheck,
    title: 'Búsqueda Personalizada con IA',
    text: 'Nuestro concierge encuentra opciones específicas según su presupuesto y estilo de vida.',
  },
  {
    icon: Wallet,
    title: 'Financiamiento Flexible',
    text: 'Le conectamos con opciones de crédito adaptadas a su perfil, sin letra pequeña.',
  },
]

export default function Services() {
  return (
    <section className="services">
      <div className="container">
        <div className="services__header">
          <span className="label label--gold">Respaldo ESCOR</span>
          <h2>Servicios pensados para su tranquilidad</h2>
        </div>

        <div className="services__grid">
          {SERVICES.map(({ icon: Icon, title, text }) => (
            <div className="service-card hairline" key={title}>
              <Icon size={22} strokeWidth={1.5} className="service-card__icon" />
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
