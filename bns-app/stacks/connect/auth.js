// authentication of user

import { showConnect } from '@stacks/connect';
import { StacksMainnet, StacksTestnet } from '@stacks/network';
import { userSession } from '../../pages/_app';
import router from 'next/router';

// Set this to true if you want to use Mainnet
const boolNetworkType = false;

export function networkType() {
    return new StacksTestnet();
}

// this will return the users stx address if logged in
export function myStxAddress() {
    try {

        if (getUserData()) {
            if (boolNetworkType)
                return getUserData().profile.stxAddress.mainnet;
            else
                return getUserData().profile.stxAddress.testnet;
        }
        else {
            return "";
        }
    }

    catch (err) {
        console.log(err);
        return "";
    }
}

// bind this function on signin button OnClick
export function Signin() {

    try {

        showConnect({
            appDetails: {
                name: 'AMORTIZE',
                icon: window.location.origin + '/YourAppLogo.svg',
            },

            onFinish: () => {
                router.push('/')
            },
            userSession: userSession,
        });

    }

    catch (err) {
        console.log(err);
        return;
    }
}

export function isConnected() {
    try {
        if (userSession) {
            if (userSession.isUserSignedIn()) {
                return true
            }
            else {
                return false
            }
        }
        else
        {
            return false
        }
    }
    catch (err) {
        console.log(err);
        return false;
    }
}

export function getUserData() {

    try {

        if (userSession) {
            if (userSession.isUserSignedIn()) {
                return userSession.loadUserData();
            }
            else {
                console.log("User is not Signed in");
            }
        }
    }
    catch (err) {
        console.log(err);
        return;
    }
}

// bind this function on signout button OnClick
export function signout() {

    try {
        if (userSession) {
            if (userSession.isUserSignedIn()) {
                userSession.signUserOut();
                console.log("Signed out");
            }
        }
    
        router.push('/')
    }
    catch (err) {
        console.log(err);

        router.push('/')
    }
}