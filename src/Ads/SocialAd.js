import React, { useEffect } from 'react';

const SocialAd = () => {
    useEffect(() => {
        const script = document.createElement('script');
        script.src = '//pl26256231.profitableratecpm.com/94/07/a8/9407a89d9a1802dcf4ee720e266fcfeb.js';
        script.type = 'text/javascript';
        script.async = true;
        document.body.appendChild(script);

        // Cleanup on unmount (optional but recommended)
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    return (
        <div id="social-ad">
            {/* Optional placeholder or wrapper */}
        </div>
    );
};

export default SocialAd;
