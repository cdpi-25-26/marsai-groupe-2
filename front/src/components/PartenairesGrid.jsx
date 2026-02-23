import PartenaireCard from "./PartenairesCard";

export default function PartenaireGrid({ items }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-12">
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