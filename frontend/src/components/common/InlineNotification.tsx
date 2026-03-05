import { type JSX } from "react";
import {
    NOTIFICATION_TYPES,
    type NotificationType,
} from "../../types/notification";

type Props = {
    message: string | null;
    type?: NotificationType;
};

const InlineNotification = ({
    message,
    type = NOTIFICATION_TYPES.ERROR,
}: Props): JSX.Element | null => {
    if (!message) return null;

    return (
        <div className={`inline-notification ${type}`}>
            <span>{message}</span>
        </div>
    );
};
export default InlineNotification;
