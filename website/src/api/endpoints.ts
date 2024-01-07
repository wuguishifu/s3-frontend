const header = 'http://localhost:3000';

const endpoints = {
    generateS3CfStack: `${header}/generate-s3-cf-stack`,
    auth: {
        signUp: `${header}/auth/sign-up`,
        logIn: `${header}/auth/log-in`
    }
};

export default endpoints;