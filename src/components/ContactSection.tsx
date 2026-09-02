import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  Mail, 
  Send, 
  Linkedin, 
  Github, 
  Copy, 
  Check, 
  MessageSquare, 
  Sparkles,
  MapPin,
  Clock,
  ArrowUpRight
} from 'lucide-react';
import { LinkedInProfile, ContactMessage } from '../types';

interface ContactSectionProps {
  profile: LinkedInProfile;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ profile }) => {
  const [formData, setFormData] = useState<ContactMessage>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const [copiedEmail, setCopiedEmail] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [lastMailtoUrl, setLastMailtoUrl] = useState<string>('');

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setIsSubmitting(true);

    const subjectText = formData.subject?.trim() || `Contacto desde Portfolio: ${formData.name}`;
    const bodyText = `Hola ${profile.name || ''},\n\nSoy ${formData.name} (${formData.email}).\n${formData.message}\n`;

    const mailtoUrl = `mailto:${encodeURIComponent(profile.email)}?subject=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(bodyText)}`;

    setLastMailtoUrl(mailtoUrl);

    // Abrir el cliente de correo predeterminado
    window.location.href = mailtoUrl;

    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.8 },
      });
    }, 400);
  };

  return (
    <section id="contact" className="py-16 md:py-24 border-t border-neutral-800/80 bg-neutral-950/60 relative overflow-hidden">
      
      {/* Background ambient lighting */}
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-950/20 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-mono font-medium text-indigo-400 uppercase tracking-wider mb-2">
            <MessageSquare className="w-4 h-4" />
            <span>Contacto Directo</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Hablemos sobre tu próximo proyecto
          </h2>
          <p className="text-sm text-neutral-400 mt-2 leading-relaxed">
            ¿Tienes una propuesta, consulta técnica o idea de colaboración? Envíame un mensaje o contáctame directamente por LinkedIn o correo.
          </p>
        </div>

        {/* Contact Layout: Left Info / Right Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Direct Links & Info */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Email Copy Card */}
            <div className="flex row justify-between rounded-2xl bg-neutral-900/80 border border-neutral-800 p-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-indigo-600/10 text-indigo-400 border border-indigo-500/20">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Correo Electrónico
                  </h3>
                  <p className="text-xs text-neutral-400 font-mono">
                    {profile.email}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCopyEmail}
                  id="btn-copy-email"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium border border-neutral-700 transition-colors cursor-pointer"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span className="text-emerald-400 font-semibold">¡Copiado!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-neutral-400" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>

                <a
                  href={`mailto:${profile.email}`}
                  className="inline-flex items-center justify-center p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-colors"
                  title="Abrir cliente de correo"
                >
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Social Network Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {profile.linkedinUrl && (
                <a
                  href={profile.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 rounded-xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 hover:border-[#0a66c2]/40 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-[#0a66c2]/10 text-[#0a66c2]">
                      <Linkedin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-neutral-200 group-hover:text-white">
                        LinkedIn
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        Conectar
                      </div>
                    </div>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-[#0a66c2] transition-colors" />
                </a>
              )}

              <a
                href={`https://github.com/${profile.githubUsername}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 rounded-xl bg-neutral-900/60 hover:bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-neutral-800 text-white">
                    <Github className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-neutral-200 group-hover:text-white">
                      GitHub
                    </div>
                    <div className="text-[11px] text-neutral-400">
                      @{profile.githubUsername}
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white transition-colors" />
              </a>

            </div>

            {/* Location & Availability Note */}
            <div className="p-4 rounded-xl bg-neutral-900/40 border border-neutral-800/80 text-xs text-neutral-400 space-y-2">
              <div className="flex items-center gap-2 text-neutral-300">
                <MapPin className="w-4 h-4 text-indigo-400" />
                <span>{profile.location}</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-400">
                <Clock className="w-4 h-4 text-neutral-500" />
                <span>Tiempo de respuesta habitual: menos de 24 horas.</span>
              </div>
            </div>

          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl bg-neutral-900/80 border border-neutral-800 p-6 sm:p-8 shadow-xl">
              
              {submitted ? (
                <div className="text-center py-10 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto">
                    <Check className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    ¡Cliente de correo abierto!
                  </h3>
                  <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
                    Se preparó tu mensaje para ser enviado a <span className="text-neutral-200 font-medium font-mono">{profile.email}</span>. Revisa tu aplicación de correo para confirmar el envío.
                  </p>
                  {lastMailtoUrl && (
                    <div className="pt-1">
                      <a
                        href={lastMailtoUrl}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-xs font-medium transition-colors"
                      >
                        <span>¿No se abrió automáticamente? Haz clic aquí</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  )}
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({
                          name: '',
                          email: '',
                          subject: '',
                          message: '',
                        });
                      }}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-medium transition-colors cursor-pointer"
                    >
                      <span>Enviar otro mensaje</span>
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-neutral-300 font-semibold mb-1">
                        Tu Nombre
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="ej: María González"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="block text-neutral-300 font-semibold mb-1">
                        Tu Correo Electrónico
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="maria@empresa.com"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1">
                      Asunto
                    </label>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="ej: Oportunidad de Proyecto / Consultoría"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500"
                    />
                  </div>

                  <div>
                    <label className="block text-neutral-300 font-semibold mb-1">
                      Mensaje
                    </label>
                    <textarea
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Cuéntame sobre tu proyecto, requerimientos o inquietud..."
                      className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    id="btn-submit-contact"
                    className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-md transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>{isSubmitting ? 'Abriendo cliente de correo...' : 'Enviar Mensaje Directo'}</span>
                  </button>

                  <p className="text-[11px] text-neutral-500 text-center">
                    Se abrirá tu cliente de correo para enviar el mensaje a {profile.email}
                  </p>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>

    </section>
  );
};
