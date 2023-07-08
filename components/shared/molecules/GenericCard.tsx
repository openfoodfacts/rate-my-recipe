import Card from "@mui/joy/Card";
import { CardMedia } from "@mui/material";
import { CardContent, Typography } from "@mui/joy";

interface GenericCardProps {
  title: string | undefined;
  onClick(): void;
  imgUrl: string | undefined | null;
}

export function GenericCard({ title, onClick, imgUrl }: GenericCardProps) {
  return (
    <Card
      sx={{
        "&:hover": { cursor: "pointer" },
        width: "40%",
        maxWidth: 200,
        display: "flex",
        justifyContent: "center",
        border: "1px solid lightGrey",
      }}
      onClick={onClick}
    >
      <CardMedia component="img" height={90} image={imgUrl || ""} alt={title} />
      <CardContent>
        <Typography maxWidth={"100%"}>{title}</Typography>
      </CardContent>
    </Card>
  );
}
