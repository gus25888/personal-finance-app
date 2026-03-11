import { DeleteIcon } from "../../icons/DeleteIcon";
import { EditIcon } from "../../icons/EditIcon";

type Props = {
    variant: "edit" | "delete";
    title: string;
    onClick: () => void;
};

export const ActionButton = ({ variant, title, onClick }: Props) => (
    <button
        className={`action-button ${variant}-button`}
        title={title}
        onClick={onClick}
    >
        {variant === "delete" ? <DeleteIcon /> : <EditIcon />}
    </button>
);
