FROM continuumio/miniconda3:4.9.2

RUN conda install -y python=3.8 scipy=1.7.3 numpy=1.21.6 pandas=1.3.5 scikit-learn=1.0.2

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["python", "app3.py"]