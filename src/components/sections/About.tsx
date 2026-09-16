export function About() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="relative py-24 grid-lines-light overflow-hidden"
    >
      {/* Background image */}
      <img
        src="/fundo.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/85" aria-hidden="true" />

      {/* Content */}
      <div className="relative mx-auto max-w-[1280px] px-6 md:px-10">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-4">
            The Team
          </p>
          <h2
            id="about-heading"
            className="text-fluid-section uppercase text-white mb-6"
            style={{ fontFamily: 'var(--font-display)', fontWeight: 700 }}
          >
            RELENTLESS SQUAD
          </h2>
          <div className="flex flex-col gap-1 text-fluid-body text-white/60 leading-relaxed text-center">
            <span>Relentless Squad is a Brazilian Jiu-Jitsu team built on technical excellence.</span>
            <span>Led by two Brazilian black belts with decades of experience as both athletes and coaches,</span>
            <span>the team focuses on creating beginner- and family-friendly gyms across the United States.</span>
          </div>
        </div>
      </div>
    </section>
  )
}
