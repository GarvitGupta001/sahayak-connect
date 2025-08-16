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
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function SignIn() {
    const router = useRouter();

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
        console.log(process.env.BASE_URL);
        try {
            const response = await axios.post(`/api/sign-in`, {
                phone: phone,
                password: password,
            });
            if (response.status === 200 || response.status === 201) {
                setLoading(false);
                setErroMessage({ phone: "", password: "" });
                localStorage.setItem("token", response.data.token);
                if (response.data.user.profileComplete) {
                    router.push("/app/home");
                } else {
                    router.push("/details-form");
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
        if (localStorage.getItem("token")) {
            router.push("/details-form");
        }
    }, []);

    return (
        <>
            <Box className="h-screen my-4 mx-4 flex flex-col justify-start gap-25">
                <div className="flex justify-center items-center gap-3 mt-25">
                    <img src="/logo.png" alt="logo.png" className="w-[30%]" />
                    <h1 className="text-5xl font-['TAN-Tangkiwood'] font-bold">
                        Sahayak
                        <br /> Connect
                    </h1>
                </div>
                <div className="">
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-5"
                    >
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
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <OutlinedInput
                                id="password"
                                type={showPassword ? "text" : "password"}
                                label="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label={
                                                showPassword
                                                    ? "hide the password"
                                                    : "display the password"
                                            }
                                            onClick={handleClickShowPassword}
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
                        >
                            Confirm
                        </Button>
                    </form>
                </div>
            </Box>
        </>
    );
}
