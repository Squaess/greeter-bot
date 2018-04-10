const Discord = require('discord.js');
const config = require('./config.json');
const APPID = "7ab46cfe137338d9856c5fb96c3da511";
//const token = "7ab46cfe137338d9856c5fb96c3da511";
var request = require('request');

// Initialize Discord Bot
const bot = new Discord.Client();

bot.on('ready', () => {
    console.log('Connected');
    console.log('Logged in as: ');
    console.log(bot.user.tag );
});

bot.on('message', (msg) => {
    // Our bot needs to know if it will execute a command
    // It will listen for messages that will start with `!`
    if (msg.content.substring(0, 1) == '!') {
        var args = msg.content.substring(1).split(' ');
        var cmd = args[0];

        args = args.splice(1);
        switch(cmd) {
            // !ping
            case 'ping':
                msg.reply('Pong!');
            break;
            case 'hi':
              msg.reply('Welcome ');
            break;
            case 'date':
              msg.reply('Welcome ' + new Date());
            break;
            case 'weather':
              if(args[0] != null){
                var location = args[0];
                getWeather(location, msg);
              } else {
                msg.reply("You stupid, you forgot to type a city name.");
              }
              break;
            // Just add any case commands if you want to..
         }
     }
});


function getWeather(location, message) {

  var url = "http://api.openweathermap.org/data/2.5/weather?"+
  "q=" + location +
  "&appid=" + APPID;

  sendRequest(url, message);

}

function sendRequest(url, message) {
  request(url, function(error, response, body) {
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

function computeOutput(obj, message){
  var cityName = obj.name,
      tmp = (obj.main.temp-272.15),
      hum = obj.main.humidity,
      pres = obj.main.pressure;

  var msg = "Weather in " + cityName + "\n" +
            "Temperature: " + tmp + " celcius\n" +
            "Pressure: " + pres + " hPa\n" +
            "Humidity: " + hum +"%";
  message.reply(msg);

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
