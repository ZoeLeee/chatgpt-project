import { ChatGPTClient } from '@waylaidwanderer/chatgpt-api';
import config from "./config.js"
import { ChatGPTUnofficialProxyAPI } from 'chatgpt'
import { ChatGPTAPI } from 'chatgpt'
import agent from "https-proxy-agent"
import nodeFetch from 'node-fetch'


const OPENAI_API_KEY = config.ApiKey

let conversationId;
let messageId;


const api = new ChatGPTAPI({
  apiKey: OPENAI_API_KEY,
  fetch: (url, options = {}) => {
    const defaultOptions = {
      agent: agent('http://192.168.100.77:1081')
    };

    const mergedOptions = {
      ...defaultOptions,
      ...options
    };

    return nodeFetch(url, mergedOptions);
  }
})


const list = [];
let doing = true;

export async function getAnswer(msg, onProgress) {
  const res = await api.sendMessage(msg, {
    parentMessageId: messageId,
    timeoutMs: 2 * 60 * 1000,
    onProgress
  })

  messageId = res.id
  return res
}