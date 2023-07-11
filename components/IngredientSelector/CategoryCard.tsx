import { GenericCard } from "@/components/shared/molecules/GenericCard";
import { BeefIcon } from "@/components/shared/atoms/icons/BeefIcon";
import { FishIcon } from "@/components/shared/atoms/icons/FishIcon";
import { EggIcon } from "@/components/shared/atoms/icons/EggIcon";
import { BroccoliIcon } from "@/components/shared/atoms/icons/BroccoliIcon";
import { CarrotIcon } from "@/components/shared/atoms/icons/CarrotIcon";
import { EggplantIcon } from "@/components/shared/atoms/icons/EggplantIcon";
import { FlourIcon } from "@/components/shared/atoms/icons/FlourIcon";
import { CerealsIcon } from "@/components/shared/atoms/icons/CerealsIcon";
import { OliveOil } from "@/components/shared/atoms/icons/OliveOil";
import { Butter } from "@/components/shared/atoms/icons/Butter";
import { WineBottle } from "@/components/shared/atoms/icons/WineBottle";
import { Milk } from "@/components/shared/atoms/icons/Milk";
import { SaltAndPaper } from "@/components/shared/atoms/icons/SaltAndPaper";
import { SaladIcon } from "@/components/shared/atoms/icons/SaladIcon";
import { LeafIcon } from "@/components/shared/atoms/icons/LeafIcon";

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
  console.log(categoryId);
  const IconsMap = {
    "meat-fish-eggs": [
      <BeefIcon key={"beef"} />,
      <EggIcon key={"egg"} />,
      <FishIcon key={"fish"} />,
    ],
    vegetables: [
      <BroccoliIcon key={"broccoli"} />,
      <CarrotIcon key={"carrot"} />,
      <EggplantIcon key={"eggplant"} />,
    ],
    "potatoes-legumes-cereals": [
      <FlourIcon key={"flour"} />,
      <CerealsIcon key={"cereals"} />,
    ],
    fats: [<OliveOil key={"oliveoil"} />, <Butter key={"butter"} />],
    liquids: [<WineBottle key={"wine"} />, <Milk key={"milk"} />],
    "spices-condiments": [<SaltAndPaper key={"salt"} />],
    "fresh-herbs": [<LeafIcon key={"leaf"} />, <SaladIcon key={"salad"} />],
  };

  return (
    <GenericCard
      title={title}
      onClick={onClick}
      // @ts-ignore
      svg={categoryId ? IconsMap[categoryId] : undefined}
    />
  );
}
