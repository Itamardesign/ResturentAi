import React, { useState, useEffect, useRef } from 'react';
import { Menu, MenuItem, MenuCategory, DietaryInfo } from '../../types';
import { Search, Globe, ChevronLeft, ChevronRight, X, Clock, Star, MapPin, Phone, Share2, Heart, Flame, Leaf, WheatOff, ThumbsUp, TrendingUp, Sparkles, ChefHat } from 'lucide-react';
import { recordMenuView, recordItemView } from '../../services/analyticsService';
import { motion, AnimatePresence, PanInfo, useScroll, useTransform } from 'framer-motion';

interface PublicMenuProps {
  menu: Menu;
  onBack: () => void;
}

const DietaryIcon: React.FC<{ info?: DietaryInfo }> = ({ info }) => {
  if (!info) return null;
  return (
    <div className="flex items-center gap-1.5 bg-black/5 rounded-full px-2 py-0.5" title="Dietary Info">
      {info.spiciness !== 'none' && (
        <div className="flex items-center gap-0.5" title={`Spiciness: ${info.spiciness}`}>
          <Flame className={`w-3.5 h-3.5 ${info.spiciness === 'hot' ? 'text-red-600 fill-red-600' : info.spiciness === 'medium' ? 'text-red-500' : 'text-orange-400'}`} />
        </div>
      )}
      {info.isVegetarian && <Leaf className="w-3.5 h-3.5 text-green-600" title="Vegetarian" />}
      {info.isVegan && <Leaf className="w-3.5 h-3.5 text-green-600 fill-green-600" title="Vegan" />}
      {info.isGlutenFree && <WheatOff className="w-3.5 h-3.5 text-amber-600" title="Gluten Free" />}
    </div>
  );
};

const TagBadge: React.FC<{ tag: string }> = ({ tag }) => {
  let styleClass = "bg-gray-100 text-gray-700";
  let icon = null;

  if (tag === "Recommended") { styleClass = "bg-blue-50 text-blue-700"; icon = <ThumbsUp className="w-3 h-3 fill-current" />; }
  else if (tag === "Chef's Choice") { styleClass = "bg-orange-50 text-orange-700"; icon = <ChefHat className="w-3 h-3" />; }
  else if (tag === "Best Seller") { styleClass = "bg-yellow-50 text-yellow-700"; icon = <TrendingUp className="w-3 h-3" />; }
  else if (tag === "New") { styleClass = "bg-purple-50 text-purple-700"; icon = <Sparkles className="w-3 h-3" />; }

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-transparent shadow-sm ${styleClass}`}>
      {icon} {tag === "Chef's Choice" ? "Chef's Fav" : tag}
    </span>
  );
};

export const PublicMenu: React.FC<PublicMenuProps> = ({ menu, onBack }) => {
  const [lang, setLang] = useState<'en' | 'th'>('en');
  const [activeCategory, setActiveCategory] = useState<string>(menu.categories[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { style, restaurantInfo } = menu;

  // Parallax Hero
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 300], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.5]);

  useEffect(() => {
    if (menu.id) recordMenuView(menu.id);
  }, [menu.id]);

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        setIsHeaderSticky(window.scrollY > 260); // Adjust based on hero height
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredCategories = menu.categories.map(cat => ({
    ...cat,
    items: cat.items.filter(item =>
      item.name[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description[lang].toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  const allVisibleItems = filteredCategories.flatMap(cat => cat.items);

  const scrollToCategory = (catId: string) => {
    setActiveCategory(catId);
    const el = document.getElementById(`cat-${catId}`);
    if (el) {
      const offset = 180;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const handleItemClick = (item: MenuItem) => {
    setSelectedItem(item);
    recordItemView(menu.id, item.id, item.name.en);
  };

  const getNextItem = (currentId: string) => {
    const idx = allVisibleItems.findIndex(i => i.id === currentId);
    if (idx === -1 || idx === allVisibleItems.length - 1) return null;
    return allVisibleItems[idx + 1];
  };

  const getPrevItem = (currentId: string) => {
    const idx = allVisibleItems.findIndex(i => i.id === currentId);
    if (idx <= 0) return null;
    return allVisibleItems[idx - 1];
  };

  const handleSwipe = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (!selectedItem) return;
    const threshold = 50;
    if (info.offset.x < -threshold) {
      const next = getNextItem(selectedItem.id);
      if (next) setSelectedItem(next);
    } else if (info.offset.x > threshold) {
      const prev = getPrevItem(selectedItem.id);
      if (prev) setSelectedItem(prev);
    }
  };

  const fontClass = style.fontFamily === 'serif' ? 'font-serif'
    : style.fontFamily === 'luxury' ? 'font-luxury'
      : style.fontFamily === 'cyber' ? 'font-cyber'
        : style.fontFamily === 'modern' ? 'font-modern'
          : style.fontFamily === 'clean' ? 'font-clean'
            : 'font-sans';

  // Dynamic Styles
  const pageStyle = {
    backgroundColor: style.backgroundColor,
    color: style.textColor,
  };

  return (
    <div className={`min-h-screen pb-24 mx-auto relative transition-colors duration-500 selection:bg-orange-500/30 ${fontClass}`} style={pageStyle} ref={containerRef}>

      {/* Dynamic Background Elements for certain themes */}
      {style.fontFamily === 'cyber' && (
        <div className="fixed inset-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900 via-transparent to-transparent z-0"></div>
      )}

      {/* Hero Section */}
      <div className="relative h-96 overflow-hidden">
        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="absolute inset-0">
          <img
            src={restaurantInfo.headerImage || "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=1200&q=80"}
            className="w-full h-full object-cover"
            alt="Hero"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        </motion.div>

        {/* Top Navbar */}
        <div className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-4">
          <button onClick={onBack} className="w-10 h-10 rounded-full bg-black/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/40 transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => setLang(l => l === 'en' ? 'th' : 'en')}
            className="px-4 py-2 rounded-full bg-black/20 backdrop-blur-md text-white font-medium hover:bg-black/40 transition-colors flex items-center gap-2"
          >
            <Globe className="w-4 h-4" /> {lang.toUpperCase()}
          </button>
        </div>

        {/* Hero Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 z-10 text-white">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2 mb-3"
          >
            {restaurantInfo.openingHours && (
              <span className="bg-emerald-500/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
                <Clock className="w-3 h-3" /> {restaurantInfo.openingHours.split(':')[0] || 'OPEN'}
              </span>
            )}
            <span className="bg-white/20 backdrop-blur-md px-2 py-1 rounded-md text-xs font-bold flex items-center gap-1">
              <Star className="w-3 h-3 fill-white" /> 4.8
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-2 shadow-sm leading-tight"
          >
            {menu.name}
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="flex items-center gap-1 text-white/80 text-sm"
          >
            <MapPin className="w-4 h-4" />
            <span className="truncate">{restaurantInfo.address}</span>
          </motion.div>
        </div>
      </div>

      {/* Sticky Filters */}
      <div
        className={`sticky top-0 z-30 transition-all duration-300 ${isHeaderSticky ? 'py-2 shadow-lg backdrop-blur-xl' : 'py-4'}`}
        style={{ backgroundColor: isHeaderSticky ? `${style.backgroundColor}E6` : style.backgroundColor }}
      >
        <div className="px-4 mb-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
            <input
              type="text"
              placeholder={lang === 'en' ? "Search menu..." : "ค้นหาเมนู..."}
              className="w-full pl-10 pr-4 py-3 rounded-2xl text-sm focus:outline-none focus:ring-2 transition-all shadow-sm"
              style={{
                backgroundColor: style.surfaceColor,
                color: style.textColor,
                border: `1px solid ${style.textColor}10`,
                '--tw-ring-color': style.primaryColor
              } as React.CSSProperties}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Horizontal Scrollable Categories */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 px-4 pb-2">
          {menu.categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => scrollToCategory(cat.id)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 relative overflow-hidden`}
              style={{
                backgroundColor: activeCategory === cat.id ? style.primaryColor : style.surfaceColor,
                color: activeCategory === cat.id ? '#fff' : style.textColor,
                boxShadow: activeCategory === cat.id ? '0 4px 15px -3px rgba(0,0,0,0.2)' : 'none'
              }}
            >
              <span className="relative z-10">{cat.name[lang]}</span>
              {activeCategory === cat.id && (
                <motion.div layoutId="activeCategory" className="absolute inset-0 bg-white/10" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid/List */}
      <div className="px-4 mt-6 pb-20 space-y-12">
        {filteredCategories.map((cat, catIdx) => (
          <motion.div
            key={cat.id}
            id={`cat-${cat.id}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5, delay: catIdx * 0.1 }}
            className="scroll-mt-44"
          >
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold" style={{ color: style.textColor }}>{cat.name[lang]}</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-current to-transparent opacity-10"></div>
            </div>

            <div className={`grid ${style.layout === 'grid' ? 'grid-cols-2 gap-4' : 'grid-cols-1 gap-6'}`}>
              {cat.items.map(item => (
                <motion.div
                  layoutId={`item-card-${item.id}`} // Shared layout ID base
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`relative group bg-white rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow dark:bg-gray-800 ${style.layout !== 'grid' ? 'flex gap-4' : ''}`}
                  style={{ backgroundColor: style.surfaceColor }}
                  whileTap={{ scale: 0.98 }}
                >

                  {/* Image Area */}
                  <div className={`${style.layout === 'grid' ? 'w-full aspect-square' : 'w-32 h-32 flex-shrink-0'} relative overflow-hidden`}>
                    {item.image ? (
                      <motion.img
                        layoutId={`item-image-${item.id}`}
                        src={item.image}
                        alt={item.name[lang]}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                        <ChefHat className="w-8 h-8 opacity-20" />
                      </div>
                    )}
                    {/* Price Badge on Grid */}
                    {style.layout === 'grid' && (
                      <div className="absolute bottom-2 right-2 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-bold shadow-sm text-gray-900">
                        ฿{item.price}
                      </div>
                    )}
                  </div>

                  {/* Content Area */}
                  <div className={`flex flex-col flex-1 ${style.layout === 'grid' ? 'p-3' : 'py-2 pr-4 justify-between'}`}>
                    <div>
                      <div className="flex justify-between items-start">
                        <motion.h3
                          layoutId={`item-title-${item.id}`} // Animate title position
                          className="font-bold text-base leading-snug mb-1"
                          style={{ color: style.textColor }}
                        >
                          {item.name[lang]}
                        </motion.h3>
                        {style.layout !== 'grid' && <span className="font-bold text-lg" style={{ color: style.primaryColor }}>฿{item.price}</span>}
                      </div>

                      {style.layout !== 'grid' && (
                        <p className="text-sm opacity-60 line-clamp-2 mb-2" style={{ color: style.textColor }}>{item.description[lang]}</p>
                      )}

                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {item.tags?.map(tag => <TagBadge key={tag} tag={tag} />)}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Full Screen Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
            />

            {/* Modal Card */}
            <motion.div
              layoutId={`item-card-${selectedItem.id}`} // Connects to the list item
              className="relative w-full h-full sm:h-auto sm:max-h-[90vh] sm:max-w-md bg-white sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col"
              style={{ backgroundColor: style.surfaceColor }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.2}
              onDragEnd={handleSwipe}
            >

              {/* Close Button */}
              <button
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 z-20 p-2 bg-black/20 text-white rounded-full backdrop-blur-md hover:bg-black/30 transition-colors"
                style={{ marginTop: 'env(safe-area-inset-top)' }}
              >
                <X className="w-6 h-6" />
              </button>

              {/* Large Image */}
              <div className="relative h-[45vh] bg-gray-100 flex-shrink-0">
                {selectedItem.image ? (
                  <motion.img
                    layoutId={`item-image-${selectedItem.id}`}
                    src={selectedItem.image}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ChefHat className="w-16 h-16 opacity-20" />
                  </div>
                )}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Floating Price */}
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="absolute bottom-6 right-6 px-4 py-2 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl text-white shadow-lg"
                >
                  <span className="text-3xl font-bold tracking-tight">฿{selectedItem.price}</span>
                </motion.div>
              </div>

              {/* Details Content */}
              <div className="flex-1 p-6 overflow-y-auto">
                <div className="flex flex-col h-full">
                  <div className="flex justify-between items-start mb-2">
                    <motion.h2
                      layoutId={`item-title-${selectedItem.id}`}
                      className="text-3xl font-bold leading-tight"
                      style={{ color: style.textColor }}
                    >
                      {selectedItem.name[lang]}
                    </motion.h2>
                  </div>

                  {/* Tags Row */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedItem.tags?.map(tag => <TagBadge key={tag} tag={tag} />)}
                    <DietaryIcon info={selectedItem.dietaryInfo} />
                  </div>

                  <div className="w-12 h-1 rounded-full mb-6 opacity-50" style={{ backgroundColor: style.primaryColor }} />

                  <p className="text-lg leading-relaxed opacity-80 mb-8" style={{ color: style.textColor }}>
                    {selectedItem.description[lang]}
                  </p>

                  {/* Action Buttons */}
                  <div className="mt-auto grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 py-3 rounded-xl border font-semibold transition-transform active:scale-95"
                      style={{ borderColor: `${style.textColor}20`, color: style.textColor }}>
                      <Heart className="w-5 h-5" /> Save
                    </button>
                    <button className="flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-white shadow-lg transition-transform active:scale-95"
                      style={{ backgroundColor: style.primaryColor }}>
                      <Share2 className="w-5 h-5" /> Share
                    </button>
                  </div>
                </div>
              </div>

              {/* Swipe Instructor */}
              <div className="absolute bottom-2 left-0 right-0 text-center opacity-30 text-xs uppercase tracking-widest pointer-events-none" style={{ color: style.textColor }}>
                Swipe for more
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};