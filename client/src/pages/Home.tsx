import { ForexWidget } from "@/components/ForexWidget";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <iframe
        src="https://www.bookmyforex.com/"
        title="BookMyForex"
        className="absolute inset-0 w-full h-full border-0"
        style={{ pointerEvents: "none" }}
        tabIndex={-1}
        aria-hidden="true"
        data-testid="bg-iframe"
      />
      <div
        className="absolute inset-0 bg-black/50"
        data-testid="overlay"
      />
      <div className="relative z-10 min-h-screen w-full flex items-center justify-center p-4">
        <ForexWidget />
      </div>
    </div>
  );
}
