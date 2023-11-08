const http=require("http");
const fs=require("fs");
const requests=require("requests")
const homeFile=fs.readFileSync("home.html","utf-8");
const cssFile = fs.readFileSync("style.css", "utf-8");
const replaceVal = (tempVal,orgVal) =>{
    // let temperature=tempVal.replace("{%tempval%}", orgVal.main.temp);
    //  temperature=tempVal.replace("{%tempmin%}", orgVal.main.temp_min);
    //  temperature=tempVal.replace("{%tempmax%}", orgVal.main.temp_max);
    //  temperature=tempVal.replace("{%location%}", orgVal.name);
    //  temperature=tempVal.replace("{%country%}",orgVal.sys.country);
    //  return temperature;
    
        let temperature = tempVal.replace("{%tempval%}", (orgVal.main.temp - 273.15).toFixed(2));
        temperature = temperature.replace("{%tempmin%}", (orgVal.main.temp_min- 273.15).toFixed(2));
        temperature = temperature.replace("{%tempmax%}", (orgVal.main.temp_max- 273.15).toFixed(2));
        temperature = temperature.replace("{%location%}", orgVal.name);
        temperature = temperature.replace("{%country%}", orgVal.sys.country);
        return temperature;
      
      
};
const server=http.createServer((req,res)=>{
    if(req.url=="/"){
        requests("https://api.openweathermap.org/data/2.5/weather?lat=34.0151&lon=71.5249&appid=1781935aa67fc5b9d91d06be92f087ff")
.on('data', function (chunk){
    const objdata=JSON.parse(chunk);
    const arrData=[objdata]
//   console.log(arrData[0].main.temp)
//   console.log(arrData[0].main.temp_min)
//   console.log(arrData[0].main.temp_max)
//   console.log(arrData[0].name)
//   console.log(arrData[0].sys.country)
 const realTimeData=arrData
 .map((val)=> replaceVal(homeFile,val))
 .join("");
    res.write(realTimeData);
    // console.log(realTimeData);
    res.end();
 })
.on('end', function (err) {
  if (err) return console.log('connection closed due to errors', err);
 res.end();
//   console.log('end');
});
    }
    else if (req.url == "/style.css") {
        res.writeHead(200, { "Content-Type": "text/css" });
        res.write(cssFile);
        res.end();
    }
    
})
// console.log(__dirname)
server.listen(3000,"127.0.0.1")