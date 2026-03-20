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

// ----- BUKU UCAPAN ----- //
var currentOffset = 0;
var isLoading = false; // Guard agar tidak terjadi double fetch

function loadUcapan(isNew = false) {
  if (isLoading) return; // Jika sedang loading, jangan ambil data lagi
  isLoading = true;

  if (isNew) {
    currentOffset = 0;
    $("#daftar-ucapan").empty(); // Pastikan kontainer kosong total saat reset
  }

  $.ajax({
    type: "GET",
    url: "ambil_ucapan.php",
    data: { offset: currentOffset },
    dataType: "json",
    success: function (data) {
      var html = "";
      if (data && data.length > 0) {
        data.forEach(function (item) {
          var statusColor =
            item.kehadiran === "Hadir"
              ? "rgba(46, 204, 113, 0.4)"
              : "rgba(255, 255, 255, 0.2)";
          html += `
                    <div class="ucapan-card">
                        <div class="ucapan-header">
                            <h4 class="ucapan-nama">${item.nama}</h4>
                            <span class="ucapan-status" style="background: ${statusColor}">${item.kehadiran}</span>
                        </div>
                        <p class="ucapan-pesan">"${item.pesan}"</p>
                        <span class="ucapan-waktu"><i class="icon-clock"></i> ${item.created_at}</span>
                    </div>`;
        });

        if (isNew) {
          $("#daftar-ucapan").html(html); // Gunakan .html() untuk menimpa jika data baru
        } else {
          $("#daftar-ucapan").append(html); // Gunakan .append() hanya untuk load more
        }

        currentOffset += data.length;
        if (data.length === 5) {
          $("#btn-load-more").show();
        } else {
          $("#btn-load-more").hide();
        }
      } else {
        if (currentOffset === 0) {
          $("#daftar-ucapan").html(
            '<p class="text-center" style="color: #888;">Belum ada doa tertulis.</p>',
          );
        }
        $("#btn-load-more").hide();
      }
    },
    complete: function () {
      isLoading = false; // Buka kembali kunci loading
    },
  });
}

$(document).ready(function () {
  // Gunakan .off() sebelum .on() untuk memastikan handler tidak terpasang dua kali
  $("#form-ucapan")
    .off("submit")
    .on("submit", function (e) {
      e.preventDefault();

      var $btn = $(this).find('button[type="submit"]');
      $btn.prop("disabled", true).text("Mengirim..."); // Disable tombol agar tidak klik 2x

      var formData = {
        nama: $("#nama").val(),
        kehadiran: $("#kehadiran").val(),
        pesan: $("#pesan").val(),
      };

      $.ajax({
        type: "POST",
        url: "simpan_ucapan.php",
        data: formData,
        dataType: "json",
        success: function (response) {
          if (response.status === "success") {
            alert("Ucapan Berhasil Dikirim!");
            $("#form-ucapan")[0].reset();
            loadUcapan(true); // Reset daftar
          } else {
            alert("Gagal mengirim: " + response.message);
          }
        },
        error: function () {
          alert("Terjadi kesalahan sistem.");
        },
        complete: function () {
          $btn.prop("disabled", false).text("Kirim Ucapan");
        },
      });
    });

  // Inisialisasi awal
  loadUcapan();

  $("#btn-load-more").on("click", function () {
    loadUcapan();
  });
});
// ----- BUKU UCAPAN END ----- //

// ----- INVITATION RECEIVER ----- //
var url_string = window.location.href;
var url = new URL(url_string);
var receiver = url.searchParams.get("kepada") || "Nama Undangan";
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
// document.addEventListener("DOMContentLoaded", () => {
//   const lightbox = document.getElementById("lightbox");
//   const lbImg = document.getElementById("lightbox-img");
//   const lbCaption = document.getElementById("lightbox-caption");
//   const closeBtn = lightbox.querySelector(".close");

//   function openLightbox(trigger) {
//     const img = trigger.querySelector("img");
//     const bigSrc = trigger.dataset.large || img.src; // pakai data-large kalau ada
//     lbImg.src = bigSrc;
//     lbCaption.textContent = trigger.dataset.caption || img.alt;
//     lightbox.classList.add("open");
//     document.body.style.overflow = "hidden";
//   }

//   function closeLightbox() {
//     lightbox.classList.remove("open");
//     document.body.style.overflow = "";
//     lbImg.src = "";
//   }

//   document.addEventListener("click", (e) => {
//     const parent = e.target.closest(".clickable-parent");
//     if (parent) {
//       openLightbox(parent);
//       return;
//     }
//     if (e.target === lightbox || e.target.classList.contains("close")) {
//       closeLightbox();
//     }
//   });
// });
