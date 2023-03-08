import React from 'react';
import { connect } from 'react-redux';
import { tryChangePassword } from '../../../controllers/BobbaProxy';
import { logOut } from '../../../actions';

const initialState = {
    currentPassword: '',
    newPassword: '',
    newPasswordConfirm: '',
    errorMessage: '',
    okMessage: '',
    wrongCurrentPassword: false,
    wrongNewPassword: false,
    wrongNewPasswordConfirm: false,
};

class ChangePassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = initialState;
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
        const { currentPassword, newPassword, newPasswordConfirm } = this.state;

        const wrongCurrentPassword = currentPassword === '';
        const wrongNewPassword = newPassword === '';
        const wrongNewPasswordConfirm = wrongNewPassword || (newPassword !== newPasswordConfirm);

        let errorMessage = '';

        if (wrongNewPasswordConfirm) {
            errorMessage = 'Passwords do not match';
        }

        if (wrongCurrentPassword || wrongNewPassword) {
            errorMessage = 'Please complete all fields';
        }

        if (errorMessage === '') {
            tryChangePassword(loginContext.token, currentPassword, newPassword).then(response => {
                if (response.error != null) {
                    if (response.error === 'token') {
                        dispatch(logOut());
                    } else if (response.error === 'currentPassword') {
                        this.setState({
                            errorMessage: 'The current password is not correct',
                            wrongCurrentPassword: true,
                        });
                    }
                } else {
                    this.setState(Object.assign({}, initialState, { okMessage: 'The password has changed.' }));
                }
            });
        } else {
            this.setState({
                wrongCurrentPassword, wrongNewPassword, wrongNewPasswordConfirm, errorMessage, okMessage: ''
            });
        }
    }

    getMessageSection(errorMessage, color) {
        return (
            <h1 className={color}>
                {errorMessage}
            </h1>
        );
    }

    render() {
        const { currentPassword, newPassword, newPasswordConfirm, wrongCurrentPassword, wrongNewPassword, wrongNewPasswordConfirm, errorMessage, okMessage } = this.state;

        let currentPasswordClassName = wrongCurrentPassword ? 'wrong' : '';
        let newPasswordClassName = wrongNewPassword ? 'wrong' : '';
        let newPasswordConfirmClassName = wrongNewPasswordConfirm ? 'wrong' : '';

        let errorContainer = null;
        if (errorMessage !== '') {
            errorContainer = this.getMessageSection(errorMessage, 'red');
        }
        let messageContainer = null;
        if (okMessage !== '') {
            messageContainer = this.getMessageSection(okMessage, 'blue');
        }

        return (
            <>
                <h1 className="green">Change Password</h1>
                {errorContainer}
                {messageContainer}
                <form onSubmit={this.handleSubmit}>
                    <div className="input_group">
                        <label htmlFor="currentPassword">Current password: </label>
                        <input id="currentPassword" name="currentPassword" type="password" aria-label="Current password" placeholder="******"
                            onChange={this.handleInputChange} value={currentPassword} className={currentPasswordClassName} />
                        <p>You need to enter your current password.</p>
                    </div>
                    <div className="input_group">
                        <label htmlFor="newPassword">New Password: </label>
                        <input id="newPassword" name="newPassword" type="password" aria-label="New Password" placeholder="******"
                            onChange={this.handleInputChange} value={newPassword} className={newPasswordClassName} />
                        <p>They are recommended upper, lowercase and numbers at the same time.</p>
                    </div>
                    <div className="input_group">
                        <label htmlFor="newPasswordConfirm">Repeat password: </label>
                        <input id="newPasswordConfirm" name="newPasswordConfirm" type="password" aria-label="Repeat password"
                            placeholder="******" onChange={this.handleInputChange} value={newPasswordConfirm} className={newPasswordConfirmClassName} />
                        <p>For security.</p>
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
});

export default connect(mapStateToProps)(ChangePassword);