import os
from pathlib import Path

# Đường dẫn tới thư mục chứa ảnh (bạn có thể thay đổi lại cho khớp với dự án)
folder_path = Path("./images/girls")

def get_student_names():
    if not folder_path.exists() or not folder_path.is_dir():
        print(f"❌ Thư mục '{folder_path}' không tồn tại. Hãy kiểm tra lại đường dẫn nhé!")
        return

    names = []
    # Duyệt qua tất cả các file trong thư mục
    for file_path in folder_path.iterdir():
        if file_path.is_file() and file_path.suffix.lower() in ['.png', '.jpg', '.jpeg']:
            # file_path.stem sẽ tự động lấy tên file mà KHÔNG bao gồm phần mở rộng (.png, .jpg...)
            name = file_path.stem.strip()
            names.append(name)

    print(f"🌸 Tìm thấy {len(names)} tệp ảnh trong thư mục:\n")
    print(names)
    
    print("\n📝 Dạng danh sách cho JavaScript (Array):")
    js_array = "[\n" + ",\n".join([f'    "{name}"' for name in names]) + "\n]"
    print(js_array)

if __name__ == "__main__":
    get_student_names()