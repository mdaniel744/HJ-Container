import { createClient } from '@base44/sdk';
import { appParams } from '@/lib/app-params';

const { appId, token, functionsVersion, appBaseUrl, apiUrl } = appParams;

// Public catalogue reads use Base44's API directly. The hosted app URL remains
// separate because it is only needed for browser-based authentication redirects.
export const base44 = createClient({
  appId,
  token,
  functionsVersion,
  serverUrl: apiUrl,
  requiresAuth: false,
  appBaseUrl
});
