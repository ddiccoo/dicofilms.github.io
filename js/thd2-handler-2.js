/*
 * PUTU MAHA GIRINDA PRABA
 * mailto:mahagirinda@gmail.com
 */

// ----- CENTER MODAL LAUNCH ----- //
(function ($) {
  "use strict";
  function centerModal() {
    $(this).css("display", "block");
    var $dialog = $(this).find(".modal-dialog"),
      offset = ($(window).height() - $dialog.height()) / 2,
      bottomMargin = parseInt($dialog.css("marginBottom"), 10);

    if (offset < bottomMargin) offset = bottomMargin;
    $dialog.css("margin-top", offset - 10);
  }

  $(document).on("show.bs.modal", ".modal", centerModal);
  $(window).on("resize", function () {
    $(".modal:visible").each(centerModal);
  });
})(jQuery);

// ----- SCROLLING HANDLER ----- //
disableScroll();
document.getElementById("btn-lihat-undangan").onclick = function () {
  enableScroll();
  setTimeout(function () {
    $("#greeting-icon").tooltip("show");
  }, 7000);
  setTimeout(function () {
    $("#greeting-icon").tooltip("hide");
  }, 30000);
};

function disableScroll() {
  let scrollTop = document.documentElement.scrollTop;
  let scrollLeft = document.documentElement.scrollLeft;

  window.onscroll = function () {
    window.scrollTo(scrollLeft, scrollTop);
  };
}

function enableScroll() {
  window.onscroll = function () {};
}

// ----- MUSIC PLAYBACK HANDLER ----- //
var sound = document.getElementById("bg-music");
var audioIcon = document.getElementById("audio-icon");
var fileKey = "1M_yLOFr9wUTgLrtzgoiI2eb_zIIMiIFA";

var dynamicApiKey = null;

const CACHE_NAME = "audio-cache-v1";

function getDynamicKey() {
  return new Promise((resolve, reject) => {
    if (dynamicApiKey) {
      resolve(dynamicApiKey);
      return;
    }
    $.ajax({
      url: "https://cdn.twohearts.id/service/get-dynamic-key.php",
      type: "GET",
      dataType: "json",
      success: function (data) {
        if (data && data.key) {
          dynamicApiKey = data.key;
          resolve(dynamicApiKey);
        } else {
          reject("Format kunci dinamis tidak valid.");
        }
      },
      error: function (jqXHR, textStatus, errorThrown) {
        console.error(
          "Error fetching the dynamic key:",
          textStatus,
          errorThrown,
        );
        reject("Gagal mengambil kunci dinamis.");
      },
    });
  });
}

function loadAudio() {
  return new Promise(async (resolve, reject) => {
    const cacheKey = `audio-${fileKey}`;

    if (!("caches" in window)) {
      console.warn(
        "Cache API tidak didukung di browser ini. Memuat langsung dari sumber.",
      );
      try {
        const apiKey = await getDynamicKey();
        sound.src = `https://www.googleapis.com/drive/v3/files/${fileKey}?alt=media&key=${apiKey}&v=.mp3`;
        sound.loop = true;
        resolve();
      } catch (error) {
        reject(error);
      }
      return;
    }

    try {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(cacheKey);

      if (cachedResponse) {
        console.log("[loadAudio] music file loaded from cache.");
        const audioBlob = await cachedResponse.blob();
        sound.src = URL.createObjectURL(audioBlob);
        sound.loop = true;
        resolve();
        return;
      }

      const apiKey = await getDynamicKey();
      const audioUrl = `https://www.googleapis.com/drive/v3/files/${fileKey}?alt=media&key=${apiKey}&v=.mp3`;

      const networkResponse = await fetch(audioUrl);
      if (!networkResponse.ok) {
        throw new Error(
          `Gagal mengambil audio: ${networkResponse.statusText} (status: ${networkResponse.status})`,
        );
      }

      await cache.put(cacheKey, networkResponse.clone());
      console.log("[loadMusic] music file loaded to cache.");

      const audioBlob = await networkResponse.blob();
      sound.src = URL.createObjectURL(audioBlob);
      sound.loop = true;
      resolve();
    } catch (error) {
      console.error("Error load audio:", error);
      reject(error);
    }
  });
}

let audioReadyPromise = loadAudio();

$(document).ready(function () {
  $("#modal-launch").modal({
    backdrop: "static",
    keyboard: false,
  });

  $("#btn-lihat-undangan").click(function () {
    audioReadyPromise
      .then(() => {
        playAudio();
      })
      .catch((error) => {
        console.warn("Error play music on click :", error);
      });
  });

  sound.addEventListener("canplaythrough", function () {
    if (!sound.paused) {
      audioIcon.setAttribute("class", "icon-pause");
    } else {
      audioIcon.setAttribute("class", "icon-music");
    }
  });

  sound.addEventListener("error", function (e) {
    console.error("Error pada elemen audio:", e);
    const cacheKey = `audio-${fileKey}`;
    caches.open(CACHE_NAME).then((cache) => {
      cache.delete(cacheKey).then((deleted) => {
        if (deleted) console.log("[loadMusic] broken cache has been deleted.");
      });
    });
    audioIcon.setAttribute("class", "icon-music");
  });

  function playAudio() {
    audioReadyPromise
      .then(() => {
        if (!sound.src || sound.src === window.location.href) {
          console.warn("Sumber audio belum diatur. Tidak bisa memutar.");
          return;
        }

        if (!sound.paused) {
          sound.pause();
          audioIcon.setAttribute("class", "icon-music");
        } else {
          sound
            .play()
            .then(() => {
              audioIcon.setAttribute("class", "icon-pause");
            })
            .catch((error) => {
              console.warn("Error saat memutar audio:", error);
              audioIcon.setAttribute("class", "icon-music");
            });
        }
      })
      .catch((error) => {
        console.warn(
          "Tidak dapat memutar musik karena proses pemuatan gagal:",
          error,
        );
        audioIcon.setAttribute("class", "icon-music");
      });
  }

  $("#music-button").on("click", function () {
    playAudio();
  });

  audioReadyPromise
    .then(() => {
      if (sound.paused) {
        audioIcon.setAttribute("class", "icon-music");
      } else {
        audioIcon.setAttribute("class", "icon-pause");
      }
    })
    .catch(() => {
      audioIcon.setAttribute("class", "icon-music");
    });
});

// ----- VISITORS DATA HANDLER ----- //
$(document).ready(function () {
  const defaultShowNumber = 6;
  const maxShowNumber = 999;

  var isHidden = true;
  initShowButton();
  loadCounter();
  loadData(defaultShowNumber);

  $(".receiver, .receiver-label, .arrow, .bounce").click(function () {
    $([document.documentElement, document.body]).animate(
      {
        scrollTop: $("#thd-couple").offset().top,
      },
      700,
    );
  });

  $("#btn-show").click(function () {
    isHidden = false;
    loadData(maxShowNumber);
    $("#button-show-all").hide();
    $("#button-show-less").show();
  });

  $("#btn-hide").click(function () {
    isHidden = true;
    loadData(defaultShowNumber);
    $("#button-show-all").show();
    $("#button-show-less").hide();
  });

  $("#form-tamu-undangan").on("submit", function (e) {
    e.preventDefault();
    $("#preview-nama").text($("#input-nama").val());
    $("#preview-alamat").text($("#input-alamat").val());
    $("#preview-ucapan").text($("#input-ucapan").val());
    $("#preview-tanggal").text(formatDate(new Date()));
    $("#modal-preview-submit").modal("show");
  });

  $("#button-confirm").on("click", function (e) {
    e.preventDefault();
    $.ajax({
      async: false,
      url: "features/service.php?action=save",
      type: "post",
      data: $("#form-tamu-undangan").serialize(),
      success: function (data) {
        if (data === "true") {
          $("#nama-modal").text($("#input-nama").val());
          $("#modal-after-submit").modal("show");

          $("#input-kehadiran").prop("disabled", true);
          $("#input-nama").prop("disabled", true);
          $("#input-ucapan").val("");
          $("#input-ucapan").prop("disabled", true);
          $("#input-alamat").val("");
          $("#input-alamat").prop("disabled", true);
          $("#input-submit").prop("disabled", true);
          isHidden ? loadData(defaultShowNumber) : loadData(maxShowNumber);
          initShowButton();
          loadCounter();
        } else {
          $("#error_detail").html(data);
          $("#modal-after-failed").modal("show");
        }
      },
      error: function (data) {
        $("#error_detail").html(data);
        $("#modal-after-failed").modal("show");
      },
    });
  });

  $(document).delegate(
    "[data-target='#modal-preview-reply']",
    "click",
    function () {
      $("#modal-preview-reply").modal("show");
      var parentId = $(this).attr("data-id");

      $("#id_parent").val(parentId);
      $("#preview-reply-nama").html($(this).attr("data-nama"));
      $("#preview-reply-ucapan").html($(this).attr("data-ucapan"));
    },
  );

  $("#form-reply-tamu-undangan").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      async: false,
      url: "features/service.php?action=reply",
      type: "post",
      data: $("#form-reply-tamu-undangan").serialize(),
      success: function (data) {
        if (data === "true") {
          $("#modal-preview-reply").modal("hide");
          $("#input-reply-ucapan").val("");
          isHidden ? loadData(defaultShowNumber) : loadData(maxShowNumber);
        } else {
          $("#error_detail").html(data);
          $("#modal-after-failed").modal("show");
        }
      },
      error: function (data) {
        $("#error_detail").html(data);
        $("#modal-after-failed").modal("show");
      },
    });
  });

  function initShowButton() {
    $("#button-show-all").hide();
    $("#button-show-less").hide();
    $.ajax({
      url: "features/service.php?action=count",
      type: "post",
      success: function (jumlahUndangan) {
        if (jumlahUndangan > defaultShowNumber) {
          $("#button-show-all").show();
          $("#count-undangan").text(
            "(" + (jumlahUndangan - defaultShowNumber) + ")",
          );
        }
      },
    });
  }

  function loadData(limit) {
    if (location.hostname === "localhost") {
      $("#data-undangan").html("");
      console.log("[loadData] localhost");
      return;
    }
    $.ajax({
      url: "features/data-undangan.php?limit=" + limit,
      type: "get",
      async: false,
      success: function (data) {
        $("#data-undangan").html(data);
      },
    });
  }

  function loadCounter() {
    if (location.hostname === "localhost") {
      $("#data-counter-hadir").text("0");
      $("#data-counter-tidak-hadir").text("0");
      $("#data-counter-ragu").text("0");
      console.log("[loadCounter] localhost");
      return;
    }
    $.ajax({
      url: "features/service.php?action=counter",
      type: "get",
      async: false,
      success: function (data) {
        var response = JSON.parse(data);
        $("#data-counter-hadir").text(response.hadir);
        $("#data-counter-tidak-hadir").text(response.tidak_hadir);
        $("#data-counter-ragu").text(response.ragu);
      },
    });
  }

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  function formatDate(date) {
    var d = new Date(date),
      month = d.getMonth(),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return (
      [day, months[month], year].join(" ") +
      " - " +
      [d.getHours(), d.getMinutes()].join(":")
    );
  }
});

// ----- FOOTER LINK COUNTER ----- //
var resellCode = "Customers";
$(".footer-icon").on("click", function () {
  var linkId = $(this).attr("id");
  if (!linkId) linkId = $(this).parent().attr("id");
  var media = linkId.split("-")[2];

  $.ajax({
    url:
      "features/service.php?action=resell&resellCode=" +
      encodeURIComponent(resellCode) +
      "&media=" +
      media,
    type: "post",
    async: true,
    success: function (data) {
      console.log("Recorded with return : " + data);
    },
  });
});

// ----- INVITATION RECEIVER ----- //
var url_string = window.location.href;
var url = new URL(url_string);
var receiver = url.searchParams.get("kepada");

if (receiver === "" || receiver == null) {
  $(".receiver-label").remove();
  $(".receiver").remove();
  $(".arrow").css("margin-top", "18vh");
} else {
  $(".receiver").text(receiver);
  $("#input-nama").val(receiver);
}

// ----- DATE COUNTER ----- //
//var end = new Date('09/28/2025 02:00 PM');
var end = new Date();
end.setDate(end.getDate() + 30);

var _second = 1000;
var _minute = _second * 60;
var _hour = _minute * 60;
var _day = _hour * 24;
var timer;

function showRemaining() {
  var now = new Date();
  var distance = end - now;
  var days = Math.floor(distance / _day);
  var hours = Math.floor((distance % _day) / _hour);
  var minutes = Math.floor((distance % _hour) / _minute);
  var seconds = Math.floor((distance % _minute) / _second);

  // CURRENT DAYS OR MORE TO 0
  if (days < 0) days = 0;
  if (hours < 0) hours = 0;
  if (minutes < 0) minutes = 0;
  if (seconds < 0) seconds = 0;

  document.getElementById("days").innerHTML = days;
  document.getElementById("hours").innerHTML = hours;
  document.getElementById("minutes").innerHTML = minutes;
  document.getElementById("seconds").innerHTML = seconds;
}
timer = setInterval(showRemaining, 1000);

// ----- SAVE TO CALENDAR ----- //
function saveEvent() {
  const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Two Hearts ID//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
UID:mahagirinda@twohearts.id
DTSTART:20250928T060000Z
DTEND:20250928T160000Z
SUMMARY:Maha & Yuni Weddings
LOCATION:Br. Petiles, Antosari, Kec. Selemadeg Barat, Kabupaten Tabanan, Bali
DESCRIPTION:Maha & Yuni Weddings
URL:https://invitation.twohearts.id/maha-yuni
BEGIN:VALARM
ACTION:DISPLAY
DESCRIPTION:Maha & Yuni Weddings
TRIGGER:-P3D
END:VALARM
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  window.location.href = url;
}

// ----- CLICKABLE IMAGE ----- //
document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lightbox-img");
  const lbCaption = document.getElementById("lightbox-caption");
  const closeBtn = lightbox.querySelector(".close");

  function openLightbox(trigger) {
    const img = trigger.querySelector("img");
    const bigSrc = trigger.dataset.large || img.src; // pakai data-large kalau ada
    lbImg.src = bigSrc;
    lbCaption.textContent = trigger.dataset.caption || img.alt;
    lightbox.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeLightbox() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
    lbImg.src = "";
  }

  document.addEventListener("click", (e) => {
    const parent = e.target.closest(".clickable-parent");
    if (parent) {
      openLightbox(parent);
      return;
    }
    if (e.target === lightbox || e.target.classList.contains("close")) {
      closeLightbox();
    }
  });
});
