from PIL import Image
import os

# Параметры
frame_w, frame_h = 338, 441
file_prefix = "-9999-"
file_suffix = ".png"
frames_count = 15

# Собираем список файлов
files = [f"{file_prefix}{i}.png" for i in range(1, frames_count + 1)]
for f in files:
    if not os.path.exists(f):
        raise FileNotFoundError(f"Файл {f} не найден в папке")

# Создаём спрайт (в одну строку)
sprite = Image.new("RGBA", (frame_w * frames_count, frame_h))

for i, file in enumerate(files):
    img = Image.open(file)
    if img.size != (frame_w, frame_h):
        raise ValueError(f"Размер файла {file} отличается от {frame_w}x{frame_h}")
    sprite.paste(img, (i * frame_w, 0))

sprite.save("sprite.webp", "WEBP", lossless=True)
print("✅ Спрайт сохранён: sprite.webp")

# Создаём CSS
css_lines = []
css_lines.append(
    f'.sprite {{ display:inline-block; width:{frame_w}px; height:{frame_h}px; '
    f'background-image:url("sprite.png"); background-repeat:no-repeat; }}'
)
for i in range(frames_count):
    x = -i * frame_w
    css_lines.append(f'.sprite-no-{i+1} {{ background-position: {x}px 0; }}')

with open("sprite.css", "w") as f:
    f.write("\n".join(css_lines))

print("✅ CSS сохранён: sprite.css")
