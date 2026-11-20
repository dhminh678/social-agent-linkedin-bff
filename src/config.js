'use strict';

/**
 * Số proxy tin cậy đứng trước BFF (dùng để lấy IP thật từ X-Forwarded-For).
 * Chuỗi rỗng, toàn khoảng trắng, số âm hoặc không phải số nguyên được coi là chưa đặt và dùng mặc định:
 * 3 khi chạy trên Render (biến RENDER có giá trị), 0 ở nơi khác.
 *
 * Giá trị 3 trên Render do đo thực tế ngày 18/11: với 1 giới hạn tần suất không có tác dụng (mỗi request mang một IP
 * khác nhau); với 3 một mạng bị 429 ở lần thứ 21 còn mạng khác vẫn dùng được. Số proxy phụ thuộc hạ tầng của Render
 * nên cần đo lại nếu Render đổi kiến trúc.
 */
const RENDER_DEFAULT_PROXY_HOPS = 3;

function parseTrustedProxyHops(raw, onRender) {
  const fallback = onRender ? RENDER_DEFAULT_PROXY_HOPS : 0;
  if (raw === undefined || raw === null) return fallback;
  const text = String(raw).trim();
  if (!/^\d+$/.test(text)) return fallback;
  return Number(text);
}

module.exports = { parseTrustedProxyHops, RENDER_DEFAULT_PROXY_HOPS };
