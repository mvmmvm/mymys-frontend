import Image from "next/image";
import Link from "next/link";

import {Typography} from "@mui/material";

const Header = () => {
  return (
    <header className="text-red-900">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8"
        aria-label="Global"
      >
        <div className="flex lg:flex-1">
          <Typography variant="h4" align="center">
          Murder Maker!!!
          </Typography>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          <a href="#" className="text-m font-semibold leading-6">
            Features
          </a>
          <a href="#" className="text-m font-semibold leading-6">
            Marketplace
          </a>
          <a href="#" className="text-m font-semibold leading-6">
            Company
          </a>
        </div>
        <div className="flex lg:flex-1 lg:justify-end">
        </div>
      </nav>
    </header>
  );
};

export default Header;