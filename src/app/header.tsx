import Link from "next/link";

import {Typography} from "@mui/material";

const Header = () => {
  return (

    <header className="dark:bg-gray-900 top-0 w-full fixed z-50">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Typography variant="h4" align="center" color="#69717f">
            <Link href="/" passHref>Murder Maker!!!</Link>
          </Typography>
        </div>
      </nav>
    </header>
  );
  
};

export default Header;