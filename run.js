var Nightmare = require('nightmare');
var vo = require('vo');
var nightmare = Nightmare({
    show: true
});

var increment = function * (count) {
    return count + 1;
}

const generateJsonOfImageURLs = (nightmare) => {
    return nightmare
        .evaluate(()=>{
            return Array.from(document.querySelectorAll('div > div._cmdpi > div._70iju > div:nth-child(3) div._4rbun > img'))
                .map((e)=>{return e.src});
        })
}

const run = function * () {
    yield nightmare
        .goto('https://www.instagram.com/explore/tags/pancakes/?hl=ja')
        .wait(3000)
        .click('article[class="_jzhdd"] > div > a');

    var previousHeight, currentHeight=0;
    var counter = 1;
    while(previousHeight !== currentHeight && counter <= 3 ) {
        previousHeight = currentHeight;
        var currentHeight = yield nightmare.evaluate(function() {
            return document.body.scrollHeight;
        });
        yield nightmare.scrollTo(currentHeight, 0)
            .wait(3000);
        counter = yield increment(counter);

    }
    var result = yield generateJsonOfImageURLs(nightmare);
    console.log(result)
    yield nightmare.end();
};

vo(run)(function(err) {
    console.dir(err);
    console.log('done');
});