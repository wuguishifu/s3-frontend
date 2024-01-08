const header = process.env.API_BASE_URL;

export const endpoints = {
    generateS3CfStack: `${header}/generate-s3-cf-stack`,
    auth: {
        signUp: `${header}/auth/sign-up`,
        logIn: `${header}/auth/log-in`,
        authenticate: `${header}/auth/authenticate`
    }
}