const sendToken = (user, statusCode, res, shop) => {
  const token = user.getJwtToken();

  const options = {
    expire: new Date(
      Date.now() + process.env.COOKIE_EXPIRES_TIME * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
    user,
    shop,
  });
};

module.exports = sendToken;
