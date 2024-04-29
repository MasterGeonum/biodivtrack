FROM python:3.10
LABEL org.opencontainers.image.source="https://github.com/MasterGeonum/biodivtrack"

WORKDIR /app

COPY requirements.txt /app
COPY apiplante.py /app
COPY static /app

RUN pip3 install -r requirements.txt

ENTRYPOINT ["python3"]
CMD ["apiplante.py"]