import { GenericCard } from "@/components/shared/molecules/GenericCard";
import { MeatFishEggs } from "@/components/IngredientSelector/icons/MeatFishEggs";
import { Vegetables } from "@/components/IngredientSelector/icons/Vegitables";
import { PotatoesLegimesCereals } from "@/components/IngredientSelector/icons/PotatoesLegimesCereals";
import { Fats } from "@/components/IngredientSelector/icons/Fats";
import { Liquids } from "@/components/IngredientSelector/icons/Liquids";
import { Spices } from "@/components/IngredientSelector/icons/Spices";
import { Herbs } from "@/components/IngredientSelector/icons/Herbs";

interface CategoryCardProps {
  title: string | undefined;
  onClick(): void;
  categoryId: string;
}

export function CategoryCard({
  title,
  onClick,
  categoryId,
}: CategoryCardProps) {
  const IconsMap: {
    [key: string]: JSX.Element;
  } = {
    "meat-fish-eggs": <MeatFishEggs />,
    vegetables: <Vegetables />,
    "potatoes-legumes-cereals": <PotatoesLegimesCereals />,
    fats: <Fats />,
    liquids: <Liquids />,
    "spices-condiments": <Spices />,
    "fresh-herbs": <Herbs />,
  };

  return (
    <GenericCard title={title} onClick={onClick} icons={IconsMap[categoryId]} />
  );
}
