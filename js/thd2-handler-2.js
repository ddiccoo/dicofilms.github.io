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

// ----- SCROLLING HANDLER PERBAIKAN ----- //
function disableScroll() {
  // Mengunci scroll dengan CSS agar lebih stabil di mobile & desktop
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";
}

function enableScroll() {
  // Mengembalikan fungsi scroll
  document.body.style.overflow = "auto";
  document.documentElement.style.overflow = "auto";
  // Menghapus paksaan onscroll jika ada sisa fungsi lama
  window.onscroll = null;
}

// Inisialisasi awal: Kunci layar
disableScroll();

// Event Listener khusus untuk tombol "Lihat Undangan"
$(document).ready(function () {
  $("#btn-lihat-undangan").on("click", function (e) {
    e.preventDefault(); // Mencegah aksi default

    enableScroll(); // Buka kunci layar

    // Logika tambahan untuk tooltip (sesuai kode asli Anda)
    setTimeout(function () {
      $("#greeting-icon").tooltip("show");
    }, 7000);
    setTimeout(function () {
      $("#greeting-icon").tooltip("hide");
    }, 20000);
  });
});

// ----- FUNGSI SMOOTH SCROLL UNTUK ARROW BOUNCE ----- //
$(document).ready(function () {
  $(".tc-bottom").on("click", function (event) {
    // Pastikan ID 'konten-utama' sesuai dengan ID yang Anda buat di index.html
    var target = $("#home"); // Anda juga bisa langsung menargetkan class section pertama

    if (target.length) {
      event.preventDefault();
      $("html, body").animate(
        {
          scrollTop: target.offset().top,
        },
        1000, // Kecepatan scroll dalam milidetik (1000ms = 1 detik)
        "easeInOutExpo", // Efek transisi (memerlukan jQuery Easing yang sudah ada di file Anda)
      );
    }
  });

  // Tambahkan kursor pointer agar user tahu itu bisa diklik
  $(".tc-bottom").css("cursor", "pointer");
});

// ----- MUSIC PLAYBACK HANDLER ----- //
var sound = document.getElementById("bg-music");
var audioIcon = document.getElementById("audio-icon");

$(document).ready(function () {
  // Fungsi untuk Play/Pause
  function toggleAudio() {
    if (sound.paused) {
      sound.play();
      audioIcon.setAttribute("class", "icon-pause");
    } else {
      sound.pause();
      audioIcon.setAttribute("class", "icon-music");
    }
  }

  // Putar musik saat tombol 'Lihat Undangan' diklik
  $("#btn-lihat-undangan").click(function () {
    sound.play();
    audioIcon.setAttribute("class", "icon-pause");
  });

  // Kontrol tombol musik manual
  $("#music-button").on("click", function () {
    toggleAudio();
  });
});

// ----- VISITORS DATA HANDLER ----- //
// $(document).ready(function () {
//   const defaultShowNumber = 6;
//   const maxShowNumber = 999;

//   var isHidden = true;
//   initShowButton();
//   loadCounter();
//   loadData(defaultShowNumber);

//   $(".receiver, .receiver-label, .arrow, .bounce").click(function () {
//     $([document.documentElement, document.body]).animate(
//       {
//         scrollTop: $("#thd-couple").offset().top,
//       },
//       700,
//     );
//   });

//   $("#btn-show").click(function () {
//     isHidden = false;
//     loadData(maxShowNumber);
//     $("#button-show-all").hide();
//     $("#button-show-less").show();
//   });

//   $("#btn-hide").click(function () {
//     isHidden = true;
//     loadData(defaultShowNumber);
//     $("#button-show-all").show();
//     $("#button-show-less").hide();
//   });

//   $("#form-tamu-undangan").on("submit", function (e) {
//     e.preventDefault();
//     $("#preview-nama").text($("#input-nama").val());
//     $("#preview-alamat").text($("#input-alamat").val());
//     $("#preview-ucapan").text($("#input-ucapan").val());
//     $("#preview-tanggal").text(formatDate(new Date()));
//     $("#modal-preview-submit").modal("show");
//   });

//   $("#button-confirm").on("click", function (e) {
//     e.preventDefault();
//     $.ajax({
//       async: false,
//       url: "features/service.php?action=save",
//       type: "post",
//       data: $("#form-tamu-undangan").serialize(),
//       success: function (data) {
//         if (data === "true") {
//           $("#nama-modal").text($("#input-nama").val());
//           $("#modal-after-submit").modal("show");

//           $("#input-kehadiran").prop("disabled", true);
//           $("#input-nama").prop("disabled", true);
//           $("#input-ucapan").val("");
//           $("#input-ucapan").prop("disabled", true);
//           $("#input-alamat").val("");
//           $("#input-alamat").prop("disabled", true);
//           $("#input-submit").prop("disabled", true);
//           isHidden ? loadData(defaultShowNumber) : loadData(maxShowNumber);
//           initShowButton();
//           loadCounter();
//         } else {
//           $("#error_detail").html(data);
//           $("#modal-after-failed").modal("show");
//         }
//       },
//       error: function (data) {
//         $("#error_detail").html(data);
//         $("#modal-after-failed").modal("show");
//       },
//     });
//   });

//   $(document).delegate(
//     "[data-target='#modal-preview-reply']",
//     "click",
//     function () {
//       $("#modal-preview-reply").modal("show");
//       var parentId = $(this).attr("data-id");

//       $("#id_parent").val(parentId);
//       $("#preview-reply-nama").html($(this).attr("data-nama"));
//       $("#preview-reply-ucapan").html($(this).attr("data-ucapan"));
//     },
//   );

//   $("#form-reply-tamu-undangan").on("submit", function (e) {
//     e.preventDefault();
//     $.ajax({
//       async: false,
//       url: "features/service.php?action=reply",
//       type: "post",
//       data: $("#form-reply-tamu-undangan").serialize(),
//       success: function (data) {
//         if (data === "true") {
//           $("#modal-preview-reply").modal("hide");
//           $("#input-reply-ucapan").val("");
//           isHidden ? loadData(defaultShowNumber) : loadData(maxShowNumber);
//         } else {
//           $("#error_detail").html(data);
//           $("#modal-after-failed").modal("show");
//         }
//       },
//       error: function (data) {
//         $("#error_detail").html(data);
//         $("#modal-after-failed").modal("show");
//       },
//     });
//   });

//   function initShowButton() {
//     $("#button-show-all").hide();
//     $("#button-show-less").hide();
//     $.ajax({
//       url: "features/service.php?action=count",
//       type: "post",
//       success: function (jumlahUndangan) {
//         if (jumlahUndangan > defaultShowNumber) {
//           $("#button-show-all").show();
//           $("#count-undangan").text(
//             "(" + (jumlahUndangan - defaultShowNumber) + ")",
//           );
//         }
//       },
//     });
//   }

//   function loadData(limit) {
//     if (location.hostname === "localhost") {
//       $("#data-undangan").html("");
//       console.log("[loadData] localhost");
//       return;
//     }
//     $.ajax({
//       url: "features/data-undangan.php?limit=" + limit,
//       type: "get",
//       async: false,
//       success: function (data) {
//         $("#data-undangan").html(data);
//       },
//     });
//   }

//   function loadCounter() {
//     if (location.hostname === "localhost") {
//       $("#data-counter-hadir").text("0");
//       $("#data-counter-tidak-hadir").text("0");
//       $("#data-counter-ragu").text("0");
//       console.log("[loadCounter] localhost");
//       return;
//     }
//     $.ajax({
//       url: "features/service.php?action=counter",
//       type: "get",
//       async: false,
//       success: function (data) {
//         var response = JSON.parse(data);
//         $("#data-counter-hadir").text(response.hadir);
//         $("#data-counter-tidak-hadir").text(response.tidak_hadir);
//         $("#data-counter-ragu").text(response.ragu);
//       },
//     });
//   }

//   const months = [
//     "Jan",
//     "Feb",
//     "Mar",
//     "Apr",
//     "May",
//     "Jun",
//     "Jul",
//     "Aug",
//     "Sep",
//     "Oct",
//     "Nov",
//     "Dec",
//   ];
//   function formatDate(date) {
//     var d = new Date(date),
//       month = d.getMonth(),
//       day = "" + d.getDate(),
//       year = d.getFullYear();

//     if (month.length < 2) month = "0" + month;
//     if (day.length < 2) day = "0" + day;

//     return (
//       [day, months[month], year].join(" ") +
//       " - " +
//       [d.getHours(), d.getMinutes()].join(":")
//     );
//   }
// });

// ----- FOOTER LINK COUNTER ----- //
// var resellCode = "Customers";
// $(".footer-icon").on("click", function () {
//   var linkId = $(this).attr("id");
//   if (!linkId) linkId = $(this).parent().attr("id");
//   var media = linkId.split("-")[2];

//   $.ajax({
//     url:
//       "features/service.php?action=resell&resellCode=" +
//       encodeURIComponent(resellCode) +
//       "&media=" +
//       media,
//     type: "post",
//     async: true,
//     success: function (data) {
//       console.log("Recorded with return : " + data);
//     },
//   });
// });

// ----- INVITATION RECEIVER ----- //
var url_string = window.location.href;
var url = new URL(url_string);
var receiver = url.searchParams.get("kepada") || "Kontol";
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
