import type { JSX } from "react";

type Props = {
    message: string | null;
};

const ErrorMessage = ({ message }: Props): JSX.Element | null => {
    if (!message) return null;

    return <div className="error-messages">{message}</div>;
};

export default ErrorMessage;
