import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToHash() {
    const { hash, pathname } = useLocation();

    useEffect(() => {
        if (!hash) {
            // optional: scroll to top when changing pages with no hash
            window.scrollTo(0, 0);
            return;
        }

        const id = hash.slice(1);
        let tries = 0;

        const tryScroll = () => {
            const el = document.getElementById(id);
            if (el) {
                el.scrollIntoView({ behavior: "smooth", block: "start" });
                return;
            }
            if (tries < 30) {
                tries += 1;
                requestAnimationFrame(tryScroll);
            }
        };

        tryScroll();
    }, [hash, pathname]);

    return null;
}
