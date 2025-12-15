import React, { useState, useEffect } from 'react';
import { Button } from '../Button';
import { ChefHat, Wand2, Globe, TrendingUp, Smartphone, ArrowRight, CheckCircle2, Zap, Camera, Star, Sparkles } from 'lucide-react';
import { INITIAL_MENU } from '../../constants';

interface LandingPageProps {
  onGetStarted: () => void;
  onLogin: () => void;
  onViewDemo: () => void;
}

const CONTENT = {
  en: {
    badge: "For Restaurant Owners",
    hero: {
      title1: "The Last Menu",
      title2: "You'll Ever Print.",
      subtitle: "Eliminate reprint costs instantly. Upgrade to a multi-language digital menu built by AI to increase your average ticket size by up to 20%.",
      ctaDemo: "View Live Demo",
      ctaLogin: "Log in",
      ctaGetStarted: "Get Started",
      noCard: "No credit card required",
      cancel: "Cancel anytime"
    },
    stats: {
      restaurants: "Restaurants",
      sales: "Sales Increase",
      dishes: "Dishes Digitized",
      rating: "Owner Rating"
    },
    features: {
      title: "Everything a small restaurant needs to grow.",
      subtitle: "We built Bistrot AI specifically for owners who love cooking but hate technology. It's simple, fast, and powerful.",
      snap: {
        title: "Snap to Import",
        desc: "Don't type out your menu. Just take a photo of your existing paper menu, and our AI will extract dishes, prices, and descriptions instantly."
      },
      lang: {
        title: "Speak Every Language",
        desc: "Tourists love your food but can't read your Thai menu. Automatically translate your dishes into English, Chinese, and more with one click."
      },
      photo: {
        title: "Studio-Quality Photos",
        desc: "Upload any photo from your phone. Our AI automatically enhances lighting, color, and sharpness to make your food look professional."
      },
      desc: {
        title: "Irresistible Descriptions",
        desc: "Not a writer? Our AI generates appetizing, sales-driving descriptions for every dish on your menu automatically."
      }
    },
    comparison: {
      title: "From \"What is this?\" to \"I'll have three!\"",
      desc: "Printed menus get dirty, are expensive to update, and don't help tourists understand your food. Switch to a dynamic web menu that loads instantly and lets you update prices in seconds.",
      check1: "Update prices instantly (no re-printing)",
      check2: "Filter by Vegetarian, Vegan, Spicy",
      check3: "Collect analytics on what customers view"
    },
    cta: {
      title: "Ready to upgrade your restaurant?",
      subtitle: "Join 500+ owners who are saving time and selling more.\nIt takes less than 5 minutes to set up.",
      button: "View Live Demo",
      buttonLogin: "Login",
      note: "Free plan available"
    }
  },
  th: {
    badge: "สำหรับเจ้าของร้านอาหาร",
    hero: {
      title1: "เมนูอาหารของคุณ",
      title2: "เหนือระดับด้วย AI",
      subtitle: "เลิกเสียเงินพิมพ์เมนูกระดาษซ้ำๆ สร้างเมนูดิจิทัลที่สวยงาม แปลภาษาอัตโนมัติ เพิ่มยอดขายได้จริง",
      ctaDemo: "ดูตัวอย่างเมนู",
      ctaLogin: "เข้าสู่ระบบ",
      ctaGetStarted: "เริ่มต้นใช้งาน",
      noCard: "ไม่ต้องใช้บัตรเครดิต",
      cancel: "ยกเลิกได้ตลอดเวลา"
    },
    stats: {
      restaurants: "ร้านอาหาร",
      sales: "ยอดขายเพิ่มขึ้น",
      dishes: "เมนูที่ถูกสร้าง",
      rating: "คะแนนจากผู้ใช้"
    },
    features: {
      title: "ทุกสิ่งที่ร้านอาหารต้องการ",
      subtitle: "เราสร้าง Bistrot AI เพื่อเจ้าของร้านที่รักการทำอาหารแต่ไม่ถนัดเทคโนโลยี ใช้งานง่าย รวดเร็ว และทรงพลัง",
      snap: {
        title: "ถ่ายรูปเพื่อนำเข้าเมนู",
        desc: "ไม่ต้องพิมพ์เอง แค่ถ่ายรูปเมนูกระดาษเดิมของคุณ AI จะดึงชื่อเมนู ราคา และคำบรรยายให้อัตโนมัติ"
      },
      lang: {
        title: "สื่อสารได้ทุกภาษา",
        desc: "นักท่องเที่ยวอยากกินอาหารของคุณแต่อ่านเมนูไทยไม่ออก? แปลเมนูเป็นอังกฤษ จีน และอื่นๆ ได้ในคลิกเดียว"
      },
      photo: {
        title: "รูปสวยระดับสตูดิโอ",
        desc: "ถ่ายรูปด้วยมือถือ แล้วให้ AI ของเราปรับแสง สี ความคมชัด ให้อาหารดูน่าทานเหมือนถ่ายโดยมืออาชีพ"
      },
      desc: {
        title: "คำบรรยายชวนหิว",
        desc: "คิดคำไม่ออก? AI ของเราช่วยแต่งคำบรรยายเมนูให้น่าทาน กระตุ้นยอดขายได้ทันที"
      }
    },
    comparison: {
      title: "เปลี่ยนจาก \"อันนี้คืออะไร?\" เป็น \"ขอ 3 ที่ครับ!\"",
      desc: "เมนูกระดาษทั้งสกปรกง่าย แก้ไขยาก และนักท่องเที่ยวอ่านไม่เข้าใจ เปลี่ยนมาใช้เมนูดิจิทัลที่โหลดไว อัปเดตราคาได้ทันที ไม่ต้องพิมพ์ใหม่",
      check1: "อัปเดตราคาได้ทันที (ไม่ต้องพิมพ์ใหม่)",
      check2: "ตัวกรองสำหรับ มังสวิรัติ และความเผ็ด",
      check3: "ดูสถิติได้ว่าลูกค้าชอบดูเมนูไหน"
    },
    cta: {
      title: "พร้อมยกระดับร้านของคุณหรือยัง?",
      subtitle: "เข้าร่วมกับเจ้าของร้านกว่า 500 รายที่ประหยัดเวลาและขายดีขึ้น\nตั้งค่าเสร็จใน 5 นาที",
      button: "ดูตัวอย่างเมนู",
      buttonLogin: "เข้าสู่ระบบ",
      note: "มีแพ็กเกจใช้งานฟรี"
    }
  }
};

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onLogin, onViewDemo }) => {
  const [activeDemoLang, setActiveDemoLang] = useState<'en' | 'th'>('en');
  const [pageLang, setPageLang] = useState<'en' | 'th'>('en');
  const [scrolled, setScrolled] = useState(false);

  const t = CONTENT[pageLang];

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Auto-toggle language in demo every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveDemoLang(prev => prev === 'en' ? 'th' : 'en');
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`min-h-screen bg-white font-sans overflow-x-hidden selection:bg-orange-100 ${pageLang === 'th' ? 'font-thai' : ''}`}>

      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-orange-500/30">B</div>
            <span className="font-bold text-gray-900 text-lg tracking-tight">Bistrot AI</span>
          </div>
          <div className="flex items-center gap-4">
            {/* Language Switcher */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setPageLang('en')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all ${pageLang === 'en' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
              >
                EN
              </button>
              <button
                onClick={() => setPageLang('th')}
                className={`px-3 py-1 rounded-md text-xs font-bold transition-all font-thai ${pageLang === 'th' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
              >
                ไทย
              </button>
            </div>

            <button onClick={onLogin} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors hidden sm:block">
              {t.hero.ctaLogin}
            </button>
            <Button onClick={onGetStarted} size="sm" className="shadow-lg shadow-orange-500/20">
              {t.hero.ctaGetStarted}
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-orange-100 rounded-full blur-3xl opacity-50 mix-blend-multiply animate-pulse"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-50 mix-blend-multiply"></div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

            {/* Copy */}
            <div className="flex-1 text-center lg:text-left space-y-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-bold uppercase tracking-wider border border-orange-100 mb-2">
                <Zap className="w-3 h-3 fill-current" />
                {t.badge}
              </div>
              <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 leading-[1.1] tracking-tight">
                {t.hero.title1} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">{t.hero.title2}</span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed max-w-xl mx-auto lg:mx-0">
                {t.hero.subtitle}
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Button onClick={onViewDemo} size="lg" className="w-full sm:w-auto text-lg h-14 px-8 shadow-xl shadow-orange-500/20 hover:scale-105 transition-transform flex items-center justify-center gap-2">
                  {t.hero.ctaDemo} <ArrowRight className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Visual: Phone Mockup */}
            <div className="flex-1 relative w-full max-w-sm lg:max-w-md mx-auto perspective-1000">
              {/* Floating Elements */}
              <div className="absolute -left-12 top-1/2 -translate-y-1/2 bg-white p-4 rounded-2xl shadow-xl z-20 hidden lg:block animate-bounce duration-[3000ms]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Daily Orders</p>
                    <p className="text-lg font-bold text-gray-900">+24%</p>
                  </div>
                </div>
              </div>

              {/* Phone Frame */}
              <div className="relative bg-gray-900 rounded-[2.5rem] p-3 shadow-2xl border-4 border-gray-900 transform rotate-[-6deg] hover:rotate-0 transition-transform duration-500">
                <div className="bg-white rounded-[2rem] overflow-hidden h-[600px] relative">
                  {/* Mock App Header */}
                  <div className="bg-orange-600 h-32 p-6 flex flex-col justify-end">
                    <div className="flex justify-between items-end text-white">
                      <div>
                        <div className="flex items-center gap-1 text-xs opacity-90 mb-1">
                          <Star className="w-3 h-3 fill-current" /> 4.9
                        </div>
                        <h3 className="font-bold text-xl">Siam Taste</h3>
                      </div>
                      <div className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold transition-all duration-300">
                        <Globe className="w-3 h-3" /> {activeDemoLang === 'en' ? 'EN' : 'TH'}
                      </div>
                    </div>
                  </div>

                  {/* Mock Menu List */}
                  <div className="p-4 space-y-4">
                    <div className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">Signature Dishes</div>

                    {INITIAL_MENU.categories[0].items.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex gap-3 animate-in slide-in-from-bottom-4 fade-in duration-700" style={{ animationDelay: `${idx * 150}ms` }}>
                        <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          <img src={item.image} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <h4 className="font-bold text-gray-900 truncate">
                              {activeDemoLang === 'en' ? item.name.en : item.name.th}
                            </h4>
                            <span className="text-orange-600 font-bold text-sm">฿{item.price}</span>
                          </div>
                          <p className="text-xs text-gray-500 line-clamp-2 mt-1 transition-opacity duration-300">
                            {activeDemoLang === 'en' ? item.description.en : item.description.th}
                          </p>
                          {idx === 0 && (
                            <div className="mt-2 flex gap-1">
                              <span className="px-1.5 py-0.5 bg-orange-50 text-orange-700 text-[10px] font-bold rounded">Best Seller</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Floating Action Button */}
                  <div className="absolute bottom-6 right-6 w-12 h-12 bg-black rounded-full flex items-center justify-center text-white shadow-lg">
                    <ChefHat className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Stats */}
      <section className="py-12 border-y border-gray-100 bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-gray-900">500+</p>
              <p className="text-sm text-gray-500 mt-1">{t.stats.restaurants}</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">20%</p>
              <p className="text-sm text-gray-500 mt-1">{t.stats.sales}</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">10k+</p>
              <p className="text-sm text-gray-500 mt-1">{t.stats.dishes}</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">4.9/5</p>
              <p className="text-sm text-gray-500 mt-1">{t.stats.rating}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Grid */}
      <section className="py-24 max-w-6xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">{t.features.title}</h2>
          <p className="text-gray-500 text-lg">{t.features.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-6">
              <Camera className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t.features.snap.title}</h3>
            <p className="text-gray-500 leading-relaxed">
              {t.features.snap.desc}
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6">
              <Globe className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t.features.lang.title}</h3>
            <p className="text-gray-500 leading-relaxed">
              {t.features.lang.desc}
            </p>
          </div>

          {/* Feature 3: Photo Enhancement */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-pink-50 rounded-2xl flex items-center justify-center text-pink-600 mb-6">
              <Sparkles className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t.features.photo.title}</h3>
            <p className="text-gray-500 leading-relaxed">
              {t.features.photo.desc}
            </p>
          </div>

          {/* Feature 4: Descriptions */}
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
              <Wand2 className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-3">{t.features.desc.title}</h3>
            <p className="text-gray-500 leading-relaxed">
              {t.features.desc.desc}
            </p>
          </div>
        </div>
      </section>

      {/* Before / After Section */}
      <section className="py-24 bg-gray-900 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20">
          <div className="absolute top-0 left-0 w-64 h-64 bg-orange-500 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-blue-500 rounded-full blur-[100px]"></div>
        </div>

        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
              <h2 className="text-3xl lg:text-4xl font-bold">{t.comparison.title}</h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                {t.comparison.desc}
              </p>
              <ul className="space-y-4 pt-4">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span>{t.comparison.check1}</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span>{t.comparison.check2}</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span>{t.comparison.check3}</span>
                </li>
              </ul>
            </div>

            <div className="flex-1 relative">
              {/* Visual comparison could go here, for now a stylized abstract representation */}
              <div className="relative w-full aspect-square max-w-sm mx-auto">
                {/* The "Old" Card */}
                <div className="absolute top-0 left-0 w-64 h-80 bg-gray-800 rounded-xl p-6 transform -rotate-6 opacity-50 scale-90 origin-bottom-left">
                  <div className="w-full h-full border-2 border-dashed border-gray-600 rounded flex items-center justify-center text-gray-500 font-mono text-sm uppercase">
                    Printed Menu
                  </div>
                </div>
                {/* The "New" Card */}
                <div className="absolute top-4 right-0 w-72 h-[400px] bg-white rounded-3xl p-2 shadow-2xl transform rotate-3 transition-transform hover:rotate-0 duration-500">
                  <div className="w-full h-full bg-gray-50 rounded-2xl overflow-hidden relative">
                    <img src="/images/landing_pad_thai.png" className="w-full h-48 object-cover" alt="" />
                    <div className="p-4">
                      <h4 className="font-bold text-gray-900 text-lg">Pad Thai</h4>
                      <p className="text-xs text-gray-500 mt-1">Stir-fried rice noodles with eggs, peanuts, and shrimp.</p>
                      <div className="mt-4 flex justify-between items-center">
                        <span className="font-bold text-orange-600 text-xl">฿120</span>
                        <button className="bg-black text-white px-3 py-1 rounded-lg text-xs font-bold">Add</button>
                      </div>
                    </div>
                    {/* Floating tag */}
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold text-green-700 flex items-center gap-1 shadow-sm">
                      <TrendingUp className="w-3 h-3" /> Popular
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-6">{t.cta.title}</h2>
        <p className="text-xl text-gray-600 mb-10 whitespace-pre-line">
          {t.cta.subtitle}
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Button onClick={onViewDemo} size="lg" className="h-14 px-10 text-lg shadow-xl shadow-orange-500/20">
            {t.cta.button}
          </Button>
          <button onClick={onLogin} className="px-10 h-14 rounded-xl border-2 border-gray-200 font-bold text-gray-600 hover:border-gray-900 hover:text-gray-900 transition-all">
            {t.cta.buttonLogin}
          </button>
        </div>
        <p className="mt-6 text-sm text-gray-400">{t.cta.note}</p>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 bg-white">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 opacity-80">
            <div className="w-6 h-6 bg-gray-900 rounded-md flex items-center justify-center text-white font-bold text-xs">B</div>
            <span className="font-bold text-gray-900">Bistrot AI</span>
          </div>
          <div className="text-sm text-gray-500">
            © 2025 Bistrot AI. Crafted for restaurants with ❤️
          </div>
          <div className="flex gap-6 text-sm text-gray-500">
            <a href="#" className="hover:text-gray-900">Privacy</a>
            <a href="#" className="hover:text-gray-900">Terms</a>
            <a href="#" className="hover:text-gray-900">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};