import Card from "@mui/joy/Card";
import { CardMedia } from "@mui/material";
import { CardContent, Typography } from "@mui/joy";

interface CategoryCardProps {
  title: string | undefined;
  onClick(): void;
}

export function CategoryCard({ title, onClick }: CategoryCardProps) {
  return (
    <Card
      sx={{
        "&:hover": { cursor: "pointer" },
        maxHeight: "50%",
        width: "40%",
        maxWidth: 300,
        border: "1px solid grey",
      }}
      onClick={onClick}
    >
      <CardMedia
        component="img"
        height={90}
        image="https://thomasgabin.com/wp-content/uploads/2023/04/Open-food-Logo.png"
        alt="Paella dish"
      />
      <CardContent>
        <Typography maxWidth={"100%"}>{title}</Typography>
      </CardContent>
    </Card>
  );
}
