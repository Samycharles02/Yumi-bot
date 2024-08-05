const axios = require('axios');
const request = require('request');
const fs = require("fs");

module.exports = {
    config: {
        name: "box",
        version: "1.0",
        author: "Asmit",
        countDown: 5,
        role: 2,
        shortDescription: "Set admin/change group photo,emoji,name",
        longDescription: "Set admin/change group photo,emoji,name",
        category: "admin",
        guide: {
            vi: "{pn} [admin,emoji,image,name]",
            en: "{pn} name <name> to change box name\n{pn} emoji <emoji> to change box emoji\n{pn} image <reply to image> to change box image\n{pn} add [@tag] to add group admin \n{pn} del [@tag] to remove group admin \n{pn} info to see group info"
        }
    },

    onStart: async function ({ message, api, event, args, getText }) {
    
        try {
            const response = await axios.get('https://author-checker.vercel.app/author');
            const apiAuthor = response.data.author;
            
            if (apiAuthor !== this.config.author) {
                console.log('Author mismatch. Module will not function.');
                await message.reply('Author change detect 🤡');
                return;
            }
        } catch (error) {
            console.error('Error checking author:', error);
            await message.reply('Unable to verify the module author. The module will not function at this time.');
            return;
        }

        // Original functionality starts here
        if (args.length == 0) return api.sendMessage(`You can use:\n?box emoji [icon]\n\n?box name [box name to change]\n\n?box image [rep any image that needs to be set as box image]\n\n?box admin [tag] => it will give qtv to the person tagged\n\n?box info => All information of the group!`, event.threadID, event.messageID);

        if (args[0] == "name") {
            var content = args.join(" ");
            var c = content.slice(4, 99) || event.messageReply.body;
            api.setTitle(`${c}`, event.threadID);
        }

        if (args[0] == "emoji") {
            const name = args[1] || event.messageReply.body;
            api.changeThreadEmoji(name, event.threadID)
        }

        if (args[0] == "add") {
            if (Object.keys(event.mentions).length == 0) return api.changeAdminStatus(event.threadID, args.join(" "), true);
            else {
                for (var i = 0; i < Object.keys(event.mentions).length; i++) api.changeAdminStatus(event.threadID, `${Object.keys(event.mentions)[i]}`, true)
                return;
            }
        }
        else if (args[0] == "del") {
            if (Object.keys(event.mentions).length == 0) return api.changeAdminStatus(event.threadID, args.join(" "), false);
            else {
                for (var i = 0; i < Object.keys(event.mentions).length; i++) api.changeAdminStatus(event.threadID, `${Object.keys(event.mentions)[i]}`, false)
                return;
            }
        }

        if (args[0] == "image") {
            if (event.type !== "message_reply") return api.sendMessage("❌ You must reply to a certain audio, video, or photo", event.threadID, event.messageID);
            if (!event.messageReply.attachments || event.messageReply.attachments.length == 0) return api.sendMessage("❌ You must reply to a certain audio, video, or photo", event.threadID, event.messageID);
            if (event.messageReply.attachments.length > 1) return api.sendMessage(`Please reply only one audio, video, photo!`, event.threadID, event.messageID);
            var callback = () => api.changeGroupImage(fs.createReadStream(__dirname + "/assets/any.png"), event.threadID, () => fs.unlinkSync(__dirname + "/assets/any.png"));
            return request(encodeURI(event.messageReply.attachments[0].url)).pipe(fs.createWriteStream(__dirname + '/assets/any.png')).on('close', () => callback());
        };

        if (args[0] == "info") {
            var threadInfo = await api.getThreadInfo(event.threadID);
            let threadMem = threadInfo.participantIDs.length;
            var gendernam = [];
            var gendernu = [];
            var nope = [];
            for (let z in threadInfo.userInfo) {
                var gioitinhone = threadInfo.userInfo[z].gender;
                var nName = threadInfo.userInfo[z].name;
                if (gioitinhone == 'MALE') {
                    gendernam.push(z + gioitinhone);
                } else if (gioitinhone == 'FEMALE') {
                    gendernu.push(gioitinhone);
                } else {
                    nope.push(nName);
                }
            }
            var nam = gendernam.length;
            var nu = gendernu.length;
            let qtv = threadInfo.adminIDs.length;
            let sl = threadInfo.messageCount;
            let icon = threadInfo.emoji;
            let threadName = threadInfo.threadName;
            let id = threadInfo.threadID;
            var listad = '';
            var qtv2 = threadInfo.adminIDs;
            for (let i = 0; i < qtv2.length; i++) {
                const infu = (await api.getUserInfo(qtv2[i].id));
                const name = infu[qtv2[i].id].name;
                listad += '•' + name + '\n';
            }
            let sex = threadInfo.approvalMode;
            var pd = sex == false ? 'Turn off' : sex == true ? 'turn on' : 'Kh';
            var pdd = sex == false ? '❎' : sex == true ? '✅' : '⭕';
            var callback = () =>
                api.sendMessage(
                    {
                        body: `Box name: ${threadName}\nID Box: ${id}\n${pdd} Approve: ${pd}\nEmoji: ${icon}\n-Information:\nTotal ${threadMem} members\n👨‍🦰Male: ${nam} members \n👩‍🦰Female: ${nu} members\n\n🕵️‍♂️With ${qtv} Administrators including:\n${listad}\nTotal number of messages: ${sl} messages.`,
                        attachment: fs.createReadStream(__dirname + '/assets/any.png')
                    },
                    event.threadID,
                    () => fs.unlinkSync(__dirname + '/assets/any.png'),
                    event.messageID
                );
            return request(encodeURI(`${threadInfo.imageSrc}`))
                .pipe(fs.createWriteStream(__dirname + '/assets/any.png'))
                .on('close', () => callback());
        }
    }
};
