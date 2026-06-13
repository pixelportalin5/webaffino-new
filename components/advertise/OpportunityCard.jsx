const CARD_THEMES = {
  blue: {
    accentColor: "#60A5FA",
    glowClass: "bg-[#60A5FA]/10",
    iconBgClass: "bg-[#60A5FA]/10 group-hover:bg-[#60A5FA]/20",
    iconBorderClass: "border-[#60A5FA]/20",
    hoverBorderClass: "hover:border-[#60A5FA]/50"
  },
  purple: {
    accentColor: "#C084FC",
    glowClass: "bg-[#C084FC]/10",
    iconBgClass: "bg-[#C084FC]/10 group-hover:bg-[#C084FC]/20",
    iconBorderClass: "border-[#C084FC]/20",
    hoverBorderClass: "hover:border-[#C084FC]/50"
  },
  green: {
    accentColor: "#34D399",
    glowClass: "bg-[#34D399]/10",
    iconBgClass: "bg-[#34D399]/10 group-hover:bg-[#34D399]/20",
    iconBorderClass: "border-[#34D399]/20",
    hoverBorderClass: "hover:border-[#34D399]/50"
  }
};

/**
 * @param {{
 *   icon: string;
 *   title: string;
 *   description: string;
 *   theme: keyof typeof CARD_THEMES;
 *   animationDelay?: string;
 * }} props
 */
export default function OpportunityCard({
  icon,
  title,
  description,
  theme,
  animationDelay = ""
}) {
  const cardTheme = CARD_THEMES[theme];

  return (
    <div
      className={`group relative flex flex-col items-center overflow-hidden rounded-[2.5rem] border border-white/10 bg-[#111111] p-10 text-center shadow-2xl transition-all duration-500 animate-fade-up ${cardTheme.hoverBorderClass} ${animationDelay}`}
      data-advertise-reveal=""
    >
      <div
        className={`absolute -right-10 -top-10 h-48 w-48 rounded-bl-full transition-transform duration-700 group-hover:scale-[1.5] ${cardTheme.glowClass}`}
      />
      <div className="relative z-10 flex flex-col items-center">
        <div
          className={`mb-8 flex h-16 w-16 items-center justify-center rounded-2xl border transition-all group-hover:scale-110 ${cardTheme.iconBgClass} ${cardTheme.iconBorderClass}`}
        >
          <i
            data-lucide={icon}
            className="h-8 w-8"
            style={{ color: cardTheme.accentColor }}
          />
        </div>
        <h3 className="h-card mb-4 text-white">{title}</h3>
        <p className="body-text text-neutral-400">{description}</p>
      </div>
    </div>
  );
}
