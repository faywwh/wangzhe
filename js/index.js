let hotHeroData = '';
let allHeroData = '';
window.onload = () => {
  initHomePage();
};

function initHomePage() {
  getNews(1760);
  getHeros();
  getSliderPic();
  getBoutiquePrograma('1809,1855,2609,4781,4782,4780,4646');
}

// 获取新闻资讯数据
function getNews(id, e) {
  const obj = {
    p0: 18,
    p1: 'searchNewsKeywordsList',
    page: 1,
    order: 'sIdxTime',
    r0: 'cors',
    r1: 'NewsObj',
    type: 'iTarget',
    pagesize: 5,
    id,
  };
  axios
    .post('http://192.168.1.104:3000/api/wzry/getNews', obj)
    .then((result) => {
      initNews(result.data.msg.result, id, e);
    });
}

// 初始化新闻资讯数据
function initNews(data, id, e) {
  let ul = '';
  data.forEach((item) => {
    const [newsName, newsClass] = chooseNewsName(id, item.sTagIds);
    const month = item.sTargetIdxTime.substring(5, 7);
    const day = item.sTargetIdxTime.substring(8, 10);
    const li = `<li>
    <a href="https://pvp.qq.com/m/m201606/newCont.shtml?newCont.shtml?G_Biz=18&tid=${item.iNewsId}">
      <span class="title ${newsClass}">${newsName}</span>
      <span class="news-text">${item.sTitle}</span>
      <span class="time">${month}/${day}</span>
    </a>
  </li>`;
    ul += li;
  });
  document.querySelector('.news-slide .content').innerHTML = `<ul>${ul}</ul>`;
  if (e) {
    document.querySelectorAll('.news-slide-ul span').forEach((item) => {
      item.classList.remove('active');
    });
    e.target.classList.add('active');
  }
}

// 获取英雄列表数据
function getHeros() {
  const hotAxios = axios.get('./assets/top_heros.json');
  const herosAxios = axios.get(
    'http://192.168.1.104:3000/api/wzry/getHeroList'
  );
  Promise.all([hotAxios, herosAxios])
    .then(([hotHero, allHero]) => {
      hotHeroData = hotHero.data;
      allHeroData = allHero.data;
      initHeros(0);
    })
    .catch((err) => {
      console.log(err);
    });
}

// 初始化英雄列表
function initHeros(index, e) {
  let ul = '';
  const hotHeroList = hotHeroData.map((item) => {
    return allHeroData.filter((allitem) => {
      return allitem.ename == item.heroid;
    })[0];
  });
  const heroArr =
    index != 0
      ? allHeroData.filter((item) => {
          return item.hero_type == index || item.hero_type2 == index;
        })
      : hotHeroList;
  heroArr.forEach(({ ename, cname }) => {
    const li = `<li onclick='openHeroDetail(${ename})'>
        <div class="hero-pic">
          <a
            style="
              background-image: url(//game.gtimg.cn/images/yxzj/img201606/heroimg/${ename}/${ename}.jpg);
            "
          ></a>
        </div>
        <a class="hero-name" href="">${cname}</a>
      </li>`;
    ul += li;
  });
  document.querySelector('.hero-slide-wrapper').innerHTML = `<ul>${ul}</ul>`;
  if (e) {
    document.querySelectorAll('.hero-slide-ul span').forEach((item) => {
      item.classList.remove('active');
    });
    e.target.classList.add('active');
  }
}

// 获取英雄攻略数据;
function getCross(e) {
  const obj = {
    serviceId: 18,
    typeids: 2,
    sortby: 'sIdxTime',
    tagids: '2543,619',
    limit: 4,
    source: 'web_m',
    filter: 'tag',
  };
  axios
    .post('http://192.168.1.104:3000/api/wzry/getCross', obj)
    .then((result) => {
      initCross(result.data.data.items, e);
    })
    .catch((e) => {
      console.log(e);
    });
}

// 初始化精品栏目（英雄攻略、赛事精品）
function initCross(data, e) {
  let ul = '';
  data.forEach((item) => {
    const month = item.sIdxTime.substring(5, 7);
    const day = item.sIdxTime.substring(8, 10);
    const li = `<li>
  <a href="https://pvp.qq.com/m/m201606/detail.shtml?G_Biz=18&tid=${item.iVideoId}&e_code=pvpweb_m.statictypenew.type${item.iType}"
    ><div
      class="video-pic"
      style="
        background-image: url(${item.sIMG});
      "
    ></div>
    <span class="video-text"
      >${item.sTitle}</span
    ></a
  >
  <div class="info">
    <span><span class="iconfont icon-edit"></span>${item.iTotalPlay}</span>
    <span class="video-time">${month}-${day}</span>
  </div>
</li>`;
    ul += li;
  });
  document.querySelector('.video-slide-wrapper').innerHTML = `<ul>${ul}</ul>`;
  if (e) {
    document.querySelectorAll('.video-slide-ul span').forEach((item) => {
      item.classList.remove('active');
    });
    e.target.classList.add('active');
  }
}

// 获取精品栏目、赛事精品(或新闻资讯接口)接口数据
// 精品栏目id‘1809,1855,2609,4781,4782,4780,4646’
// 赛事精品id‘1639,1852,4784,4785,4786,4787,4775’
function getBoutiquePrograma(id, e) {
  obj = {
    p0: 18,
    p1: 'searchKeywordsList',
    page: 1,
    pagesize: 4,
    order: 'sIdxTime',
    r0: 'cors',
    r1: 'userObj',
    source: 'app_search',
    id,
    type: 'iTag',
  };
  axios
    .post('http://192.168.1.104:3000/api/wzry/getNews', obj)
    .then((result) => {
      initCross(result.data.msg.result, e);
    })
    .catch((err) => {
      console.log(err);
    });
}

// 选择新闻资讯种类
function chooseNewsName(e, t) {
  const eMap = {
    1761: ['新闻', 'new'],
    1762: ['公告', 'announcement'],
    1763: ['活动', 'activity'],
    1764: ['赛事', 'match'],
  };
  const tMap = {
    655: ['新闻', 'new'],
    656: ['公告', 'announcement'],
    1139: ['活动', 'activity'],
    658: ['赛事', 'match'],
  };
  const id = Object.keys(tMap).find((id) => t.includes(id));
  return eMap[e] || tMap[id] || ['热门', 'hot'];
}

// 转换类名
function addClass() {
  const ul = document.querySelector('.home-nav-ul');
  const text = document.querySelector('.home-nav-text');
  const icon = document.querySelector('.span');
  ul.classList.toggle('active');
  if (ul.className.indexOf('active') >= 0) {
    text.innerText = '收起';
    icon.className = 'span iconfont icon-search';
  } else {
    text.innerText = '展开';
    icon.className = 'span iconfont icon-edit';
  }
}

// 获取轮播图片数据
function getSliderPic() {
  axios
    .get('./assets/info_new_15223.json')
    .then((result) => {
      initSliderPic(Object.values(result.data));
    })
    .catch((e) => {
      console.log(e);
    });
}

// 初始化轮播图片;
function initSliderPic(data) {
  let div = '';
  data.forEach((item) => {
    div += `<div class="swiper-slide"><a href='${item[1]}'><img src='http://ossweb-img.qq.com/upload/adw/${item[2]}'/></a></div>`;
  });
  document.querySelector('.swiper-wrapper').innerHTML = div;
  new Swiper('.swiper-container', {
    autoplay: true,
    loop: true,
    pagination: {
      el: '.swiper-pagination',
    },
  });
}

// 打开英雄介绍
function openHeroDetail(id) {
  location.href = `/hero.html?id=${id}`;
}
