import cookie from 'cookie';

export const serializeCookie = (token: string) =>
    cookie.serialize('token', token, {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 24 * 7,
        path: '/',
        sameSite: 'none'
    });