import React, { useState, useEffect, useRef } from 'react';
import { Menu, MenuItem, MenuCategory, DietaryInfo } from '../../types';
import { Search, Globe, ChevronLeft, ChevronRight, X, Clock, Star, MapPin, Phone, Share2, Heart, Flame, Leaf, WheatOff, ThumbsUp, TrendingUp, Sparkles, ChefHat } from 'lucide-react';
import { recordMenuView, recordItemView } from '../../services/analyticsService';

interface PublicMenuProps {
  menu: Menu;
  onBack: () => void;
}

const DietaryIcon: React.FC<{ info?: DietaryInfo }> = ({ info }) => {
  if (!info) return null;
  return (
    <div className="flex items-center gap-1.5">
      {info.spiciness !== 'none' && (
        <div className="flex items-center gap-0.5" title={`Spiciness: ${info.spiciness}`}>
          <Flame className={`w-3.5 h-3.5 ${info.spiciness === 'hot' ? 'text-red-600 fill-red-600' : info.spiciness === 'medium' ? 'text-red-500' : 'text-orange-400'}`} />
          {info.spiciness === 'hot' && <Flame className="w-3.5 h-3.5 text-red-600 fill-red-600 -ml-2" />}
          {info.spiciness === 'hot' && <Flame className="w-3.5 h-3.5 text-red-600 fill-red-600 -ml-2" />}
        </div>
      )}
      {info.isVegetarian && <Leaf className="w-3.5 h-3.5 text-green-600" title="Vegetarian" />}
      {info.isVegan && <Leaf className="w-3.5 h-3.5 text-green-600 fill-green-600" title="Vegan" />}
      {info.isGlutenFree && <WheatOff className="w-3.5 h-3.5 text-amber-600" title="Gluten Free" />}
    </div>
  );
};

const TagIcon: React.FC<{ tag: string }> = ({ tag }) => {
  switch (tag) {
    case "Recommended":
      return <ThumbsUp className="w-3 h-3 fill-current" />;
    case "Chef's Choice":
      return <ChefHat className="w-3 h-3" />;
    case "Best Seller":
      return <TrendingUp className="w-3 h-3" />;
    case "New":
      return <Sparkles className="w-3 h-3" />;
    default:
      return null;
  }
};

const TagBadge: React.FC<{ tag: string }> = ({ tag }) => {
  let styleClass = "bg-gray-100 text-gray-700";

  if (tag === "Recommended") styleClass = "bg-blue-50 text-blue-700";
  else if (tag === "Chef's Choice") styleClass = "bg-orange-50 text-orange-700";
  else if (tag === "Best Seller") styleClass = "bg-yellow-50 text-yellow-700";
  else if (tag === "New") styleClass = "bg-purple-50 text-purple-700";

  return (
    <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 border border-transparent ${styleClass}`}>
      <TagIcon tag={tag} /> {tag === "Chef's Choice" ? "Chef's Fav" : tag}
    </span>
  );
};

export const PublicMenu: React.FC<PublicMenuProps> = ({ menu, onBack }) => {
  const [lang, setLang] = useState<'en' | 'th'>('en');
  const [activeCategory, setActiveCategory] = useState<string>(menu.categories[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [isHeaderSticky, setIsHeaderSticky] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  // Swipe Physics State
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const { style, restaurantInfo } = menu;

  // Record Menu View on Mount
  useEffect(() => {
    if (menu.id) {
      recordMenuView(menu.id);
    }
  }, [menu.id]);

  // Derive flat list of visible items
  const filteredCategories = menu.categories.map(cat => ({
    ...cat,
    items: cat.items.filter(item =>
      item.name[lang].toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description[lang].toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(cat => cat.items.length > 0);

  const allVisibleItems = filteredCategories.flatMap(cat => cat.items);

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        setIsHeaderSticky(window.scrollY > 150);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reset swipe state when item changes
  useEffect(() => {
    setDragX(0);
    setIsDragging(false);
    setIsAnimating(false);
  }, [selectedItemIndex]);

  const scrollToCategory = (catId: string) => {
    setActiveCategory(catId);
    const el = document.getElementById(`cat-${catId}`);
    if (el) {
      const offset = 160;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  const toggleLang = () => setLang(prev => prev === 'en' ? 'th' : 'en');

  const handleItemClick = (itemId: string) => {
    const index = allVisibleItems.findIndex(i => i.id === itemId);
    if (index >= 0) {
      setSelectedItemIndex(index);
      // Record Item View
      const item = allVisibleItems[index];
      recordItemView(menu.id, item.id, item.name.en);
    }
  };

  const getNextIndex = () => (selectedItemIndex !== null && selectedItemIndex < allVisibleItems.length - 1) ? selectedItemIndex + 1 : 0;
  const getPrevIndex = () => (selectedItemIndex !== null && selectedItemIndex > 0) ? selectedItemIndex - 1 : allVisibleItems.length - 1;

  const handleNextItem = () => {
    if (selectedItemIndex !== null) setSelectedItemIndex(getNextIndex());
  };

  const handlePrevItem = () => {
    if (selectedItemIndex !== null) setSelectedItemIndex(getPrevIndex());
  };

  // --- Swipe Gesture Handlers ---

  const handleDragStart = (clientX: number) => {
    if (isAnimating || selectedItemIndex === null) return;
    setIsDragging(true);
    setStartX(clientX);
  };

  const handleDragMove = (clientX: number) => {
    if (!isDragging || isAnimating) return;
    const delta = clientX - startX;
    setDragX(delta);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);

    const threshold = 100; // px to trigger swipe

    if (dragX < -threshold) {
      // Swipe Left (Next)
      setIsAnimating(true);
      setDragX(-window.innerWidth); // Fly out left
      setTimeout(handleNextItem, 200);
    } else if (dragX > threshold) {
      // Swipe Right (Prev)
      setIsAnimating(true);
      setDragX(window.innerWidth); // Fly out right
      setTimeout(handlePrevItem, 200);
    } else {
      // Snap back
      setDragX(0);
    }
  };

  // Touch Events
  const onTouchStart = (e: React.TouchEvent) => handleDragStart(e.touches[0].clientX);
  const onTouchMove = (e: React.TouchEvent) => handleDragMove(e.touches[0].clientX);
  const onTouchEnd = () => handleDragEnd();

  // Mouse Events (for desktop testing)
  const onMouseDown = (e: React.MouseEvent) => handleDragStart(e.clientX);
  const onMouseMove = (e: React.MouseEvent) => handleDragMove(e.clientX);
  const onMouseUp = () => handleDragEnd();
  const onMouseLeave = () => { if (isDragging) handleDragEnd(); };

  // Calculate transforms
  const rotateDeg = dragX * 0.05; // 100px move = 5deg rotation
  const opacity = Math.max(0, 1 - Math.abs(dragX) / (window.innerWidth * 0.8));

  // Phantom card scaling (background card pops up)
  const backgroundScale = Math.min(1, 0.9 + (Math.abs(dragX) / window.innerWidth) * 0.1);

  // Determine which item is "behind" the current one based on drag direction
  // Default to Next item, but if dragging right, show Prev item
  const phantomIndex = (dragX > 0) ? getPrevIndex() : getNextIndex();
  const phantomItem = selectedItemIndex !== null ? allVisibleItems[phantomIndex] : null;

  // Styles
  const pageStyle = {
    backgroundColor: style.backgroundColor,
    color: style.textColor,
    fontFamily: style.fontFamily === 'serif' ? '"Playfair Display", serif' : style.fontFamily === 'mono' ? 'monospace' : 'Inter, sans-serif'
  };
  const isLuxury = style.fontFamily === 'serif';

  return (
    <div className="min-h-screen pb-24 max-w-md mx-auto shadow-2xl overflow-hidden relative transition-colors duration-300" style={pageStyle}>

      {/* Top Bar */}
      <div
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${isHeaderSticky ? 'shadow-lg backdrop-blur-xl' : 'bg-transparent py-4'} max-w-md mx-auto`}
        style={isHeaderSticky ? { backgroundColor: `${style.surfaceColor}E6` } : {}}
      >
        <div className="flex items-center justify-between px-4 h-14">
          {isHeaderSticky ? (
            <div className={`text-lg font-bold truncate flex-1 ml-2 ${isLuxury ? 'font-serif' : ''}`} style={{ color: style.textColor }}>{menu.name}</div>
          ) : (
            <button onClick={onBack} className="bg-black/20 backdrop-blur-md p-2.5 rounded-full text-white hover:bg-black/30 transition-all active:scale-95">
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          <button
            onClick={toggleLang}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold tracking-wide transition-colors uppercase ${isHeaderSticky ? '' : 'bg-black/20 backdrop-blur-md text-white hover:bg-black/30'}`}
            style={isHeaderSticky ? { backgroundColor: style.backgroundColor, color: style.textColor, border: `1px solid ${style.textColor}15` } : {}}
          >
            <Globe className="w-3 h-3" />
            {lang}
          </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="h-80 relative overflow-hidden flex items-end" style={{ backgroundColor: style.primaryColor }}>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
        <img
          src={restaurantInfo.headerImage || "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=1200&q=80"}
          className="absolute inset-0 w-full h-full object-cover transform scale-105"
          alt="Hero"
        />

        <div className="relative z-20 px-6 pb-16 w-full space-y-3">
          <div className="flex flex-wrap gap-2 mb-1">
            {restaurantInfo.openingHours && (
              <span className="bg-green-500/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <Clock className="w-3 h-3" /> {restaurantInfo.openingHours.split(':')[0] || 'OPEN'}
              </span>
            )}
            <span className="bg-white/20 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
              <Star className="w-3 h-3 fill-current" /> 4.8
            </span>
          </div>

          <h1 className={`text-4xl font-bold text-white leading-tight drop-shadow-sm ${isLuxury ? 'font-serif tracking-wide' : 'tracking-tight'}`}>{menu.name}</h1>

          <div className="flex flex-col gap-1 text-white/90 text-sm font-medium">
            {restaurantInfo.address && (
              <a
                href={restaurantInfo.googleMapsLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 opacity-80" />
                <span className="truncate max-w-[280px]">{restaurantInfo.address}</span>
              </a>
            )}
            {restaurantInfo.phone && (
              <div className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 opacity-80" />
                <span>{restaurantInfo.phone}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky Search & Nav */}
      <div className="sticky top-0 z-30 pt-4 pb-2 shadow-sm transition-colors duration-300" ref={headerRef} style={{ backgroundColor: style.backgroundColor }}>
        <div className="px-4 mb-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-orange-500 transition-colors" />
            <input
              type="text"
              placeholder={lang === 'en' ? "Search for dishes..." : "ค้นหาเมนู..."}
              className="w-full pl-10 pr-4 py-3 rounded-2xl shadow-sm text-sm focus:ring-2 focus:outline-none transition-all"
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

        {/* Categories Pills */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 px-4 pb-2">
          {menu.categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => scrollToCategory(cat.id)}
              className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border active:scale-95`}
              style={{
                backgroundColor: activeCategory === cat.id ? style.primaryColor : style.surfaceColor,
                color: activeCategory === cat.id ? '#fff' : style.textColor,
                borderColor: activeCategory === cat.id ? 'transparent' : `${style.textColor}10`,
                boxShadow: activeCategory === cat.id ? `0 4px 12px ${style.primaryColor}66` : 'none'
              }}
            >
              {cat.name[lang]}
            </button>
          ))}
        </div>
      </div>

      {/* Menu List */}
      <div className="px-4 space-y-10 mt-6 min-h-[50vh]">
        {filteredCategories.map(cat => (
          <div key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-44">
            <h2 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${isLuxury ? 'font-serif' : ''} ${lang === 'th' ? 'font-thai' : ''}`} style={{ color: style.textColor }}>
              {cat.name[lang]}
              <div className="h-px flex-1 bg-gradient-to-r from-current to-transparent opacity-20"></div>
            </h2>

            <div className={`${style.layout === 'grid' ? 'grid grid-cols-2 gap-4' : 'flex flex-col gap-5'}`}>
              {cat.items.map(item => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item.id)}
                  className={`group rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${style.layout === 'grid' ? 'flex flex-col' : 'flex gap-4 p-3 pr-4'}`}
                  style={{
                    backgroundColor: style.surfaceColor,
                    border: `1px solid ${style.textColor}08`,
                    boxShadow: '0 2px 8px -2px rgba(0,0,0,0.05)'
                  }}
                >
                  {/* Image */}
                  <div className={`${style.layout === 'grid' ? 'w-full aspect-[4/3]' : 'w-32 h-32'} flex-shrink-0 bg-gray-100 overflow-hidden relative ${style.layout === 'grid' ? '' : 'rounded-xl'}`}>
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name[lang]}
                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                        style={item.imageEnhancement ? {
                          filter: `brightness(${item.imageEnhancement.brightness}) contrast(${item.imageEnhancement.contrast}) saturate(${item.imageEnhancement.saturation})`
                        } : {}}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300 bg-gray-50">No Image</div>
                    )}

                    {/* Price Badge for Grid View */}
                    {style.layout === 'grid' && (
                      <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm text-black font-bold px-2 py-1 rounded-lg text-xs shadow-sm">
                        ฿{item.price}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className={`flex-1 flex flex-col justify-between ${style.layout === 'grid' ? 'p-4 pt-3' : 'py-1'}`}>
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h3 className={`font-bold leading-tight mb-1.5 ${isLuxury ? 'text-lg' : 'text-base'} ${lang === 'th' ? 'font-thai' : ''}`} style={{ color: style.textColor }}>
                          {item.name[lang]}
                        </h3>
                      </div>

                      {/* Tags & Dietary Icons (List View) */}
                      <div className="mb-2 flex flex-wrap gap-1">
                        {item.tags?.map(tag => (
                          <TagBadge key={tag} tag={tag} />
                        ))}
                        <DietaryIcon info={item.dietaryInfo} />
                      </div>

                      <p className={`text-xs opacity-60 line-clamp-2 leading-relaxed ${lang === 'th' ? 'font-thai' : ''}`} style={{ color: style.textColor }}>
                        {item.description[lang]}
                      </p>
                    </div>

                    {style.layout !== 'grid' && (
                      <div className="flex justify-between items-end mt-3">
                        <span className="font-bold text-lg" style={{ color: style.primaryColor }}>฿{item.price}</span>
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                          style={{ backgroundColor: `${style.textColor}10` }}
                        >
                          <ChevronRight className="w-4 h-4 opacity-50" />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {filteredCategories.length === 0 && (
          <div className="text-center py-20 opacity-50" style={{ color: style.textColor }}>
            <p>No items found</p>
          </div>
        )}
      </div>

      {/* Swipeable Detail Card Modal */}
      {selectedItemIndex !== null && (
        <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-md flex items-center justify-center overflow-hidden">

          {/* Close Button */}
          <button
            onClick={() => setSelectedItemIndex(null)}
            className="absolute top-6 right-6 p-3 bg-white/10 rounded-full text-white z-50 hover:bg-white/20 transition-all duration-300"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Floating Navigation Buttons */}
          <button
            onClick={handlePrevItem}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-white/10 rounded-full text-white hover:bg-white/20 hover:scale-110 transition-all active:scale-95 backdrop-blur-sm z-50 hidden md:flex items-center justify-center shadow-lg border border-white/10"
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
          <button
            onClick={handleNextItem}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-white/10 rounded-full text-white hover:bg-white/20 hover:scale-110 transition-all active:scale-95 backdrop-blur-sm z-50 hidden md:flex items-center justify-center shadow-lg border border-white/10"
          >
            <ChevronRight className="w-8 h-8" />
          </button>

          <div className="relative w-full h-full md:max-w-md md:max-h-[800px] flex items-center justify-center p-4">

            {/* Phantom Background Card (Previews next item) */}
            {phantomItem && (
              <div
                className="absolute w-[90%] h-[80%] md:h-[750px] bg-white rounded-3xl overflow-hidden opacity-50 shadow-2xl"
                style={{
                  transform: `scale(${backgroundScale})`,
                  transition: 'transform 0.1s linear',
                  zIndex: 10
                }}
              >
                {phantomItem.image && (
                  <img src={phantomItem.image} className="w-full h-1/2 object-cover opacity-50" alt="" />
                )}
                <div className="p-6">
                  <div className="h-6 w-3/4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 w-full bg-gray-100 rounded mb-2"></div>
                  <div className="h-4 w-1/2 bg-gray-100 rounded"></div>
                </div>
              </div>
            )}

            {/* Main Active Card */}
            <div
              className="relative w-full h-full md:h-[750px] bg-white rounded-3xl overflow-hidden flex flex-col shadow-2xl cursor-grab active:cursor-grabbing select-none"
              style={{
                transform: `translateX(${dragX}px) rotate(${rotateDeg}deg)`,
                transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                zIndex: 20
              }}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseLeave}
            >
              {/* Image */}
              <div className="h-[55%] bg-gray-900 relative">
                {allVisibleItems[selectedItemIndex].image ? (
                  <img
                    src={allVisibleItems[selectedItemIndex].image}
                    className="w-full h-full object-cover pointer-events-none"
                    alt="Detail"
                    draggable={false}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 bg-gray-100">No Image</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

                {/* Floating Price Tag */}
                <div className="absolute bottom-6 right-6 bg-white/20 backdrop-blur-md border border-white/20 text-white px-5 py-2 rounded-2xl shadow-lg">
                  <span className="text-3xl font-bold tracking-tight">฿{allVisibleItems[selectedItemIndex].price}</span>
                </div>
              </div>

              {/* Text Info */}
              <div className="flex-1 p-8 bg-white flex flex-col pointer-events-none">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {/* Tags with Icons */}
                    {allVisibleItems[selectedItemIndex].tags?.map((tag, idx) => {
                      let styleClass = "bg-gray-100 text-gray-700";
                      let icon = null;

                      if (tag === "Recommended") {
                        styleClass = "bg-blue-50 text-blue-700";
                        icon = <ThumbsUp className="w-3 h-3 fill-current" />;
                      }
                      else if (tag === "Chef's Choice") {
                        styleClass = "bg-orange-50 text-orange-700";
                        icon = <ChefHat className="w-3 h-3" />;
                      }
                      else if (tag === "Best Seller") {
                        styleClass = "bg-yellow-50 text-yellow-700";
                        icon = <TrendingUp className="w-3 h-3" />;
                      }
                      else if (tag === "New") {
                        styleClass = "bg-purple-50 text-purple-700";
                        icon = <Sparkles className="w-3 h-3" />;
                      }

                      return (
                        <span
                          key={tag}
                          className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 ${styleClass}`}
                        >
                          {icon} {tag === "Chef's Choice" ? "Chef's Fav" : tag}
                        </span>
                      );
                    })}

                    {/* Dietary Badges */}
                    {allVisibleItems[selectedItemIndex].dietaryInfo?.isVegetarian && (
                      <span className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                        <Leaf className="w-3 h-3" /> Veg
                      </span>
                    )}
                    {allVisibleItems[selectedItemIndex].dietaryInfo?.isVegan && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                        <Leaf className="w-3 h-3 fill-current" /> Vegan
                      </span>
                    )}
                    {allVisibleItems[selectedItemIndex].dietaryInfo?.isGlutenFree && (
                      <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                        <WheatOff className="w-3 h-3" /> GF
                      </span>
                    )}
                    {allVisibleItems[selectedItemIndex].dietaryInfo?.spiciness && allVisibleItems[selectedItemIndex].dietaryInfo?.spiciness !== 'none' && (
                      <span className="px-3 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                        <Flame className="w-3 h-3 fill-current" /> {allVisibleItems[selectedItemIndex].dietaryInfo?.spiciness}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between items-start mb-2">
                    <h2 className={`text-3xl font-bold text-gray-900 leading-tight flex-1 ${isLuxury ? 'font-serif' : ''} ${lang === 'th' ? 'font-thai' : ''}`}>
                      {allVisibleItems[selectedItemIndex].name[lang]}
                    </h2>
                    <div className="flex gap-3 ml-4 pointer-events-auto">
                      <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors border border-gray-100">
                        <Share2 className="w-5 h-5" />
                      </button>
                      <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-red-500 transition-colors border border-gray-100">
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="w-12 h-1 bg-orange-500 rounded-full mb-6"></div>

                  <p className={`text-gray-600 leading-relaxed text-lg ${lang === 'th' ? 'font-thai' : ''}`}>
                    {allVisibleItems[selectedItemIndex].description[lang]}
                  </p>
                </div>

                {/* Hint Text */}
                <div className="mt-auto pt-6 border-t border-gray-50 flex justify-center text-gray-300 text-xs font-bold uppercase tracking-[0.2em] animate-pulse">
                  {isDragging ? (dragX < 0 ? 'Next' : 'Previous') : 'Swipe to Navigate'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};