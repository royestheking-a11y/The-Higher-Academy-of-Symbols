async function test() {
  const loginRes = await fetch('http://localhost:5001/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@symbolsacademy.com', password: 'admin123' })
  });
  const loginData = await loginRes.json();
  if (!loginData.token) {
    console.log('Login failed:', loginData);
    return;
  }
  
  console.log('Login success. Fetching users...');
  const usersRes = await fetch('http://localhost:5001/api/users', {
    headers: { 'Authorization': `Bearer ${loginData.token}` }
  });
  const usersText = await usersRes.text();
  console.log('Users response:', usersText);
}
test();
