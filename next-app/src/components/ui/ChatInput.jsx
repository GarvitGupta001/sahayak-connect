"use client";

import { FormControl, OutlinedInput } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import MicIcon from "@mui/icons-material/Mic";
import SendIcon from "@mui/icons-material/Send";
import StopIcon from "@mui/icons-material/Stop";
import { useState, useRef, useEffect } from "react";
import { useUserContext } from "@/hooks/useUserContext";
import { createClient, LiveTranscriptionEvents } from "@deepgram/sdk";

const ChatInput = ({ onSend, disabled }) => {
    const [textInput, setTextInput] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const deepgramConnectionRef = useRef(null);
    const keepAliveIntervalRef = useRef(null);
    const transcriptRef = useRef("");
    const { personalDetails } = useUserContext();

    const startRecording = async () => {
        const currentText = textInput.trim();
        const prefix = currentText ? currentText + " " : "";
        console.log("Prefix:", prefix);
        transcriptRef.current = prefix;
        console.log("Attempting to start recording...");
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });

            const deepgram = createClient(
                process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY
            );

            const connection = deepgram.listen.live({
                model: "nova-2",
                language: personalDetails.preferredLanguage,
                smart_format: true,
                // Add this to get more detailed interim results
                interim_results: true,
            });

            deepgramConnectionRef.current = connection;

            connection.on(LiveTranscriptionEvents.Open, () => {
                console.log("✅ Deepgram connection opened.");

                keepAliveIntervalRef.current = setInterval(() => {
                    if (deepgramConnectionRef.current?.getReadyState() === 1) {
                        console.log("ping: Sending keep-alive signal.");
                        deepgramConnectionRef.current.keepAlive();
                    }
                }, 10000);

                connection.on(LiveTranscriptionEvents.Transcript, (data) => {
                    const transcript = data.channel.alternatives[0].transcript;
                    if (transcript) {
                        setTextInput(transcriptRef.current + transcript);
                        if (data.is_final) {
                            transcriptRef.current += transcript + " ";
                        }
                    }
                });

                connection.on(LiveTranscriptionEvents.Close, (closeEvent) => {
                    // Log the entire close event object
                    console.error("❌ Deepgram connection closed.", closeEvent);
                    stopRecording();
                });

                connection.on(LiveTranscriptionEvents.Error, (err) => {
                    console.error("❌ Deepgram Error:", err);
                });

                mediaRecorderRef.current = new MediaRecorder(stream);
                mediaRecorderRef.current.ondataavailable = (event) => {
                    if (
                        event.data.size > 0 &&
                        connection.getReadyState() === 1
                    ) {
                        // Log the size of the audio chunk being sent
                        console.log(
                            `🎤 Sending audio data chunk: ${event.data.size} bytes`
                        );
                        connection.send(event.data);
                    }
                };

                mediaRecorderRef.current.start(250);
                setIsRecording(true);
            });
        } catch (error) {
            console.error("❌ Error accessing microphone:", error);
        }
    };

    const stopRecording = () => {
        console.log("Stopping recording and cleaning up...");
        if (keepAliveIntervalRef.current) {
            clearInterval(keepAliveIntervalRef.current);
            keepAliveIntervalRef.current = null;
        }
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current = null;
        }
        if (deepgramConnectionRef.current) {
            deepgramConnectionRef.current.finish();
            deepgramConnectionRef.current = null;
        }
        transcriptRef.current = "";
        setIsRecording(false);
    };

    useEffect(() => {
        return () => {
            if (isRecording) {
                stopRecording();
            }
        };
    }, [isRecording]);

    return (
        <FormControl sx={{ paddingX: "8px", paddingY: "12px", width: "100%" }}>
            <OutlinedInput
                sx={{
                    borderRadius: "20px",
                    fontSize: "16px",
                    paddingX: "16px",
                    paddingY: "4px",
                }}
                disabled={disabled}
                type="text"
                fullWidth={true}
                placeholder="Ask your scheme..."
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                multiline={true}
                minRows={1}
                maxRows={4}
                endAdornment={
                    <InputAdornment
                        position="end"
                        sx={{ paddingRight: "8px", display: "flex" }}
                    >
                        <IconButton
                            onClick={
                                isRecording ? stopRecording : startRecording
                            }
                            disabled={disabled}
                        >
                            {isRecording ? <StopIcon /> : <MicIcon />}
                        </IconButton>
                        <IconButton
                            aria-label={"Send"}
                            edge="end"
                            onClick={() => onSend(textInput, setTextInput)}
                            disabled={disabled}
                        >
                            <SendIcon />
                        </IconButton>
                    </InputAdornment>
                }
            />
        </FormControl>
    );
};

export default ChatInput;
