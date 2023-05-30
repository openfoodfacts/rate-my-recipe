"use client";

import Box from "@mui/joy/Box";

const AppBar = () => (
  <Box
    sx={{
      width: "100%",
      height: "54px",
      backgroundColor: "#76B947", // Set the desired background color
      color: "#fff", // Set the desired text color
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "20px",
      fontWeight: "bold",
    }}
  >
    Rate My Recipes
  </Box>
);

export default AppBar;
