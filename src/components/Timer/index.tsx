import { useEffect, useState } from "react";

interface Format {
    format: string
}

export const Timer: React.FC<Format> = (props) => {

    const [time, setTime] = useState(new Date().format(props.format));

    useEffect(() => {
        const timer = setInterval(() => {
            setTime(new Date().format(props.format));
        }, 1000);

        return () => clearInterval(timer);
    }, [time]);

    return (
        <p>{time}</p>
    );
}
