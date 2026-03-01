import React, { useState } from 'react';

const Footer = () => {
  const [expandedSections, setExpandedSections] = useState({
    cancelacion: true,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const sociosSupport = [
    {
      id: 'atencion',
      title: 'Atención al socio',
      description: 'Consultas sobre turnos, acceso y seguimiento de membresía.',
      cta: 'contacto@laresistenciagym.com',
    },
    {
      id: 'baja',
      title: 'Solicitud de baja',
      description: 'Gestionamos la solicitud por mail con 30 días de anticipación.',
      cta: 'contacto@laresistenciagym.com',
    },
    {
      id: 'beneficios',
      title: 'Beneficios',
      description: 'Promociones activas y upgrades disponibles en recepción.',
      cta: null,
    },
  ];

  const legalItems = [
    {
      id: 'cancelacion',
      title: 'Cancelación y arrepentimiento',
      summary: 'Podés iniciar la baja por correo y recibir confirmación del proceso por el mismo canal.',
    },
    {
      id: 'contratos',
      title: 'Contratos de adhesión',
      summary: 'La documentación está disponible para consulta en administración y por solicitud escrita.',
    },
    {
      id: 'privacidad',
      title: 'Privacidad y datos',
      summary: 'Usamos tus datos para gestionar acceso, pagos y seguimiento interno de tu membresía.',
    },
    {
      id: 'defensa',
      title: 'Defensa al consumidor',
      summary: 'Si necesitás soporte formal, te orientamos desde recepción o por correo.',
    },
  ];

  return (
    <footer className="border-t border-gray-900 bg-black text-white transition-all duration-1000">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-heading font-bold uppercase">
                La Resistencia <span className="text-primary">Gym</span>
              </h2>
              <p className="mt-3 max-w-sm text-sm leading-6 text-gray-400">
                Entrenamiento directo, seguimiento real y una comunidad que empuja para adelante.
              </p>
            </div>
            <div className="space-y-3 text-sm text-gray-300">
              <a
                href="mailto:contacto@laresistenciagym.com"
                className="block rounded-2xl border border-gray-800 bg-surface px-4 py-3 transition-colors hover:border-primary/40 hover:text-white"
              >
                contacto@laresistenciagym.com
              </a>
              <div className="rounded-2xl border border-gray-800 bg-surface px-4 py-3 text-gray-400">
                Atención administrativa: lunes a sábado
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-heading font-bold mb-4 uppercase tracking-wide">Socios</h3>
            <ul className="space-y-3">
              {sociosSupport.map((item) => (
                <li key={item.id} className="rounded-2xl border border-gray-800 bg-surface p-4">
                  <p className="text-sm font-semibold uppercase tracking-wide text-white">{item.title}</p>
                  <p className="mt-2 text-sm leading-6 text-gray-400">{item.description}</p>
                  {item.cta ? (
                    <a
                      href={`mailto:${item.cta}`}
                      className="mt-3 inline-flex text-xs font-semibold uppercase tracking-[0.18em] text-primary"
                    >
                      {item.cta}
                    </a>
                  ) : (
                    <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">
                      Disponible en recepción
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-heading font-bold mb-4 uppercase tracking-wide">Legal</h3>
            <ul className="space-y-2">
              {legalItems.map((item) => (
                <li key={item.id} className="rounded-2xl border border-gray-800 bg-surface">
                  <button
                    onClick={() => toggleSection(item.id)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-4 text-left"
                    aria-expanded={Boolean(expandedSections[item.id])}
                  >
                    <span className="text-sm font-semibold uppercase tracking-wide text-white">
                      {item.title}
                    </span>
                    <svg
                      className={`h-4 w-4 shrink-0 text-primary transition-transform ${expandedSections[item.id] ? 'rotate-180' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {expandedSections[item.id] && (
                    <div className="border-t border-gray-800 px-4 py-4">
                      <p className="text-sm leading-6 text-gray-400">{item.summary}</p>
                      <a
                        href="mailto:contacto@laresistenciagym.com"
                        className="mt-3 inline-flex text-xs font-semibold uppercase tracking-[0.18em] text-primary"
                      >
                        Solicitar detalle por correo
                      </a>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 rounded-3xl border border-gray-800 bg-surface p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary">Información importante</p>
              <p className="mt-3 text-sm leading-6 text-gray-400">
                Tu apto médico es indispensable al iniciar cualquier actividad física. Si necesitás copia de condiciones,
                consentimiento o información de defensa del consumidor, la entregamos por correo o en administración.
              </p>
            </div>
            <div className="rounded-2xl border border-primary/25 bg-primary/10 px-5 py-4 text-sm font-semibold uppercase tracking-[0.18em] text-white">
              Confirmación y soporte por mail
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-6 mt-6">
          <p className="text-gray-400 text-sm text-center mt-4">
            Copyright © {new Date().getFullYear()} LA RESISTENCIA GYM. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
