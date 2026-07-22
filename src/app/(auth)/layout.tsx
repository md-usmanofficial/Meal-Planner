/**
 * Auth layout — wraps login, register, forgot/reset password pages.
 * Centered layout with brand sidebar on large screens.
 */

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Brand panel — visible on large screens */}
      <div className="hidden lg:flex lg:w-1/2 gradient-brand flex-col items-center justify-center p-12 text-white">
        <div className="max-w-sm text-center">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-3xl font-extrabold">
            N
          </div>
          <h1 className="mb-4 text-3xl font-extrabold">NutriPlan</h1>
          <p className="text-lg text-white/80">
            Your personal nutrition coach. Plan smarter meals, track your progress,
            and discover recipes you&apos;ll love.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 text-left">
            {[
              { icon: "🥗", text: "Personalized meal plans" },
              { icon: "📊", text: "Automatic macro tracking" },
              { icon: "🔍", text: "500K+ recipes" },
              { icon: "📈", text: "Progress analytics" },
            ].map((item) => (
              <div key={item.text} className="flex items-center gap-2 text-sm text-white/90">
                <span>{item.icon}</span>
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 flex-col items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="mb-8 flex items-center justify-center gap-2 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
              N
            </div>
            <span className="text-lg font-bold text-foreground">NutriPlan</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
