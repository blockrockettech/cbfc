module.exports = (nickname) => {
  return web3.toAscii(nickname).toString().replace(/\0/g, '');
};
