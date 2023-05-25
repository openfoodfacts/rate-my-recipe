import Image from "next/image";

function Nutriscore({ grade = "empty", height = 80 }) {
  return (
    <Image
    src={`/nutriscores/nutriscore-${grade || "empty"}.svg`}
      alt="nutriscore"
      width={(240 / 130) * height}
      height={height}
    />
  );
}

export default Nutriscore;
