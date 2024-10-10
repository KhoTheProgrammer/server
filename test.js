const bcrypt = require('bcrypt');

async function hashpassword(password) {
  const hash = await bcrypt.hash(password, 5);
  const ismatch = await bcrypt.compare(password, hash);
  console.log(ismatch);
}
hashpassword('12345678');
