import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import { logOut } from '../../actions';

class Navigator extends React.Component {

    onLogOut = event => {
        event.preventDefault();
        const { dispatch } = this.props;

        dispatch(logOut());
    }

    render() {
        let { username } = this.props.loginContext;

        let navOptions = (
            <>
                <li className="rightside logout"><Link to="/" onClick={this.onLogOut}>Salir</Link></li>
                <li className="rightside"><Link to="/manage">Opciones</Link></li>
            </>
        );

        if (username === '') {
            username = 'Invitado';
            navOptions = (
                <li className="rightside"><Link to="/register">Regístrate</Link></li>
            );
        }

        return (
            <nav>
                <div className="full_container">
                    <ul>
                        <li><NavLink activeClassName="selected" to="/me">{username}</NavLink></li>
                        <li><NavLink activeClassName="selected" to="/articles">Noticias</NavLink></li>
                        <li><NavLink activeClassName="selected" to="/community">Comunidad</NavLink></li>
                        {navOptions}
                    </ul>
                </div>
            </nav>
        );
    }
}

export default Navigator;