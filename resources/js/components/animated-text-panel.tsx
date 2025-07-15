import { AnimatePresence, motion, Variants } from 'framer-motion';
import { Award, BarChart3, Calculator, DollarSign, FileText, Globe, Shield, TrendingUp, Users, Zap } from 'lucide-react';
import React, { useEffect, useState } from 'react';

interface TextContent {
  title: string;
  description: string;
  icon: React.ReactNode;
  stats: string;
  color: string;
  bgColor: string;
}

const textContents: TextContent[] = [
  {
    title: 'Gestión Financiera Integral',
    description:
      'Controla todos los aspectos financieros de tu empresa desde una sola plataforma. Automatiza procesos contables y reduce errores manuales con herramientas inteligentes.',
    icon: <Calculator className="h-6 w-6" />,
    stats: '99.9% Precisión',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'Reportes en Tiempo Real',
    description:
      'Genera reportes financieros actualizados al instante. Toma decisiones informadas con datos precisos y dashboards interactivos que se actualizan automáticamente.',
    icon: <TrendingUp className="h-6 w-6" />,
    stats: 'Reportes Instantáneos',
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-50',
  },
  {
    title: 'Seguridad Empresarial',
    description:
      'Protege la información financiera con encriptación de nivel bancario, controles de acceso granulares y auditorías completas de todas las transacciones.',
    icon: <Shield className="h-6 w-6" />,
    stats: 'Certificación ISO 27001',
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    title: 'Automatización Inteligente',
    description:
      'Automatiza tareas repetitivas como conciliaciones bancarias, facturación recurrente y seguimiento de pagos. Ahorra tiempo y elimina errores humanos.',
    icon: <Zap className="h-6 w-6" />,
    stats: '80% Menos Tiempo Manual',
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    title: 'Colaboración Eficiente',
    description:
      'Facilita el trabajo en equipo con roles definidos, flujos de aprobación personalizables y trazabilidad completa de cambios en tiempo real.',
    icon: <Users className="h-6 w-6" />,
    stats: 'Equipos Sincronizados',
    color: 'from-indigo-500 to-indigo-600',
    bgColor: 'bg-indigo-50',
  },
  {
    title: 'Análisis Avanzado',
    description:
      'Obtén insights profundos sobre el rendimiento financiero con dashboards interactivos, análisis predictivo y alertas inteligentes personalizadas.',
    icon: <BarChart3 className="h-6 w-6" />,
    stats: 'KPIs en Vivo',
    color: 'from-teal-500 to-teal-600',
    bgColor: 'bg-teal-50',
  },
  {
    title: 'Facturación Inteligente',
    description:
      'Crea y envía facturas profesionales automáticamente. Gestiona cobros, recordatorios y seguimiento de pagos con inteligencia artificial.',
    icon: <FileText className="h-6 w-6" />,
    stats: 'Facturación Automática',
    color: 'from-rose-500 to-rose-600',
    bgColor: 'bg-rose-50',
  },
  {
    title: 'Control de Flujo de Caja',
    description:
      'Monitorea el flujo de efectivo en tiempo real con proyecciones precisas. Anticipa necesidades de liquidez y optimiza la gestión financiera.',
    icon: <DollarSign className="h-6 w-6" />,
    stats: 'Proyecciones Precisas',
    color: 'from-green-500 to-green-600',
    bgColor: 'bg-green-50',
  },
];

const FloatingElement = ({ delay = 0, duration = 8, className = '' }) => (
  <motion.div
    className={`absolute opacity-15 ${className}`}
    animate={{ y: [-5, 5, -5], x: [-3, 3, -3], rotate: [0, 3, -3, 0] }}
    transition={{ duration, ease: 'easeInOut', repeat: Infinity, delay }}
  />
);

const DataVisualization = ({ currentIndex }: { currentIndex: number }) => (
  <div className="absolute bottom-20 left-8 z-5 opacity-15">
    <div className="flex h-16 items-end gap-1">
      {[65, 45, 80, 35, 90, 55].map((h, i) => (
        <motion.div
          key={i}
          className="w-2 rounded-sm bg-slate-400"
          initial={{ height: 0 }}
          animate={{ height: `${h}%`, backgroundColor: i === currentIndex ? '#3b82f6' : '#94a3b8' }}
          transition={{ duration: 0.6, delay: i * 0.05, ease: 'easeOut' }}
        />
      ))}
    </div>
  </div>
);

const NetworkNodes = () => {
  const nodes = [
    { x: 20, y: 30, size: 4 },
    { x: 60, y: 20, size: 3 },
    { x: 80, y: 50, size: 5 },
    { x: 40, y: 70, size: 3 },
  ];
  return (
    <div className="absolute top-8 right-8 z-1 h-24 w-24 opacity-15">
      <svg viewBox="0 0 100 100" width="100%" height="100%">
        {[
          { from: 0, to: 1, delay: 0 },
          { from: 1, to: 2, delay: 0.3 },
          { from: 2, to: 3, delay: 0.6 },
        ].map(({ from, to, delay }, idx) => (
          <motion.line
            key={idx}
            x1={nodes[from].x}
            y1={nodes[from].y}
            x2={nodes[to].x}
            y2={nodes[to].y}
            stroke="#64748b"
            strokeWidth="0.5"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay, repeat: Infinity, repeatType: 'reverse' }}
          />
        ))}
        {nodes.map((n, i) => (
          <motion.circle
            key={i}
            cx={n.x}
            cy={n.y}
            r={n.size}
            fill="#64748b"
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 1, delay: i * 0.3, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </svg>
    </div>
  );
};

export default function AnimatedTextPanel() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => setCurrentIndex((prev) => (prev + 1) % textContents.length), 3000);
    return () => clearInterval(interval);
  }, []);

  const currentContent = textContents[currentIndex];
  const slideVariants: Variants = {
    enter: { x: 100, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
  };

  return (
    <div className="relative flex h-full flex-col justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/10 to-indigo-50/10 p-8 lg:p-12">
      <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[length:15px_15px]" />

      <FloatingElement delay={0} duration={8} className="top-1/4 right-1/4 z-1 h-3 w-3 rounded-full bg-blue-200" />
      <FloatingElement delay={1} duration={8} className="bottom-1/3 left-1/5 z-1 h-10 w-2 rounded-full bg-indigo-200" />
      <FloatingElement delay={2} duration={8} className="top-1/2 left-1/6 z-1 h-2 w-10 rounded-full bg-blue-300" />
      <FloatingElement delay={3} duration={8} className="top-1/6 left-1/3 z-1 h-3 w-3 rotate-45 rounded-full bg-slate-200" />
      <FloatingElement delay={4} duration={8} className="right-1/3 bottom-1/4 z-1 h-1 w-5 rounded-full bg-indigo-300" />
      <DataVisualization currentIndex={currentIndex} />

      <NetworkNodes />

      <div className="relative z-10 mx-auto max-w-lg">
        <AnimatePresence initial={false} custom={currentIndex} mode="wait">
          <motion.div
            key={currentIndex}
            custom={currentIndex}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: 'tween', duration: 0.5 }}
            className="space-y-6 pt-4"
          >
            <div
              className={`inline-flex items-center gap-2 rounded-full ${currentContent.bgColor} border border-white/50 px-4 py-2 text-xs font-semibold text-slate-700 backdrop-blur-sm`}
            >
              <motion.div
                className="h-2 w-2 rounded-full bg-green-500"
                animate={{ scale: [1, 1.3, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              {currentContent.stats}
            </div>

            <motion.div
              initial={{ scale: 0.7, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ delay: 0.1, duration: 0.3, type: 'spring', stiffness: 180, damping: 12 }}
              className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${currentContent.color} text-white shadow-lg`}
            >
              <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
                {currentContent.icon}
              </motion.div>
            </motion.div>

            <h2 className="text-3xl font-bold text-slate-800">{currentContent.title}</h2>
            <p className="text-base text-slate-600">{currentContent.description}</p>

            <div className="flex items-center gap-4 pt-2 text-sm text-slate-500">
              <Globe className="h-4 w-4" />
              <span>Global</span>
              <Award className="h-4 w-4" />
              <span>Certificado</span>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
