import { client } from "../config/redis.js";

export const revokedTokenPrefix = (userId) => {
  return `user:revokedToken:${userId}`;
};
export const revokedTokenKey = (jti, userId) => {
  return `${revokedTokenPrefix(userId)}:${jti}`;
};

export const set = async (key, value, ttl = null) => {
  const data = typeof value == "object" ? JSON.stringify(value) : value;
  const options = ttl ? { EX: ttl } : {};
  return await client.set(key, data, options);
};

export const get = async (key) => {
  return await client.get(key);
};

export const del = async (key) => {
  return await client.del(key);
};

export const upsert = async (key, value) => {
  return await set(key, value);
};

export const epxire = async (key, ttl) => {
  return await client.expire(key, ttl);
};

export const findKey = async (pattern) => {
  return client.keys(pattern);
};
