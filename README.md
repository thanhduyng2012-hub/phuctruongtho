# Phúc Trường Thọ — Không gian quán

Trang mô hình 3D tương tác dựa trên bản thiết kế PTT. Chạy bằng Node.js 22.12+ (môi trường này: Node 24).

```sh
npm ci --cache /tmp/ptt-npm
npm run dev -- --port 5173
```

## Thao tác

- Kéo mô hình để xoay 360°, cuộn hoặc chụm hai ngón để thu phóng. Chuột phải kéo để dịch góc nhìn.
- Chọn Toàn cảnh, Mặt tiền, Trong quán hoặc Mặt bằng. Mở tường để xem nội thất.
- Nhấp đồ nội thất hoặc chọn danh mục. Dùng thanh trượt hay nhập số để chỉnh kích thước (mét).
- Bấm Kéo để di chuyển, kéo các mũi tên; bấm Xong khi hoàn tất. Vị trí được giữ trong mặt bằng.
- Xem gần chi tiết để đưa camera đến bàn/quầy đang chọn.
- Thêm/xóa bàn, bật đường kích thước hoặc tự xoay.
- Bố trí tự lưu trong trình duyệt. Xuất JSON để gửi đối tác; đối tác mở cùng trang và Nhập bố trí đã lưu. Không có đồng bộ nhiều người hoặc tài khoản.

## Cơ sở thiết kế

Kem ngà #F2E8D5, gỗ sồi #B88A57, mây tre #C7A675, đỏ #C7191D. Quầy thu ngân 1.2 × 0.6 × 0.9 m, bàn vuông 0.8 × 0.8 × 0.75 m, bàn chữ nhật 1.2 × 0.75 × 0.75 m theo PDF. Ghế rộng 45 cm, sâu 43 cm, cao 82 cm. Mặt bằng 6 × 12 × 3.6 m và quầy bếp 4.8 × 1.1 × 0.9 m là giả định có thể chỉnh. Bảng hiệu rộng theo mặt bằng; mặc định 6 m, cao 1.4 m.

Đây là mô hình phác dựng để trao đổi; chưa phải bản vẽ thi công hay ảnh render chân thực. Chưa có kiểm tra va chạm, quy hoạch lối thoát hiểm, thiết bị bếp, hút mùi/cấp thoát nước. Số chỗ là 4 chỗ/bàn dự kiến, không phải sức chứa được chứng nhận.

## Kiểm tra và phát hành

```sh
npm run build
npx playwright test
```

Playwright mặc định dùng `/usr/bin/chromium` đã có trong môi trường. Test cần máy chủ dev tại cổng 5173. Có kiểm tra chỉnh kích thước, chuyển góc nhìn, thêm/xóa bàn, xuất/nhập bố trí, lưu sau tải lại, lỗi nhập và màn hình di động.

`npm run build` tạo `dist/index.html` tự chứa JavaScript, CSS, font và các trang tham chiếu. Tải tệp HTML này, mở bằng Chrome/Edge có WebGL để thao tác và gửi cho đối tác. Không cần kết nối mạng sau khi tải; một số trình duyệt doanh nghiệp có thể chặn mở tệp HTML cục bộ, khi đó dùng hosting tĩnh. `node scripts/check-standalone.mjs` kiểm tra bản đóng gói với mọi yêu cầu tài nguyên bên ngoài bị chặn. Có thể đưa thư mục này lên dịch vụ hosting tĩnh HTTPS (Netlify, Cloudflare Pages hoặc Vercel) để gửi một đường dẫn cho đối tác. Chưa triển khai công khai trong phiên này. Không cần API key, backend hoặc cơ sở dữ liệu; font và thư viện được đóng gói cùng ứng dụng.
