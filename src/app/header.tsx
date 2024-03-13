import Image from "next/image";
import Link from "next/link";

import {Typography} from "@mui/material";

const Header = () => {
  return (

    <header className="dark:bg-gray-900 top-0 w-full">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Typography variant="h4" align="center" color="#69717f">
          Murder Maker!!!
          </Typography>
        </div>
      </nav>
    </header>
  );
  
};

export default Header;