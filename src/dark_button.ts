'use client';

import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Box,
}
from "@mui/material";
import { styled } from "@mui/system";

const DarkButton = styled(Button)({
  backgroundColor: "#111827",
  color: "#69717f", // 文字色を白に設定
  "&:hover": {
    backgroundColor: "#070814",
    
  },
});



export default DarkButton;