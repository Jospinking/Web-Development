import React from 'react';
import CreateAccountDialog from './CreateAccountDialog.js';
import ResetPasswordDialog from './ResetPasswordDialog.js';
import AppMode from "./../AppMode.js";

class LoginPage extends React.Component {

constructor() {
    super();
    //Create a ref for the email input DOM element
    this.emailInputRef = React.createRef();
    this.passwordInputRef = React.createRef();
    this.state = {accountCreateMsg: "",
                  loginBtnIcon: "fa fa-sign-in",
                  loginBtnLabel: "Log In",
                  showCreateAccountDialog: false,
                  showResetPasswordDialog: false,
                  githubIcon: "fa fa-github",
                  githubLabel: "Sign in with GitHub",
                  googleLabel: "Sign in with Google",
                  googleIcon: "fa fa-google",
                  loginMsg: ""
                  };
} 
    
//Focus cursor in email input field when mounted
componentDidMount() {
    this.emailInputRef.current.focus();
}  

//handleLogin -- Callback function that sets up initial app state upon login.
//handleLogin = () => {
    //Stop spinner
//    this.setState({loginBtnIcon: "fa fa-sign-in",
 //                  loginBtnLabel: "Log In"});
    //Set current user
    //this.props.setUserId(this.emailInputRef.current.value);
    //Trigger switch to FEED mode (default app landing page)
    //this.props.changeMode(AppMode.FEED);
//}


//handleLoginSubmit -- Called when user clicks on login button.
handleLoginSubmit = async (event) => {
    event.preventDefault();
    this.setState({loginBtnIcon: "fa fa-spin fa-spinner",
                   loginBtnLabel: "Logging In..."});
    const url = "auth/login?username=" + this.emailInputRef.current.value +
                "&password=" + this.passwordInputRef.current.value;
    const res = await fetch(url, {method: 'POST'}); 
    if (res.status == 200) { //successful login!
        window.open("/","_self");
    } else { //Unsuccessful login
      const resText = await res.text();
      this.setState({loginBtnIcon: "fa fa-sign-in",
                     loginBtnLabel: "Log In",
                     loginMsg: resText});
    }
}

  //accountCreateStatus -- Called by child CreateAccountDialog component when 
  //user attempted to create new account. Hide the dialog and display 
  //a message indicating result of the attempt.
  accountCreateStatus = (msg) => {
      this.setState({accountCreateMsg: msg,
                     showCreateAccountDialog: false});
  }

  //cancelCreateAccount -- Called by child CreateAccountDialog componenet when user decides
  //to cancel creation of new account by clicking the "X" in top-right of dialog.
  cancelCreateAccount = () => {
      this.setState({showCreateAccountDialog: false});
  }

//handleOAuthLogin -- Callback function that initiates contact with OAuth
//provider
handleOAuthLogin = (provider) => {
    window.open(`/auth/${provider}`,"_self");
}

//handleOAuthLoginClick -- Called whent the user clicks on button to
//authenticate via a third-party OAuth service. The name of the provider is
//passed in as a parameter.
handleOAuthLoginClick = (provider) => {
   this.setState({[provider + "Icon"] : "fa fa-spin fa-spinner",
                  [provider + "Label"] : "Connecting..."});
   setTimeout(() => this.handleOAuthLogin(provider),1000);
}


  render() {
    return(
        <div id="login-mode-div" className="padded-page">
        <center>
            <h1 />
            {this.state.accountCreateMsg != "" ? <p className="emphasis">{this.state.accountCreateMsg}</p> : null}
            {this.state.loginMsg != "" ? <p className="emphasis">{this.state.loginMsg}</p> : null}
            <form id="loginInterface" onSubmit={this.handleLoginSubmit}>
            <label htmlFor="emailInput" style={{ padding: 0, fontSize: 24 }}>
                Email:
                <input
                ref={this.emailInputRef}
                className="form-control login-text"
                type="email"
                placeholder="Enter Email Address"
                id="emailInput"
                pattern="[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}"
                required={true}
                />
            </label>
            <p />
            <label htmlFor="passwordInput" style={{ padding: 0, fontSize: 24 }}>
                Password:
                <input
                ref={this.passwordInputRef}
                className="form-control login-text"
                type="password"
                placeholder="Enter Password"
                pattern="[A-Za-z0-9!@#$%^&*()_+\-]+"
                required={true}
                />
            </label>
            <p className="bg-danger" id="feedback" style={{ fontSize: 16 }} />
            <button
                type="submit"
                className="btn-color-theme btn btn-primary btn-block login-btn">
                <span id="login-btn-icon" className={this.state.loginBtnIcon}/>
                &nbsp;{this.state.loginBtnLabel}
            </button>
            <p>
            <button type="button" className="btn btn-link login-link" 
                    onClick={() => {this.setState({showCreateAccountDialog: true});}}>
                Create an account</button> | 
                <button type="button" className="btn btn-link login-link"
                        onClick={() => {this.setState({showResetPasswordDialog: true});}}>
                Reset your password</button>
            </p>  
            <button type="button" className="btn btn-github"
               onClick={() => this.handleOAuthLoginClick("github")}>
              <span className={this.state.githubIcon}></span>&nbsp;
                {this.state.githubLabel}
            </button>
            <button type="button" className="btn btn-google"
               onClick={() => this.handleOAuthLoginClick("google")}>
              <span className={this.state.googleIcon}></span>&nbsp;
                {this.state.googleLabel}
            </button>
            <p>
                <i>Version CptS 489</i>
            </p>
            </form>
            {this.state.showCreateAccountDialog ? 
              <CreateAccountDialog 
                accountCreateStatus={this.accountCreateStatus}
                cancelCreateAccount={this.cancelCreateAccount} /> : null}
            {this.state.showResetPasswordDialog ? <ResetPasswordDialog /> : null}
        </center>
        </div>
        )
    }
} 

export default LoginPage;
