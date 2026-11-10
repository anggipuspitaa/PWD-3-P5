// ===== 1. OBJECT DAN ARRAY =====

// Produk 1 dan 2: object literal { }
var produk1 = { id: 1, nama: "Buku Tulis A5", harga: 8000, stok: 10 };
var produk2 = { id: 2, nama: "Pulpen Gel Hitam", harga: 5000, stok: 15 };

// Produk 3: new Object()
var produk3 = new Object();
produk3.id = 3;
produk3.nama = "Pensil 2B";
produk3.harga = 3000;
produk3.stok = 20;

var produk4 = { id: 4, nama: "Penghapus Putih", harga: 2500, stok: 0 }; // sengaja habis
var produk5 = { id: 5, nama: "Penggaris 30 cm", harga: 6000, stok: 3 };

// Array of object: daftar produk
var daftarProduk = [produk1, produk2, produk3, produk4, produk5];

// Array terpisah: isi keranjang (setiap entri = satu unit produk)
var keranjang = [];

// ===== Fungsi bantu =====
function rupiah(angka) {
  return "Rp " + angka.toLocaleString("id-ID");
}

function cariProduk(id) {
  for (var i = 0; i < daftarProduk.length; i++) {
    if (daftarProduk[i].id === id) {
      return daftarProduk[i];
    }
  }
  return null;
}

// ===== 2. DOM SELECTION =====
var wadahProduk = document.getElementById("daftar-produk");        // getElementById
var listKeranjang = document.querySelector("#daftar-keranjang");   // querySelector
var pesanKosong = document.getElementById("keranjang-kosong");
var infoKeranjang = document.getElementById("ringkasan-keranjang");
var areaRingkasan = document.getElementById("ringkasan-pesanan");

// ===== 3. DOM MANIPULATION: tampilkan produk =====
function tampilkanProduk() {
  for (var i = 0; i < daftarProduk.length; i++) {
    var p = daftarProduk[i];

    var kartu = document.createElement("div");
    kartu.className = "kartu";
    kartu.id = "kartu-" + p.id;

    var judul = document.createElement("h3");
    judul.appendChild(document.createTextNode(p.nama));

    var harga = document.createElement("div");
    harga.className = "harga";
    harga.appendChild(document.createTextNode(rupiah(p.harga)));

    var stok = document.createElement("div");
    stok.className = "stok";
    stok.id = "stok-" + p.id;
    stok.appendChild(document.createTextNode("Stok: " + p.stok));

    var tombol = document.createElement("button");
    tombol.className = "btn-tambah";
    tombol.setAttribute("data-id", p.id);
    tombol.appendChild(document.createTextNode("Tambah ke Keranjang"));

    kartu.appendChild(judul);
    kartu.appendChild(harga);
    kartu.appendChild(stok);
    kartu.appendChild(tombol);
    wadahProduk.appendChild(kartu);
  }
}

// Update teks stok + tandai produk yang stoknya habis
function perbaruiTampilanStok() {
  var semuaKartu = document.getElementsByClassName("kartu"); // getElementsByClassName
  for (var i = 0; i < semuaKartu.length; i++) {
    var p = daftarProduk[i];
    var teksStok = document.getElementById("stok-" + p.id);
    teksStok.firstChild.nodeValue = "Stok: " + p.stok;

    if (p.stok === 0) {
      // style CamelCase
      semuaKartu[i].style.backgroundColor = "#eceff3";
      semuaKartu[i].style.opacity = "0.7";
      teksStok.firstChild.nodeValue = "Stok habis";
      teksStok.style.color = "#b42318";
    } else {
      semuaKartu[i].style.backgroundColor = "";
      semuaKartu[i].style.opacity = "";
      teksStok.style.color = "";
    }
  }
}

// ===== Keranjang =====
function buatItemKeranjang(item) {
  var li = document.createElement("li");

  var teks = document.createElement("span");
  teks.appendChild(document.createTextNode(item.nama + " - " + rupiah(item.harga)));

  var tombolHapus = document.createElement("button");
  tombolHapus.className = "hapus";
  tombolHapus.appendChild(document.createTextNode("Hapus"));

  tombolHapus.onclick = function () {
    if (confirm("Hapus \"" + item.nama + "\" dari keranjang?")) {
      var posisi = keranjang.indexOf(item);
      if (posisi !== -1) {
        keranjang.splice(posisi, 1);
      }
      item.produk.stok++; // kembalikan stok
      listKeranjang.removeChild(li); // removeChild
      perbaruiKeranjang();
      perbaruiTampilanStok();
    }
  };

  li.appendChild(teks);
  li.appendChild(tombolHapus);
  return li;
}

function hitungTotal() {
  var total = 0;
  for (var i = 0; i < keranjang.length; i++) {
    total += keranjang[i].harga;
  }
  return total;
}

function perbaruiKeranjang() {
  // innerHTML untuk jumlah item dan total harga
  infoKeranjang.innerHTML =
    "Jumlah item: <strong>" + keranjang.length + "</strong><br>" +
    "Total: <span id=\"total-harga\">" + rupiah(hitungTotal()) + "</span>";

  pesanKosong.style.display = keranjang.length === 0 ? "block" : "none";
}

function tambahKeKeranjang(id) {
  var p = cariProduk(id);
  if (p.stok <= 0) {
    alert("Maaf, stok \"" + p.nama + "\" sudah habis.");
    return;
  }
  p.stok--; // stok berkurang

  var item = { nama: p.nama, harga: p.harga, produk: p };
  keranjang.push(item); // push
  listKeranjang.appendChild(buatItemKeranjang(item));

  perbaruiKeranjang();
  perbaruiTampilanStok();
}

function batalkanTerakhir() {
  if (keranjang.length === 0) {
    alert("Keranjang masih kosong.");
    return;
  }
  var terakhir = keranjang.pop(); // pop
  terakhir.produk.stok++;
  listKeranjang.removeChild(listKeranjang.lastChild);
  perbaruiKeranjang();
  perbaruiTampilanStok();
}

function kosongkanKeranjang() {
  if (keranjang.length === 0) {
    alert("Keranjang sudah kosong.");
    return;
  }
  if (!confirm("Kosongkan seluruh isi keranjang?")) {
    return;
  }
  for (var i = 0; i < keranjang.length; i++) {
    keranjang[i].produk.stok++; // kembalikan stok
  }
  keranjang = [];
  while (listKeranjang.firstChild) {
    listKeranjang.removeChild(listKeranjang.firstChild);
  }
  perbaruiKeranjang();
  perbaruiTampilanStok();
}

// ===== Checkout =====
function checkout() {
  if (keranjang.length === 0) {
    alert("Keranjang masih kosong. Tambahkan produk dulu.");
    return;
  }
  var nama = prompt("Masukkan nama pembeli:");
  if (nama === null || nama.trim() === "") {
    alert("Checkout dibatalkan: nama pembeli wajib diisi.");
    return;
  }

  // Kelompokkan item per nama produk dengan for...in
  var jumlahPerProduk = {};
  for (var i = 0; i < keranjang.length; i++) {
    var n = keranjang[i].nama;
    jumlahPerProduk[n] = (jumlahPerProduk[n] || 0) + 1;
  }
  var baris = [];
  for (var namaProduk in jumlahPerProduk) {
    baris.push(namaProduk + " x" + jumlahPerProduk[namaProduk]);
  }

  var total = hitungTotal();

  // Tampilkan ringkasan (nama pakai textContent agar aman)
  areaRingkasan.innerHTML = "";
  var judul = document.createElement("h2");
  judul.appendChild(document.createTextNode("Ringkasan Pesanan"));
  var pNama = document.createElement("p");
  pNama.textContent = "Nama pembeli: " + nama.trim();
  var pItem = document.createElement("p");
  pItem.textContent = "Item: " + baris.join(", "); // join()
  var pTotal = document.createElement("p");
  pTotal.innerHTML = "Total bayar: <strong>" + rupiah(total) + "</strong>";
  areaRingkasan.appendChild(judul);
  areaRingkasan.appendChild(pNama);
  areaRingkasan.appendChild(pItem);
  areaRingkasan.appendChild(pTotal);

  // Kosongkan keranjang (stok tidak dikembalikan karena sudah dibeli)
  keranjang = [];
  while (listKeranjang.firstChild) {
    listKeranjang.removeChild(listKeranjang.firstChild);
  }
  perbaruiKeranjang();
}

// ===== Inisialisasi & event =====
tampilkanProduk();
perbaruiTampilanStok();
perbaruiKeranjang();

var tombolTambah = document.querySelectorAll(".btn-tambah"); // querySelectorAll
for (var t = 0; t < tombolTambah.length; t++) {
  tombolTambah[t].addEventListener("click", function () {
    tambahKeKeranjang(Number(this.getAttribute("data-id")));
  });
}

document.getElementById("btn-batal").addEventListener("click", batalkanTerakhir);
document.getElementById("btn-kosongkan").addEventListener("click", kosongkanKeranjang);
document.getElementById("btn-checkout").addEventListener("click", checkout);
