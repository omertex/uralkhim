export const loginVerification = async ({userName, password}) => {
  try {
    const res = await fetch('https://scalaxi-auth.herokuapp.com/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json;charset=utf-8'
      },
      body: JSON.stringify({userName, password})
    });
    if (res.status !== 200) {
      return (['status error', null]);
    }

    const result = await res.json();
    return [null, result]
  } catch (e) {
    console.error(e);
    return ['general error', null];
  }
}
