import { useNavigate } from 'react-router-dom';
import logo from '../assets/imagotipo.png';
import { Monitor, ShieldCheck, Clock, Smartphone, ArrowRight } from 'lucide-react';

const features = [
  {
    icon: <Monitor size={26} />,
    title: 'Reserva en Línea',
    desc: 'Reserve sus pasajes de manera rápida y segura desde cualquier lugar',
  },
  {
    icon: <ShieldCheck size={26} />,
    title: 'Seguridad Garantizada',
    desc: 'Viaje con tranquilidad en nuestros vehículos certificados y conductores profesionales',
  },
  {
    icon: <Clock size={26} />,
    title: 'Disponibilidad 24/7',
    desc: 'Acceda a nuestro sistema en cualquier momento del día',
  },
  {
    icon: <Smartphone size={26} />,
    title: 'Desde Cualquier Dispositivo',
    desc: 'Compatible con computadoras, tablets y smartphones',
  },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ── HERO ── */}
      <section
        className="bg-cootrans-hero"
        style={{
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1.5rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative blobs */}
        <div style={{
          position: 'absolute', top: '-80px', right: '-80px',
          width: '320px', height: '320px', borderRadius: '50%',
          background: 'rgba(255,255,255,.06)', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: '-60px', left: '-60px',
          width: '260px', height: '260px', borderRadius: '50%',
          background: 'rgba(255,255,255,.05)', pointerEvents: 'none',
        }} />

        {/* Logo placeholder */}
        <div className="animate-fade-up" style={{
          width: 90, height: 90, borderRadius: '50%',
          background: 'rgba(255,255,255,.15)', backdropFilter: 'blur(8px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          marginBottom: '1.5rem', border: '2px solid rgba(255,255,255,.3)',
          boxShadow: '0 8px 32px rgba(0,0,0,.2)',
        }}>
          <span style={{ fontSize: '2.2rem' }}>
            <img src={logo} alt="Logo" />
          </span>
        </div>

        <h1
          className="animate-fade-up delay-100"
          style={{ color: '#fff', fontSize: 'clamp(2rem, 5vw, 3.25rem)', fontWeight: 900, margin: '0 0 .75rem', lineHeight: 1.15 }}
        >
          Viaje Seguro y Confiable
        </h1>

        <p className="animate-fade-up delay-200" style={{ color: 'rgba(255,255,255,.85)', fontSize: '1.125rem', marginBottom: '.5rem' }}>
          La seguridad y calidad de servicio van de la mano
        </p>
        <p className="animate-fade-up delay-200" style={{ color: 'rgba(255,255,255,.65)', fontSize: '.95rem', marginBottom: '2.5rem' }}>
          Transporte intermunicipal Ábrego – Ocaña y más destinos
        </p>

        <div className="animate-fade-up delay-300" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button id="cta-register" className="btn-gold" onClick={() => navigate('/register')}>
            Comenzar Ahora <ArrowRight size={18} />
          </button>
          <button id="cta-login" className="btn-outline-white" onClick={() => navigate('/login')}>
            Iniciar Sesión
          </button>
        </div>
      </section>

      {/* ── WHY COOTRANS ── */}
      <section style={{ padding: '5rem 1.5rem', background: '#fff' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
          <h2 className="animate-fade-up" style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: 'var(--green-dark)', marginBottom: '.75rem' }}>
            ¿Por qué elegir COOTRANS Hacaritama?
          </h2>
          <p className="animate-fade-up delay-100" style={{ color: 'var(--gray-600)', fontSize: '1rem', marginBottom: '3rem', maxWidth: 540, margin: '0 auto 3rem' }}>
            Somos una cooperativa de transporte comprometida con su seguridad y comodidad
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginTop: '2.5rem' }}>
            {features.map((f, i) => (
              <div key={i} className={`feature-card animate-fade-up delay-${(i + 1) * 100}`} style={{ textAlign: 'left' }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '12px',
                  background: 'var(--gray-100)', display: 'flex',
                  alignItems: 'center', justifyContent: 'center',
                  color: 'var(--green-main)', marginBottom: '1rem',
                }}>
                  {f.icon}
                </div>
                <h3 style={{ fontWeight: 700, fontSize: '.95rem', color: 'var(--gray-800)', marginBottom: '.4rem' }}>{f.title}</h3>
                <p style={{ fontSize: '.875rem', color: 'var(--gray-600)', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="bg-cootrans-footer" style={{ padding: '4.5rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
          <h2 style={{ color: '#fff', fontSize: 'clamp(1.5rem, 3vw, 2rem)', fontWeight: 800, marginBottom: '.75rem' }}>
            ¿Listo para viajar con nosotros?
          </h2>
          <p style={{ color: 'rgba(255,255,255,.8)', marginBottom: '2rem' }}>
            Únase a miles de pasajeros satisfechos que confían en COOTRANS Hacaritama
          </p>
          <button id="cta-register-footer" className="btn-gold" onClick={() => navigate('/register')}>
            Crear Cuenta Ahora <ArrowRight size={18} />
          </button>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#111', padding: '1.5rem', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,.45)', fontSize: '.8rem', margin: 0 }}>
          © 2025 COOTRANS Hacaritama. Todos los derechos reservados.
        </p>
        <p style={{ color: 'rgba(255,255,255,.3)', fontSize: '.75rem', marginTop: '.25rem' }}>
          Ábrego, Norte de Santander – Colombia
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
