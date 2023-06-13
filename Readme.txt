- Các bước import database:
+ Mở mongodb, connect database
+ Giải nén folder hotel_data, trong folder có một thư mục hotel (chứa tất cả các file export collection).
+ Ở folder chứa thư mục hotel, mở cmd
+ Gõ câu lệnh mongorestore -d hotel ./hotel để import tất cả vào mongodb
(Để sử dụng câu lệnh import trên, cần download MongoDB Database Tools và cài thêm vào biến môi trường)

- Các bước để start project
+ Mở project
+ Ở terminal, gõ npm i
+ npm start để chạy project