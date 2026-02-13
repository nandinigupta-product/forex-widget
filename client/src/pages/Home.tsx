import { ForexWidget } from "@/components/ForexWidget";

export default function Home() {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-top bg-no-repeat"
        style={{ backgroundImage: "url('/images/bmf-bg.png')" }}
        aria-hidden="true"
        data-testid="bg-image"
      />
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[2px]"
        data-testid="overlay"
      />
      <div className="relative z-10 min-h-screen w-full flex items-center justify-center p-4">
        <ForexWidget />
      </div>
    </div>
  );
}
