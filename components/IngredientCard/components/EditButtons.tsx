import * as React from "react";
import {EditButton} from "@/components/IngredientCard/components/editButton";
import {Stack} from "@mui/joy";

interface EditButtonsProps {
    onEdit(): void;

    onDelete(): void;
}

export const EditButtons = ({onEdit, onDelete}: EditButtonsProps) => {

    return (<Stack direction={'row'}
                   gap={5}>
        <EditButton title={'Delete'}
                    onClick={onDelete}
                    type={'delete'}/>
        <EditButton title={"Edit"}
                    onClick={onEdit}
                    type={'edit'}/>
    </Stack>)
}

