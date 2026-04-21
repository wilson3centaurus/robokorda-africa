import crypto from 'crypto';

const SECRET_KEY = process.env.ADMIN_SECRET || 'robokorda-admin-2026';

export function createSessionToken(): string {
  const timestamp = Date.now().toString();
  const hmac = crypto.createHmac('sha256', SECRET_KEY).update(timestamp).digest('hex');
  return `${timestamp}.${hmac}`;
}

export function verifySessionToken(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length !== 2) return false;
    const [timestamp, hmac] = parts;

    const age = Date.now() - parseInt(timestamp, 10);
    if (isNaN(age) || age > 24 * 60 * 60 * 1000 || age < 0) return false;

    const expected = crypto.createHmac('sha256', SECRET_KEY).update(timestamp).digest('hex');
    return crypto.timingSafeEqual(Buffer.from(hmac, 'hex'), Buffer.from(expected, 'hex'));
  } catch {
    return false;
  }
}

export function validatePassword(password: string): boolean {
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminPassword) return false;
  const inputHash = crypto.createHash('sha256').update(password).digest('hex');
  const storedHash = crypto.createHash('sha256').update(adminPassword).digest('hex');
  return crypto.timingSafeEqual(Buffer.from(inputHash, 'hex'), Buffer.from(storedHash, 'hex'));
}

export function isAuthenticated(request: Request): boolean {
  const cookieHeader = request.headers.get('cookie');
  if (!cookieHeader) return false;
  const match = cookieHeader.match(/admin_session=([^;]+)/);
  if (!match) return false;
  return verifySessionToken(match[1]);
}
