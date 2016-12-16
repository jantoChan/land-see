/*** crawler-server.js ***/

'use strict'
const http = require('http')
const url = require('url')
const util = require('util')
const superagent = require('superagent')
const cheerio = require('cheerio')
const request = require('request')
const Iconv = require('iconv').Iconv
const schedule = require('node-schedule')


const onRequest = (req, res) => {
    // CORS options
    res.writeHead(200, {'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*'})
    let keyWord = encodeURI(url.parse(req.url, true).query.query);
    let page = encodeURI(url.parse(req.url, true).query.page);
    // recieve keyword from the client side and use it to make requests
    if (keyWord && keyWord=='58') {
        let resultArr = []
        page>1 ? page='/pn'+page : page='';
        superagent.get('http://huizhou.58.com/huicheng/ershoufang/0/'+page+'?PGTID=0d30000c-002d-2d06-4b77-b03bf73d8c31&ClickID=4')
        .end((err, response) => {
            if (err) console.log(err)
            let $ = cheerio.load(response.text)
            $('#main .tbimg tr').each((index, item) => {
                // define an object and update it
                // then push to the result array
                let resultObj = {
                    title: '',
                    address: '',
                    price: '',
                    links: '',
                    pic: '',
                    date: ''
                }

                resultObj.links = $(item).find('.bthead .t').attr('href');
                resultObj.title = $(item).find('.bthead .t').text();
                resultObj.pic = $(item).find('.img_list img').attr('lazy_src');
                resultObj.date=$(item).find('.qj-listleft .qj-listjjr').contents().filter(function() { return this.nodeType === 3; }).text().replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                resultObj.price = $(item).find('.qj-listright.btall').html();
                resultObj.address = $(item).find('.a_xq1').eq(0).text() +$(item).find('.qj-listleft').contents().filter(function() { return this.nodeType === 3; }).text().replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                resultArr.push(resultObj)
            })
            // console.log(resultArr);
            res.write(JSON.stringify(resultArr))
            res.end()
        })
    }
    if (keyWord && keyWord=='xz') {
       let resultArr = []
       var iconv = new Iconv('GBK', 'UTF-8');
        request({
          url: "http://house.xizi.com/index.php?m=agent&c=lists&a=list_sale&areaid=22&htypeid=&price=&title_search=&ifagent=0&page="+page,
          encoding: null  // 关键代码
        }, function (err, sres, body) {
          if (err) console.log(err)
            var html = iconv.convert(new Buffer(body, 'binary')).toString();
          var $ = cheerio.load(html, {decodeEntities: false});
            $('#main #result_show .result_item.cc').each((index, item) => {
                // define an object and update it
                // then push to the result array
                let resultObj = {
                    title: '',
                    address: '',
                    price: '',
                    links: '',
                    pic: '',
                    date: ''
                }

                resultObj.links = $(item).find('h4 a').attr('href');
                resultObj.title = $(item).find('h4 a').text().replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                resultObj.pic = $(item).find('.img_desc.cc img').attr('src');
                resultObj.date=$(item).find('.update_time').text();
                resultObj.price = $(item).find('.h_price.cc .fr').html()+$(item).find('.h_price .fl').html()+'<br/>'+$(item).find('dd .gray').text();
                resultObj.address = $(item).find('dd p').eq(0).text().replace(/^\s\s*/, '').replace(/\s\s*$/, '');
                resultArr.push(resultObj)
            })//each
            res.write(JSON.stringify(resultArr))
            res.end()
        })
    }
}


//定时刷新
　　var rule = new schedule.RecurrenceRule();
　　var times = [];
　　for(var i=1; i<60; i++){
　　　　times.push(i);
　　}
　　rule.second = times;
　　var c=0;
　　var j = schedule.scheduleJob(rule, function(){
     　　 c++;
      　　console.log(c);
　　});

http.createServer(onRequest).listen(8090)
console.log('Server Start!')