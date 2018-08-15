module.exports = (nickname) => {
  return web3.toAscii(nickname).toString();
};
