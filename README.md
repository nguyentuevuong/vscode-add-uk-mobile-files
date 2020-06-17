# Hướng dẫn sử dụng.
> `Phần mở rộng` này được sử dụng để hỗ trợ thao tác thêm một `view` mới vào dự án **UK** một cách nhanh chóng và thuận tiện hơn.
> <br/>Chi tiết thao tác xem hướng dẫn và ảnh động ở bên dưới.

#### 1. Thêm một view (dành cho developer).
> Tất cả các `view` của **UK** đều được đặt trong thư mục `/src/views`. Để thêm một view mới, ta thao tác theo các bước sau:

- Bước 1: Chuột phải vào thư mục `views`.
- Bước 2: Chọn menu: `UK: Add component`.
- Bước 3: Nhập đường dẫn (Ví dụ: `cps/001/a`, `001/a` hoặc: `cps\001\a`, `001\a`, `a`).
- Bước 4: Khởi động serve bằng lệnh: `npm run serve` và truy cập vào đường link tương ứng với thư mục khởi tạo view để kiểm tra kết quả.
- Bước 5: Nếu kết quả khởi tạo đúng. Đẩy toàn bộ những tập tin được tạo và thay đổi lên `github`.

**Hình minh hoạ:**

![Thêm một view](./images/add-view.gif)

#### 2. Thêm một document (dành cho kiban).
> Tất cả các `documents` của **UK** đều được đặt trong thư mục `/src/views/documents`. Để thêm một view mới, ta thao tác theo các bước sau:

- Bước 1: Chuột phải vào thư mục `documents`.
- Bước 2: Chọn menu: `UK: Add document (for kiban)`.
- Bước 3: Nhập đường dẫn (Ví dụ: `controls/inputs/string`, `inputs/string` hoặc: `controls\inputs\string`, `inputs\string`, `string`).
- Bước 4: Khởi động serve bằng lệnh: `npm run serve` và truy cập vào đường link tương ứng với thư mục khởi tạo view để kiểm tra kết quả.
- Bước 5: Nếu kết quả khởi tạo đúng. Đẩy toàn bộ những tập tin được tạo và thay đổi lên `github`.

**Hình minh hoạ:**

![Thêm một control](./images/add-control.gif)
