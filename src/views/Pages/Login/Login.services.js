export const loginVerification = async ({userName, password}) => {
  try {
    const res = await fetch('https://scalaxi.herokuapp.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({userName, password})
    });
console.log(res.status);
    if (res.status !== 200) {
      return (['status error', null]);
    }

    const result = await res.json();
    console.log(res.status, result);
    return [null, result]
  } catch (e) {
    console.error(e);
    return ['general error', null];
  }
}
