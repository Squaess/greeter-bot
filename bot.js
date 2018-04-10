const Discord = require('discord.js');
const config = require('./config.json');
const APPID = "7ab46cfe137338d9856c5fb96c3da511";
var request = require('request');

const prefix = '!';
// Initialize Discord Bot
const bot = new Discord.Client();

bot.on('ready', () => {
    console.log('Connected');
    console.log('Logged in as: ');
    console.log(bot.user.tag );
});

bot.on('message',   message => {

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    var args = message.content.substring(1).split(' ');
    var command = args[0];

    switch (command) {
            case 'ping':
                    message.reply('Pong!');
                    break;

            case 'hi':
                    message.channel.send('Welcome ' + message.author);
                    break;

            case 'date':
                    message.reply('Welcome ' + new Date());
                    break;

            case 'weather':
                    if(args[1] != null){
                        var location = args[1];
                        getWeather(location, message);
                    } else
                        message.reply("You stupid, you forgot to type a city name.");
                    break;
            case 'meme':
                    getMeme(message);
                    break;

            case 'urban':
                    console.log(args.slice(1));
                    break;
         }

});


function getMeme(message) {
    var url = 'https://api.imgflip.com/get_memes';

    sendRequestMeme(url, message);
}

function getWeather(location, message) {

  var url = "http://api.openweathermap.org/data/2.5/weather?"+
  "q=" + location +
  "&appid=" + APPID;

  sendRequest(url, message);

}

function sendRequestMeme(url, message) {
    request(url, async function(error, response, body){
        if (!error && response.statusCode == 200) {
          console.log('error:', error); // Print the error if one occurred
          console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
          var toSend = JSON.parse(body);
          computeMeme(toSend, message);
      } else {
        console.log("Error: "+ error);
        console.log("Response: " + response);
        message.reply("This meme is to good for you, try later.");
      }
    });
}

function sendRequest(url, message) {
  request(url,  function(error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      console.log('body:', body); // Print the HTML for the Google homepage.
      console.log('request: ', url);

      var toSend = JSON.parse(body);
      computeOutput(toSend, message);
    } else {
      console.log("Error: "+ error);
      console.log("Response: " + response);
      message.reply("I smell some typo here...");
    }
  });
}

function computeMeme(obj, message) {
    var size = obj.data.memes.length;
    console.log("Size of meme array: " + size);
    var index = Math.floor(Math.random() * size);
    console.log("Choosen index for meme: "+ index);
    message.reply(obj.data.memes[index].url);
}

function computeOutput(obj, message){
  var cityName = obj.name,
      tmp = (obj.main.temp-272.15),
      hum = obj.main.humidity,
      pres = obj.main.pressure;
/*
  var msg = "Weather in " + cityName + "\n" +
            "Temperature: " + tmp + " celcius\n" +
            "Pressure: " + pres + " hPa\n" +
            "Humidity: " + hum +"%";
*/
    var embed = new Discord.RichEmbed()
                .setColor('#EFFF00')
                .setTitle("Weather in " + cityName)
                .setURL('https://openweathermap.org/')
                .addField("Temperature", "\t" + tmp + " celcius")
                .addField("Pressure", "\t" + pres + " hPa")
                .addField("Humidity", "\t" + hum + "%");
    console.log(embed);
  message.channel.send(embed);

}

bot.on("guildCreate", (guild) => {
  // This event triggers when the bot joins a guild.
  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
});

bot.on("guildDelete", (guild) => {
  // this event triggers when the bot is removed from a guild.
  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
});


bot.on('guildMemberAdd', (member) => {

  console.log('GuildMemberAdded ' + member);
  console.dir(member);

  const channel = member.guild.channels.get('432516866842296321');

  if(!channel) return;
  console.log('What????');
  channel.send(`Welcome on the best server in my home, ${member}`);
  member.addRole('432950017272184843','You are new here.');

});

bot.login(config.token);
