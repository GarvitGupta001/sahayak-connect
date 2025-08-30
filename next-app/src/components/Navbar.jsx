"use client";

import { useState } from "react";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SearchIcon from "@mui/icons-material/Search";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import PersonIcon from "@mui/icons-material/Person";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
    const pathname = usePathname();
    const [value, setValue] = useState(pathname.split("/")[2]);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <BottomNavigation
            sx={{
                width: "100%",
                boxShadow: "0px -2px 10px rgba(0, 0, 0, 0.1)",
                position: 'fixed',
                bottom: 0,
                left: 0,
                zIndex: 30,
                background: '#ffffff'
            }}
            value={value}
            onChange={handleChange}
        >
            <BottomNavigationAction
                component={Link}
                href="/app/home"
                label="Home"
                value="home"
                icon={<HomeIcon />}
            />
            <BottomNavigationAction
                component={Link}
                href="/app/search"
                label="Search"
                value="search"
                icon={<SearchIcon />}
            />
            <BottomNavigationAction
                component={Link}
                href="/app/saved"
                label="Saved"
                value="saved"
                icon={<BookmarkIcon />}
            />
            <BottomNavigationAction
                component={Link}
                href="/app/profile"
                label="Profile"
                value="profile"
                icon={<PersonIcon />}
            />
        </BottomNavigation>
    );
};

export default Navbar;
