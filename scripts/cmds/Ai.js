const axios = require('axios');
const UPoLPrefix = [
  'ai'
];

const axiosInstance = axios.create();

module.exports = {
  config: {
    name: 'ai',
    version: '1.2.1',
    role: 0,
    category: 'AI',
    author: 'UPoL/Priyanshi',
//API Author Priyansh Rajput
    shortDescription: '',
    longDescription: '',
  },

  onStart: async function () {},
  onChat: async function ({ message, event, args, api, threadID, messageID }) {
    const ahprefix = UPoLPrefix.find((p) => event.body && event.body.toLowerCase().startsWith(p));
    if (!ahprefix) {
      return;
    }

    const upol = event.body.substring(ahprefix.length).trim();
    if (!upol) {
      await message.reply('IT4CHI H3R3 ♥');
      return;
    }

    const apply = ['𝚎𝚗𝚝𝚎𝚛 (𝚚)*', '𝙷𝚘𝚠 𝙲𝚊𝚗 𝙸 𝙷𝚎𝚕𝚙 𝚈𝚘𝚞?', '𝚀𝚞𝚊𝚛𝚢 𝙿𝚕𝚎𝚊𝚜𝚎....', '𝙷𝚘𝚠 𝙲𝚊𝚗 𝙸 𝙰𝚜𝚒𝚜𝚝 𝚈𝚘𝚞?'];
    const randomapply = apply[Math.floor(Math.random() * apply.length)];

    if (args[0] === 'hi') {
      message.reply(`${randomapply}`);
      return;
    }

    const encodedPrompt = encodeURIComponent(args.join(' '));

    await message.reply('im thinking sir 🤔..');

    const response = await axiosInstance.get(`https://priyansh-ai.onrender.com/gemini/ai?query=${encodedPrompt}`);
    const UPoL = response.data;
    const upolres = `${UPoL}`;

    message.reply(upolres);
  }
};
