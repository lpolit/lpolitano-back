import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  vus: 10, // Usuarios virtuales simultáneos
  duration: '10s', // Duración de la prueba
};

export default function () {
  // Paso 1: Login
  const loginRes = http.post('http://localhost:3000/login', JSON.stringify({
    username: 'admin',
    password: '1234'
  }), {
    headers: { 'Content-Type': 'application/json' },
  });

  check(loginRes, {
    'login status is 200': (r) => r.status === 200,
    'login returned token': (r) => r.json('accessToken') !== undefined,
  });

  const token = loginRes.json('accessToken');

  // Paso 2: Acceder al perfil con el token
  const profileRes = http.get('http://localhost:3000/profile', {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  check(profileRes, {
    'profile status is 200': (r) => r.status === 200,
  });

  sleep(1); // Simula un pequeño tiempo entre interacciones
}
