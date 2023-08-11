import Image from "next/image";
import { Stack } from "@mui/joy";

function Nutriscore({ grade = "", score = "", height = 80 }) {
  if (grade) {
    return (
      <Stack>
        <Image
          src={`/nutriscores/nutriscore-${grade || "empty"}.svg`}
          alt={`nutriscore ${grade}`}
          width={(240 / 130) * height}
          height={height}
        />
        {score}/100
      </Stack>
    );
  }
  else {
    return null;
  }
}

export default Nutriscore;
