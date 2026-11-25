import { Link } from 'react-router-dom'

const hours = [
  'Mon – Fri: 9:30 – 9:00',
  'Sat – Sun: 9:30 – 10:00',
]

const payments = ['Cash', 'Cards', 'UPI']

const year = new Date().getFullYear()

export default function Footer() {
  return (
    <footer className="border-t-3 border-ink bg-ink text-gold">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <img
            src="/logo.png"
            alt="A & A Women Store"
            className="h-20 w-20 border-3 border-gold object-cover"
            width={80}
            height={80}
          />
          <p className="mt-3 font-body text-sm text-cream">
            Women's fashion, Old Pallavaram.
          </p>
        </div>

        <div>
          <h3 className="font-display uppercase text-sm text-cream">Visit</h3>
          <address className="mt-3 font-body text-sm not-italic leading-relaxed">
            No. 108, PV Vaithiyalingam Road
            <br />
            (Opp. IOB), Malliga Nagar,
            <br />
            Krishnapuram, Old Pallavaram,
            <br />
            Chennai 600117
          </address>
        </div>

        <div>
          <h3 className="font-display uppercase text-sm text-cream">Contact</h3>
          <p className="mt-3 font-body text-sm">
            <a href="tel:+917904733345" className="hover:text-cream hover:underline">
              +91 79047 33345
            </a>
            <br />
            <a
              href="https://wa.me/917904733345"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cream hover:underline"
            >
              WhatsApp
            </a>
            <br />
            <a
              href="https://instagram.com/aandawomenstore"
              target="_blank"
              rel="noreferrer"
              className="hover:text-cream hover:underline"
            >
              @aandawomenstore
            </a>
          </p>
          <h3 className="mt-6 font-display uppercase text-sm text-cream">Hours</h3>
          <ul className="mt-3 font-body text-sm">
            {hours.map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display uppercase text-sm text-cream">Payments</h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {payments.map((p) => (
              <li key={p} className="border-3 border-gold px-2 py-1 font-mono text-xs uppercase">
                {p}
              </li>
            ))}
          </ul>
          <nav className="mt-6 flex flex-col gap-2 font-body text-sm" aria-label="Footer">
            <Link to="/shop" className="hover:text-cream hover:underline">
              Shop
            </Link>
            <Link to="/tailoring" className="hover:text-cream hover:underline">
              Tailoring
            </Link>
            <Link to="/contact" className="hover:text-cream hover:underline">
              Contact
            </Link>
          </nav>
        </div>
      </div>

      <div className="border-t-3 border-gold px-6 py-4 text-center font-mono text-xs">
        © {year} A &amp; A Women Store
      </div>
    </footer>
  )
}
