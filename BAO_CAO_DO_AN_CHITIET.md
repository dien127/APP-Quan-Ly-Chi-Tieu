# BÁO CÁO CUỐI KỲ MÔN HỌC: PHÁT TRIỂN PHẦN MỀM ỨNG DỤNG
## ĐỀ TÀI: XÂY DỰNG ỨNG DỤNG QUẢN LÝ CHI TIÊU THÔNG MINH SPENDWISE

---

## 1. TRANG BÌA
- **TRƯỜNG:** [TÊN TRƯỜNG CỦA BẠN - VÍ DỤ: ĐẠI HỌC CÔNG NGHỆ ĐỒNG NAI]
- **KHOA:** CÔNG NGHỆ THÔNG TIN
- **MÔN HỌC:** PHÁT TRIỂN PHẦN MỀM ỨNG DỤNG
- **ĐỀ TÀI:** ỨNG DỤNG QUẢN LÝ CHI TIÊU THÔNG MINH SPENDWISE (TÍCH HỢP OCR & AI)
- **NHÓM THỰC HIỆN:** NHÓM 05 (Tất Tay Ra Trường)
- **GIẢNG VIÊN HƯỚNG DẪN:** [TÊN THẦY GIÁO]
- **NĂM HỌC:** 2025 - 2026

---

## 2. DANH SÁCH THÀNH VIÊN & PHÂN CÔNG TỔNG QUAN

| STT | Họ và Tên | Mã Sinh Viên | Nhiệm vụ chính | % đóng góp |
|:---:|:---------|:------------:|:---------------|:----------:|
| 1 | **Hoàng Hữu Điền** | 172100041 | **Nhóm trưởng**, Quản lý dự án, Phát triển Backend (Server Actions), Tích hợp Prisma & Database, Viết báo cáo kỹ thuật. | 25% |
| 2 | **Ninh Văn Dũng** | 1721031229 | Phát triển giao diện Dashboard, Thiết kế Responsive UI, Biểu đồ thống kê & Tối ưu hóa trải nghiệm người dùng. | 20% |
| 3 | **Nguyễn Đình Hào** | 1721031314 | Thiết kế & Chuẩn hóa CSDL (PostgreSQL), Triển khai hệ thống (Deployment), Xác thực người dùng (NextAuth). | 18% |
| 4 | **Bảo Ngọc Thiên Bảo** | 1721031139 | Tích hợp AI Advisor (Gemini AI), Tối ưu thuật toán quét hóa đơn (OCR), Thực hiện Kiểm thử hệ thống (Testing). | 19% |
| 5 | **Trần Quốc Lâm** | 1721030882 | Xây dựng tài liệu đặc tả (SRS/Documentation), Cấu hình PWA (Chế độ ngoại tuyến), Phát triển chức năng Tag/Note. | 18% |

---

## 3. MỤC LỤC
1. CHƯƠNG 1: GIỚI THIỆU ĐỀ TÀI
2. CHƯƠNG 2: PHÂN TÍCH YÊU CẦU
3. CHƯƠNG 3: THIẾT KẾ HỆ THỐNG
4. CHƯƠNG 4: PHÁT TRIỂN ỨNG DỤNG
5. CHƯƠNG 5: KIỂM THỬ HỆ THỐNG
6. CHƯƠNG 6: KẾT QUẢ & HƯỚNG PHÁT TRIỂN
7. TÀI LIỆU THAM KHẢO
8. PHỤ LỤC

---

## 4. CHƯƠNG 1: GIỚI THIỆU ĐỀ TÀI

### 1.1. Lý do chọn đề tài
Trong kỷ nguyên kinh tế số, việc quản lý tài chính cá nhân trở nên phức tạp hơn bao giờ hết với nhiều nguồn thu nhập và kênh chi tiêu khác nhau (tiền mặt, ví điện tử, ngân hàng). Việc ghi chép thủ công qua sổ sách hay Excel thường gây nản lòng cho người dùng do tốn thời gian. Do đó, nhóm quyết định xây dựng SpendWise - một ứng dụng quản lý chi tiêu hiện đại, tự động hóa tối đa quy trình nhập liệu thông qua công nghệ OCR và hỗ trợ tư vấn tài chính bằng AI.

### 1.2. Mục tiêu dự án
- Xây dựng hệ thống quản lý giao dịch chi tiêu/thu nhập trực quan.
- Tích hợp công nghệ nhận diện ký tự quang học (OCR) để đọc hóa đơn từ ảnh chụp.
- Sử dụng trí tuệ nhân tạo (Generative AI) để đưa ra lời khuyên tài chính cho người dùng.
- Cung cấp biểu đồ trực quan giúp người dùng hiểu rõ dòng tiền cá nhân.

### 1.3. Phạm vi ứng dụng
- Hệ thống hỗ trợ đa nền tảng (Web & Mobile Responsive).
- Đối tượng: Cá nhân, gia đình trẻ cần quản lý tài chính.
- Khu vực: Hỗ trợ tiếng Việt và tiền tệ VNĐ.

### 1.4. Công nghệ sử dụng (Tech Stack)
- **Framework:** Next.js 15 (Sử dụng App Router và Server Actions để tối ưu hiệu suất).
- **Ngôn ngữ:** TypeScript (Đảm bảo an toàn kiểu dữ liệu và giảm thiểu lỗi runtime).
- **Cơ sở dữ liệu:** PostgreSQL (Lưu trữ trên cloud thông qua Neon DB).
- **ORM:** Prisma (Giúp thao tác với database nhanh chóng và minh bạch).
- **Giao diện:** Tailwind CSS kết hợp với Shadcn/UI (Bộ component chuẩn Premium).
- **OCR:** Tesseract.js (Xử lý bóc tách text từ hình ảnh ngay tại phía Client).
- **AI:** Google Gemini AI API (Phân tích thói quen và tư vấn tài chính).

---

## 5. CHƯƠNG 2: PHÂN TÍCH YÊU CẦU

### 2.1. Yêu cầu chức năng (Functional Requirements)
Hệ thống SpendWise tập trung vào 5 nhóm chức năng chính:
1. **Quản lý ví tài chính:** Cho phép người dùng tạo nhiều nguồn tiền khác nhau (Ví tiền mặt, Tài khoản ATM, Thẻ tín dụng).
2. **Quản lý giao dịch:** Theo dõi các khoản thu, chi và chuyển tiền nội bộ giữa các ví.
3. **Phân tích OCR:** Tự động điền form giao dịch khi người dùng chụp ảnh hóa đơn mua hàng.
4. **Cảnh báo ngân sách:** Thiết lập hạn mức chi tiêu cho từng danh mục và nhận cảnh báo khi sắp vượt mức.
5. **Cố vấn AI Advisor:** Trò chuyện hoặc nhận gợi ý từ AI dựa trên lịch sử chi tiêu thực tế.

### 2.2. User Stories
- **Là một người bận rộn**, tôi muốn chụp ảnh bill quán cà phê để ứng dụng tự lưu số tiền mà không cần tôi phải gõ tay.
- **Là một người đang tiết kiệm mua nhà**, tôi muốn đặt mục tiêu tài chính và thấy thanh tiến độ hoàn thành mỗi khi tôi nạp tiền vào heo đất.
- **Là một người hay mua sắm quá tay**, tôi muốn AI nhắc nhở tôi mỗi khi tôi chi tiêu vào đồ điện tử quá nhiều trong tháng.

### 2.3. Sơ đồ Use Case
[CHÈN ẢNH SƠ ĐỒ USE CASE - Tổng quan các hành động của người dùng]

### 2.4. Phân tích giao diện (Wireframe & UI Design)
Hệ thống sử dụng ngôn ngữ thiết kế "Glassmorphism" (Hiệu ứng kính mờ) mang lại cảm giác hiện đại và cao cấp.
- **Dashboard:** Trung tâm điều khiển với các biểu đồ tròn (Pie Chart) và biểu đồ cột (Bar Chart).
- **Form thêm giao dịch:** Tối giản hóa các bước nhập liệu, ưu tiên tính năng Scan QR/Bill.

---

## 6. CHƯƠNG 3: THIẾT KẾ HỆ THỐNG
*(Thành viên phụ trách: Nguyễn Đình Hào)*

### 3.1. Kiến trúc hệ thống
Hệ thống được xây dựng theo kiến trúc **Full-stack Next.js**, tận dụng tối đa sức mạnh của mô hình Client-Server hiện đại:
- **Presentation Layer (Client):** Sử dụng React Server Components (RSC) để render phía server và Client Components cho các phần cần tương tác (như form, biểu đồ).
- **Business Logic Layer (Server Actions):** Thay vì sử dụng API Route truyền thống, SpendWise sử dụng Server Actions để xử lý logic nghiệp vụ một cách trực tiếp, an toàn và giảm thiểu độ trễ.
- **Data Access Layer (ORM):** Prisma đóng vai trò là "cầu nối" giữa mã nguồn và cơ sở dữ liệu PostgreSQL.

### 3.2. Sơ đồ cơ sở dữ liệu (ERD)
Dưới đây là chi tiết các bảng trong hệ thống:

1. **User:** Lưu trữ thông tin định danh người dùng.
2. **Wallet:** Quản lý các tài khoản/nguồn tiền của người dùng (balance, type, color).
3. **Category:** Phân loại giao dịch (Ăn uống, Lương, Mua sắm...).
4. **Transaction:** Bảng trung tâm lưu tất cả lịch sử tiền vào/ra (amount, date, note, location).
5. **SavingGoal:** Lưu trữ các mục tiêu tiết kiệm dài hạn.
6. **Budget:** Lưu trữ hạn mức chi tiêu định kỳ.

### 3.3. Chi tiết các bảng dữ liệu (Data Dictionary)

| Bảng | Trường | Kiểu dữ liệu | Mô tả |
|------|--------|--------------|-------|
| **Transactions** | id | String (UUID) | Khóa chính |
| | amount | Decimal | Số tiền giao dịch |
| | type | Enum | INCOME / EXPENSE / TRANSFER |
| | date | DateTime | Ngày thực hiện giao dịch |
| | walletId | String | Liên kết tới ví thanh toán |
| **Wallets** | name | String | Tên ví (Ví dụ: Ví MoMo) |
| | balance | Decimal | Số dư hiện có |
| **Budgets** | limitAmount | Decimal | Hạn mức chi tiêu tối đa |

---

## 7. CHƯƠNG 4: PHÁT TRIỂN ỨNG DỤNG
*(Thành viên phụ trách: Hoàng Hữu Điền & Ninh Văn Dũng)*

### 4.1. Quy trình phát triển Frontend
Frontend của SpendWise được chia thành các **Component nguyên tử (Atomic Components)** để dễ dàng tái sử dụng và bảo trì.
- **Trang Dashboard:** Tổng hợp dữ liệu từ nhiều nguồn qua `Promise.all` để tăng tốc độ tải trang.
- **Trang Giao dịch:** Sử dụng kỹ thuật `Pagination` và `Filters` để quản lý hàng ngàn bản ghi mà không gây lag.

### 4.2. Xử lý Logic nghiệp vụ (Backend & Actions)
Tôi sẽ giải thích đoạn code chuyển đổi tiền tệ và bóc tách dữ liệu từ Prisma (Đây là phần giải quyết lỗi Serialization mà chúng ta đã xử lý):

```typescript
// File: src/app/actions/transaction-actions.ts
// Chuyển đổi Decimal sang Number để đảm bảo Next.js có thể truyền dữ liệu sang Client
export async function getTransactions(params) {
  const transactions = await prisma.transaction.findMany({
    // ... filtering logic
  });

  return {
    success: true,
    transactions: transactions.map(t => ({
      ...t,
      amount: Number(t.amount), // Bước cực kỳ quan trọng
    }))
  };
}
```

### 4.3. Giải thuật Quét hóa đơn OCR (Tesseract.js)
Đây là tính năng đột phá của ứng dụng. Dưới đây là cách chúng tôi sử dụng biểu thức chính quy (Regex) để tìm số tiền trong hóa đơn:

```javascript
// Regex tìm số tiền có định dạng hàng nghìn
const amountRegex = /(\d{1,3}([\.,\s]\d{3})+)|(\d{4,12})/;
const matches = line.match(amountRegex);
if (matches) {
  // Thay thế các dấu tách hàng nghìn để lấy số nguyên thuần túy
  const raw = matches[0].replace(/[\.,\s]/g, "");
  return parseInt(raw);
}
```

### 4.4. Tích hợp Trí tuệ nhân tạo (Gemini AI)
Chúng tôi thiết kế một `Prompt` chuyên biệt gửi tới Gemini AI để yêu cầu nó đóng vai trò là "Cố vấn tài chính chuyên nghiệp", dựa vào lịch sử chi tiêu của người dùng để trả về kết quả dưới dạng Markdown thân thiện.

---

## 8. CHƯƠNG 5: KIỂM THỬ HỆ THỐNG
*(Thành viên phụ trách: Bảo Ngọc Thiên Bảo)*

### 5.1. Kế hoạch kiểm thử (Test Plan)
Mục tiêu là đảm bảo mọi tính năng hoạt động đúng logic nghiệp vụ và không có lỗi nghiêm trọng khi người dùng thao tác. Nhóm thực hiện kiểm thử thủ công (Manual Testing) trên nhiều trình duyệt khác nhau (Chrome, Edge, Safari).

### 5.2. Các kịch bản kiểm thử chi tiết (Test Cases)

| ID | Chức năng | Hành động | Kết quả mong đợi | Trạng thái |
|----|-----------|-----------|------------------|------------|
| TC01 | Đăng nhập | Nhấn "Đăng nhập với Google" | Chuyển hướng thành công tới Dashboard | Pass |
| TC02 | Thêm ví | Nhập tên ví 'Tiền mặt', số dư '0' | Ví mới xuất hiện trong danh sách | Pass |
| TC03 | Thêm giao dịch | Nhập chi tiêu 50.000đ cho 'Ăn uống' | Số dư ví giảm đi 50.000đ | Pass |
| TC04 | Quét hóa đơn | Tải lên ảnh bill có chữ '50.000' | Ô số tiền tự động điền '50000' | Pass |
| TC05 | Ngân sách | Chi tiêu vượt hạn mức đã đặt | Hiện cảnh báo đỏ trên Dashboard | Pass |
| TC06 | Chuyển tiền | Chuyển 100k từ Ví A sang Ví B | Ví A -100k, Ví B +100k | Pass |

### 5.3. Kết quả kiểm thử
Hệ thống vượt qua 100% các kịch bản kiểm thử quan trọng. Đặc biệt, tính năng OCR đã hoạt động ổn định với các loại hóa đơn phổ biến tại Việt Nam.

---

## 9. CHƯƠNG 6: KẾT QUẢ & HƯỚNG PHÁT TRIỂN
*(Thành viên phụ trách: Trần Quốc Lâm)*

### 6.1. Kết quả đạt được
- Hoàn thành ứng dụng SpendWise với đầy đủ các tính năng quản lý tài chính từ cơ bản đến nâng cao.
- Tích hợp thành công các công nghệ mới (Next.js 15, OCR, AI).
- Giao diện người dùng mượt mà, tốc độ phản hồi nhanh nhờ tối ưu hóa Server Actions.
- Mã nguồn được quản lý chuyên nghiệp trên GitHub với lịch sử commit rõ ràng.

### 6.2. Hướng phát triển tương lai
- Phát triển phiên bản Mobile App chính thức trên iOS và Android.
- Tích hợp thêm tính năng quét mã QR ngân hàng để thanh toán trực tiếp.
- Sử dụng AI để dự báo chi tiêu trong 6 tháng tới dựa trên dữ liệu quá khứ.

---

## 10. TÀI LIỆU THAM KHẢO
1. Tài liệu chính thức của Next.js (https://nextjs.org/docs)
2. Tài liệu hướng dẫn Prisma ORM (https://www.prisma.io/docs)
3. Hướng dẫn sử dụng Tesseract.js (https://github.com/naptha/tesseract.js)
4. Google AI Studio - Gemini Documentation.

---

## 11. PHỤ LỤC
- **Link GitHub Repository:** https://github.com/dien127/APP-Quan-Ly-Chi-Tieu
- **Link Video Demo (YouTube):** [DÁN LINK YOUTUBE SAU KHI QUAY XONG]
- **Hướng dẫn cài đặt nhanh:** Đọc file README.md trong mã nguồn.

---
**KẾT THÚC BÁO CÁO**
