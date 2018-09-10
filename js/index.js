/**
 * Created by 前端-朱晔雯 on 2017/12/26.
 */
$(function () {
  //新闻公告滚动条
  $lis = $('.carousel ul li');
  $('.carousel ul').append($lis[0].cloneNode(true));
  var index = 0;
  var timer = null;
  timer = setInterval(function () {
    $('.carousel ul').on('transitionend', function () {
      if (index >= $lis.length) {
        index = 0;
        $('.carousel ul').css('transition', 'none');
        $('.carousel ul').css('transform', 'translateX(' + 0);
      }
    })
    index++;
    $('.carousel ul').css('transition', 'transform 1s');
    $('.carousel ul').css('transform', 'translateX(' + (-index * $lis[0].offsetWidth) + 'px)')
  }, 2000);
  
  
  //点击活动说明显示详细活动说明
  //显示详细活动禁止页面滑动
  var flag = 1;//可滑动
  $('.des').on('click', function () {
    $('.container').css('display', 'block');
    flag = 0;//不可滑动
    document.addEventListener('touchmove', function (e) {
      if (flag = 0) {
        e.preventDefault()
      }
    })
  })
  
  //关闭详细活动说明
  $('.close').on('click', function () {
    $('.container').css('display', 'none');
    flag = 1;//可滑动
  })
  
  //买标献爱心
  $('.banner .icon').on('click', function () {
    $('body,html').animate({'scrollTop': 1690}, 1000);
  })
  
  //初始化数据
  var pages = 1;  //初始化pages
  var flags = false;  //ajax获取判断是否要加载
  $('.nulls').hide();
  $('.loding').hide();
  $.ajax({
    url: "/charity/list",
    type: "get",
    dataType: "json",
    data: {
      'page': pages
    },
    success: function (data) {
      console.log(data);
      //新闻公告数据渲染
      var newsArr = data.result.news;
      for (var i = 0; i < newsArr.length; i++) {
        $('.carousel ul').append("<li>" + newsArr[i] + "</li>");
      }
      
      
      //金额数据渲染
      var fundStr = (data.result.fund).toString();
      var fundArr = fundStr.split('').reverse();
      for (var i = fundArr.length; i < 7; i++) {
        fundArr.push(0);
      }
      fundArr.reverse();
      console.log(fundArr);
      for (var i = 0; i < fundArr.length; i++) {
        $('.fund span').eq(i + 1).html(fundArr[i]);
        //金额动态效果
        $('.fund span').eq(i + 1).numberRock({
          speed: 100,//数字越大数字滚动速度越慢
          count: fundArr[i]//最终停留数字
        })
      }
      //商品列表渲染
      var strs = '';
      $.each(data.result.list, function (idx, val) {
        strs +=
          "<li>" +
          "<a href='http://m.86sb.com/detail.php?id=" + val.id + "'>" +
          "<div class='img f-left'><img src='" + val.sbpic + "'></div>" +
          "<span class='name'>" + val.sbname + "</span>" +
          "<span class='lei'>" + val.className + "</span>" +
          "<p class='help'>赞助方：<span>" + val.sbcontact + "</span></p>" +
          "<p class='fund'>￥<span>" + val.sbprice + "</span>元</p>" +
          "<button>买标献爱心</button>" +
          "</a>" +
          "</li>"
      });
      $('.prolist .list').html(strs);
      flags = true;
    }
  })
  
  $(window).scroll(function () {
    if ($(document).scrollTop() >= $(document).height() - $(window).height())  {
      if (flags) {
        flags = false;
        $('.loding').show();
        pages++;
        $.ajax({
          type: 'get',
          url: "/charity/list",
          data: {
            'page': pages
          },
          dataType: "json",
          success: function (data) {
            if (data.status == 0) {
              $('.loding').hide();
              var strs = '';
              $.each(data.result.list, function (idx, val) {
                strs +=
                  "<li>" +
                  "<a href='http://m.86sb.com/detail.php?id=" + val.id + "'>" +
                  "<div class='img f-left'><img src='" + val.sbpic + "'></div>" +
                  "<span class='name'>" + val.sbname + "</span>" +
                  "<span class='lei'>" + val.className + "</span>" +
                  "<p class='help'>赞助方：<span>" + val.sbcontact + "</span></p>" +
                  "<p class='fund'>￥<span>" + val.sbprice + "</span>元</p>" +
                  "<button>买标献爱心</button>" +
                  "</a>" +
                  "</li>"
              });
              $('.prolist .list').append(strs);
              flags = true
            } else {
              $('.loding').hide();
              $('.nulls').show();
            }
          }
        });
      }
    }
  });
  
  
})