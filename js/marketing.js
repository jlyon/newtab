$(function () {
  count = 0;
  wordsArray = ["go on Facebook", "read the news", "check your email", "stream a rom-com", "shop"];
  setInterval(function () {
    count++;
    $("#word").fadeOut(400, function () {
      $(this).text(wordsArray[count % wordsArray.length]).fadeIn(400);
    });
  }, 4000);
});
