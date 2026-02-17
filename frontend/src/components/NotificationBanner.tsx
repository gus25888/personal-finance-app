import { useEffect, type JSX } from "react";
import {
    NOTIFICATION_TYPES,
    type NotificationData,
} from "../types/notification";

type Props = {
    notification: NotificationData;
    onClose: () => void;
};

const NotificationBanner = ({ notification, onClose }: Props): JSX.Element => {
    useEffect(() => {
        if (notification.type === NOTIFICATION_TYPES.SUCCESS) {
            const timer = setTimeout(onClose, 4000);
            return () => clearTimeout(timer);
        }
    }, [notification, onClose]);

    return (
        <div className={`banner ${notification.type}`}>
            <span>{notification.message}</span>
            <button onClick={onClose} className="closeButton">
                X
            </button>
        </div>
    );
};
export default NotificationBanner;
