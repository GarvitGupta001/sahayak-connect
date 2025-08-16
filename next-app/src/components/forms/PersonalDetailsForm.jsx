"use client";

import React from "react";
import { fieldGenerator } from "@/utils/fieldGenerator";
import { PERSONAL_DETAILS_FORM } from "@/constants/forms";

export default function PersonalDetailsForm({
    state,
    setState,
}) {
    const onChange = (e) => {
        const { id, value, checked, type } = e.target;
        let fieldValue;

        switch (type) {
            case "checkbox":
                fieldValue = checked;
                break;
            case "number":
                fieldValue = Number(value);
                break;
            case "date":
                fieldValue = new Date(value);
                break;
            default:
                fieldValue = value;
                break;
        }

        setState((prev) => ({
            ...prev,
            [id]: fieldValue,
        }));
    };

    return (
        <div className="px-3">
            {PERSONAL_DETAILS_FORM.entrySeq()
                .map(([fieldName, field]) => {
                    
                    const fieldWithHandlers = {
                        ...field,
                        value: state[fieldName],
                        onChange: onChange,
                    };
                    if (field.required && !state[fieldName]) {
                        fieldWithHandlers.color = "error";
                    }
                    return fieldGenerator(fieldWithHandlers, fieldName);
                })
                .toArray()}
        </div>
    );
}
