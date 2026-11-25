export default function Stub({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <h1 className="font-display text-5xl uppercase">{title}</h1>
      <p className="mt-4 font-body">Coming soon.</p>
    </div>
  )
}
