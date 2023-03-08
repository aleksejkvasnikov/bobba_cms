import React from 'react';
import { Link } from 'react-router-dom';

class IndexTeaser extends React.Component {
    render() {
        return (
            <section className="news_preview">
                <img alt="Welcome to Bobba" src="/web-gallery/images/habbos.gif" />
                <div>
                    <h2>
                        Make friends and join the fun!
                    </h2>
                    <p>
                        You are about to enter an incredible place, where you will share new experiences while 
                         You will know 
                         New people from everywhere. See where you see it ... fun never ends!
                    </p>
                    <Link to="/register">
                        <button>
                            Sign up!
                        </button>
                    </Link>
                </div>
            </section>
        );
    }
}

export default IndexTeaser;