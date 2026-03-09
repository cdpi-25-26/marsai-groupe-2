import ColorBends from "@/components/ColorBends.jsx";

export default function Page() {
  return (
    <div className="w-full h-[400px]">
      <ColorBends
        colors={["#ff5c7a", "#8a5cff", "#00ffd1"]}
        rotation={0}
        speed={0.2}
        scale={1}
        frequency={1}
        warpStrength={1}
        mouseInfluence={1}
        parallax={0.5}
        noise={0.1}
        transparent
      />
    </div>
  );
}
