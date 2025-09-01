"use client";

import {
    FormControl,
    InputAdornment,
    InputLabel,
    Button,
    Box,
    OutlinedInput,
    IconButton,
    FormHelperText,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import React, { useEffect, useState, useLayoutEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useUserContext } from "@/hooks/useUserContext";
import Loader from "@/components/Loader";
import GlassCard from '@/components/ui/GlassCard';

export default function SignIn() {
    const router = useRouter();

    const { user, setUser } = useUserContext();

    const [pageLoading, setPageLoading] = useState(false);
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErroMessage] = useState({
        phone: "",
        password: "",
    });

    const handleClickShowPassword = () => setShowPassword((prev) => !prev);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post(`/api/sign-in`, {
                phone: phone,
                password: password,
            });
            if (response.status === 200 || response.status === 201) {
                setLoading(false);
                setErroMessage({ phone: "", password: "" });
                setUser(response.data.user);
                localStorage.setItem("token", response.data.token);
                if (response.data.user.profileComplete) {
                    router.replace("/app/home");
                } else {
                    router.replace("/details-form");
                }
            }
        } catch (error) {
            const { response } = error;
            if (response.status === 400 || response.status === 401) {
                setLoading(false);
                setErroMessage(response.data.error);
            }
            if (response.status === 500) {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        const checkUser = async () => {
            setPageLoading(true);
            if (user && user.profileComplete) {
                await router.replace("/app/home");
            }
            if (user && !user.profileComplete) {
                await router.replace("/details-form");
            }
            setPageLoading(false);
        };
        checkUser();
    }, [user]);

    return (
        <>
            {pageLoading ? (
                <Loader />
            ) : (
                <Box className="min-h-screen my-6 mx-auto flex flex-col items-center gap-10 max-w-md px-4">
                    <div className="flex flex-col items-center gap-3 mt-4">
                    {/* <Image src="/sahaayaklogo%20(1).png" alt="Sahayak logo" width={160} height={160} priority className="w-40 h-auto" /> */}
                        <h1 className="text-4xl md:text-5xl font-['TAN-Tangkiwood'] font-bold text-center leading-none">
                            Sahayak<br/>Connect
                        </h1>
                    </div>
                    <GlassCard className="w-full">
                        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                            <FormControl
                                variant="outlined"
                                error={!!errorMessage.phone}
                            >
                                <InputLabel htmlFor="phone">
                                    Phone Number
                                </InputLabel>
                                <OutlinedInput
                                    id="phone"
                                    type="number"
                                    label="Phone Number"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    startAdornment={
                                        <InputAdornment position="start">
                                            +91
                                        </InputAdornment>
                                    }
                                />
                                <FormHelperText>
                                    {errorMessage.phone}
                                </FormHelperText>
                            </FormControl>
                            <FormControl
                                variant="outlined"
                                error={!!errorMessage.password}
                            >
                                <InputLabel htmlFor="password">
                                    Password
                                </InputLabel>
                                <OutlinedInput
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    label="Password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label={
                                                    showPassword
                                                        ? "hide the password"
                                                        : "display the password"
                                                }
                                                onClick={
                                                    handleClickShowPassword
                                                }
                                                edge="end"
                                            >
                                                {showPassword ? (
                                                    <VisibilityOff />
                                                ) : (
                                                    <Visibility />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                                <FormHelperText>
                                    {errorMessage.password}
                                </FormHelperText>
                            </FormControl>
                                                        <Button
                                                            type="submit"
                                                            loading={loading}
                                                            variant="contained"
                                                            sx={{
                                                                textTransform: 'none',
                                                                borderRadius: '9999px',
                                                                paddingY: '10px',
                                                                fontWeight: 600,
                                                                background: 'linear-gradient(to right,#0f172a,#1e3a8a)',
                                                            }}
                                                            fullWidth
                                                        >
                                                            Confirm
                                                        </Button>
                        </form>
                                        </GlassCard>
                </Box>
            )}
        </>
    );
}
