export const timeToNow = (time) => {
  const t = parseFloat(new Date - new Date(time)) / 1000;
  let str;
  if (t) {
    if (t > 60 && t < 3600) {
      str = `${parseInt(t / 60.0, 10)}分钟前`;
    } else if (t >= 3600 && t < 86400) {
      str = `${parseInt(t / 3600.0, 10)}小时前`;
    } else if (t >= 86400 && t < 86400 * 30) {
      str = `${parseInt(t / 86400.0, 10)}天前`;
    } else if (t >= 86400 * 30 && t < 86400 * 365) {
      str = `${parseInt(t / (86400.0 * 30), 10)}个月前`;
    } else if (t >= 86400 * 365) {
      str = `${parseInt(t / (86400.0 * 365), 10)}年前`;
    } else {
      str = `${parseInt(t, 10)}秒前`;
    }
  }
  return str;
};


export const timeToUpdata = (time) => {
  const t = time.split('T');
  return `${t[0]}  ${t[1].slice(0, 8)}`;
};


export const transTab = (tab) => {
  let str;
  switch (tab) {
    case 'good':
      str = '精华';
      break;
    case 'share':
      str = '分享';
      break;
    case 'job':
      str = '招聘';
      break;
    case 'ask':
      str = '问答';
      break;
    default:
  }
  return str;
};


export const myblog = (num) => {
  let str;
  switch (num) {
    case 5:
      str = '我';
      break;
    case 4:
      str = '我的';
      break;
    case 3:
      str = '我的博';
      break;
    case 2:
      str = '我的博客';
      break;
    case 1:
      str = '我的博客!';
      break;
    default:
  }
  return str;
};
