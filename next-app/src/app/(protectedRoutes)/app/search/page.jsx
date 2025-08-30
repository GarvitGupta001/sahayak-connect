"use client";

import React, { useRef, useState, useEffect } from "react";
import {
    FormControl,
    TextField,
    OutlinedInput,
    InputAdornment,
    Autocomplete,
    IconButton,
} from "@mui/material";
import {
    Search as SearchIcon,
    FilterAlt as FilterAltIcon,
} from "@mui/icons-material";

const Search = () => {
    const searchRef = useRef(null);
    const filterRef = useRef(null);
    const resultsRef = useRef(null);

    const options = [
        "Sports & Culture",
        "Utility & Sanitation",
        "IT & Communications",
        "Agriculture",
        "Law & Justice",
        "Transport & Infrastructure",
        "Rural & Environment",
        "Travel & Tourism",
        "Social welfare & Empowerment",
        "Health & Wellness",
        "Skills & Employment",
        "Banking",
        "Business & Entrepreneurship",
        "Financial Services and Insurance",
        "Education & Learning",
        "Public Safety",
        "Women and Child",
        "Housing & Shelter",
        "Science",
    ];

    const [search, setSearch] = useState("");

    const handleSearch = () => {
        console.log(search);
    };

    useEffect(() => {
        console.log(search);
    }, [search]);

    return (
        <div className="h-[100%]">
            <div ref={searchRef}>
                <FormControl
                    sx={{
                        width: "100%",
                        paddingX: "12px",
                        paddingBottom: "8px",
                    }}
                >
                    <OutlinedInput
                        variant="outlined"
                        placeholder="Search"
                        fullWidth={true}
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        endAdornment={
                            <InputAdornment>
                                <IconButton onClick={handleSearch}>
                                    <SearchIcon />
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>
                <FormControl
                    sx={{
                        width: "100%",
                        paddingX: "12px",
                        paddingBottom: "8px",
                    }}
                >
                    <Autocomplete
                        fullWidth
                        disablePortal
                        freeSolo
                        disableClearable
                        options={options}
                        defaultValue=""
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                placeholder="Category"
                                slotProps={{
                                    input: {
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <FilterAltIcon />
                                            </InputAdornment>
                                        ),
                                    },
                                }}
                            />
                        )}
                    />
                </FormControl>
            </div>
        </div>
    );
};

export default Search;
