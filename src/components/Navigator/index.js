import React from 'react';
import { connect } from 'react-redux';
import { Link, NavLink } from 'react-router-dom';
import { logOut, userSetData } from '../../actions';
import { tryGetUserData } from '../../controllers/BobbaProxy';

class Navigator extends React.Component {

    onLogOut = event => {
        event.preventDefault();
        const { dispatch } = this.props;
        dispatch(logOut());
    }

    componentDidMount() {
        const { userContext, loginContext, dispatch } = this.props;
        if (!userContext.fetched) {
            tryGetUserData(loginContext.token).then(response => {
                if (response.error != null) {
                    dispatch(logOut());
                } else {
                    dispatch(userSetData(response.username, response.motto, response.look));
                }
            });
        }
    }

    render() {
        let { username } = this.props.userContext;
        const { loggedIn } = this.props.loginContext;

        let navOptions = (
            <>
                <li className="rightside logout"><Link to="/" onClick={this.onLogOut}>Go out</Link></li>
                <li className="rightside"><NavLink activeClassName="selected" to="/settings">Options</NavLink></li>
            </>
        );

        if (!loggedIn) {
            username = 'Invitado';
            navOptions = (
                <li className="rightside"><Link to="/register">Sign up</Link></li>
            );
        }

        if (username === '') {
            username = 'Yo';
        }

        return (
            <nav>
                <div className="full_container">
                    <ul>
                        <li><NavLink activeClassName="selected" to="/me">{username}</NavLink></li>
                        <li><NavLink activeClassName="selected" to="/articles">News</NavLink></li>
                        <li><NavLink activeClassName="selected" to="/catalogue">Catalog</NavLink></li>
                        {navOptions}
                    </ul>
                </div>
            </nav>
        );
    }
}

const mapStateToProps = state => ({
    userContext: state.user,
    loginContext: state.login,
});

export default connect(mapStateToProps)(Navigator);