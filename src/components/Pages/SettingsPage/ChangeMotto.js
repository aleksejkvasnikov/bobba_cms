import React from 'react';
import { connect } from 'react-redux';
import { tryPatchUser } from '../../../controllers/BobbaProxy';
import { logOut, userSetData } from '../../../actions';

class ChangeMotto extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            motto: '',
            okMessage: '',
        };
    }

    componentDidMount() {
        const { motto } = this.props.userContext;
        this.setState({ motto });
    }

    handleInputChange = event => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value
        });
    }

    handleSubmit = event => {
        event.preventDefault();
        const { dispatch, loginContext } = this.props;
        const { motto } = this.state;

        tryPatchUser(loginContext.token, { motto }).then(response => {
            if (response.error != null && response.error === 'token') {
                dispatch(logOut());
            } else {
                dispatch(userSetData(response.username, response.motto, response.look));
                this.setState({ okMessage: 'The motto has changed.', motto: response.motto });
            }
        });
    }

    getMessageSection(errorMessage, color) {
        return (
            <h1 className={color}>
                {errorMessage}
            </h1>
        );
    }

    render() {
        const { motto, okMessage } = this.state;
        let messageContainer = null;
        if (okMessage !== '') {
            messageContainer = this.getMessageSection(okMessage, 'blue');
        }
        return (
            <>
                <h1 className="green">Change motto</h1>
                {messageContainer}
                <form onSubmit={this.handleSubmit}>
                    <div className="input_group">
                        <label htmlFor="motto">Motto: </label>
                        <input id="motto" name="motto" type="text" aria-label="Motto" placeholder="******"
                            onChange={this.handleInputChange} value={motto} />
                        <p>A phrase that identifies you.</p>
                    </div>
                    <div className="input_group">
                        <input type="submit" value="Confirm" aria-label="Confirm" />
                    </div>
                </form>
            </>
        );
    }
}

const mapStateToProps = state => ({
    loginContext: state.login,
    userContext: state.user,
});

export default connect(mapStateToProps)(ChangeMotto);