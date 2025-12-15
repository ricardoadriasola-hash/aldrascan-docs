import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";

// --- Types & Data Structures ---

type ModelKey = 
  | 'medit_i700' 
  | 'medit_i900_classic' 
  | 'medit_i900_touch' 
  | 'medit_i900_mobility' 
  | 'shining_elite' 
  | 'shining_elf'
  | 'panda_smart';

interface ScannerModel {
  id: ModelKey;
  name: string;
  tagline: string;
  description: string;
  features: string[];
  image: string;
  specs: {
    priceCategory: string;
    mainUse: string;
  };
  device: string;
}

const MODELS: Record<ModelKey, ScannerModel> = {
  medit_i700: {
    id: 'medit_i700',
    name: "Medit i700",
    tagline: "El equilibrio perfecto.",
    description: "Rendimiento probado y versatilidad total.",
    features: ["Alta velocidad", "Desinfección UV-C", "Plug & Play"],
    image: "https://placehold.co/800x600/f0f9ff/3B82F6?text=MEDIT+i700%0AStandard&font=roboto",
    specs: { priceCategory: "Media", mainUse: "General" },
    device: "Portátil de alto rendimiento"
  },
  medit_i900_classic: {
    id: 'medit_i900_classic',
    name: "Medit i900 Classic",
    tagline: "Potencia de nueva generación.",
    description: "Motor óptico Gen 3 con control físico.",
    features: ["Motor Gen 3", "Botones físicos", "Ultraligero (165g)"],
    image: "https://placehold.co/800x600/f0f9ff/2563EB?text=MEDIT+i900%0AClassic&font=roboto",
    specs: { priceCategory: "Alta", mainUse: "Restauradora" },
    device: "Portátil de alto rendimiento"
  },
  medit_i900_touch: {
    id: 'medit_i900_touch',
    name: "Medit i900 Touch",
    tagline: "Innovación premium.",
    description: "Interfaz 100% táctil y diseño unibody.",
    features: ["Interfaz táctil 360°", "Diseño Unibody", "Máxima higiene"],
    image: "https://placehold.co/800x600/f0f9ff/1D4ED8?text=MEDIT+i900%0ATouch&font=roboto",
    specs: { priceCategory: "Premium", mainUse: "Estética" },
    device: "Portátil de alto rendimiento"
  },
  medit_i900_mobility: {
    id: 'medit_i900_mobility',
    name: "Medit i900 Mobility",
    tagline: "Libertad absoluta.",
    description: "Escanea directamente en iPad sin cables.",
    features: ["Conexión a iPad", "Sin cables", "Portabilidad total"],
    image: "https://placehold.co/800x600/f0f9ff/007AFF?text=MEDIT+i900%0AMobility&font=roboto",
    specs: { priceCategory: "Premium", mainUse: "Movilidad" },
    device: "iPad Pro / MacBook"
  },
  shining_elite: {
    id: 'shining_elite',
    name: "Shining 3D Elite",
    tagline: "Especialista en implantes.",
    description: "Solución 2 en 1: Escáner + Fotogrametría.",
    features: ["Tecnología IPG", "Precisión implantes", "Punta edéntulos"],
    image: "https://placehold.co/800x600/fff7ed/CA8A04?text=SHINING+3D%0AElite&font=roboto",
    specs: { priceCategory: "Especializada", mainUse: "Implantología" },
    device: "PC de alto rendimiento"
  },
  shining_elf: {
    id: 'shining_elf',
    name: "Shining 3D ELF",
    tagline: "Ligereza inteligente.",
    description: "Solo 106g. Ideal para empezar con IA.",
    features: ["Peso pluma (106g)", "IA tejidos blandos", "Económico"],
    image: "https://placehold.co/800x600/f0fdfa/14B8A6?text=SHINING+3D%0AELF&font=roboto",
    specs: { priceCategory: "Eco", mainUse: "Iniciación" },
    device: "Portátil certificado"
  },
  panda_smart: {
    id: 'panda_smart',
    name: "Panda Smart",
    tagline: "Calidad-precio imbatible.",
    description: "Precisión 7μm por una inversión mínima.",
    features: ["Ultraligero (138g)", "Precisión 7μm", "Sin suscripciones"],
    image: "https://placehold.co/800x600/f0f9ff/0EA5E9?text=PANDA%0ASmart&font=roboto",
    specs: { priceCategory: "Eco", mainUse: "General" },
    device: "Portátil certificado"
  }
};

interface Question {
  id: string;
  text: string;
  options: {
    label: string;
    scores: Partial<Record<ModelKey, number>>;
  }[];
}

const QUESTIONS: Question[] = [
  {
    id: 'location',
    text: "Para orientarte correctamente:\n\n¿Dónde trabajarás principalmente con el escáner?",
    options: [
      { label: "1️⃣ Clínica dental", scores: { panda_smart: 1, shining_elf: 1, medit_i700: 1, medit_i900_touch: 1 } },
      { label: "2️⃣ Laboratorio", scores: { medit_i900_classic: 3, shining_elite: 2, medit_i700: 1 } },
      { label: "3️⃣ Uso mixto", scores: { medit_i700: 3, medit_i900_classic: 1, medit_i900_mobility: 1 } }
    ]
  },
  {
    id: 'experience',
    text: "¿Cuál es tu nivel de experiencia con escáneres intraorales?",
    options: [
      { label: "1️⃣ Primera experiencia", scores: { shining_elf: 3, panda_smart: 3, medit_i700: 2 } },
      { label: "2️⃣ Uso habitual", scores: { medit_i700: 3, medit_i900_classic: 2 } },
      { label: "3️⃣ Usuario avanzado", scores: { medit_i900_touch: 3, medit_i900_mobility: 3, shining_elite: 2, medit_i900_classic: 2 } }
    ]
  },
  {
    id: 'priorities',
    text: "¿Qué valoras más en un escáner?",
    options: [
      { label: "1️⃣ Movilidad y libertad de uso", scores: { medit_i900_mobility: 5, shining_elf: 2, panda_smart: 1 } },
      { label: "2️⃣ Máxima precisión", scores: { shining_elite: 5, medit_i900_classic: 4, medit_i900_touch: 3 } },
      { label: "3️⃣ Rapidez de escaneado", scores: { medit_i900_touch: 3, medit_i900_classic: 3, medit_i900_mobility: 3, medit_i700: 2 } },
      { label: "4️⃣ Equilibrio general", scores: { medit_i700: 5, panda_smart: 3, shining_elf: 2 } }
    ]
  },
  {
    id: 'role',
    text: "¿Para qué perfil clínico buscamos el escáner?",
    options: [
      { label: "Odontología General / Restauradora 🦷", scores: { panda_smart: 3, medit_i700: 2, medit_i900_classic: 2, shining_elf: 2 } },
      { label: "Implantología Avanzada 🔩", scores: { shining_elite: 5, medit_i900_touch: 1 } },
      { label: "Ortodoncia / Estética ✨", scores: { medit_i900_touch: 2, medit_i900_mobility: 2, panda_smart: 1 } },
      { label: "Higiene / Revisiones rápidas ⏱️", scores: { shining_elf: 3, panda_smart: 3 } }
    ]
  },
  {
    id: 'budget',
    text: "¿Cuál es la prioridad en cuanto a inversión?",
    options: [
      { label: "Opción económica y funcional 💶", scores: { shining_elf: 3, panda_smart: 4, medit_i700: 1 } },
      { label: "Mejor calidad-precio ⚖️", scores: { panda_smart: 5, medit_i700: 3, medit_i900_classic: 1 } },
      { label: "Lo mejor del mercado (Premium) 🚀", scores: { medit_i900_touch: 3, medit_i900_mobility: 3, shining_elite: 2 } }
    ]
  },
  {
    id: 'ecosystem',
    text: "¿En qué ecosistema te sientes más cómodo trabajando?",
    options: [
      { label: "Entorno PC / Ordenador potente 💻", scores: { medit_i900_classic: 3, shining_elite: 3, medit_i900_touch: 2, medit_i700: 2, panda_smart: 2 } },
      { label: "Tablet / iPad ligero 📱", scores: { medit_i900_mobility: 5 } },
      { label: "Movilidad total (100% inalámbrico) 🛜", scores: { medit_i900_mobility: 5, medit_i900_touch: 1 } }
    ]
  },
  {
    id: 'mobility',
    text: "¿Cómo de importante es la movilidad física del equipo?",
    options: [
      { label: "Fijo en un gabinete 🖥️", scores: { medit_i700: 1, shining_elite: 1, panda_smart: 1 } },
      { label: "Mover entre gabinetes (Carrito) 🛒", scores: { panda_smart: 3, medit_i700: 1, medit_i900_classic: 1, shining_elf: 2 } },
      { label: "Movilidad total (En mano) 👋", scores: { medit_i900_mobility: 3 } }
    ]
  },
  {
    id: 'interface',
    text: "¿Preferencia de uso?",
    options: [
      { label: "Botones físicos (Clásico) 🔘", scores: { medit_i900_classic: 3, medit_i700: 2, panda_smart: 2, shining_elf: 1 } },
      { label: "Interfaz táctil / Gestos 👆", scores: { medit_i900_touch: 4 } },
      { label: "Indiferente 🤷", scores: { panda_smart: 2, medit_i700: 1, shining_elite: 1 } }
    ]
  }
];

// --- Chat Types ---

interface Message {
  id: number;
  type: 'bot' | 'user';
  content: React.ReactNode;
  timestamp: Date;
}

function ChatApp() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [step, setStep] = useState(-1); // -1: Init, 0..N: Questions, 99: Result
  const [scores, setScores] = useState<Record<ModelKey, number>>({
    medit_i700: 0,
    medit_i900_classic: 0,
    medit_i900_touch: 0,
    medit_i900_mobility: 0,
    shining_elite: 0,
    shining_elf: 0,
    panda_smart: 0
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Initial Welcome
  useEffect(() => {
    const initChat = async () => {
      setIsTyping(true);
      await new Promise(r => setTimeout(r, 1000));
      addMessage('bot', "Hola 👋\nSoy el asesor digital de AldraScan.");
      
      await new Promise(r => setTimeout(r, 1200));
      addMessage('bot', "Te ayudo a definir el pack más adecuado para tu clínica:\nescáner intraoral + dispositivo de trabajo + formación.");

      await new Promise(r => setTimeout(r, 1000));
      addMessage('bot', "Si te parece, empezamos con unas preguntas rápidas.");
      setIsTyping(false);
      setStep(0); 
    };
    initChat();
  }, []);

  const addMessage = (type: 'bot' | 'user', content: React.ReactNode) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      type,
      content,
      timestamp: new Date()
    }]);
  };

  const handleOptionClick = async (label: string, optionScores: Partial<Record<ModelKey, number>>) => {
    // 1. User message
    addMessage('user', label);
    
    // 2. Update scores
    const newScores = { ...scores };
    (Object.keys(optionScores) as ModelKey[]).forEach((key) => {
      newScores[key] = (newScores[key] || 0) + (optionScores[key] || 0);
    });
    setScores(newScores);

    // 3. Advance Step Logic
    setStep(prev => prev + 1); 
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 1000 + Math.random() * 500)); 

    const nextQIndex = step + 1;
    
    if (nextQIndex < QUESTIONS.length) {
      setIsTyping(false);
    } else {
      showRecommendation(newScores);
    }
  };

  const showRecommendation = async (finalScores: Record<ModelKey, number>) => {
    const sorted = Object.entries(finalScores)
      .sort(([, scoreA], [, scoreB]) => (scoreB as number) - (scoreA as number))
      .map(([key]) => MODELS[key as ModelKey]);

    const winner = sorted[0];
    const winnerScore = finalScores[winner.id];

    // Lógica para seleccionar alternativa:
    // Prioridad: Un modelo con buena puntuación (cercana a 3 puntos del ganador) 
    // pero de una categoría de precio DIFERENTE.
    let alternative = sorted.slice(1).find(m => 
      finalScores[m.id] >= (winnerScore - 3) && 
      m.specs.priceCategory !== winner.specs.priceCategory
    );

    // Fallback: Si no hay alternativa de diferente categoría, usamos el segundo mejor 
    // si está muy cerca (1 punto de diferencia).
    if (!alternative && sorted[1] && finalScores[sorted[1].id] >= (winnerScore - 1)) {
        alternative = sorted[1];
    }
    
    // 1. Analysis confirmation (maintain previous typing state for a bit)
    await new Promise(r => setTimeout(r, 800));
    setIsTyping(false);
    addMessage('bot', "Analizando tus necesidades... 🧠");
    
    // 2. Recommendation Message
    await new Promise(r => setTimeout(r, 500)); // Pause for user to read
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 1500)); // Typing animation
    setIsTyping(false);
    
    addMessage('bot', (
      <div>
        Gracias por la información.
        <br/><br/>
        Según lo que me indicas, el pack que mejor encaja contigo es:
        <br/>
        👉 <strong>Pack {winner.name}</strong>
        <br/><br/>
        Incluye:
        <br/>
        - Escáner: {winner.name}
        <br/>
        - Dispositivo: {winner.device}
        <br/>
        - Formación AldraScan adaptada a tu clínica
        <br/><br/>
        Es una combinación pensada para trabajar con seguridad y fluidez desde el primer día.
      </div>
    ));

    // 2.5 Training Details Message (NEW)
    await new Promise(r => setTimeout(r, 600));
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 2000));
    setIsTyping(false);

    addMessage('bot', (
        <div>
            La formación AldraScan no es una sesión puntual.
            <br/><br/>
            Se realiza de forma progresiva, en varias sesiones, para que el equipo pueda practicar, asimilar conceptos y avanzar de manera natural.
            <br/><br/>
            Siempre orientada a clínica real y a vuestro flujo de trabajo.
        </div>
    ));

    // 3. Image
    await new Promise(r => setTimeout(r, 500));
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 1000));
    setIsTyping(false);
    
    addMessage('bot', (
       <div className="rounded-lg overflow-hidden border border-slate-200 bg-white shadow-sm max-w-[280px]">
          <img src={winner.image} alt={winner.name} className="w-full h-auto object-contain bg-slate-50" />
       </div>
    ));

    // 4. Market Context (New)
    await new Promise(r => setTimeout(r, 600));
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 1500));
    setIsTyping(false);

    addMessage('bot', (
        <div>
            A nivel de mercado, este modelo se sitúa en la gama equivalente a otros escáneres profesionales de referencia.
            <br/><br/>
            En AldraScan trabajamos este equipo por su fiabilidad y encaje en clínica real.
        </div>
    ));

    // 5. Alternative
    if (alternative) {
         await new Promise(r => setTimeout(r, 500));
         setIsTyping(true);
         await new Promise(r => setTimeout(r, 1200));
         setIsTyping(false);
         
         const similarity = winner.specs.mainUse === alternative.specs.mainUse 
            ? `su enfoque en ${alternative.specs.mainUse.toLowerCase()}` 
            : "rendimiento general";
         
         const difference = winner.specs.priceCategory !== alternative.specs.priceCategory
            ? `su categoría (${alternative.specs.priceCategory})`
            : "su diseño específico";

         addMessage('bot', (
            <div>
               Como alternativa dentro de AldraScan, también podrías valorar:
               <br/>
               👉 <strong>{alternative.name}</strong>
               <br/><br/>
               Es una opción similar en <strong>{similarity}</strong>, con diferencias principalmente en <strong>{difference}</strong>.
               <br/><br/>
               Si quieres, puedo ayudarte a compararlos.
            </div>
         ));
    }

    // 6. Next Steps
    await new Promise(r => setTimeout(r, 600));
    setIsTyping(true);
    await new Promise(r => setTimeout(r, 1200));
    setIsTyping(false);

    addMessage('bot', (
        <div>
            Si lo deseas, puedo:
            <br/><br/>
            1️⃣ Ponerte en contacto con un asesor AldraScan  
            <br/>
            2️⃣ Preparar una propuesta personalizada del pack
            <br/>
            3️⃣ Resolver alguna duda concreta ahora
            <br/><br/>
            Dime cómo prefieres continuar.
        </div>
    ));

    setStep(99); // End state
  };

  const handleRestart = () => {
     setMessages([]);
     setStep(-1);
     setScores({
        medit_i700: 0,
        medit_i900_classic: 0,
        medit_i900_touch: 0,
        medit_i900_mobility: 0,
        shining_elite: 0,
        shining_elf: 0,
        panda_smart: 0
    });
    setTimeout(() => {
        const initChat = async () => {
            setIsTyping(true);
            await new Promise(r => setTimeout(r, 1000));
            addMessage('bot', "Hola 👋\nSoy el asesor digital de AldraScan.");
            await new Promise(r => setTimeout(r, 1200));
            addMessage('bot', "Te ayudo a definir el pack más adecuado para tu clínica:\nescáner intraoral + dispositivo de trabajo + formación.");
            await new Promise(r => setTimeout(r, 1000));
            addMessage('bot', "Si te parece, empezamos con unas preguntas rápidas.");
            setIsTyping(false);
            setStep(0); 
        };
        initChat();
    }, 100);
  };

  const currentQuestion = step >= 0 && step < QUESTIONS.length ? QUESTIONS[step] : null;

  return (
    <div className="h-screen w-full bg-[#EFE7DD] flex flex-col font-sans overflow-hidden">
        {/* WhatsApp Header */}
        <header className="bg-[#008069] text-white py-3 px-4 flex items-center gap-3 shadow-md flex-shrink-0 z-10">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-2xl border-2 border-white/20">
                🤖
            </div>
            <div className="flex flex-col">
                <h1 className="font-bold text-lg leading-tight">AldraScan Asesor</h1>
                <span className="text-xs text-white/90">Cuenta de empresa</span>
            </div>
            <div className="ml-auto flex gap-5 text-xl opacity-90">
                <button>📹</button>
                <button>📞</button>
                <button>⋮</button>
            </div>
        </header>

        {/* Chat Area */}
        <main className="flex-1 overflow-y-auto p-4 space-y-3" style={{backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')", backgroundBlendMode: "soft-light", backgroundColor: "rgba(239, 231, 221, 1)"}}>
            {messages.map((msg) => (
                <div 
                    key={msg.id} 
                    className={`flex w-full ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                    <div 
                        className={`max-w-[85%] sm:max-w-[75%] rounded-lg px-3 py-2 text-[15px] shadow-[0_1px_2px_rgba(0,0,0,0.1)] relative leading-snug ${
                            msg.type === 'user' 
                                ? 'bg-[#D9FDD3] text-[#111B21] rounded-tr-none' 
                                : 'bg-white text-[#111B21] rounded-tl-none'
                        }`}
                    >
                        {typeof msg.content === 'string' ? (
                            <div className="whitespace-pre-wrap">{msg.content}</div>
                        ) : (
                            msg.content
                        )}
                        <div className={`text-[11px] text-[#667781] mt-1 flex ${msg.type === 'user' ? 'justify-end' : 'justify-end'} gap-1 items-center`}>
                            {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            {msg.type === 'user' && <span className="text-[#53bdeb] text-[10px]">✓✓</span>}
                        </div>
                        
                        {/* CSS Triangle */}
                        <div className={`absolute top-0 w-0 h-0 border-[6px] border-transparent ${
                            msg.type === 'user' 
                             ? 'right-[-6px] border-t-[#D9FDD3] border-l-[#D9FDD3]' 
                             : 'left-[-6px] border-t-white border-r-white'
                        }`}></div>
                    </div>
                </div>
            ))}

            {isTyping && (
                <div className="flex justify-start w-full animate-fade-in">
                    <div className="bg-white rounded-lg rounded-tl-none px-4 py-3 shadow-sm flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 bg-[#667781] rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-[#667781] rounded-full animate-bounce delay-100"></div>
                        <div className="w-1.5 h-1.5 bg-[#667781] rounded-full animate-bounce delay-200"></div>
                    </div>
                </div>
            )}
            
            {(currentQuestion && !isTyping && step < QUESTIONS.length) && (
                 <div className="flex justify-start w-full animate-slide-up">
                    <div className="bg-white max-w-[85%] rounded-lg rounded-tl-none px-3 py-2 text-[15px] shadow-[0_1px_2px_rgba(0,0,0,0.1)] relative">
                        <div className="font-medium text-[#111B21]">
                           {currentQuestion.text}
                        </div>
                        <div className="text-[11px] text-[#667781] text-right mt-1">
                           {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                         <div className="absolute top-0 left-[-6px] w-0 h-0 border-[6px] border-transparent border-t-white border-r-white"></div>
                    </div>
                 </div>
             )}

            <div ref={messagesEndRef} />
        </main>

        {/* Interaction Footer */}
        <footer className="bg-[#F0F2F5] px-2 py-2 flex flex-col gap-2 border-t border-[#D1D7DB]">
            {currentQuestion && !isTyping && step < QUESTIONS.length ? (
                <div className="grid grid-cols-1 gap-2 animate-slide-up p-1">
                    {currentQuestion.options.map((opt, idx) => (
                        <button
                            key={idx}
                            onClick={() => handleOptionClick(opt.label, opt.scores)}
                            className="bg-white active:bg-[#f0f2f5] text-[#008069] font-medium py-3 px-4 rounded-xl shadow-sm border border-slate-200 text-left transition-all active:scale-[0.98]"
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            ) : step === 99 && !isTyping ? (
                 <button
                    onClick={handleRestart}
                    className="w-full bg-[#008069] text-white font-bold py-3 rounded-full shadow hover:bg-[#006a55] transition-colors mb-1"
                >
                    🔄 Empezar de nuevo
                </button>
            ) : (
                <div className="text-center text-[#667781] text-xs py-2">
                    {isTyping ? "AldraScan está escribiendo..." : ""}
                </div>
            )}
            
            {/* Input Mockup */}
            <div className="flex items-center gap-3 px-2 py-1 opacity-60 pointer-events-none mb-1">
                 <span className="text-2xl text-[#54656f]">😃</span>
                 <span className="text-2xl text-[#54656f]">➕</span>
                 <div className="flex-1 bg-white rounded-lg h-9 border border-none"></div>
                 <span className="text-2xl text-[#54656f]">🎤</span>
            </div>
        </footer>
    </div>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<ChatApp />);