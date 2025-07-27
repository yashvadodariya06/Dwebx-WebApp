import React, { useEffect } from 'react'

const Popunder = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = '//pl26253243.profitableratecpm.com/de/71/e9/de71e9e84dad3721790aba10ebc6faf2.js';
        script.type = 'text/javascript';
        script.async = true;
        document.body.appendChild(script);

        // Optional cleanup
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div id="adsterra-ad">
            {/* You can leave this empty or add a placeholder */}
        </div>
    );
}

export default Popunder
