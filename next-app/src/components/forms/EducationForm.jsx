"use client";

import React from 'react';
import { fieldGenerator } from "@/utils/fieldGenerator";
import { EDUCATION_FORM } from "@/constants/forms";

export default function EducationForm({
    state,
    setState,
}) {
    const onChange = (e) => {
        const { id, value, checked, type } = e.target;
        
        const fieldValue = type === 'checkbox' ? checked : value;
        
        setState((prev) => ({
            ...prev,
            [id]: fieldValue,
        }));
    };

    return (
        <div className="px-3">
            {Object.entries(EDUCATION_FORM).map(([fieldName, field]) => {
                const fieldWithHandlers = {
                    ...field,
                    value: state[fieldName] || (field.type === 'checkbox' ? false : ''),
                    onChange: onChange,
                };
                return fieldGenerator(fieldWithHandlers, fieldName);
            })}
        </div>
    );
}
