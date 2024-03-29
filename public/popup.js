let stories = null;

document.addEventListener('DOMContentLoaded', async function () {
    let sel = document.getElementById('month-year');
    for(let yr = 1985; yr < 1996; yr++) {
        for(let mn = (yr == 1985 ? 11 : 1); mn <= 12; mn++) {
            let opt = document.createElement('option');
            opt.value = yr + '/' + mn.toString().padStart(2, '0');
            opt.innerText = yr + '-' + mn.toString().padStart(2, '0');
            sel.appendChild(opt);
        }
    }
    sel.addEventListener('change', function() {
        loadComics();
    });

    let story = document.getElementById('story');
    stories = await (await fetch('story-arcs.json')).json();
    for(n = 0; n < stories.length; n++) {
        let opt = document.createElement('option');
        opt.value = n;
        opt.innerText = stories[n].title.substring(0, 64);
        story.appendChild(opt);
    }
    story.addEventListener('change', function() {
        loadComics(story.value);
    });

    loadComics();
    
    document.getElementById('reload').addEventListener('click', function() {
        if(sel.selectedIndex == sel.options.length - 1) sel.selectedIndex = 0;
        else sel.selectedIndex = sel.selectedIndex + 1;
        loadComics();
    });
});

function loadComics(storyId) {
    let sel = document.getElementById('month-year');
    let monthyear = sel.value;
    const linktocomicplacement = document.getElementById('text');
    const comic = document.getElementById('comic');
    comic.innerHTML = '';
    linktocomicplacement.innerHTML = '';

    if(storyId === undefined) {
        let day = sel.value == '1985/11' ? 18 : 1;
        const startDate = new Date(sel.value + '/' + day);
        let date = new Date(sel.value + '/' + day);
        // console.log(date);

        while(date.getMonth() == startDate.getMonth()) {
            console.log(date);
            addComic(comic, date);
            date.setDate(date.getDate()+1);
        }
    } else {
        let story = stories[storyId];
        let startDate = new Date(story.startDate);
        let endDate = new Date(story.endDate);
        console.log('startDate: '+startDate);
        console.log('endDate:'+endDate);
        for(let date = new Date(startDate); date.valueOf() <= endDate.valueOf(); date.setDate(date.getDate()+1)) {
            console.log(date);
            addComic(comic, date);
        }
    }

    /*
    const gif = document.getElementById('gif');
    gif.style.display = 'block';
    fetch('https://api.codetabs.com/v1/proxy?quest=https://www.gocomics.com/calvinandhobbes/'+datestring).then((response) => response.text()).then((text) => {
        const img = extract_strip(text);
        comic.appendChild(img);
        // gif.style.display = 'none';
    });
    */
}

function addComic(comic, date) {
    const div = document.createElement('div');
    comic.appendChild(div);
    fetch('/strip?'+
        'year='+date.getFullYear().toString()+'&'+
        'month='+(date.getMonth()+1).toString().padStart(2,'0')+'&'+
        'day='+date.getDate().toString().padStart(2,'0')
    ).then(async (response) => {
        const text = await response.text();
        const img = document.createElement('img');
        img.src = text;
        div.appendChild(img);
        // gif.style.display = 'none';
    });
}

function extract_strip(text) {
    const source_html = document.createElement('html');
    source_html.innerHTML = text;
    // const comic_link = source_html.querySelector("link[rel='canonical']").href;
    const img_class = source_html.getElementsByClassName('item-comic-image')[0];
    const img_link = img_class.getElementsByTagName('img')[0].src;
    // const a = document.createElement('a');
    // a.href = comic_link;
    // a.target = '_blank';
    // a.appendChild(document.createTextNode(comic_link));
    // // a.innerHTML = comic_link;

    const img = document.createElement('img');
    img.src = img_link;

    return img;
    // linktocomicplacement.appendChild(a);

}