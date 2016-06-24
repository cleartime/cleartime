/**
 * Created by gxx on 16/6/22.
 */

/* 通过createXHR()函数创建一个XHR对象 */

function createXHR() {

  /* IE7+、Firefox、Opera、Chrome 和Safari */

  if (window.XMLHttpRequest) {
    return new XMLHttpRequest();

    /* IE6 及以下 */

  } else if (window.ActiveXObject) {
    var versions = ['MSXML2.XMLHttp', 'Microsoft.XMLHTTP'];
    for (var i = 0, len = versions.length; i < len; i++) {
      try {
        return new ActiveXObject(version[i]);
        break;
      } catch (e) {

        /* 跳过 */

      }
    }
  } else {
    throw new Error('浏览器不支持XHR对象！');
  }
}

/* 封装ajax，参数为一个对象 */

 function ajax(obj) {
  var xhr = createXHR();

   /* 创建XHR对象
    * 通过使用JS随机字符串解决IE浏览器第二次默认获取缓存的问题
    */

  obj.url = obj.url + '?rand=' + Math.random();

   /* 通过params()将名值对转换成字符串 */

  obj.data = params(obj.data);

  /* 若是GET请求，则将数据加到url后面 */

  if (obj.method === 'get') {
    obj.url += obj.url.indexOf('?') == -1 ? '?' + obj.data : '&' + obj.data;
  }

   /* true表示异步，false表示同步 */

  if (obj.async === true) {

    /* 使用异步调用的时候，需要触发readystatechange 事件 */

    xhr.onreadystatechange = function () {

      /* 判断对象的状态是否交互完成 */

      if (xhr.readyState == 4) {

        /* 回调 */

        callback();
      }
    };
  }

  /* 在使用XHR对象时，必须先调用open()方法，
   * 它接受三个参数：请求类型(get、post)、请求的URL和表示是否异步。
   */

  xhr.open(obj.method, obj.url, obj.async);
  if (obj.method === 'post') {

    /* post方式需要自己设置http的请求头，来模仿表单提交。
     * 放在open方法之后，send方法之前。
     */
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

    /* post方式将数据放在send()方法里 */

    xhr.send(obj.data);
  } else {

    /* get方式则填null */

    xhr.send(null);
  }

   /* 同步 */
  if (obj.async === false) {
    callback();
  }
  function callback() {

    /* 判断http的交互是否成功，200表示成功 */
    if (xhr.status == 200) {

      /* 回调传递参数 */
      obj.success(xhr.responseText);
    } else {
      alert('获取数据错误！错误代号：' + xhr.status + '，错误信息：' + xhr.statusText);
    }
  }
}
/* 名值对转换为字符串 */
function params(data) {
  var arr = [];
  for (var i in data) {

    /* 特殊字符传参产生的问题可以使用encodeURIComponent()进行编码处理 */
    arr.push(encodeURIComponent(i) + '=' + encodeURIComponent(data[i]));
  }
  return arr.join('&');
}

export default function () {
  console.log('foo')
}
