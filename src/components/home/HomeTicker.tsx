const MSG = 'KOREAN ✦ WESTERN ✦ ETHNIC ✦ INNERWEAR ✦ ACCESSORIES ✦ TAILORING ✦ '

export default function HomeTicker() {
  return (
    <div className="w-full overflow-hidden bg-gold text-ink border-y-[4px] border-ink" aria-label="Collections ticker">
      <div className="flex w-max [animation:aa-ticker2_20s_linear_infinite] hover:[animation-play-state:paused] motion-reduce:[animation:none] py-3">
        <span className="shrink-0 pr-2 font-display uppercase text-[14px] tracking-[0.08em] whitespace-nowrap">{MSG.repeat(4)}</span>
        <span className="shrink-0 pr-2 font-display uppercase text-[14px] tracking-[0.08em] whitespace-nowrap" aria-hidden="true">{MSG.repeat(4)}</span>
      </div>
      <style>{`@keyframes aa-ticker2 { from{transform:translateX(0)} to{transform:translateX(-50%)} }`}</style>
    </div>
  )
}
