import PartenaireCard from "./PartenairesCard";

export default function PartenaireGrid({ items }) {
  return (
    <div className="flex flex-wrap justify-center gap-6 pb-12">
      {items.map((p, index) => (
        <PartenaireCard
          key={index}
          logo={p.logo}
          color={p.color}
          url={p.url}
        />
      ))}
    </div>
  );
}
