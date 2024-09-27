import { GenericCard } from "@/components/shared/molecules/GenericCard";
import { MeatFishEggs } from "@/components/IngredientSelector/icons/MeatFishEggs";
import { Fruits } from "@/components/IngredientSelector/icons/Fruits";
import { Vegetables } from "@/components/IngredientSelector/icons/Vegetables";
import { PotatoesLegumesCereals } from "@/components/IngredientSelector/icons/PotatoesLegumesCereals";
import { Nuts } from "@/components/IngredientSelector/icons/Nuts";
import { Fats } from "@/components/IngredientSelector/icons/Fats";
import { Cheeses } from "@/components/IngredientSelector/icons/Cheeses";
import { Liquids } from "@/components/IngredientSelector/icons/Liquids";
import { Spices } from "@/components/IngredientSelector/icons/Spices";
import { Herbs } from "@/components/IngredientSelector/icons/Herbs";
import { Pastries } from "@/components/IngredientSelector/icons/Pastries";

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
    fruits: <Fruits />,    
    vegetables: <Vegetables />,
    "potatoes-legumes-cereals": <PotatoesLegumesCereals />,
    nuts: <Nuts />,
    fats: <Fats />,
    cheeses: <Cheeses />,
    liquids: <Liquids />,
    "spices-condiments": <Spices />,
    "fresh-herbs": <Herbs />,
    "pastries": <Pastries />,
  };

  return (
    <GenericCard title={title} onClick={onClick} icons={IconsMap[categoryId]} />
  );
}
