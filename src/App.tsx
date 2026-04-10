/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion, useScroll, useSpring } from 'motion/react';
import { Download, ChevronRight, List, Smartphone, Globe, Cpu, Layout, Zap } from 'lucide-react';
import { CONTENT } from './constants';
import { cn } from './lib/utils';
import { useRef, type ReactNode } from 'react';

const PageWrapper = ({ children, className, id }: { children: ReactNode; className?: string; id?: string; key?: string }) => (
  <section id={id} className={cn("w-full flex flex-col relative overflow-hidden page-break py-12 md:py-16 px-6 md:px-24", className)}>
    {children}
  </section>
);

const SectionHeader = ({ title, number, light = false }: { title: string; number?: string; light?: boolean }) => (
  <div className="mb-10 md:mb-12">
    <div className="flex items-baseline gap-3 md:gap-5">
      {number && (
        <span className={cn("font-serif font-bold text-4xl md:text-7xl opacity-10", light ? "text-mono-white" : "text-mono-black")}>
          {number}
        </span>
      )}
      <h2 className={cn("text-2xl md:text-5xl font-serif font-bold tracking-tight", light ? "text-mono-white" : "text-mono-900")}>
        {title}
      </h2>
    </div>
    <div className={cn("h-0.5 w-12 md:w-20 mt-3 md:mt-5", light ? "bg-mono-white/40" : "bg-mono-black")} />
  </div>
);

export default function App() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const handleDownload = () => {
    window.print();
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div ref={containerRef} className="relative font-sans antialiased text-mono-900 bg-mono-white">
      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-mono-black origin-left z-50 no-print"
        style={{ scaleX }}
      />

      {/* Floating Action Button */}
      <button
        onClick={handleDownload}
        className="fixed bottom-8 right-8 z-40 bg-mono-black text-mono-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform flex items-center gap-2 no-print group"
      >
        <Download className="w-5 h-5" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 whitespace-nowrap font-sans text-xs tracking-widest uppercase">
          Download PDF
        </span>
      </button>

      {/* 1. New Cover Page - Dark Gray Background */}
      <section className="min-h-screen w-full bg-mono-900 flex flex-col items-center justify-center text-center px-6 page-break">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="space-y-8 md:space-y-12"
        >
          <div className="space-y-4">
            <span className="text-mono-400 font-sans text-sm md:text-base tracking-[0.5em] uppercase block">
              Product Manual
            </span>
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-mono-white tracking-[0.1em]">
              {CONTENT.brand.name}
            </h1>
            <h2 className="text-2xl md:text-4xl font-serif text-mono-300 tracking-[0.2em]">
              产品书
            </h2>
          </div>
          
          <div className="h-px w-24 md:w-40 bg-mono-700 mx-auto" />
          
          <div className="space-y-2">
            <p className="text-lg md:text-2xl font-serif italic text-mono-400">
              「 远看是风景，近看是生活 」
            </p>
          </div>
          
          <div className="pt-12 md:pt-20">
            <span className="text-mono-500 font-sans text-[10px] md:text-xs tracking-[0.4em] uppercase">
              2026 EDITION / MAGICFRAME
            </span>
          </div>
        </motion.div>
      </section>

      {/* 2. Table of Contents */}
      <PageWrapper className="bg-mono-white">
        <div className="max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-4 mb-10 md:mb-16">
            <List className="w-5 h-5 text-mono-black" />
            <h2 className="text-xl md:text-2xl font-serif font-bold tracking-[0.2em] uppercase">目录 / Contents</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 md:gap-x-20 gap-y-2 md:gap-y-4">
            {CONTENT.toc.map((item, i) => (
              <button
                key={i}
                onClick={() => scrollToSection(CONTENT.sections[i]?.id || '')}
                className="flex items-center justify-between group py-3 border-b border-mono-100 hover:border-mono-900 transition-colors text-left"
              >
                <div className="flex items-center gap-5">
                  <span className="font-serif text-xs md:text-sm text-mono-400 group-hover:text-mono-900 transition-colors">{item.number}</span>
                  <span className="font-serif text-base md:text-lg text-mono-700 group-hover:text-mono-900 transition-colors">{item.title}</span>
                </div>
                <ChevronRight className="w-3 h-3 text-mono-300 group-hover:text-mono-900 transition-transform group-hover:translate-x-1" />
              </button>
            ))}
          </div>
        </div>
      </PageWrapper>

      {/* Dynamic Sections */}
      {CONTENT.sections.map((section, idx) => (
        <PageWrapper 
          key={section.id} 
          id={section.id}
          className={cn(
            idx % 2 === 0 ? "bg-mono-50" : "bg-mono-white",
            section.id === "friction" || section.id === "hardware" ? "bg-mono-900 text-mono-white" : ""
          )}
        >
          <div className="max-w-5xl mx-auto w-full">
            <SectionHeader 
              number={section.number} 
              title={section.title} 
              light={section.id === "friction" || section.id === "hardware"}
            />

            {section.content && section.id !== "closing" && (
              <p className={cn(
                "text-base md:text-lg font-serif leading-relaxed mb-8 md:mb-10 max-w-4xl",
                section.id === "friction" || section.id === "hardware" ? "text-mono-300" : "text-mono-800"
              )}>
                {section.content}
              </p>
            )}

            {section.items && (
              <div className="space-y-12 md:space-y-16">
                {section.items.map((item, i) => (
                  <div key={i} className="space-y-4 md:space-y-6">
                    {item.label && (
                      <h3 className="text-xs md:text-sm font-sans font-bold tracking-[0.2em] uppercase text-mono-500">
                        {item.label}
                      </h3>
                    )}
                    {item.title && (
                      <div className="space-y-1">
                        <h3 className="text-lg md:text-2xl font-serif font-bold">{item.title}</h3>
                        {item.subtitle && <p className="text-mono-400 font-sans text-[10px] md:text-xs tracking-widest uppercase">{item.subtitle}</p>}
                      </div>
                    )}
                    {item.content && (
                      <p className={cn(
                        "text-sm md:text-base font-sans leading-relaxed whitespace-pre-line max-w-3xl",
                        section.id === "friction" || section.id === "hardware" ? "text-mono-400" : "text-mono-700"
                      )}>
                        {item.content}
                      </p>
                    )}
                    {item.points && (
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-3">
                        {item.points.map((p, j) => (
                          <li key={j} className="flex items-start gap-3 text-xs md:text-sm text-mono-600 font-sans">
                            <div className="w-1 h-1 bg-mono-400 rounded-full mt-2 shrink-0" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    )}
                    {item.subItems && (
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        {item.subItems.map((si, j) => (
                          <div key={j} className={cn(
                            "p-6 rounded-sm transition-colors",
                            section.id === "friction" || section.id === "hardware" ? "bg-mono-800" : "bg-mono-100"
                          )}>
                            <h4 className="font-serif font-bold text-base md:text-lg mb-3">{si.title}</h4>
                            {si.content && <p className="text-xs md:text-sm text-mono-600 leading-relaxed font-sans">{si.content}</p>}
                            {si.points && (
                              <ul className="space-y-2 mt-3">
                                {si.points.map((p, k) => (
                                  <li key={k} className="text-[10px] md:text-xs text-mono-500 leading-relaxed font-sans">• {p}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {section.groups && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {section.groups.map((group, i) => (
                  <div key={i} className="p-6 border border-mono-200 rounded-sm hover:bg-mono-100 transition-colors">
                    <h3 className="text-base md:text-lg font-serif font-bold tracking-wide mb-6">
                      {group.name}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {group.points.map((p, j) => (
                        <span key={j} className="px-3 py-1.5 border border-mono-300 text-[9px] md:text-[10px] font-sans tracking-wider text-mono-600">
                          {p}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.points && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.points.map((p, i) => (
                  <div key={i} className="flex items-center gap-6 p-6 border border-mono-200 rounded-none">
                    <span className="text-sm md:text-base font-serif text-mono-800 leading-snug">{p}</span>
                  </div>
                ))}
              </div>
            )}

            {section.sections && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {section.sections.map((s, i) => (
                  <div key={i} className="space-y-4 p-6 bg-white/5 rounded-sm border border-white/10">
                    <h3 className="text-xs md:text-sm font-serif font-bold tracking-widest uppercase text-mono-200">{s.name}</h3>
                    <ul className="space-y-2">
                      {s.points.map((p, j) => (
                        <li key={j} className="text-[10px] md:text-xs text-mono-400 font-sans leading-relaxed flex gap-2">
                          <span className="text-mono-500 opacity-50">•</span>
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {section.subItems && !section.items && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {section.subItems.map((si, i) => (
                  <div key={i} className="space-y-6">
                    <h3 className="text-lg md:text-2xl font-serif font-bold border-b border-mono-100 pb-4">{si.title}</h3>
                    {si.content && <p className="text-sm md:text-base font-serif text-mono-600 italic leading-relaxed">「{si.content}」</p>}
                    {si.points && (
                      <ul className="space-y-3">
                        {si.points.map((p, j) => (
                          <li key={j} className="flex items-center gap-3 text-xs md:text-sm font-sans tracking-wide text-mono-700">
                            <div className="w-1 h-1 bg-mono-300 rounded-full" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            )}

            {section.table && (
              <div className="max-w-3xl mx-auto border border-mono-200 rounded-sm overflow-hidden">
                {section.table.map((row, i) => (
                  <div key={i} className={cn(
                    "grid grid-cols-1 md:grid-cols-3 border-b border-mono-100 last:border-0",
                    i % 2 === 0 ? "bg-mono-white" : "bg-mono-50"
                  )}>
                    <div className="p-4 md:p-6 font-sans font-bold text-[10px] md:text-xs tracking-widest uppercase text-mono-500 bg-mono-100/40">
                      {row.label}
                    </div>
                    <div className="p-4 md:p-6 md:col-span-2 font-serif text-sm md:text-base text-mono-800">
                      {row.value}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {section.id === "closing" && (
              <div className="text-center py-12 md:py-16">
                <p className="text-sm md:text-lg font-serif leading-tight text-mono-700 mb-8 italic max-w-2xl mx-auto">
                  「{section.content}」
                </p>
                <h2 className="text-2xl md:text-4xl font-serif font-bold italic text-mono-900">
                  {section.finalTagline}
                </h2>
              </div>
            )}
          </div>
        </PageWrapper>
      ))}

      {/* Final Page */}
      <PageWrapper className="bg-mono-white justify-center text-center">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <span className="font-sans tracking-[1em] text-mono-300 uppercase text-[10px] md:text-xs">MagicFrame</span>
          </div>
          <p className="text-base md:text-lg font-serif text-mono-600 mb-12">
            {CONTENT.brand.vision}
          </p>
          <div className="h-px w-24 md:w-32 bg-mono-200 mx-auto mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            {[
              { label: "Vision", value: "远看是风景" },
              { label: "Life", value: "近看是生活" },
              { label: "Product", value: "MagicFrame" }
            ].map((item, i) => (
              <div key={i} className="flex flex-col gap-1 items-center">
                <span className="text-[9px] font-sans tracking-widest uppercase text-mono-400">{item.label}</span>
                <span className="text-xs md:text-sm font-serif font-bold">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </PageWrapper>

      {/* Footer */}
      <footer className="bg-mono-50 py-16 px-6 md:px-24 border-t border-mono-100 no-print">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10 mb-16">
            <div className="space-y-3">
              <h2 className="font-serif font-bold text-2xl md:text-3xl">{CONTENT.brand.name}</h2>
              <p className="text-[10px] md:text-xs text-mono-400 font-sans tracking-[0.3em] uppercase">Your Family AI Assistant</p>
            </div>
            <div className="flex flex-wrap gap-10 md:gap-16">
              <div className="space-y-3">
                <h4 className="text-[9px] font-sans font-bold tracking-[0.3em] uppercase text-mono-300">Contact</h4>
                <p className="text-xs font-sans tracking-wider">rdFrame@qitegroup.com</p>
              </div>
              <div className="space-y-3">
                <h4 className="text-[9px] font-sans font-bold tracking-[0.3em] uppercase text-mono-300">Social</h4>
                <div className="flex gap-5">
                  <span className="text-xs font-sans tracking-wider cursor-pointer hover:text-mono-black transition-colors">WeChat</span>
                  <span className="text-xs font-sans tracking-wider cursor-pointer hover:text-mono-black transition-colors">Instagram</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-mono-200 gap-6">
            <span className="text-[9px] text-mono-400 tracking-[0.3em] uppercase">© 2026 MagicFrame. All Rights Reserved.</span>
            <div className="flex gap-6 text-[9px] font-sans font-bold tracking-[0.3em] uppercase text-mono-400">
              <a href="#" className="hover:text-mono-900 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-mono-900 transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
