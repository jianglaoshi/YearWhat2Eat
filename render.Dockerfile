# Render 专用镜像：把菜谱数据源直接打进镜像（Render 不支持挂载宿主机目录）
# Render 里设置：Dockerfile Path = render.Dockerfile；Docker Build Context Directory = .

FROM python:3.12-slim
WORKDIR /app

# CPU 版 torch
RUN pip install --no-cache-dir torch==2.5.1+cpu --extra-index-url https://download.pytorch.org/whl/cpu
RUN pip install --no-cache-dir "setuptools<81"

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/app ./app
COPY backend/alembic.ini .
COPY backend/scripts ./scripts
COPY backend/docker-entrypoint.sh .
RUN chmod +x docker-entrypoint.sh

# 菜谱数据源直接打进镜像
COPY data/HowToCook-1.6.0 /data/HowToCook-1.6.0

EXPOSE 8000
ENTRYPOINT ["./docker-entrypoint.sh"]
