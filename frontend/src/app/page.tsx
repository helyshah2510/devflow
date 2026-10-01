import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0d0f1a] text-white">
      <nav className="flex items-center justify-between border-b border-white/10 px-8 py-5">
        <h2 className="text-xl font-semibold">
          Dev<span className="text-indigo-400">Flow</span>
        </h2>

        <Link href="/login" className="rounded-lg border border-white/10 px-4 py-2 text-sm text-gray-300 transition hover:bg-white/10">
          Login
        </Link>
      </nav>

      <section className="flex min-h-[calc(100vh-81px)] flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 rounded-full border border-indigo-400/20 bg-indigo-400/10 px-4 py-2 text-sm text-indigo-300">
          Project & Task Management
        </div>

        <h1 className="max-w-4xl text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
          Build better projects.
          <br />
          <span className="text-indigo-400">Flow better.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-400">
          Manage your development projects, tasks, and team workflow
          from one simple workspace.
        </p>

        <div className="mt-8 flex gap-4">
          <link href="/register" className="rounded-lg bg-indigo-500 px-6 py-3 font-medium transition hover:bg-indigo-400">
            Get Started
          </link>

          <button className="rounded-lg border border-white/10 px-6 py-3 font-medium text-gray-300 transition hover:bg-white/10">
            Learn More
          </button>
        </div>
      </section>
    </main>
  );
}