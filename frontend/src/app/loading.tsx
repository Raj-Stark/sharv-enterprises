export default function Loading() {
  return (
    <main className="mx-auto w-full max-w-[1440px] px-5 py-12 sm:px-8 lg:px-12 lg:py-16">
      <div className="skeleton h-4 w-28 rounded-full" />
      <div className="skeleton mt-6 h-14 max-w-2xl rounded-2xl" />
      <div className="skeleton mt-4 h-5 max-w-xl rounded-full" />
      <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="overflow-hidden rounded-[1.75rem] border border-[var(--line)] bg-white">
            <div className="skeleton aspect-[4/3]" />
            <div className="space-y-3 p-6">
              <div className="skeleton h-4 w-24 rounded-full" />
              <div className="skeleton h-7 w-3/4 rounded-full" />
              <div className="skeleton h-4 w-full rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
