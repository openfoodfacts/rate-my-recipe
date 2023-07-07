import { GenericCard } from "@/components/shared/molecules/GenericCard";

interface CategoryCardProps {
  title: string | undefined;
  onClick(): void;
}

export function CategoryCard({ title, onClick }: CategoryCardProps) {
  return (
    <GenericCard
      title={title}
      onClick={onClick}
      imgUrl={
        "https://thomasgabin.com/wp-content/uploads/2023/04/Open-food-Logo.png"
      }
    />
  );
}
