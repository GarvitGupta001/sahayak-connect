"use client";

import React from "react";
import { fieldGenerator } from "@/utils/fieldGenerator";
import { PERSONAL_DETAILS_FORM } from "@/constants/forms";
import { useUserContext } from "@/hooks/useUserContext";

export default function PersonalDetailsForm() {
    const { personalDetails, setPersonalDetails } = useUserContext();
    const onChange = (e) => {
        console.log(e.target.value);
        console.log(personalDetails)
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

        setPersonalDetails((prev) => ({
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
                        value: personalDetails[fieldName],
                        onChange: onChange,
                    };
                    return fieldGenerator(fieldWithHandlers, fieldName);
                })
                .toArray()}
        </div>
    );
}
