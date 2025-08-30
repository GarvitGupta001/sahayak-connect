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
    const [schemes, setSchemes] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasMore, setHasMore] = useState(true);

    const fetchSchemes = async ({ reset = false, q = search, nextPage = reset ? 1 : page }) => {
        try {
            setLoading(true);
            setError(null);
            const params = new URLSearchParams({ page: String(nextPage) });
            if (q) params.set("q", q);
            const res = await fetch(`/api/schemes?${params.toString()}`);
            const data = await res.json();
            if (!data.success) throw new Error(data.error || 'Failed');
            setSchemes((prev) => (reset ? data.data : [...prev, ...data.data]));
            setPage(nextPage);
            setHasMore(!data.isLastPage);
        } catch (e) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        fetchSchemes({ reset: true, q: search });
    };

    useEffect(() => {
        // initial load
        fetchSchemes({ reset: true });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
    <div className="h-[100%] pt-2 flex flex-col gap-4">
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
            <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-3">
                {schemes.map((s) => (
                    <div key={s.scheme_id} className="p-3 rounded-lg border border-slate-200 bg-white/70 backdrop-blur-sm shadow-sm">
                        <div className="text-xs font-mono text-slate-500">{s.scheme_id}</div>
                        <div className="font-semibold text-sm text-slate-800">{s.scheme_name}</div>
                    </div>
                ))}
                {loading && <div className="text-center text-xs text-slate-500">Loading...</div>}
                {error && <div className="text-center text-xs text-red-600">{error}</div>}
                {!loading && hasMore && (
                    <button
                        onClick={() => fetchSchemes({ reset: false, nextPage: page + 1 })}
                        className="w-full py-2 text-sm font-medium rounded-md bg-slate-900 text-white hover:bg-slate-800 transition"
                    >
                        Load More
                    </button>
                )}
                {!loading && !hasMore && schemes.length > 0 && (
                    <div className="text-center text-xs text-slate-400">End of results</div>
                )}
            </div>
        </div>
    );
};

export default Search;
