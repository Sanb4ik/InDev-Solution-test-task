export const configuration = () => ({
    NODE_ENV: process.env.NODE_ENV,
    
    jwt_access: {
      secret: process.env.ACCESS_SECRET_KEY,
      expiresIn: process.env.JWT_AC_EXPIRES_IN,
    },

    jwt_refresh: {
        secret: process.env.REFRESH_SECRET_KEY,
        expiresIn: process.env.JWT_RT_EXPIRES_IN,
      }
});