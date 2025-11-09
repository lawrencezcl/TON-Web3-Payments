// app/not-found.tsx
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Page Not Found</h1>
        <p className="text-lg mb-8">The page you are looking for does not exist.</p>
        <a 
          href="/"
          className="px-4 py-2 bg-primary text-white rounded-md inline-block"
        >
          Return Home
        </a>
      </div>
    </div>
  );
}