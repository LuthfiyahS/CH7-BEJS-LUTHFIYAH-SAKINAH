# BEJS-4-LUTHFIYAH SAKINAH-CHALLENGE-7

AUTH DAN MEDIA HANDLING
Link deploy heroku https://bejs-chapter07.herokuapp.com/ 

//Callback Google Oauth tidak di deploy di heroku masih local saja.

## Getting started CH SEBELUMNYA

Hi. Berikut panduan memulainya
Install semua package yang dibutuhkan ya.
1. Pastikan confignya sudah sesuai sama db dan user development yang akan kamu pakai ya.
2. lalu create db menggunakan perintah sequelize db:create.
3. lalu migrate tabel dan relasinya menggunakan perintah sequelize db:migrate.
4. lalu isi data menggunakan seeder menggunakan perintah sequelize db:seed:all.
5. lalu jalankan servernya menggunakan npm start.
6. lalu buka postman jika ingin via postman dan import APIGAMES.postman_collection.js ke postman nya (filenya ada di folder api_docs).
7. lalu jika menjalankan API DOCS Swagger tinggal panggil http://localhost:3000/docs
8. silahkan jalankan dan tes semua APInya.

Fyi ada 2 tipe docs yang aku buat(satu satu dari swagger sama nge generate di postman), bisa cek line 22 dan 25 di file server.js jalanin salah satunya.

### URL API 
#### Akses di postman atau bisa akses docnya http://localhost:3000/docs
http://localhost:3000/v1/api (with jwt integrated db) 

### URL VIEW
#### Akses di browser 
http://localhost:3000/v1/login (simply login not integrated db)
http://localhost:3000/v1/view

Semangat!

## Getting started CH SEKARANG
Link deploy heroku https://bejs-chapter07.herokuapp.com/ 
