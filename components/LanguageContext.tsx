
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'en' | 'ar' | 'fr' | 'es';

interface Translations {
  navbar: {
    home: string;
    services: string;
    integrations: string;
    languages: string;
    ask_ai: string;
    get_demo: string;
  };
  hero: {
    headline: string;
    cta: string;
  };
  problem: {
    live_loss: string;
    headline: string;
    subheadline: string;
    cta: string;
    cards: {
      title: string;
      text: string;
      insight: string;
    }[];
  };
  solution: {
    headline: string;
    headline_highlight: string;
    subheadline: string;
    steps: {
      title: string;
      desc: string;
      stat: string;
    }[];
    comparison_title: string;
    features: {
      feature: string;
      human: string;
      ai: string;
    }[];
    cta: string;
  };
  salesBot: {
    headline: string;
    subheadline: string;
    cta: string;
    badge: string;
    chat: {
      q1: string;
      a1: string;
      q2: string;
      a2: string;
      closing: string;
    };
  };
  reactivation: {
    headline: string;
    subheadline: string;
    cards: {
      input_title: string;
      input_desc: string;
      engine_title: string;
      processing: string;
      result_title: string;
      result_desc: string;
      roi: string;
    };
    cta: string;
  };
  integrations: {
    headline: string;
    subheadline: string;
    engine_label: string;
    zero_entry: string;
  };
  global: {
    headline: string;
    subheadline: string;
    stats: {
      languages: string;
      sales: string;
      switching: string;
    };
    bottom_text: string;
  };
  footer: {
    desc: string;
    rights: string;
    privacy: string;
    terms: string;
    contact: string;
    operational: string;
  };
  modal: {
    title: string;
    subtitle: string;
    name_placeholder: string;
    email_placeholder: string;
    phone_placeholder: string;
    submit: string;
    processing: string;
    success_title: string;
    success_msg: string;
    error_msg: string;
  };
}

const dictionary: Record<Language, Translations> = {
  en: {
    navbar: {
      home: "Home",
      services: "Services",
      integrations: "Integrations",
      languages: "Languages",
      ask_ai: "Ask AI",
      get_demo: "GET DEMO"
    },
    hero: {
      headline: "A 24/7 AI Agent That Never Misses a Lead\n100% Qualification Consistency",
      cta: "TEST OUR AI NOW"
    },
    problem: {
      live_loss: "LEADS LOST GLOBALLY RIGHT NOW",
      headline: "Your Leads Are Disappearing While You Sleep",
      subheadline: "Not responding in 5 minutes? They're already talking to your competitor.",
      cta: "Stop Losing Leads. Deploy AI Now.",
      cards: [
        { title: "The 5-Minute Golden Window", text: "More likely to convert leads when responding within 5 minutes vs. 30 minutes.", insight: "Harvard Business Review" },
        { title: "The Rapid Lead Decay", text: "Contact odds DROP immediately after the first 5 minutes. Speed is the only variable that matters.", insight: "InsideSales.com Research" },
        { title: "The First Responder Wins", text: "Of converted leads go to the vendor that responds FIRST, regardless of price or feature set.", insight: "LeadSimple Benchmark Report" },
        { title: "Qualification Multiplier", text: "Increase in qualification rates when leads are contacted within the first 5 minutes.", insight: "MIT Lead Response Study" }
      ]
    },
    solution: {
      headline: "While You Sleep, AI Works.",
      headline_highlight: "Perfectly.",
      subheadline: "From the first ring to a booked meeting. No humans needed.",
      steps: [
        { title: "Answers In Seconds", desc: "Your lead calls at 2 AM. Our AI picks up before the 3rd ring. Smart greeting. Professional. Instant.", stat: "<10s Response" },
        { title: "Understands Everything", desc: "AI asks 3 pre-qualified questions (Budget? Location? Timeline?). Captures intent perfectly. No dead air.", stat: "98% Qualification" },
        { title: "Books It Instantly", desc: "Lead interested? Meeting auto-booked. Calendar updated. SMS notification sent to agent. Done.", stat: "0 Manual Touchpoints" }
      ],
      comparison_title: "Why Human Agents Can't Compete",
      features: [
        { feature: "Response Time", human: "2-4 Hours", ai: "< 10 Seconds" },
        { feature: "Availability", human: "9 AM - 5 PM", ai: "24/7/365" },
        { feature: "Qualification Rate", human: "65% Avg", ai: "98% Consistent" },
        { feature: "Simultaneous Calls", human: "1 at a time", ai: "Unlimited" }
      ],
      cta: "GET STARTED NOW"
    },
    salesBot: {
      headline: "Auto-Qualify Leads & Book Meetings. 24/7.",
      subheadline: "Deploy our AI Sales Chatbot on Website, WhatsApp, or Instagram. One smart brain that captures, qualifies, and books leads on the platforms where your clients are most active.",
      cta: "Get Your Sales Bot",
      badge: "Meeting Confirmed",
      chat: {
        q1: "Hi, what type of property are you interested in? (Luxury villa, Apartment, Commercial?)",
        a1: "Luxury villa in Dubai Marina",
        q2: "Budget range? (3M-5M AED, 5M+?)",
        a2: "5M+ AED",
        closing: "Perfect. Booking your exclusive tour with our team. Check your email in 2 minutes."
      }
    },
    reactivation: {
      headline: "Turn Your 'Dead' Lists Into Active Revenue.",
      subheadline: "Upload your old CSVs. Our AI calls thousands of leads instantly to find the gold hidden in your database.",
      cards: {
        input_title: "Upload CSV",
        input_desc: "Dead leads loaded",
        engine_title: "AI Mass Dialing",
        processing: "PROCESSING",
        result_title: "Revenue Unlocked",
        result_desc: "Saved per month",
        roi: "ROI: 3,400%"
      },
      cta: "Start Recovering Revenue"
    },
    integrations: {
      headline: "Seamless Integration With Your Favorite Tools.",
      subheadline: "Fluent in 30+ Languages & Dialects.",
      engine_label: "Wolfz AI Engine",
      zero_entry: "Zero Manual Entry"
    },
    global: {
      headline: "Speak the Language of Every Buyer.",
      subheadline: "From Mandarin to Khaleeji Arabic, our AI switches languages instantly so you never miss an international investor.",
      stats: {
        languages: "Languages & Dialects",
        sales: "Intl. Sales Enabled",
        switching: "Avg Switching Time"
      },
      bottom_text: "Your buyers speak 30+ languages. Our AI speaks all of them. Native fluency. Cultural context. Zero translation lag. Just results."
    },
    footer: {
      desc: "The AI-powered engine for modern Real Estate.",
      rights: "Wolfz AI Inc. All rights reserved.",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
      contact: "Contact Us",
      operational: "System Operational"
    },
    modal: {
      title: "Get Your Free Demo",
      subtitle: "Enter your details below to see Wolfz AI in action.",
      name_placeholder: "Full Name",
      email_placeholder: "Email Address",
      phone_placeholder: "Phone Number (+1 ...)",
      submit: "SUBMIT",
      processing: "Processing...",
      success_title: "Received!",
      success_msg: "Thank you! Your details have been received. Our team will contact you shortly.",
      error_msg: "Connection failed, please try again."
    }
  },
  ar: {
    navbar: {
      home: "الرئيسية",
      services: "الخدمات",
      integrations: "التكاملات",
      languages: "اللغات",
      ask_ai: "اسأل الذكاء الاصطناعي",
      get_demo: "احجز استشارة"
    },
    hero: {
      headline: "وكيل ذكاء اصطناعي يعمل 24/7\nتأهيل عملاء بدقة 100% دون توقف",
      cta: "جرب النظام الآن"
    },
    problem: {
      live_loss: "عملاء يُفقدون عالمياً الآن",
      headline: "عملاؤك يتسربون أثناء نومك",
      subheadline: "إذا لم ترد خلال 5 دقائق، فقد ذهبوا بالفعل إلى منافسك.",
      cta: "أوقف خسارة العملاء. ابدأ الآن.",
      cards: [
        { title: "النافذة الذهبية (5 دقائق)", text: "احتمالية تحويل العميل تزيد بشكل هائل عند الرد خلال 5 دقائق مقارنة بـ 30 دقيقة.", insight: "هارفارد بزنس ريفيو" },
        { title: "التلاشي السريع للفرص", text: "فرص التواصل تنخفض فوراً بعد الدقائق الخمس الأولى. السرعة هي العامل الحاسم.", insight: "أبحاث InsideSales.com" },
        { title: "الفوز للمستجيب الأول", text: "من العملاء يذهبون للشركة التي ترد أولاً، بغض النظر عن السعر أو الميزات.", insight: "تقرير LeadSimple" },
        { title: "مضاعف التأهيل", text: "زيادة معدلات التأهيل عند الاتصال بالعملاء المحتملين خلال أول 5 دقائق.", insight: "دراسة MIT للاستجابة" }
      ]
    },
    solution: {
      headline: "بينما أنت نائم، الذكاء الاصطناعي يعمل.",
      headline_highlight: "بإتقان.",
      subheadline: "من الرنة الأولى إلى حجز الاجتماع. بدون تدخل بشري.",
      steps: [
        { title: "إجابة في ثوانٍ", desc: "يتصل العميل في الـ 2 صباحاً؟ نظامنا يجيب قبل الرنة الثالثة. ترحيب ذكي. احترافي. فوري.", stat: "استجابة < 10 ثوانٍ" },
        { title: "يفهم كل شيء", desc: "يسأل 3 أسئلة مؤهلة (الميزانية؟ الموقع؟ الجدول الزمني؟). يفهم النية بدقة. لا صمت محرج.", stat: "تأهيل 98%" },
        { title: "حجز فوري", desc: "العميل مهتم؟ يتم حجز الاجتماع تلقائياً. تحديث التقويم. إرسال إشعار للوكيل. تم.", stat: "صفر تدخل يدوي" }
      ],
      comparison_title: "لماذا لا يمكن للبشر المنافسة",
      features: [
        { feature: "وقت الاستجابة", human: "2-4 ساعات", ai: "< 10 ثوانٍ" },
        { feature: "التوافر", human: "9 ص - 5 م", ai: "24/7/365" },
        { feature: "معدل التأهيل", human: "65% متوسط", ai: "98% ثابت" },
        { feature: "المكالمات المتزامنة", human: "1 في كل مرة", ai: "غير محدود" }
      ],
      cta: "ابدأ الآن"
    },
    salesBot: {
      headline: "حول الزيارات إلى إيرادات أثناء نومك",
      subheadline: "محرك التأهيل بالذكاء الاصطناعي لدينا لا يقدم الدعم فقط. إنه يبيع. كل عميل محتمل يتم تأهيله ومزامنته تلقائيًا مع نظام CRM الخاص بك في الوقت الفعلي.",
      cta: "احصل على بوت المبيعات",
      badge: "تم تأكيد الاجتماع",
      chat: {
        q1: "مرحباً، ما نوع العقار الذي تهتم به؟ (فيلا فاخرة، شقة، تجاري؟)",
        a1: "فيلا فاخرة في دبي مارينا",
        q2: "نطاق الميزانية؟ (3-5 مليون درهم، 5 مليون+؟)",
        a2: "5 مليون+ درهم",
        closing: "ممتاز. جارٍ حجز جولتك الحصرية مع فريقنا. تحقق من بريدك الإلكتروني خلال دقيقتين."
      }
    },
    reactivation: {
      headline: "حول قوائمك 'الميتة' إلى إيرادات نشطة.",
      subheadline: "ارفع ملفات CSV القديمة. نظامنا يتصل بآلاف العملاء فوراً لاستخراج الذهب المدفون في قاعدة بياناتك.",
      cards: {
        input_title: "رفع البيانات",
        input_desc: "عميل غير نشط",
        engine_title: "اتصال جماعي ذكي",
        processing: "جاري المعالجة",
        result_title: "الإيرادات المستعادة",
        result_desc: "تم توفيرها شهرياً",
        roi: "العائد: 3,400%"
      },
      cta: "ابدأ استعادة الإيرادات"
    },
    integrations: {
      headline: "تكامل سلس مع أدواتك المفضلة.",
      subheadline: "يتحدث بطلاقة أكثر من 30 لغة ولهجة.",
      engine_label: "محرك Wolfz AI",
      zero_entry: "بدون إدخال يدوي"
    },
    global: {
      headline: "تحدث لغة كل مشترٍ.",
      subheadline: "من الماندرين إلى اللهجة الخليجية، نظامنا يبدل اللغات فوراً لضمان عدم فقدان أي مستثمر دولي.",
      stats: {
        languages: "لغات ولهجات",
        sales: "مبيعات دولية",
        switching: "سرعة التحويل"
      },
      bottom_text: "مستثمروك يتحدثون 30+ لغة. نظامنا يتقنها جميعاً. طلاقة تامة. سياق ثقافي. بدون تأخير ترجمة. نتائج فقط."
    },
    footer: {
      desc: "المحرك الذكي للعقارات الحديثة.",
      rights: "جميع الحقوق محفوظة لشركة Wolfz AI Inc.",
      privacy: "سياسة الخصوصية",
      terms: "شروط الخدمة",
      contact: "اتصل بنا",
      operational: "النظام يعمل"
    },
    modal: {
      title: "احصل على استشارة مجانية",
      subtitle: "أدخل بياناتك أدناه لرؤية Wolfz AI يعمل.",
      name_placeholder: "الاسم الكامل",
      email_placeholder: "البريد الإلكتروني",
      phone_placeholder: "رقم الهاتف (+966 ...)",
      submit: "إرسال",
      processing: "جاري المعالجة...",
      success_title: "تم الاستلام!",
      success_msg: "شكراً لك! تم استلام بياناتك. سيتواصل فريقنا معك قريباً.",
      error_msg: "فشل الاتصال، يرجى المحاولة مرة أخرى."
    }
  },
  fr: {
    navbar: {
      home: "Accueil",
      services: "Services",
      integrations: "Intégrations",
      languages: "Langues",
      ask_ai: "Demander à l'IA",
      get_demo: "OBTENIR DÉMO"
    },
    hero: {
      headline: "Un Agent IA 24/7 Qui Ne Manque Jamais un Prospect\nQualification 100% Cohérente",
      cta: "TESTER NOTRE IA"
    },
    problem: {
      live_loss: "PROSPECTS PERDUS GLOBALEMENT",
      headline: "Vos Prospects Disparaissent Pendant Que Vous Dormez",
      subheadline: "Pas de réponse en 5 minutes ? Ils sont déjà chez votre concurrent.",
      cta: "Arrêtez de Perdre des Prospects.",
      cards: [
        { title: "La Fenêtre d'Or de 5 Minutes", text: "Plus de chances de convertir en répondant dans les 5 minutes vs 30 minutes.", insight: "Harvard Business Review" },
        { title: "Déclin Rapide des Leads", text: "Les chances de contact CHUTENT immédiatement après les 5 premières minutes.", insight: "Recherche InsideSales.com" },
        { title: "Le Premier Répondant Gagne", text: "Des leads convertis vont au vendeur qui répond EN PREMIER, peu importe le prix.", insight: "Rapport LeadSimple" },
        { title: "Multiplicateur de Qualification", text: "Augmentation des taux de qualification lors d'un contact dans les 5 premières minutes.", insight: "Étude MIT" }
      ]
    },
    solution: {
      headline: "Pendant Que Vous Dormez, l'IA Travaille.",
      headline_highlight: "Parfaitement.",
      subheadline: "De la première sonnerie au rendez-vous pris. Aucun humain nécessaire.",
      steps: [
        { title: "Réponses en Secondes", desc: "Appel à 2h du matin ? Notre IA décroche avant la 3ème sonnerie. Accueil intelligent. Pro. Instantané.", stat: "Réponse < 10s" },
        { title: "Comprend Tout", desc: "L'IA pose 3 questions clés (Budget ? Lieu ? Délai ?). Capture l'intention parfaitement.", stat: "Qualification 98%" },
        { title: "Réservation Instantanée", desc: "Prospect intéressé ? Rendez-vous auto-réservé. Agenda mis à jour. SMS envoyé.", stat: "0 Tâche Manuelle" }
      ],
      comparison_title: "Pourquoi les Agents Humains ne Peuvent pas Lutter",
      features: [
        { feature: "Temps de Réponse", human: "2-4 Heures", ai: "< 10 Secondes" },
        { feature: "Disponibilité", human: "9h - 17h", ai: "24/7/365" },
        { feature: "Taux de Qualification", human: "65% Moyenne", ai: "98% Constant" },
        { feature: "Appels Simultanés", human: "1 à la fois", ai: "Illimité" }
      ],
      cta: "COMMENCER MAINTENANT"
    },
    salesBot: {
      headline: "Transformez le trafic en revenus pendant que vous dormez",
      subheadline: "Notre moteur de qualification IA ne fait pas de support. Il VEND. Chaque prospect est qualifié automatiquement et synchronisé avec votre CRM en temps réel.",
      cta: "Obtenez votre Bot de Vente",
      badge: "Réunion Confirmée",
      chat: {
        q1: "Bonjour, quel type de propriété vous intéresse ? (Villa de luxe, Appartement, Commercial ?)",
        a1: "Villa de luxe à Dubai Marina",
        q2: "Fourchette budgétaire ? (3M-5M AED, 5M+ ?)",
        a2: "5M+ AED",
        closing: "Parfait. Réservation de votre visite exclusive avec notre équipe. Vérifiez votre email dans 2 minutes."
      }
    },
    reactivation: {
      headline: "Transformez Vos Listes 'Mortes' en Revenus Actifs.",
      subheadline: "Importez vos anciens CSV. Notre IA appelle des milliers de contacts instantanément pour trouver l'or caché.",
      cards: {
        input_title: "Importer CSV",
        input_desc: "Leads inactifs chargés",
        engine_title: "Appel de Masse IA",
        processing: "TRAITEMENT",
        result_title: "Revenus Débloqués",
        result_desc: "Économisé par mois",
        roi: "ROI : 3,400%"
      },
      cta: "Commencer la Récupération"
    },
    integrations: {
      headline: "Intégration Transparente avec Vos Outils Préférés.",
      subheadline: "Parle couramment 30+ Langues et Dialectes.",
      engine_label: "Moteur Wolfz AI",
      zero_entry: "Zéro Saisie Manuelle"
    },
    global: {
      headline: "Parlez la Langue de Chaque Acheteur.",
      subheadline: "Du Mandarin à l'Arabe, notre IA change de langue instantanément pour ne jamais manquer un investisseur.",
      stats: {
        languages: "Langues & Dialectes",
        sales: "Ventas Int. Activées",
        switching: "Temps de Changement"
      },
      bottom_text: "Vos acheteurs parlent 30+ langues. Notre IA les parle toutes. Fluidité native. Contexte culturel. Zéro délai."
    },
    footer: {
      desc: "Le moteur IA pour l'immobilier moderne.",
      rights: "Wolfz AI Inc. Tous droits réservés.",
      privacy: "Politique de Confidentialité",
      terms: "Conditions d'Utilisation",
      contact: "Contactez-nous",
      operational: "Système Opérationnel"
    },
    modal: {
      title: "Obtenez Votre Démo Gratuite",
      subtitle: "Entrez vos détails ci-dessous pour voir Wolfz AI en action.",
      name_placeholder: "Nom Complet",
      email_placeholder: "Adresse Email",
      phone_placeholder: "Numéro de Téléphone",
      submit: "ENVOYER",
      processing: "Traitement...",
      success_title: "Reçu !",
      success_msg: "Merci ! Vos détails ont été reçus. Notre équipe vous contactera bientôt.",
      error_msg: "Échec de connexion, veuillez réessayer."
    }
  },
  es: {
    navbar: {
      home: "Inicio",
      services: "Servicios",
      integrations: "Integraciones",
      languages: "Idiomas",
      ask_ai: "Preguntar a IA",
      get_demo: "OBTENER DEMO"
    },
    hero: {
      headline: "Un Agente de IA 24/7 Que Nunca Pierde un Cliente\nCalificación 100% Consistente",
      cta: "PRUEBA NUESTRA IA"
    },
    problem: {
      live_loss: "CLIENTES PERDIDOS GLOBALMENTE",
      headline: "Tus Clientes Desaparecen Mientras Duermes",
      subheadline: "¿No respondes en 5 minutos? Ya están hablando con tu competencia.",
      cta: "Deja de Perder Clientes.",
      cards: [
        { title: "La Ventana de Oro de 5 Minutos", text: "Más probabilidad de conversión al responder en 5 minutos vs 30 minutos.", insight: "Harvard Business Review" },
        { title: "Decadencia Rápida", text: "Las probabilidades de contacto CAEN inmediatamente después de los primeros 5 minutos.", insight: "InsideSales.com" },
        { title: "El Primero Gana", text: "De los leads convertidos van al vendedor que responde PRIMERO, sin importar el precio.", insight: "Reporte LeadSimple" },
        { title: "Multiplicador de Calificación", text: "Aumento en tasas de calificación cuando se contacta en los primeros 5 minutos.", insight: "Estudio MIT" }
      ]
    },
    solution: {
      headline: "Mientras Duermes, la IA Trabaja.",
      headline_highlight: "Perfectamente.",
      subheadline: "Desde el primer tono hasta la reunión agendada. Sin humanos.",
      steps: [
        { title: "Respuestas en Segundos", desc: "¿Llamada a las 2 AM? Nuestra IA contesta antes del 3er tono. Saludo inteligente. Profesional.", stat: "Respuesta < 10s" },
        { title: "Entiende Todo", desc: "La IA hace 3 preguntas clave (¿Presupuesto? ¿Ubicación? ¿Plazo?). Captura la intención.", stat: "Calificación 98%" },
        { title: "Reserva Instantánea", desc: "¿Interesado? Reunión auto-agendada. Calendario actualizado. SMS enviado.", stat: "0 Tareas Manuales" }
      ],
      comparison_title: "Por Qué los Agentes Humanos No Pueden Competir",
      features: [
        { feature: "Tiempo de Respuesta", human: "2-4 Horas", ai: "< 10 Segundos" },
        { feature: "Disponibilidad", human: "9 AM - 5 PM", ai: "24/7/365" },
        { feature: "Tasa de Calificación", human: "65% Promedio", ai: "98% Constante" },
        { feature: "Llamadas Simultáneas", human: "1 a la vez", ai: "Ilimitado" }
      ],
      cta: "EMPEZAR AHORA"
    },
    salesBot: {
      headline: "Convierte el tráfico en ingresos mientras duermes",
      subheadline: "Nuestro motor de calificación por IA no ofrece soporte. VENDE. Cada cliente potencial es calificado automáticamente y sincronizado con tu CRM en tiempo real.",
      cta: "Obtén tu Bot de Ventas",
      badge: "Reunión Confirmada",
      chat: {
        q1: "Hola, ¿qué tipo de propiedad le interesa? (Villa de lujo, Apartamento, Commercial?)",
        a1: "Villa de lujo en Dubai Marina",
        q2: "¿Rango de presupuesto? (3M-5M AED, 5M+?)",
        a2: "5M+ AED",
        closing: "Perfecto. Reservando su visita exclusiva con nuestro equipo. Revise su correo en 2 minutos."
      }
    },
    reactivation: {
      headline: "Convierte Tus Listas 'Muertas' en Ingresos Activos.",
      subheadline: "Sube tus CSV antiguos. Nuestra IA llama a miles de contactos al instante para encontrar oro en tu base de datos.",
      cards: {
        input_title: "Subir CSV",
        input_desc: "Leads inactivos",
        engine_title: "Marcado Masivo IA",
        processing: "PROCESANDO",
        result_title: "Ingresos Desbloqueados",
        result_desc: "Ahorrado por mes",
        roi: "ROI: 3,400%"
      },
      cta: "Iniciar Recuperación"
    },
    integrations: {
      headline: "Integración Fluida con Tus Herramientas Favoritas.",
      subheadline: "Habla con fluidez más de 30 idiomas y dialectos.",
      engine_label: "Motor Wolfz AI",
      zero_entry: "Cero Entrada Manual"
    },
    global: {
      headline: "Habla el Idioma de Cada Comprador.",
      subheadline: "Del Mandarín al Árabe, nuestra IA cambia de idioma al instante para no perder ningún inversor.",
      stats: {
        languages: "Idiomas y Dialectos",
        sales: "Ventas Int. Activadas",
        switching: "Tiempo de Cambio"
      },
      bottom_text: "Tus compradores hablan 30+ idiomas. Nuestra IA los habla todos. Fluidez nativa. Sin retraso."
    },
    footer: {
      desc: "El motor de IA para el sector inmobiliario moderno.",
      rights: "Wolfz AI Inc. Todos los derechos reservados.",
      privacy: "Política de Privacidad",
      terms: "Términos de Servicio",
      contact: "Contáctanos",
      operational: "Sistema Operativo"
    },
    modal: {
      title: "Obtén Tu Demo Gratis",
      subtitle: "Ingresa tus datos a continuación para ver Wolfz AI en acción.",
      name_placeholder: "Nombre Completo",
      email_placeholder: "Correo Electrónico",
      phone_placeholder: "Número de Teléfono",
      submit: "ENVIAR",
      processing: "Procesando...",
      success_title: "¡Recibido!",
      success_msg: "¡Gracias! Tus datos han sido recibidos. Nuestro equipo te contactará pronto.",
      error_msg: "Fallo de conexión, intenta de nuevo."
    }
  }
};

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const isRTL = language === 'ar';
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  const value = {
    language,
    setLanguage,
    t: dictionary[language],
    isRTL: language === 'ar'
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};
    