/*
 *   Copyright 2018 Amazon.com, Inc. or its affiliates. All Rights Reserved.

 *  Licensed under the Apache License, Version 2.0 (the "License").
 *  You may not use this file except in compliance with the License.
 *  A copy of the License is located at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 *  or in the "license" file accompanying this file. This file is distributed
 *  on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 *  express or implied. See the License for the specific language governing
 *  permissions and limitations under the License.
 */
import React from 'react';
import { Auth } from 'aws-amplify';
import DynamicImage from '../components/DynamicImage';
import { withRouter } from 'react-router-dom';

import '../css/app.css';

/**
 * Sign-in Page
 */
class SignIn extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: 0,
      email: '',
      password: '',
      code: '',
      userObject: null
    };
  }

  onEmailChanged(e) {
    this.setState({ email: e.target.value.toLowerCase() });
  }

  onPasswordChanged(e) {
    this.setState({ password: e.target.value });
  }

  onCodeChanged(e) {
    this.setState({ code: e.target.value });
  }

  async onSubmitForm(e) {
      e.preventDefault();
      try {
          const userObject = await Auth.signIn(
              this.state.email.replace(/[@.]/g, '|'),
              this.state.password
          );
          console.log('userObject', userObject);
          if (userObject.challengeName) {
          // Auth challenges are pending prior to token issuance
          this.setState({ userObject, stage: 1 });
          } else {
          // No remaining auth challenges need to be satisfied
          const session = await Auth.currentSession();
          // console.log('Cognito User Access Token:', session.getAccessToken().getJwtToken());
          console.log('Cognito User Identity Token:', session.getIdToken().getJwtToken());
          // console.log('Cognito User Refresh Token', session.getRefreshToken().getToken());
          this.setState({ stage: 0, email: '', password: '', code: '' });
          this.props.history.replace('/app');
          }
      } catch (err) {
          alert(err.message);
          console.error('Auth.signIn(): ', err);
      }
  }
  
  async onSubmitVerification(e) {
      e.preventDefault();
      try {
          const data = await Auth.confirmSignIn(
              this.state.userObject,
              this.state.code
          );
          console.log('Cognito User Data:', data);
          const session = await Auth.currentSession();
          // console.log('Cognito User Access Token:', session.getAccessToken().getJwtToken());
          console.log('Cognito User Identity Token:', session.getIdToken().getJwtToken());
          // console.log('Cognito User Refresh Token', session.getRefreshToken().getToken());
          this.setState({ stage: 0, email: '', password: '', code: '' });
          this.props.history.replace('/app');
      } catch (err) {
          alert(err.message);
          console.error('Auth.confirmSignIn(): ', err);
      }
  }

  isValidEmail(email) {
    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  
  static async getCurrentSession() {
    return await Auth.currentSession();
  }

  static async signOut() {
    await Auth.signOut();
    window.location.pathname = '/signin';
  }
  
  static async globalSignOut() {
    await Auth.signOut({global: true});
    window.location.pathname = '/signin';
  }

  renderSignIn() {
    const isValidEmail = this.isValidEmail(this.state.email);
    const isValidPassword = this.state.password.length > 6;

    return (
      <div className="app">
        <header>
          <DynamicImage src="logo.png"/>
        </header>
        <section className="form-wrap">
          <h1>Sign in</h1>
          <form id="registrationForm" onSubmit={(e) => this.onSubmitForm(e)}>
            <input className={isValidEmail?'valid':'invalid'} type="email" placeholder="Email" value={this.state.email} onChange={(e) => this.onEmailChanged(e)}/>
            <input className={isValidPassword?'valid':'invalid'} type="password" placeholder="Password" value={this.state.password} onChange={(e) => this.onPasswordChanged(e)}/>
            <input disabled={!(isValidEmail && isValidPassword)} type="submit" value="Let's Ryde"/>
          </form>
        </section>
      </div>
    );
  }

  renderConfirm() {
    const isValidEmail = this.isValidEmail(this.state.email);
    const isValidCode = this.state.code.length === 6;

    return (
      <div className="app">
        <header>
          <DynamicImage src="logo.png"/>
        </header>
        <section className="form-wrap">
          <h1>Enter MFA Code</h1>
          <form id="verifyForm" onSubmit={(e) => this.onSubmitVerification(e)}>
            <input className={isValidEmail?'valid':'invalid'} type="email" placeholder="Email" value={this.state.email}/>
            <input className={isValidCode?'valid':'invalid'} type="text" placeholder="Verification Code" value={this.state.code} onChange={(e) => this.onCodeChanged(e)}/>
            <input disabled={!(isValidCode&&isValidEmail)} type="submit" value="Verify"/>
          </form>
        </section>
      </div>
    );
  }

  render() {
    switch (this.state.stage) {
      case 0:
      default:
        return this.renderSignIn();
      case 1:
        return this.renderConfirm();
    }
  }
}

export default withRouter(SignIn);

