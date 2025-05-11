'use client';

import { useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import { motion, useScroll, useTransform, AnimatePresence, useMotionValueEvent } from 'framer-motion';
import { Code, Terminal, BrainCircuit, Cpu, Binary, GitBranch, Network } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

// Фиксированные данные для детерминированного рендеринга
const FRACTAL_PATHS = [
  { x: 64.74, y: 46.25, rotation: 296.07, scale: 0.24 },
  { x: 34.45, y: 45.01, rotation: 10.48, scale: 0.19 },
  { x: 18.59, y: 86.01, rotation: 10.61, scale: 0.28 },
  { x: 73.26, y: 57.88, rotation: 211.84, scale: 0.22 },
  { x: 71.21, y: 76.29, rotation: 6.75, scale: 0.26 }
];

const BINARY_LINES = Array.from({ length: 20 }).map((_, i) => ({
  left: `${10 + i * 4}%`,
  top: `${10 + Math.sin(i) * 20}%`,
  content: i % 2 === 0 ? '10101010101010101010' : '01010101010101010101',
  speed: 0.5 + Math.random() * 0.5
}));

// Компонент шумного фона в стиле Framer
const NoiseBackground = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <svg className="absolute inset-0 w-full h-full opacity-[10%]"> {/* Увеличил opacity до 10% */}
      <filter id="noise">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves="2"
          stitchTiles="stitch"
        />
        <feColorMatrix type="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 200 -70" /> {/* Подстроил значения feColorMatrix для большего контраста */}
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
    <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70" />
  </div>
);


// Компонент параллакс слоя
const ParallaxLayer = ({ children, speed = 1, className = '' }) => {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100 * speed]);

  return (
    <motion.div style={{ y }} className={className}>
      {children}
    </motion.div>
  );
};

const SelfUniversityHome = () => {
  const containerRef = useRef(null);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end']
  });

  // Параллакс эффекты для разных слоев
  // const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const middlegroundY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  // const foregroundY = useTransform(scrollYProgress, [0, 1], [0, -300]);

  // Переходы между слайдами
  const firstSlideOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const secondSlideY = useTransform(scrollYProgress, [0.2, 0.7], [300, 0]);
  const secondSlideOpacity = useTransform(scrollYProgress, [0.2, 0.4], [0, 1]);
  const thirdSlideY = useTransform(scrollYProgress, [0.5, 1], [500, 0]);
  const thirdSlideOpacity = useTransform(scrollYProgress, [0.5, 0.7], [0, 1]);

  // Хедер
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0.8]);
  const headerBlur = useTransform(scrollYProgress, [0, 0.1], [0, 4]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    setHeaderVisible(latest < 0.95);
  });

  const renderFractalPattern = () => (
    <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-10">
      {FRACTAL_PATHS.map((path, i) => (
        <motion.path
          key={i}
          d="M10,10 L90,10 L90,90 L10,90 Z"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          transform={`translate(${path.x} ${path.y}) rotate(${path.rotation}) scale(${path.scale})`}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 2, delay: i * 0.1 }}
        />
      ))}
    </svg>
  );

  return (
    <>
      <Head>
        <title>Self University | The Future of Technical Education</title>
        <meta name="description" content="Code. Create. Conquer." />
      </Head>

      <div className="relative bg-black text-white overflow-hidden">
        {/* Шумный фон в стиле Framer */}
        <NoiseBackground />

        {/* Фоновые элементы с параллаксом */}
        <ParallaxLayer speed={0.2}>
          <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-[2%]" />
        </ParallaxLayer>

        {/* Прозрачный хедер */}
        <AnimatePresence>
          {headerVisible && (
            <motion.header
              style={{ opacity: headerOpacity, backdropFilter: `blur(${headerBlur}px)` }}
              className="fixed top-0 left-0 right-0 z-50 bg-black/50 border-b border-white/10"
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              exit={{ y: -100 }}
              transition={{ type: 'spring', damping: 20 }}
            >
              <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
                    className="w-8 h-8"
                  >
                    <Binary className="w-full h-full text-white" aria-hidden="true" />
                  </motion.div>
                  <span className="text-xl font-mono font-bold">SELF_UNIVERSITY</span>
                </div>
                <nav className="hidden md:flex space-x-8">
                  {['Curriculum', 'Labs', 'Research', 'Admissions'].map((item, i) => (
                    <motion.a
                      key={item}
                      href="#"
                      className="text-white/80 hover:text-white transition-colors font-mono text-sm"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 + i * 0.1 }}
                    >
                      {item.toUpperCase()}
                    </motion.a>
                  ))}
                </nav>
                <Button variant="ghost" className="font-mono border border-white/20 ">
                  APPLY NOW
                </Button>
              </div>
            </motion.header>
          )}
        </AnimatePresence>

        <div ref={containerRef} className="h-[300vh] relative">
          {/* Первый слайд */}
          <motion.div
            style={{
              y: middlegroundY,
              opacity: firstSlideOpacity
            }}
            className="fixed inset-0 flex items-center justify-center"
          >
            <ParallaxLayer speed={0.5}>
              {renderFractalPattern()}
            </ParallaxLayer>

            <div className="container mx-auto flex flex-col items-center justify-center text-center px-4">
              <motion.h1
                className="text-5xl md:text-8xl font-bold mb-6 font-mono"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <ParallaxLayer speed={0.3}>
                  <span className="text-white">CODE.CREATE.CONQUER</span>
                </ParallaxLayer>

              </motion.h1>

              <ParallaxLayer speed={0.6}>
                <motion.p
                  className="text-xl md:text-2xl text-white/70 max-w-3xl mb-12 font-mono"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  THE ULTIMATE PROGRAMMER`S UNIVERSITY WHERE ALGORITHMS MEET ART
                </motion.p>
              </ParallaxLayer>

              <ParallaxLayer speed={0.7}>
                <motion.div
                  className="flex flex-col sm:flex-row gap-4 mb-24"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button className="px-8 py-6 bg-white text-black hover:bg-white/90 transition-all font-mono gap-2">
                    <Terminal className="w-5 h-5" />
                    EXPLORE CURRICULUM
                  </Button>
                  <Button variant="outline" className="px-8 py-6 border-white/30 hover:bg-white/10 font-mono gap-2">
                    <Code className="w-5 h-5" />
                    JOIN CODING LAB
                  </Button>
                </motion.div>
              </ParallaxLayer>
            </div>
          </motion.div>

          {/* Второй слайд */}
          <motion.div
            style={{
              y: secondSlideY,
              opacity: secondSlideOpacity
            }}
            className="fixed inset-0 flex items-center justify-center bg-black/90"
          >
            <div className="container mx-auto px-4">
              <NoiseBackground />
              <ParallaxLayer speed={0.4}>
                <motion.h2
                  className="text-4xl md:text-6xl font-bold mb-12 text-center font-mono"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ margin: "-100px" }}
                >
                  <span className="text-white">CORE</span>
                  <span className="text-white/50">_</span>
                  <span className="text-white">DISCIPLINES</span>
                </motion.h2>
              </ParallaxLayer>

              <div className="grid md:grid-cols-3 gap-6">
                {[
                  { icon: <Code className="w-8 h-8" />, title: "Quantum Computing", desc: "Master qubits and quantum algorithms" },
                  { icon: <BrainCircuit className="w-8 h-8" />, title: "Neural Architectures", desc: "Design next-gen AI systems" },
                  { icon: <GitBranch className="w-8 h-8" />, title: "Decentralized Systems", desc: "Build web3 infrastructure" },
                ].map((item, i) => (
                  <ParallaxLayer key={item.title} speed={0.5 + i * 0.1}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.2, duration: 0.5 }}
                      viewport={{ once: true, margin: "-100px" }}
                    >
                      <Card className="bg-black/70 border-white/10 hover:border-white/30 transition-all h-full backdrop-blur-sm">
                        <CardHeader>
                          <motion.div
                            className="mb-4 text-white"
                            whileHover={{ scale: 1.1 }}
                          >
                            {item.icon}
                          </motion.div>
                          <CardTitle className="font-mono text-white">{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <CardDescription className="text-white/70">
                            {item.desc}
                          </CardDescription>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </ParallaxLayer>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Третий слайд */}
          <motion.div
            style={{
              y: thirdSlideY,
              opacity: thirdSlideOpacity
            }}
            className="fixed inset-0 flex items-center justify-center bg-black/90"
          >
            <div className="container mx-auto px-4">
              <NoiseBackground />
              <div className="relative h-[80vh]">
                <ParallaxLayer speed={0.3}>
                  <h3 className="text-4xl font-mono mb-8 text-center">MATH_IS_BEAUTIFUL</h3>
                </ParallaxLayer>

                <ParallaxLayer speed={0.5}>
                  <svg viewBox="0 0 800 400" className="w-full h-full">
                    {Array.from({ length: 40 }).map((_, i) => {
                      const x = i * 20;
                      return (
                        <motion.path
                          key={i}
                          d={`M${x},400 ${x},${350 - Math.sin(i / 5) * 100 - (i % 3) * 30}`}
                          stroke="white"
                          strokeWidth="1"
                          fill="none"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 2, delay: i * 0.02 }}
                        />
                      );
                    })}
                  </svg>
                </ParallaxLayer>
              </div>
            </div>
          </motion.div>

          {/* Плавающие элементы с параллаксом */}
          {isClient && (
            <>
              <ParallaxLayer speed={0.8}>
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {BINARY_LINES.map((line, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-white/5 font-mono text-xs whitespace-nowrap"
                      style={{
                        left: line.left,
                        top: line.top,
                      }}
                      animate={{
                        y: [0, 100, 0],
                        opacity: [0.02, 0.1, 0.02],
                      }}
                      transition={{
                        duration: 10 / line.speed,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    >
                      {line.content}
                    </motion.div>
                  ))}
                </div>
              </ParallaxLayer>

              <ParallaxLayer speed={1.2}>
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {[Code, Cpu, BrainCircuit, Network, GitBranch].map((Icon, i) => (
                    <motion.div
                      key={i}
                      className="absolute text-white/10"
                      style={{
                        width: '80px',
                        height: '80px',
                        left: `${10 + i * 15}%`,
                        top: `${20 + Math.sin(i) * 20}%`,
                      }}
                      animate={{
                        y: [0, 100, 0],
                        x: [0, 50, 0],
                        rotate: [0, 360],
                      }}
                      transition={{
                        duration: 15 + i * 3,
                        repeat: Infinity,
                        repeatType: "reverse",
                      }}
                    >
                      <Icon className="w-full h-full" />
                    </motion.div>
                  ))}
                </div>
              </ParallaxLayer>
            </>
          )}
        </div>

        {/* Футер */}
        <motion.footer
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ margin: "-100px" }}
          className="relative z-10 bg-black/90 border-t border-white/10 py-12 backdrop-blur-sm"
        >
          <div className="container mx-auto px-4">
            <NoiseBackground />
            <ParallaxLayer speed={0.3}>
              <div className="flex flex-col md:flex-row justify-between items-start gap-12">
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <Binary className="w-6 h-6" />
                    <span className="text-xl font-mono font-bold">SELF_UNIVERSITY</span>
                  </div>
                  <p className="text-white/60 font-mono max-w-md">
                    deep learning cryptography & cybersecurity
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                  <div>
                    <h4 className="text-white/80 font-mono mb-4">LEARN</h4>
                    <ul className="space-y-2">
                      {['Curriculum', 'Labs', 'Research', 'Open Source'].map((item) => (
                        <li key={item}>
                          <a href="#" className="text-white/50 hover:text-white font-mono text-sm transition-colors">
                            {item}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-white/80 font-mono mb-4">ABOUT</h4>
                    <ul className="space-y-2">
                      {['Mission', 'Faculty', 'Campus', 'History'].map((item) => (
                        <li key={item}>
                          <a href="#" className="text-white/50 hover:text-white font-mono text-sm transition-colors">
                            {item}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-white/80 font-mono mb-4">CONNECT</h4>
                    <ul className="space-y-2">
                      {['GitHub', 'Twitter', 'Discord', 'Contact'].map((item) => (
                        <li key={item}>
                          <a href="#" className="text-white/50 hover:text-white font-mono text-sm transition-colors">
                            {item}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </ParallaxLayer>

            <ParallaxLayer speed={0.4}>
              <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
                <p className="text-white/40 font-mono text-sm">
                  © {new Date().getFullYear()} Self University. All code is open source.
                </p>
                <div className="flex space-x-6 mt-4 md:mt-0">
                  <Button variant="ghost" size="sm" className="text-white/50 font-mono">
                    Privacy Policy
                  </Button>
                  <Button variant="ghost" size="sm" className="text-white/50 font-mono">
                    Terms of Use
                  </Button>
                </div>
              </div>
            </ParallaxLayer>
          </div>
        </motion.footer>
      </div>
    </>
  );
};

export default SelfUniversityHome;