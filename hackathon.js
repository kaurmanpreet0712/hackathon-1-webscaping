const puppy=require("puppeteer");
const data=require("./config.json");

let newstype=process.argv[2];
let finalData="";
let tab;

async function main(){
  let browser=await puppy.launch({
  headless:false,
  defaultViewport:false,
   args:["--start-maximized"]
  
   
  });
   
  let pages=await browser.pages();
  tab=pages[0];
  await tab.goto("https://inshorts.com/en/read/"+newstype);
  await tab.waitForSelector(".news-card.z-depth-1",{visible:true});
  let newsDetail=await tab.$$(".news-card.z-depth-1");
  for(let i in newsDetail){
    let headings=await newsDetail[i].$$("span[itemprop='headline']");
    let headingInnerText= await tab.evaluate(function(ele){
     return ele.textContent;
    },headings[0]);
    let headingDetail=await newsDetail[i].$$("div[itemprop='articleBody']");
    //console.log(headingDetail.length);
    let headingDetailInnerText=await tab.evaluate(function(ele){
    return ele.textContent;
    },headingDetail[0]);
    let headingnumber=Number(i)+1;
    
    finalData=finalData+"\n\n Headings:"+headingnumber+"\n"+headingInnerText+".\n Details:"+headingDetailInnerText;
    // console.log(finalData);
    if(i==1){  //taking only 2 top headlines
      break;
      
    } 
  }
   whatsapp(finalData,newstype);
  await instagram(finalData,newstype);
  await voicefeature(finalData,newstype);

  //whatsapp
  async function whatsapp(finalData,newstype){
    let newpage=await browser.newPage();
    await newpage.setDefaultNavigationTimeout(0);
    await newpage.goto("https://web.whatsapp.com/",);
    await newpage.waitForTimeout(10000);
    await newpage.waitForSelector("._2_1wd.copyable-text.selectable-text",{visible:true});
    await newpage.type("._2_1wd.copyable-text.selectable-text","Dailynews");
    await newpage.keyboard.press("Enter");
    await newpage.waitForSelector("._1JAUF._2x4bz .OTBsx",{visible:true});
    let newMessage="**"+newstype+"**\n"+finalData;
    await newpage.type("._1JAUF._2x4bz .OTBsx",newMessage);
    await newpage.keyboard.press("Enter");
    //await newpage.close();
  }
  //instagram
  async function instagram(finalData,newstype){
    let otherpage=await browser.newPage();
    await otherpage.setDefaultNavigationTimeout(0);
    await otherpage.goto("https://www.instagram.com/",{waitUntil:"networkidle2"});
    await otherpage.type("input[name='username']",data.user,{delay:100});
    await otherpage.type("input[name='password']",data.pwd,{delay:100});
    await otherpage.click("button[type='submit']");
    await otherpage.waitForNavigation({waitUntil:"networkidle2"});
    await otherpage.click(".xWeGp");
    await otherpage.waitForSelector(".aOOlW.HoLwm",{visible:true});
    await otherpage.click(".aOOlW.HoLwm");
    await otherpage.waitForSelector("._7UhW9.xLCgt.MMzan.KV-D4.fDxYl",{visible:true});
    await otherpage.click("._7UhW9.xLCgt.MMzan.KV-D4.fDxYl");
    await otherpage.waitForSelector(".Igw0E.IwRSH.eGOV_.vwCYk.ItkAi  textarea",{visible:true});
    let instaMessage="**"+newstype+"**\n"+finalData;
    await otherpage.type(".Igw0E.IwRSH.eGOV_.vwCYk.ItkAi  textarea",instaMessage);
    await otherpage.keyboard.press("Enter");
    // await otherpage.close();
    setTimeout(function(){
      return otherpage.close();
    },20000)
  }
  //voicefeature
  async function voicefeature(finalData,newstype){
    let voicepage=await browser.newPage();
    await voicepage.setDefaultNavigationTimeout(0);
    await voicepage.goto("https://voicemaker.in/",{waitUntil:"networkidle2"});
    await voicepage.waitForSelector("#main-textarea",{visible:true});
    await voicepage.click("#main-textarea");
    await voicepage.keyboard.down('Control');
    await voicepage.keyboard.press('A');
    await voicepage.keyboard.up('Control');
    await voicepage.keyboard.press('Backspace');

    let voicestring=newstype+"\n"+finalData;
    await voicepage.type("#main-textarea",voicestring);
    await voicepage.click(".ripple.convert-button");
    setTimeout(function(){
      return voicepage.close();
    },15000)
  }
}
main(); 