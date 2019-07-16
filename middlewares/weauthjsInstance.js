import weauthjs from 'weauthjs';

const api = weauthjs.Initialize({
  app: process.env.AUTH_API_CLIENT_ID || 'weyoume.alpha',
  baseURL: process.env.AUTH_URL || 'https://auth.weyoume.io',
  callbackURL: process.env.AUTH_API_REDIRECT_URL || 'https://alpha.weyoume.io/callback',
  
});

if(typeof window !== 'undefined'){
	window.weauthjs = weauthjs
	window.weauthjsInstance = api
}

export default api;