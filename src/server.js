'use strict';

const http = require('node:http');
const { createApp } = require('./app');
const { parseTrustedProxyHops } = require('./config');

const config = {
  clientId: process.env.LINKEDIN_MEMBER_CLIENT_ID,
  clientSecret: process.env.LINKEDIN_MEMBER_CLIENT_SECRET,
  publicUrl: process.env.BFF_PUBLIC_URL,
  appRedirectUri: process.env.APP_REDIRECT_URI || 'com.lttbdd.socialagent://oauth/linkedin/callback',
  // Số proxy tin cậy đứng trước BFF. Render đặt biến RENDER=true; mặc định 3 trên Render (đã đo, xem config.js), 0 ở nơi khác = không tin X-Forwarded-For.
  trustedProxyHops: parseTrustedProxyHops(process.env.TRUSTED_PROXY_HOPS, Boolean(process.env.RENDER)),
};

let handler;
try {
  handler = createApp({ config });
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const port = Number(process.env.PORT) || 8787;
http.createServer(handler).listen(port, () => {
  console.log(`LinkedIn BFF đang chạy ở cổng ${port} (trustedProxyHops=${config.trustedProxyHops})`);
  if (process.env.RENDER && config.trustedProxyHops === 0) {
    console.warn('Cảnh báo: trustedProxyHops=0 trên Render, mọi người chung một hạn mức tần suất và dễ bị 429 nhầm. Xóa biến TRUSTED_PROXY_HOPS hoặc đặt giá trị đã đo.');
  }
});
