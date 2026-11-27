const COLS = [1, 2, 3, 4] as const
const CATS = ['all', 'kurti', 'jeans', 'party', 'y2k'] as const
const SORTS = [
  { value: 'recommended', label: 'Recommended' },
  { value: 'price-asc', label: 'Price low-high' },
  { value: 'price-desc', label: 'Price high-low' },
  { value: 'name-asc', label: 'Name A-Z' },
] as const

export type Sort = (typeof SORTS)[number]['value']
export type Cat = (typeof CATS)[number]

type Props = {
  cols: number
  cat: Cat
  sort: Sort
  onCols: (n: number) => void
  onCat: (c: Cat) => void
  onSort: (s: Sort) => void
}

export default function ShopToolbar({ cols, cat, sort, onCols, onCat, onSort }: Props) {
  return (
    <div className="sticky top-0 z-30 border-b-3 border-ink bg-cream">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-2" role="group" aria-label="Grid columns">
            {COLS.map((n) => (
              <button
                key={n}
                type="button"
                data-active={cols === n || (n === 2 && cols > 2 && typeof window !== 'undefined' && window.innerWidth < 768)}
                className={`nb-chip size-10 p-0 font-mono text-sm focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-pink focus-visible:outline-offset-2 ${n > 2 ? 'hidden md:inline-flex' : ''}`}
                aria-label={`${n} columns`}
                aria-pressed={cols === n || (n === 2 && cols > 2 && typeof window !== 'undefined' && window.innerWidth < 768)}
                onClick={() => onCols(n)}
              >
                {n}
              </button>
            ))}
          </div>

          <label className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase">Sort</span>
            <select
              className="nb-input py-2 text-sm focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-pink focus-visible:outline-offset-2"
              value={sort}
              onChange={(e) => onSort(e.target.value as Sort)}
              aria-label="Sort products"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-wrap gap-2" role="group" aria-label="Collection filter">
          {CATS.map((c) => (
            <button
              key={c}
              type="button"
              data-active={cat === c}
              className="nb-chip font-display text-xs uppercase focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-pink focus-visible:outline-offset-2"
              aria-label={`Filter ${c}`}
              aria-pressed={cat === c}
              onClick={() => onCat(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

