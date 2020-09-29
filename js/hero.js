let heroName = '';
let picUl = '';
let textUl = '';
let mingDiv = '';
let panelDiv = '';
let relaDiv = '';
let equipPanel = '';
let heroAbi = '';
let sumAbi = '';
let info = '';

window.onload = () => {
  adjustRem();
  getHeroDetail();
};

// 获取英雄详情
function getHeroDetail() {
  const obj = {
    id: querySearchParameter('id'),
  };
  const heroInfo = axios.post(
    'http://192.168.1.104:3000/api/wzry/getHeroDetail',
    obj
  );
  const item = axios.get('./assets/item.json');
  const ming = axios.get('./assets/ming.json');
  const summoner = axios.get('./assets/summoner.json');
  Promise.all([heroInfo, item, ming, summoner])
    .then(([heroData, itemData, mingData, sumData]) => {
      info = heroData.data.heroInfo;
      heroName = info.name;
      getForward();
      initHeader(heroData.data);
      initContentList1(
        heroData.data,
        itemData.data,
        mingData.data,
        sumData.data
      );
    })
    .catch((err) => {
      console.log(err);
    });
}

// 初始化头部
function initHeader(data) {
  const loc = {
    1: '战士',
    2: '法师',
    3: '坦克',
    4: '刺客',
    5: '射手',
    6: '辅助',
  };
  const location = info.location
    .split('/')
    .filter((val) => val)
    .map((val) => loc[val])
    .join('/');
  const skinlen = info.skinName.split('|').length;
  const headerDiv = `<div
  class="header"
  style="
    background-image: url(${info.avatar});
  "
>
  <div class="hero-attribute">
    <p class="hero-title">${info.title}</p>
    <p class="hero-name">${info.name}</p>
    <p class="hero-type">${location}</p>
    <div class="hero-cover">
      <ul class="cover-list">
        <li>难度<span class="hero-attrsp hero-attr4-${
          info.desc.difficulty
        }"></span></li>
        <li>技能<span class="hero-attrsp hero-attr3-${
          info.desc.ability
        }"></span></li>
        <li>攻击<span class="hero-attrsp hero-attr2-${
          info.desc.attack
        }"></span></li>
        <li>生存<span class="hero-attrsp hero-attr1-${
          info.desc.survival
        }"></span></li>
      </ul>
      <a href="https://pvp.qq.com/m/m201706/herodetail/skin.shtml?imgname=${escape(
        info.skinName
      )}&name=${info.heroId}">皮肤：${skinlen}></a>
    </div>
  </div>
</div>`;
  document.querySelector('.header-box').innerHTML = headerDiv;
}

// 初始化英雄初识
function initContentList1(heroData, itemData, mingData, sumData) {
  // 初始化技能列表
  initAbility(heroData);
  // 装备推荐
  initEquip(heroData, itemData);
  // 铭文推荐
  initMing(heroData, mingData);
  // 团战技巧
  initSkill(heroData);
  // 英雄关系
  initRelative(heroData);
  // 加点建议
  initSuggest(heroData, sumData);

  // 主干
  const list1 = `<div class="hero-video">
  <a href="${info.video}"
    ><i class="iconfont icon-link"></i>&nbsp;&nbsp;英雄介绍视频</a
  >
  <a href="https://pvp.qq.com/m/m201706/heropic-detail.shtml?hid=${info.heroId}"
    ><i class="iconfont icon-link"></i>&nbsp;&nbsp;一图识英雄</a
  >
</div>
<div class="ability-introduce-panel">
  <div class="panel-box">
    <ul class="ability">
      ${picUl}
    </ul>
    <ul class="ability-text">
      ${textUl}
    </ul>
  </div>
</div>
<div class="suggest-panel">
<div class="panel-box">
  <p class="suggest-title">
    <i class="iconfont icon-edit"></i> 加点建议
  </p>
  <div class="suggest-box">
    ${heroAbi}
    <div class="kael">
      <p class="up">召唤师技能</p>
      <div class="kael-ability">
        ${sumAbi}
      </div>
    </div>
  </div>
</div>
</div>
${equipPanel}
<div class="panel inscription-panel">
  <div class="panel-box">
    <p class="panel-title">
      <i class="iconfont icon-edit"></i> 铭文推荐
    </p>
    ${mingDiv}
  </div>
</div>
${panelDiv}
<div class="panel">
  <div class="panel-box">
    <p class="panel-title">
      <i class="iconfont icon-edit"></i>英雄关系
    </p>
    ${relaDiv}
  </div>
</div>`;
  document.querySelector('.content-list1').innerHTML = list1;
  document.querySelector('.hero-nav .li1').click();
}

// 获取进阶攻略数据
function getForward() {
  const video = jsonp(
    '//ams.qq.com/wmp/data/js/v3/WMP_PVP_WEBSITE_NEWBEE_DATA_V1.js',
    {
      param: 'callbackparam',
      name: 'newbee_hero_list_callback',
    }
  );
  const news = jsonp(
    '//ams.qq.com/wmp/data/js/v3/WMP_PVP_WEBSITE_DATA_18_V3.js',
    {
      param: 'callbackparam',
      name: 'web_hero_list_v3',
    }
  );
  Promise.all([video, news])
    .then(([videoData, newsData]) => {
      initContentList2(videoData.video, newsData);
    })
    .catch((err) => {
      console.log(err);
    });
}

// 初始化进阶攻略
function initContentList2(videoData, newsData) {
  let dataArr = [];
  let ul = '';
  // 获取newsData当前英雄数据
  const newsDataArr = Object.values(newsData).find(
    (ele) => ele.sTag == heroName
  ).jData;
  const videoDataArr = videoData[heroName].filter(
    (ele, index) => index >= videoData[heroName].length - 2
  );
  const dataArray = dataArr.concat(videoDataArr, newsDataArr);
  dataArray.forEach((ele) => {
    const id = ele.iVideoId || ele.iId;
    const img = ele.iVideoId
      ? `<img
    src="//game.gtimg.cn/images/yxzj/m/m201706/images/herodetail/video-img.png"
    alt=""
  />`
      : '';
    const video = ele.iVideoId ? 'detail' : 'newCont';
    const li = `<li>
  <a href="https://pvp.qq.com/m/m201606/${video}.shtml?G_Biz=18&tid=${id}">
    <div
      class="bgimg"
      style="
        background-image: url(${ele.sIMG});
      "
    >${img}
    </div>
    <div class="detail-text">
      <p class="title">${ele.sTitle}</p>
      <div class="text">
        <span class="iconfont icon-edit">${ele.iTotalPlay}</span>
        <span>${ele.sIdxTime.substring(0, 10)}</span>
      </div>
    </div>
  </a>
</li>`;
    ul += li;
  });
  document.querySelector('.content-list2 .strategy').innerHTML = ul;
}

// 转换列表
function toggleList(e) {
  const list1 = document.querySelector('.content-list1');
  const list2 = document.querySelector('.content-list2');
  const sp1 = document.querySelector('.hero-nav .sp1');
  const sp2 = document.querySelector('.hero-nav .sp2');
  const allspan = document.querySelectorAll('.hero-nav span');
  const slideContent = document.querySelector('.slide-content');
  const arr1 = ['sp1', 'li1'];
  const arr2 = ['sp2', 'li2'];
  if (arr1.includes(e.target.className)) {
    allspan.forEach((item) => {
      item.classList.remove('active');
    });
    sp1.classList.add('active');
    list2.classList.remove('active');
    list1.classList.add('active');
    slideContent.style.height = list1.scrollHeight + 'px';
  } else if (arr2.includes(e.target.className)) {
    allspan.forEach((item) => {
      item.classList.remove('active');
    });
    sp2.classList.add('active');
    list1.classList.remove('active');
    list2.classList.add('active');
    slideContent.style.height = list2.scrollHeight + 'px';
  }
}

// 转换技能介绍
function toggleAbility(e) {
  const index = e.target.getAttribute('index');
  const picLis = document.querySelectorAll(
    '.ability-introduce-panel .ability li'
  );
  const textLis = document.querySelectorAll(
    '.ability-introduce-panel .ability-text li'
  );
  picLis.forEach((ele) => ele.classList.remove('active'));
  textLis.forEach((ele) => ele.classList.remove('active'));
  e.target.classList.add('active');
  textLis[index - 1].classList.add('active');
}

// 调整rem
function adjustRem() {
  const htmlElem = document.documentElement;
  if (htmlElem) {
    const width = htmlElem.clientWidth;
    htmlElem.style.fontSize = (width / 375) * 100 + 'px';
  }
}

// 获取页面href的search值
function querySearchParameter(param) {
  const arr = location.search.substring(1).split('&');
  let result = '';
  for (let item of arr) {
    const [key, value] = item.split('=');
    if (key === param) {
      result = value;
      break;
    }
  }
  return result;
}

// 初始化技能介绍列表
function initAbility(heroData) {
  heroData.abilityIntro.forEach((ele, picindex) => {
    const active = picindex == 0 ? 'active' : '';
    const abilityId = picindex + '0';
    const picLi = `<li
      onclick="toggleAbility(event);"
      index="${picindex + 1}"
      class="${active}"
      style="
        background-image: url(//game.gtimg.cn/images/yxzj/img201606/heroimg/${
          info.heroId
        }/${info.heroId}${abilityId}.png);
      "
    ></li>`;
    const textLi = `<li class="ability-text-li ${active}">
        <p>
          <span class="title">${ele.name}&nbsp;&nbsp;&nbsp;&nbsp;</span
          ><span class="text">${ele.value}</span>
        </p>
        <p class="ability-detail">
          ${ele.desc}
        </p>
      </li>`;
    picUl += picLi;
    textUl += textLi;
  });
}

// 初始化装备推荐
function initEquip(heroData, itemData) {
  const equ = {
    0: '顺风出装',
    1: '逆风出装',
  };
  let equipment = heroData.equipment.map((ele) => ele.split('|'));
  equipPanel = `<div class="equip-panel">
  <div class="panel-box">
    <p class="panel-title">
      <i class="iconfont icon-edit"></i> 出装推荐
    </p>`;
  let equipRecom = '';
  equipment.forEach((elem, index) => {
    equipRecom = `<div class="equip-recommend">
    <p class="title2">${equ[index]}</p>
    <ul>`;
    elem.forEach((ele) => {
      const equName = itemData
        .filter((filEle) => filEle.item_id == ele)
        .map((mapEle) => mapEle.item_name);
      const EqLi = `<li>
    <span
      class="img"
      style="
        background-image: url(//game.gtimg.cn/images/yxzj/img201606/itemimg/${ele}.jpg);
      "
    ></span>
    <span>${equName}</span>
  </li>`;
      equipRecom += EqLi;
    });
    equipPanel += equipRecom + '</ul></div>';
  });
  equipPanel += `</div></div>`;
}

// 初始化铭文推荐
function initMing(heroData, mingData) {
  const ming = heroData.ming.split('|');
  mingDiv = `<div class="panel-list">`;
  ming.forEach((ele) => {
    let mingName = mingData
      .filter((mingEle) => mingEle.ming_id == ele)
      .map((mapEle) => [mapEle.ming_name, mapEle.ming_des])[0];
    const detail = `<div class="datail">
  <div
    class="img"
    style="
      background-image: url(//game.gtimg.cn/images/yxzj/img201606/mingwen/${ele}.png);
    "
  ></div>
  <p class="text">${mingName[0]}</p>
  ${mingName[1]}
  </div>`;
    mingDiv += detail;
  });
  mingDiv = mingDiv + '</div>';
}

// 初始化团战技巧
function initSkill(heroData) {
  const panelTitle = {
    0: '使用技巧',
    1: '对抗技巧',
    2: '团战思路',
  };
  heroData.skill.forEach((ele, index) => {
    const panel = `<div class="panel">
    <div class="panel-box">
      <p class="panel-title">
        <i class="iconfont icon-edit"></i> ${panelTitle[index]}
      </p>
      <p class="detail-text">
        ${ele.desc}
      </p>
    </div>
  </div>`;
    panelDiv += panel;
  });
}

// 初始化英雄关系
function initRelative(heroData) {
  const relTitle = {
    0: '最佳搭档',
    1: '被谁克制',
    2: '克制谁',
  };
  let div = '';
  heroData.relation.forEach((ele, index) => {
    div = `<p class="title2">${relTitle[index]}</p>
    <ul class="parner-ul">`;
    ele.list.forEach((elem) => {
      const relative = `
        <li>
          <div
            class="img"
            style="
              background-image: url(${elem.image});
            "
          ></div>
          <p class="datail-text">
          ${elem.text}
          </p>
        </li>`;
      div += relative;
    });
    div += '</ul>';
    relaDiv += div;
  });
}

// 初始化加点建议
function initSuggest(heroData, sumData) {
  const mainName = heroData.abilityIntro.filter(
    (ele) => ele.skillId == heroData.upAbility.main
  );
  const viceName = heroData.abilityIntro.filter(
    (ele) => ele.skillId == heroData.upAbility.vice
  );
  const nameArr = mainName.concat(viceName);
  const summoner = heroData.upAbility.summoner.split('|');
  const sumName = summoner.map((ele) =>
    sumData
      .filter((elem) => ele == elem.summoner_id)
      .map((item) => item.summoner_name)
  );
  const mainUp = {
    0: ['主升', 'main'],
    1: ['副升', 'sub'],
  };
  nameArr.forEach((ele, index) => {
    const main = `<div class="${mainUp[index][1]}-up">
    <span class="up">${mainUp[index][0]}</span
    ><span
      class="img"
      style="
        background-image: url(//game.gtimg.cn/images/yxzj/img201606/heroimg/${info.heroId}/${ele.skillId}.png);
      "
    ></span
    ><span class="ability-name">${ele.name}</span>
  </div>`;
    heroAbi += main;
  });
  sumName.forEach((ele, index) => {
    const sum = `<div class="ability${index + 1}">
  <span
    class="img"
    style="
      background-image: url(//game.gtimg.cn/images/yxzj/img201606/summoner/${
        summoner[index]
      }.jpg);
    "
  ></span>
  <span class="ability-name">${ele}</span>
  </div>`;
    sumAbi += sum;
  });
}
