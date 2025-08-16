import { INPUT_TYPES } from "@/constants/inputTypes";
import {
    TextField,
    Checkbox,
    FormControlLabel,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Radio,
    RadioGroup,
} from "@mui/material";

export const fieldGenerator = (field, fieldName) => {
    switch (field.type) {
        case INPUT_TYPES.TEXT:
            return (
                <TextField
                    key={fieldName}
                    id={fieldName}
                    label={field.label}
                    required={field.required}
                    color={field.color || "primary"}
                    sx={{
                        my: "7px",
                    }}
                    fullWidth={field.full_width}
                    size={field.size || "medium"}
                    onChange={field.onChange}
                    value={field.value}
                />
            );
        case INPUT_TYPES.NUMBER:
            return (
                <TextField
                    key={fieldName}
                    id={fieldName}
                    label={field.label}
                    required={field.required}
                    color={field.color || "primary"}
                    sx={{
                        my: "7px",
                    }}
                    fullWidth={field.full_width}
                    size={field.size || "medium"}
                    type="number"
                    onChange={field.onChange}
                    value={field.value}
                />
            );
        case INPUT_TYPES.DATE:
            return (
                <TextField
                    key={fieldName}
                    id={fieldName}
                    label={field.label}
                    required={field.required}
                    color={field.color || "primary"}
                    sx={{
                        my: "7px",
                    }}
                    fullWidth={field.full_width}
                    size={field.size || "medium"}
                    type="date"
                    onChange={field.onChange}
                    value={field.value}
                />
            );
        case INPUT_TYPES.TIME:
            return (
                <TextField
                    key={fieldName}
                    id={fieldName}
                    label={field.label}
                    required={field.required}
                    color={field.color || "primary"}
                    sx={{
                        my: "7px",
                    }}
                    fullWidth={field.full_width}
                    size={field.size || "medium"}
                    type="time"
                    onChange={field.onChange}
                    value={field.value}
                />
            );
        case INPUT_TYPES.PASSWORD:
            return (
                <TextField
                    key={fieldName}
                    id={fieldName}
                    label={field.label}
                    required={field.required}
                    color={field.color || "primary"}
                    sx={{
                        my: "7px",
                    }}
                    fullWidth={field.full_width}
                    size={field.size || "medium"}
                    type="password"
                    onChange={field.onChange}
                    value={field.value}
                />
            );
        case INPUT_TYPES.CHECKBOX:
            return (
                <FormControlLabel
                    key={fieldName}
                    sx={{
                        my: "7px",
                    }}
                    control={
                        <Checkbox
                            id={fieldName}
                            color={field.color || "primary"}
                            size={field.size || "medium"}
                            onChange={field.onChange}
                            checked={field.value || false}
                        />
                    }
                    label={field.label}
                    required={field.required}
                />
            );
        case INPUT_TYPES.SELECT:
            return (
                <FormControl
                    key={fieldName}
                    fullWidth={field.full_width}
                    required={field.required}
                    sx={{
                        my: "7px",
                    }}
                    size={field.size || "medium"}
                >
                    <InputLabel
                        id={`${fieldName}-label`}
                        color={field.color || "primary"}
                    >
                        {field.label}
                    </InputLabel>
                    <Select
                        labelId={`${fieldName}-label`}
                        id={fieldName}
                        value={field.value || ""}
                        label={field.label}
                        onChange={(e) => {
                            // Create a synthetic event with the fieldName as id
                            const syntheticEvent = {
                                target: {
                                    id: fieldName,
                                    value: e.target.value,
                                },
                            };
                            field.onChange(syntheticEvent);
                        }}
                        color={field.color || "primary"}
                    >
                        {field.options?.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            );
        case INPUT_TYPES.RADIO:
            return (
                <FormControl
                    key={fieldName}
                    sx={{
                        my: "7px",
                    }}
                    required={field.required}
                >
                    <InputLabel
                        component="legend"
                        color={field.color || "primary"}
                    >
                        {field.label}
                    </InputLabel>
                    <RadioGroup
                        id={fieldName}
                        value={field.value || ""}
                        onChange={field.onChange}
                        row={field.row || false}
                    >
                        {field.options?.map((option) => (
                            <FormControlLabel
                                key={option.value}
                                value={option.value}
                                control={
                                    <Radio
                                        color={field.color || "primary"}
                                        size={field.size || "medium"}
                                    />
                                }
                                label={option.label}
                            />
                        ))}
                    </RadioGroup>
                </FormControl>
            );
        default:
            return null;
    }
};
