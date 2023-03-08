import React from 'react';

class Welcome extends React.Component {
    render() {
        return (
            <>
                <h1 className="blue">Welcome to Bobba</h1>
                <p>
                    <img alt="Welcome" src="/web-gallery/images/welcome_frank.png" />
                </p>
                <p>
                    You are about to enter an incredible place, where you will share new experiences while 
                     You will know new people from everywhere. See where you see it ... fun never ends!
                </p>
            </>
        );
    }
}

export default Welcome;