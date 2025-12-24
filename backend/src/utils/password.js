<<<<<<< HEAD
exports.validatePassword = (password) => {
  // >=8, có hoa, thường, số
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
};
=======
exports.validatePassword = (password) => {
  // >=8, có hoa, thường, số
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
};
>>>>>>> d8f4b6dd27e42e2420908d9b3678d12ab3e9cb81
